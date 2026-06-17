const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://daodesign.vn';
const OUTPUT_DIR = path.join(__dirname, 'site');
const MAX_PATH = 200;

const visited = new Set();
const discoveredAssets = new Set();
const downloadedAssets = new Set();
const allPages = new Map();

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }, rejectUnauthorized: false }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = new URL(res.headers.location, url).href;
        fetchUrl(redirectUrl).then(resolve).catch(reject);
        return;
      }
      let data = Buffer.alloc(0);
      res.on('data', (chunk) => {
        data = Buffer.concat([data, chunk]);
        if (data.length > 50 * 1024 * 1024) { res.destroy(); reject(new Error('File too large')); }
      });
      res.on('end', () => {
        resolve({ status: res.statusCode, headers: res.headers, data, url: res.responseUrl || url });
      });
    }).on('error', (e) => { if (e.code !== 'ECONNRESET') reject(e); }).setTimeout(30000, function() { this.destroy(); reject(new Error('Timeout')); });
  });
}

function urlToLocalPath(urlStr) {
  const parsed = new URL(urlStr);
  let filePath = parsed.pathname;
  if (parsed.search) filePath += '_' + parsed.search.replace(/[?&]/g, '_').replace(/=/g, '_');
  if (filePath.endsWith('/') || filePath === '') filePath = path.join(filePath, 'index.html');
  filePath = filePath.split('/').map(seg => {
    try { return decodeURIComponent(seg); } catch { return seg; }
  }).join(path.sep);
  filePath = filePath.replace(/^[/\\]+/, '');
  if (filePath.length > MAX_PATH) {
    const ext = path.extname(filePath);
    const base = path.basename(filePath, ext);
    const dir = path.dirname(filePath);
    const shortBase = base.substring(0, 80) + '_' + simpleHash(base);
    filePath = path.join(dir, shortBase + ext);
  }
  return filePath;
}

function safePath(pageId) {
  // Map clean page paths to filesystem paths
  if (pageId === '/' || pageId === '') return 'index.html';
  let p = pageId.replace(/^\//, '').replace(/\/$/, '');
  // If the path is too long, shorten it
  const parts = p.split('/');
  const last = parts[parts.length - 1];
  if (last.length > 100) {
    parts[parts.length - 1] = last.substring(0, 80) + '_' + simpleHash(last);
  }
  return path.join(...parts, 'index.html');
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) { const chr = str.charCodeAt(i); hash = ((hash << 5) - hash) + chr; hash |= 0; }
  return Math.abs(hash).toString(36).substring(0, 8);
}

function extractPageId(url) {
  const parsed = new URL(url);
  let p = parsed.pathname.replace(/\/$/, '') || '/';
  return p;
}

function isInternalUrl(url) {
  try { const parsed = new URL(url); return parsed.hostname === 'daodesign.vn' || parsed.hostname === 'www.daodesign.vn'; } catch { return false; }
}

function isAssetUrl(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname;
    const cdnHosts = [
      'cdn.prod.website-files.com',
      'd3e54v103j8qbb.cloudfront.net',
      'cdn.jsdelivr.net',
      'cdn.intellimize.co',
      'fonts.googleapis.com',
      'fonts.gstatic.com'
    ];
    if (cdnHosts.some(h => host === h || host.endsWith('.' + h))) {
      // Skip API endpoints and root CDN URL
      const path = parsed.pathname;
      if (path === '/' || path === '') return false;
      return true;
    }
    return false;
  } catch { return false; }
}

function isApiUrl(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname;
    return host === 'api.intellimize.co' || host === 'log.intellimize.co';
  } catch { return false; }
}

function normalizeUrl(href, baseUrl) {
  try {
    const parsed = new URL(href, baseUrl);
    parsed.hash = '';
    return parsed.href;
  } catch { return null; }
}

function saveFile(localPath, data) {
  const fullPath = path.join(OUTPUT_DIR, localPath);
  const dir = path.dirname(fullPath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, data);
  return fullPath;
}

function readFile(localPath) {
  const fullPath = path.join(OUTPUT_DIR, localPath);
  if (fs.existsSync(fullPath)) return fs.readFileSync(fullPath, 'utf-8');
  return null;
}

async function downloadAsset(url) {
  if (downloadedAssets.has(url) || isApiUrl(url)) return null;
  downloadedAssets.add(url);

  const localPath = urlToLocalPath(url);
  const fullPath = path.join(OUTPUT_DIR, localPath);
  if (fs.existsSync(fullPath)) { console.log(`  [SKIP] ${url}`); return localPath; }

  try {
    console.log(`  [DL] ${url}`);
    const result = await fetchUrl(url);
    if (result.status === 200) {
      saveFile(localPath, result.data);
      return localPath;
    } else {
      console.log(`  [FAIL ${result.status}] ${url}`);
      return null;
    }
  } catch (err) {
    console.log(`  [ERR] ${url}: ${err.message.slice(0, 100)}`);
    return null;
  }
}

async function processPage(url) {
  const pageId = extractPageId(url);
  if (visited.has(pageId)) return;
  visited.add(pageId);

  console.log(`\n=== Fetching page: ${url} ===`);
  const result = await fetchUrl(url);
  if (result.status !== 200) { console.log(`  Failed with status ${result.status}`); return; }

  const localPath = safePath(pageId);
  saveFile(localPath, result.data);
  allPages.set(pageId, localPath);
  console.log(`  Saved to ${localPath} (${result.data.length} bytes)`);

  const html = result.data.toString('utf-8');

  // Extract links and assets manually (avoid cheerio $ issue)
  const linkRegex = /<a[^>]*href\s*=\s*["']([^"']*)["'][^>]*>/gi;
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1];
    if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#') || href.startsWith('javascript:')) continue;
    const normalized = normalizeUrl(href, url);
    if (normalized && isInternalUrl(normalized)) {
      const pid = extractPageId(normalized);
      if (!visited.has(pid)) {
        await processPage(normalized);
      }
    }
  }

  // Extract all assets
  const assetPatterns = [
    /<link[^>]*href=["']([^"']+)["'][^>]*>/gi,
    /<script[^>]*src=["']([^"']+)["'][^>]*>/gi,
    /<img[^>]*src=["']([^"']+)["'][^>]*>/gi,
    /<source[^>]*src=["']([^"']+)["'][^>]*>/gi,
    /srcset=["']([^"']+)["']/gi,
    /<video[^>]*poster=["']([^"']+)["'][^>]*>/gi
  ];

  for (const pattern of assetPatterns) {
    while ((match = pattern.exec(html)) !== null) {
      const val = match[1];
      if (pattern.toString().includes('srcset')) {
        val.split(',').forEach(part => {
          const s = part.trim().split(/\s+/)[0];
          if (s) {
            const normalized = normalizeUrl(s, url);
            if (normalized && isAssetUrl(normalized)) discoveredAssets.add(normalized);
          }
        });
      } else {
        const normalized = normalizeUrl(val, url);
        if (normalized && isAssetUrl(normalized)) discoveredAssets.add(normalized);
      }
    }
  }

  // Extract from inline styles and style tags
  const urlInCss = /url\(['"]?([^'")]+)['"]?\)/gi;
  const styleBlocks = html.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || [];
  for (const block of styleBlocks) {
    while ((match = urlInCss.exec(block)) !== null) {
      const u = match[1];
      if (!u.startsWith('data:')) {
        const normalized = normalizeUrl(u, url);
        if (normalized && isAssetUrl(normalized)) discoveredAssets.add(normalized);
      }
    }
  }

  // Extract from inline style attributes
  const inlineStyleRegex = /style\s*=\s*["'][^"']*url\(['"]?([^'")]+)['"]?\)[^"']*["']/gi;
  while ((match = inlineStyleRegex.exec(html)) !== null) {
    const u = match[1];
    const normalized = normalizeUrl(u, url);
    if (normalized && isAssetUrl(normalized)) discoveredAssets.add(normalized);
  }
}

async function mirrorSite() {
  console.log('=== Starting Site Mirror ===');
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // Start with homepage
  console.log('\n=== Phase 1: Downloading Pages ===');
  await processPage(BASE_URL + '/');
  await processPage(BASE_URL + '/about');
  await processPage(BASE_URL + '/projects');
  await processPage(BASE_URL + '/contact');

  // Try project detail pages
  const projectUrls = [
    'xay-dung-su-hien-dien-chuyen-nghiep-nhung-day-thu-vi-cho-start-up-cong-nghe-dang-len',
    'goi-tron-net-sang-trong-cua-khach-san-boutique-vao-mot-khong-gian-so-day-tinh-te',
    'dinh-hinh-dien-mao-truc-tuyen-cho-doi-ngu-van-hanh-homestay-dang-tren-da-but-pha'
  ];
  for (const proj of projectUrls) {
    await processPage(BASE_URL + '/projects/' + proj);
  }

  console.log(`\n=== Pages mirrored: ${allPages.size} ===`);
  for (const [id, lp] of allPages) console.log(`  ${id} -> ${lp}`);

  console.log(`\n=== Phase 2: Downloading Assets (${discoveredAssets.size} discovered) ===`);
  let successCount = 0, failCount = 0;
  for (const assetUrl of discoveredAssets) {
    try {
      const result = await downloadAsset(assetUrl);
      if (result) successCount++; else failCount++;
    } catch (err) { failCount++; console.log(`  [ERR] ${assetUrl}: ${err.message.slice(0, 100)}`); }
  }

  console.log(`\n=== Asset download complete: ${successCount} success, ${failCount} failed ===`);

  // Phase 3: Rewrite HTML to use local asset paths
  console.log('\n=== Phase 3: Rewriting HTML asset URLs ===');
  for (const [pageId, localPath] of allPages) {
    const html = readFile(localPath);
    if (!html) continue;

    // Replace CDN URLs with local paths
    let modified = html;

    // Replace asset URLs in src, href, srcset attributes
    for (const assetUrl of downloadedAssets) {
      if (isApiUrl(assetUrl)) continue;
      const localAssetPath = '/' + urlToLocalPath(assetUrl).replace(/\\/g, '/');
      const escapedUrl = assetUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(escapedUrl, 'g');
      modified = modified.replace(re, localAssetPath);
    }

    // Replace internal page links
    for (const [pid, plp] of allPages) {
      const pageUrl = BASE_URL + (pid === '/' ? '' : pid);
      const localPagePath = '/' + plp.replace(/\\/g, '/');
      const escapedUrl = pageUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const re = new RegExp(escapedUrl, 'g');
      modified = modified.replace(re, localPagePath);
    }

    // Also fix root-relative paths (starting with /) that reference CDN
    modified = modified.replace(/href="\/\//g, 'href="https://');
    modified = modified.replace(/src="\/\//g, 'src="https://');

    if (modified !== html) {
      fs.writeFileSync(path.join(OUTPUT_DIR, localPath), modified);
      console.log(`  Rewritten: ${localPath}`);
    }
  }

  // Phase 4: Create _redirects file for spa-style routing if needed
  console.log('\n=== Mirroring Complete ===');
  console.log(`Pages: ${allPages.size}`);
  console.log(`Assets discovered: ${discoveredAssets.size}`);
  console.log(`Assets downloaded: ${downloadedAssets.size} (${successCount} success, ${failCount} fail)`);
}

mirrorSite().catch(err => { console.error('Fatal:', err); process.exit(1); });
