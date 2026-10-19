#!/usr/bin/env node
/**
 * 本地预览服务器（零依赖）。
 *
 * 默认先执行一次构建，再托管 dist/；也可以用 --no-build 直接托管已有产物。
 *
 * 用法：
 *   node scripts/serve.mjs
 *   node scripts/serve.mjs --no-build
 *   PORT=9000 node scripts/serve.mjs
 */
import { existsSync } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSite } from './build.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const PORT = Number.parseInt(process.env.PORT ?? '8899', 10);
const HOST = process.env.HOST ?? '127.0.0.1';
const NO_BUILD = process.argv.includes('--no-build');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.map': 'application/json; charset=utf-8',
};

function send(res, status, body, headers = {}) {
  const payload = Buffer.isBuffer(body) ? body : Buffer.from(String(body), 'utf8');
  res.writeHead(status, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': payload.length,
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...headers,
  });
  res.end(payload);
}

async function resolveFile(pathname) {
  const root = path.resolve(DIST);
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return { badRequest: true };
  }
  const relative = decoded.replace(/^\/+/, '');
  let filePath = path.resolve(root, relative);

  if (filePath !== root && !filePath.toLowerCase().startsWith(root.toLowerCase() + path.sep)) {
    return { forbidden: true };
  }

  if (pathname.endsWith('/')) filePath = path.join(filePath, 'index.html');

  try {
    const info = await stat(filePath);
    if (info.isDirectory()) filePath = path.join(filePath, 'index.html');
  } catch {
    if (!path.extname(filePath)) filePath += '.html';
  }

  return { filePath };
}

async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    send(res, 405, 'Method Not Allowed', { Allow: 'GET, HEAD' });
    return;
  }

  let url;
  try {
    url = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
  } catch {
    send(res, 400, 'Bad Request');
    return;
  }

  const resolved = await resolveFile(url.pathname);
  if (resolved.badRequest) {
    send(res, 400, 'Bad Request');
    return;
  }
  if (resolved.forbidden) {
    send(res, 403, 'Forbidden');
    return;
  }

  try {
    const data = await readFile(resolved.filePath);
    const ext = path.extname(resolved.filePath).toLowerCase();
    const headers = {
      'Content-Type': MIME[ext] ?? 'application/octet-stream',
      'Content-Length': data.length,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    };
    res.writeHead(200, headers);
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      const notFound = path.join(DIST, '404.html');
      if (existsSync(notFound)) {
        const data = await readFile(notFound);
        res.writeHead(404, {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Length': data.length,
          'Cache-Control': 'no-store',
        });
        res.end(req.method === 'HEAD' ? undefined : data);
      } else {
        send(res, 404, 'Not Found');
      }
      return;
    }
    console.error(error);
    send(res, 500, 'Internal Server Error');
  }
}

if (!NO_BUILD) {
  await buildSite({ silent: true });
}

if (!existsSync(path.join(DIST, 'index.html'))) {
  console.error('找不到 dist/index.html，请先运行 npm run build。');
  process.exit(1);
}

const server = createServer(handler);
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`端口 ${PORT} 已被占用，请设置 PORT 环境变量后重试。`);
  } else {
    console.error(error);
  }
  process.exit(1);
});
server.listen(PORT, HOST, () => {
  console.log('OpenCourseAtlas · 本地预览');
  console.log(`  地址   http://localhost:${PORT}`);
  console.log(`  目录   ${path.relative(ROOT, DIST) || '.'}/`);
  console.log('  停止   Ctrl+C');
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
  });
}
