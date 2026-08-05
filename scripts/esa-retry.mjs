import Esa20240910 from "@alicloud/esa20240910";
import * as $OpenApi from "@alicloud/openapi-client";
import Credential from "@alicloud/credentials";
import { CreateRecordRequest, CreateRecordRequestData } from "@alicloud/esa20240910/dist/models/CreateRecordRequest.js";

async function main() {
  const cred = new Credential.default();
  const config = new $OpenApi.Config({
    credential: cred,
    endpoint: "esa.cn-hangzhou.aliyuncs.com",
    userAgent: "evidway-deploy",
  });
  const client = new Esa20240910.default(config);
  const SITE_ID = 171032258279632n;

  const records = [
    { type: "A", recordName: "evidway.com", data: { value: "216.198.79.1" }, ttl: 600 },
    { type: "A", recordName: "evidway.com", data: { value: "64.29.17.1" }, ttl: 600 },
    { type: "TXT", recordName: "evidway.com", data: { value: "v=spf1 include:spf1.dm.aliyun.com -all" }, ttl: 600 },
  ];

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
      console.log(`✗ ${rec.type} ${rec.recordName}: ${e.code}`);
    }
  }
}
main().catch(console.error);
