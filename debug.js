const cheerio = require('cheerio');
const https = require('https');

const BASE_URL = 'https://daodesign.vn/';

function isAssetUrl(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname;
    const cdnHosts = [
      'cdn.prod.website-files.com',
      'd3e54v103j8qbb.cloudfront.net',
      'cdn.jsdelivr.net',
      'cdn.intellimize.co',
      'api.intellimize.co',
      'log.intellimize.co',
      'fonts.googleapis.com',
      'fonts.gstatic.com'
    ];
    return cdnHosts.some(h => host === h || host.endsWith('.' + h));
  } catch { return false; }
}

function normalizeUrl(href, baseUrl) {
  try {
    const parsed = new URL(href, baseUrl);
    parsed.hash = '';
    return parsed.href;
  } catch { return null; }
}

https.get('https://daodesign.vn/', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const $ = cheerio.load(data);
    const assets = new Set();
    $('[src]').each((i, el) => {
      const src = $(el).attr('src');
      if (src) {
        const normalized = normalizeUrl(src, BASE_URL);
        if (normalized && isAssetUrl(normalized)) {
          assets.add(normalized);
        }
      }
    });
    $('link[href]').each((i, el) => {
      const href = $(el).attr('href');
      if (href) {
        const normalized = normalizeUrl(href, BASE_URL);
        if (normalized && isAssetUrl(normalized)) {
          assets.add(normalized);
        }
      }
    });
    $('script[src]').each((i, el) => {
      const src = $(el).attr('src');
      if (src) {
        const normalized = normalizeUrl(src, BASE_URL);
        if (normalized && isAssetUrl(normalized)) {
          assets.add(normalized);
        }
      }
    });
    console.log('Assets found:', assets.size);
    assets.forEach(a => console.log('  ' + a));
  });
}).on('error', e => console.error('Error:', e.message));
