/**
 * Add DNS records to ESA site evidway.com
 */
import Esa20240910 from "@alicloud/esa20240910";
import * as $OpenApi from "@alicloud/openapi-client";
import Credential from "@alicloud/credentials";
import { CreateRecordRequest, CreateRecordRequestData } from "@alicloud/esa20240910/dist/models/CreateRecordRequest.js";

// ── Dry-run confirmation guard ──
const isDryRun = process.argv.includes("--dry-run");

async function main() {
  if (isDryRun) {
    console.log("🧪 DRY RUN — no records will be created\n");
    const records = getRecords();
    for (const rec of records) {
      console.log(`  Would create: ${rec.type} ${rec.recordName} → ${rec.data.value || JSON.stringify(rec.data)}`);
    }
    console.log(`\n${records.length} records listed. Pass --confirm or remove --dry-run to execute.`);
    return;
  }

  if (!process.argv.includes("--confirm")) {
    console.error("❌ This script modifies ESA DNS records. Add --confirm to execute, or --dry-run to preview.");
    process.exit(1);
  }

  const cred = new Credential.default();
  const config = new $OpenApi.Config({
    credential: cred,
    endpoint: "esa.cn-hangzhou.aliyuncs.com",
    userAgent: "evidway-deploy",
  });
  const client = new Esa20240910.default(config);
  const SITE_ID = 171032258279632n;

  function getRecords() { return [
    { type: "A", recordName: "@", data: { value: "216.198.79.1" }, ttl: 600 },
    { type: "A", recordName: "@", data: { value: "64.29.17.1" }, ttl: 600 },
    { type: "MX", recordName: "@", data: { value: "mx01.dm.aliyun.com", priority: 10 }, ttl: 600 },
    { type: "TXT", recordName: "@", data: { value: "v=spf1 include:spf1.dm.aliyun.com -all" }, ttl: 600 },
    { type: "TXT", recordName: "_dmarc.evidway.com", data: { value: "v=DMARC1;p=none;rua=mailto:dmarc_report@service.aliyun.com" }, ttl: 600 },
    { type: "TXT", recordName: "aliyun-cn-hangzhou._domainkey.evidway.com", data: { value: "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCDRRt5Zr4OSH9nHAErmBf0B5DXwRnqBygfQMi36WJdqBj6IIg1WI2Cwajok0hfJ2cQUS/cmI0L79lv2gF2nsbEwxTO0kqxVCAaFR8iPZUicSbiNWNrQSI3A4c0zHTPXZZ3oH+pSQK4OnRPHYHyLQQT36g4jimzS9XnuV7wDEpj3QIDAQAB" }, ttl: 600 },
    { type: "CNAME", recordName: "www.evidway.com", data: { value: "careercopilot-frontend.c70e4fa4.er.aliyun-esa.net" }, ttl: 600 },
    { type: "CNAME", recordName: "dmtrace.evidway.com", data: { value: "dmtrace.aliyuncs.com" }, ttl: 600 },
  ]; }

  const records = getRecords();

  for (const rec of records) {
    try {
      const dataObj = new CreateRecordRequestData(rec.data);
      const req = new CreateRecordRequest({
        siteId: SITE_ID,
        type: rec.type,
        recordName: rec.recordName,
        data: dataObj,
        ttl: rec.ttl,
      });
      const r = await client.createRecord(req);
      console.log(`✓ ${rec.type} ${rec.recordName}`);
    } catch (e) {
      console.log(`✗ ${rec.type} ${rec.recordName}: ${e.code} ${e.message}`);
    }
  }

  // Verify
  const list = await client.listRecords({ siteId: SITE_ID, pageSize: 20 });
  console.log(`\nTotal records on ESA: ${list.body?.totalCount || 0}`);
}

main().catch(console.error);
