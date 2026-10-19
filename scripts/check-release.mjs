#!/usr/bin/env node
/**
 * 发布前一致性检查：Git tag、package.json 与 CHANGELOG.md 必须互相对应。
 *
 * 用法：
 *   node scripts/check-release.mjs v1.0.0
 *   GITHUB_REF_NAME=v1.0.0 node scripts/check-release.mjs
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tag =
  process.argv[2] ??
  process.env.GITHUB_REF_NAME ??
  process.env.GITHUB_REF?.replace(/^refs\/tags\//, '');

const fail = (message) => {
  console.error(`发布检查失败：${message}`);
  process.exit(1);
};

if (!tag) fail('缺少 Git tag，例如：node scripts/check-release.mjs v1.0.0');
if (!/^v\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(tag)) {
  fail(`tag 必须形如 v1.2.3 或 v1.2.3-beta.1，当前为 ${tag}`);
}

const pkg = JSON.parse(await readFile(path.join(ROOT, 'package.json'), 'utf8'));
const expected = `v${pkg.version}`;
if (tag !== expected) fail(`tag ${tag} 与 package.json 版本 ${pkg.version} 不一致`);

const changelog = await readFile(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
if (!changelog.includes(`## [${pkg.version}]`)) {
  fail(`CHANGELOG.md 缺少 ${pkg.version} 的发布记录`);
}

console.log(`发布检查通过：${tag}（package.json / CHANGELOG.md 一致）`);
