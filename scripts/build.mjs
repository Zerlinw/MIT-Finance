#!/usr/bin/env node
/**
 * 发布目录归集。
 *
 * 本项目没有打包器、没有运行时依赖；这里的“构建”只做一件事：
 * 把 src/（页面）与 assets/（样式、脚本）按站点根目录结构复制到 dist/。
 *
 * 用法：
 *   node scripts/build.mjs
 */
import { existsSync } from 'node:fs';
import { cp, mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const ASSETS = path.join(ROOT, 'assets');
const DIST = path.join(ROOT, 'dist');

/** 复制可选的站点根文件（自定义域名、robots 等）。 */
const OPTIONAL_ROOT_FILES = ['CNAME', 'robots.txt'];

function rel(file) {
  return path.relative(ROOT, file).split(path.sep).join('/');
}

async function measure(dir) {
  let files = 0;
  let bytes = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await measure(full);
      files += nested.files;
      bytes += nested.bytes;
    } else {
      files += 1;
      bytes += (await stat(full)).size;
    }
  }
  return { files, bytes };
}

export async function buildSite({ silent = false } = {}) {
  if (!existsSync(SRC)) throw new Error('找不到 src/ 目录');
  if (!existsSync(ASSETS)) throw new Error('找不到 assets/ 目录');

  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  // 页面：src/*.html -> dist/*.html
  await cp(SRC, DIST, { recursive: true });

  // 资源：assets/** -> dist/assets/**
  await cp(ASSETS, path.join(DIST, 'assets'), { recursive: true });

  // GitHub Pages 默认走 Jekyll；.nojekyll 让下划线开头的文件也能正常发布。
  await writeFile(path.join(DIST, '.nojekyll'), '');

  for (const name of OPTIONAL_ROOT_FILES) {
    const from = path.join(ROOT, name);
    if (existsSync(from)) await cp(from, path.join(DIST, name));
  }

  const pages = (await readdir(SRC)).filter((f) => f.endsWith('.html')).sort();
  const { files, bytes } = await measure(DIST);

  if (!silent) {
    console.log('OpenCourseAtlas · 构建完成');
    console.log(`  页面   ${pages.length} 个：${pages.join(', ')}`);
    console.log(`  文件   ${files} 个`);
    console.log(`  体积   ${(bytes / 1024).toFixed(1)} KiB`);
    console.log(`  输出   ${rel(DIST)}/`);
  }

  return { dist: DIST, pages, files };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  buildSite().catch((error) => {
    console.error(`构建失败：${error.message}`);
    process.exitCode = 1;
  });
}
