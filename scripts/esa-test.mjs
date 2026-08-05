/**
 * Test creating a simple A record via ESA API
 */
const Esa20240910 = (await import("@alicloud/esa20240910")).default;
const $OpenApi = await import("@alicloud/openapi-client");
const $Esa = await import("@alicloud/esa20240910");
const Credential = (await import("@alicloud/credentials")).default;

const cred = new Credential.default();
const config = new $OpenApi.Config({
  credential: cred,
  endpoint: "esa.cn-hangzhou.aliyuncs.com",
  userAgent: "evidway-deploy",
});
const client = new Esa20240910.default(config);

// Try with lowercase type and string data
try {
  const r = await client.createRecord({
    siteId: 171032258279632n,
    type: "A",
    recordName: "@",
    data: "216.198.79.1",
    ttl: 600,
  });
  console.log("OK:", JSON.stringify(r.body));
} catch (e) {
  console.log("Error:", e.code, e.message, JSON.stringify(e.data || {}));
}
