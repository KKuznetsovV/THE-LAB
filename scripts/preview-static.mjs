import { createServer } from 'node:http';
import { readFileSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('../frontend/dist', import.meta.url)));
const port = Number(process.env.PREVIEW_PORT || 4173);
const contentOrigin = process.env.CONTENT_URL || 'http://127.0.0.1:3109';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.map': 'application/json',
};

function inside(target) {
  return target === root || target.startsWith(root + path.sep);
}

function fileFor(pathname) {
  const decoded = decodeURIComponent(pathname);
  const candidates = [path.resolve(root, `.${decoded}`)];
  if (!path.extname(decoded)) candidates.push(path.resolve(root, `.${decoded}`, 'index.html'));
  for (const candidate of candidates) {
    if (!inside(candidate)) continue;
    try {
      if (statSync(candidate).isFile()) return candidate;
    } catch {
      // try the next candidate
    }
  }
  return null;
}

const server = createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://127.0.0.1');
  if (url.pathname === '/favicon.ico') {
    url.pathname = '/brand/logo/the-lab-logo-stacked-green.svg';
  }
  if (url.pathname.startsWith('/api/')) {
    fetch(new URL(`${url.pathname}${url.search}`, contentOrigin))
      .then(async (upstream) => {
        const body = Buffer.from(await upstream.arrayBuffer());
        res.writeHead(upstream.status, { 'content-type': upstream.headers.get('content-type') ?? 'application/json' });
        res.end(body);
      })
      .catch(() => {
        res.writeHead(502);
        res.end('content api unavailable');
      });
    return;
  }
  if (path.extname(url.pathname)) {
    const exact = fileFor(url.pathname);
    if (!exact) {
      res.writeHead(404);
      res.end('not found');
      return;
    }
  }
  const file = fileFor(url.pathname) ?? path.join(root, 'index.html');
  const raw = readFileSync(file);
  const type = TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream';
  const compressible = type.startsWith('text/') || type.includes('javascript') || type.includes('json') || type.includes('xml') || type.includes('svg');
  if (compressible && raw.length >= 256) {
    res.writeHead(200, { 'content-type': type, 'content-encoding': 'gzip' });
    res.end(gzipSync(raw));
    return;
  }
  res.writeHead(200, { 'content-type': type });
  res.end(raw);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`prerender preview http://127.0.0.1:${port}`);
});
