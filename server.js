const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const SITE_DIR = path.join(__dirname, 'site');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.eot': 'application/vnd.ms-fontobject',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.pdf': 'application/pdf',
  '.lottie': 'application/json',
  '.json': 'application/json',
};

function getMimeType(ext) {
  return MIME_TYPES[ext.toLowerCase()] || 'application/octet-stream';
}

function serverLog(req, status, extra) {
  const msg = `${req.method} ${req.url} -> ${status}${extra ? ' (' + extra + ')' : ''}`;
  console.log(msg);
}

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0].split('#')[0]);

  // Security: prevent directory traversal
  urlPath = urlPath.replace(/\\/g, '/');
  const normalized = path.normalize(urlPath).replace(/\\/g, '/');
  if (normalized.includes('..')) {
    serverLog(req, 403);
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // Determine file path
  let filePath = path.join(SITE_DIR, urlPath);

  // Clean URL handling: if path doesn't have extension, treat as directory
  const ext = path.extname(filePath).toLowerCase();
  if (!ext || ext === '') {
    // Try as directory with index.html
    const indexPath = path.join(filePath, 'index.html');
    if (fs.existsSync(indexPath)) {
      filePath = indexPath;
    } else if (fs.existsSync(filePath)) {
      // It's a file without extension (shouldn't happen but handle)
    } else {
      // Try appending .html
      const htmlPath = filePath + '.html';
      if (fs.existsSync(htmlPath)) {
        filePath = htmlPath;
      } else {
        serverLog(req, 404);
        res.writeHead(404);
        res.end('Not Found');
        return;
      }
    }
  }

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    serverLog(req, 404);
    res.writeHead(404);
    res.end('Not Found');
    return;
  }

  // Check if it's a directory (without trailing /)
  const stat = fs.statSync(filePath);
  if (stat.isDirectory()) {
    const indexPath = path.join(filePath, 'index.html');
    if (fs.existsSync(indexPath)) {
      filePath = indexPath;
    } else {
      serverLog(req, 404);
      res.writeHead(404);
      res.end('Directory listing not available');
      return;
    }
  }

  // Read and serve file
  const fileExt = path.extname(filePath).toLowerCase();
  const mimeType = getMimeType(fileExt);

  try {
    const content = fs.readFileSync(filePath);
    res.writeHead(200, {
      'Content-Type': mimeType,
      'Content-Length': content.length,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
    });
    res.end(content);
    serverLog(req, 200, fileExt);
  } catch (err) {
    serverLog(req, 500);
    res.writeHead(500);
    res.end('Internal Server Error');
  }
});

server.listen(PORT, () => {
  console.log(`\n  Local mirror server running:`);
  console.log(`  http://localhost:${PORT}/`);
  console.log(`  Serving: ${SITE_DIR}`);
  console.log(`  Press Ctrl+C to stop.\n`);
});
