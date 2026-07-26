// 契约 codegen：把 B 仓策展的 JSON Schema 生成 TS 类型。
// 这是"前后端脱钩"的关键——schema 不变，前端类型一行不改；schema 变了，TS 直接报错。
// 运行：npm run codegen
import { readFile, writeFile } from 'node:fs/promises';
import { compile } from 'json-schema-to-typescript';

const SCHEMA_PATH = new URL('../src/shared/api/schema-2.0.0.json', import.meta.url);
const OUT_PATH = new URL('../src/shared/api/contract.generated.ts', import.meta.url);

const schema = JSON.parse(await readFile(SCHEMA_PATH, 'utf8'));

const banner = `/* AUTO-GENERATED from contracts/career-navigation/career-navigation-v2.0.0.schema.json
 * 源：B 仓 product-library。不要手改——改源 schema 后 npm run codegen。
 * 这是"契约驱动 / 前后端脱钩"的类型真相源。
 */\n`;

const ts = await compile(schema, 'CareerNavigation', {
  bannerComment: banner,
  additionalProperties: false,
  declareExternallyReferenced: true,
  style: { singleQuote: true, semi: false, bracketSpacing: false },
});

await writeFile(OUT_PATH, ts, 'utf8');
console.log('contract.generated.ts written:', ts.length, 'bytes');
