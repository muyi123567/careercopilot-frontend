/**
 * ESA Functions & Pages — Static Directory Deployment
 * Deploys the frontend dist/ build to Alibaba Cloud ESA edge nodes.
 */
import Esa20240910, * as $Esa20240910 from "@alicloud/esa20240910";
import * as $OpenApi from "@alicloud/openapi-client";
import Credential from "@alicloud/credentials";
import fs from "node:fs";
import path from "node:path";

import JSZip from "jszip";

const ROUTINE_NAME = "careercopilot-frontend";
const DIST_DIR = path.resolve(import.meta.dirname, "../dist");

// ── Parse CLI args ──
const args = process.argv.slice(2);
const ENV_FLAG = args.includes("--env") ? args[args.indexOf("--env") + 1] : "staging";
const isProd = ENV_FLAG === "production";

if (isProd && !process.env.ESA_PROD_CONFIRM) {
  console.error("❌ Production deployment requires ESA_PROD_CONFIRM=1 environment variable. Use --env staging to deploy to staging first.");
  process.exit(1);
}
console.log(`→ Deploying to environment: ${ENV_FLAG}${isProd ? " (PRODUCTION)" : ""}`);

// ── ESA Client ──
function createClient() {
  const credential = new Credential.default();
  const config = new $OpenApi.Config({
    credential,
    endpoint: "esa.cn-hangzhou.aliyuncs.com",
    userAgent: "AlibabaCloud-Agent-Skills/evidway-deploy",
  });
  return new Esa20240910.default(config);
}

// ── Step 1: Verify dist exists ──
if (!fs.existsSync(DIST_DIR)) {
  console.error("dist/ directory not found. Run 'npm run build' first.");
  process.exit(1);
}
const files = fs.readdirSync(DIST_DIR);
if (!files.includes("index.html")) {
  console.error("dist/ is missing index.html — build may be incomplete.");
  process.exit(1);
}
console.log(`✓ dist/ found with ${files.length} files`);

// ── Step 2: Create Routine ──
const client = createClient();
let routineName = ROUTINE_NAME;

try {
  await client.createRoutine(
    new $Esa20240910.CreateRoutineRequest({ name: routineName })
  );
  console.log(`✓ Routine "${routineName}" created`);
} catch (err) {
  const code = err?.code ?? err?.data?.Code ?? "";
  if (code === "RoutineNameAlreadyExists" || code === "RoutineAlreadyExist") {
    console.log(`→ Routine "${routineName}" already exists, reusing`);
  } else {
    console.error("✗ CreateRoutine failed:", err);
    process.exit(1);
  }
}

// ── Step 3: Build zip of dist/ ──
const zip = new JSZip();
function addFiles(dir, zipFolder) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      addFiles(fullPath, zipFolder.folder(entry.name));
    } else {
      zipFolder.file(entry.name, fs.readFileSync(fullPath));
    }
  }
}
addFiles(DIST_DIR, zip);
const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
console.log(`✓ dist/ zipped (${(zipBuffer.length / 1024).toFixed(1)} KB)`);

// ── Step 4: CreateRoutineWithAssetsCodeVersion ──
const codeVersionResp = await client.createRoutineWithAssetsCodeVersion(
  new $Esa20240910.CreateRoutineWithAssetsCodeVersionRequest({
    name: routineName,
    codeType: "ASSETS_ONLY",
    confOptions: {
      notFoundStrategy: "SinglePageApplication",
    },
    assets: [
      {
        assetsPath: "assets/",
        assetsType: "static",
      },
    ],
  })
);
const codeVersion = codeVersionResp.body?.codeVersion;
if (!codeVersion) {
  console.error("✗ No codeVersion returned");
  process.exit(1);
}
console.log(`✓ Code version "${codeVersion}" created, uploading zip...`);

// ── Step 5: Upload zip via OSS POST (multipart form) ──
// ESA 返回 ossPostConfig（含 url/key/policy/signature/OSSAccessKeyId），
// 需用 multipart/form-data POST 上传（不是 PUT）。
const postCfg = codeVersionResp.body?.ossPostConfig;
if (postCfg?.url) {
  const form = new FormData();
  form.append("key", postCfg.key ?? "");
  form.append("OSSAccessKeyId", postCfg.OSSAccessKeyId ?? "");
  form.append("policy", postCfg.policy ?? "");
  form.append("signature", postCfg.signature ?? "");
  form.append("x-oss-security-token", postCfg.XOssSecurityToken ?? "");
  form.append("file", new Blob([zipBuffer], { type: "application/zip" }), "bundle.zip");
  const uploadResp = await fetch(postCfg.url, { method: "POST", body: form });
  if (!uploadResp.ok) {
    console.error("✗ Upload failed:", uploadResp.status, await uploadResp.text().catch(() => ""));
    process.exit(1);
  }
  console.log("✓ Zip uploaded to staging (OSS POST)");
}

// ── Step 6: Commit staging code ──
await client.commitRoutineStagingCode(
  new $Esa20240910.CommitRoutineStagingCodeRequest({
    name: routineName,
  })
);
console.log("✓ Staging code committed");

// ── Step 7: Publish ──
await client.publishRoutineCodeVersion(
  new $Esa20240910.PublishRoutineCodeVersionRequest({
    name: routineName,
    codeVersion: codeVersion,
    env: ENV_FLAG,
  })
);
console.log(`✓ Published to ${ENV_FLAG}`);

// ── Step 8: Get access URL ──
const getResp = await client.getRoutine(
  new $Esa20240910.GetRoutineRequest({ name: routineName })
);
const url = getResp.body?.defaultRelatedRecord;
if (url) {
  console.log(`\n🌐 Deployment URL: https://${url}`);
  try {
    const tokenResp = await client.getRoutineAccessToken(
      new $Esa20240910.GetRoutineAccessTokenRequest({ name: routineName })
    );
    const token = tokenResp.body?.accessToken;
    if (token) {
      const masked = token.length > 8 ? `${token.slice(0, 4)}...${token.slice(-4)}` : "****";
      console.log(`🔑 Token (masked): ${masked}`);
      console.log(`🌐 Access URL: https://${url}?esa_er_token=<token>`);
    }
  } catch {
    console.log("⚠ Token retrieval skipped (may not need it)");
  }
}

console.log("\n✅ ESA deployment complete!");
