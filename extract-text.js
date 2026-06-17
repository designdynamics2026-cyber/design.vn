const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const siteDir = path.join(__dirname, 'site');
const textSet = new Set();

function walkDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walkDir(fullPath);
    else if (entry.name.endsWith('.html')) {
      const html = fs.readFileSync(fullPath, 'utf-8');
      const $ = cheerio.load(html);
      
      $('title').each((i, el) => {
        const t = $(el).text().trim();
        if (t) textSet.add(t);
      });
      
      $('meta[name="description"]').each((i, el) => {
        const t = $(el).attr('content');
        if (t && /[\u0080-\uFFFF]/.test(t)) textSet.add(t);
      });

      $('body').find('*').contents().each(function() {
        if (this.type === 'text') {
          const text = $(this).text().trim();
          if (text && text.length > 0 && !/^[\s\n\r]+$/.test(text) && /[\u0080-\uFFFF]/.test(text)) {
            textSet.add(text);
          }
        }
      });
    }
  }
}

walkDir(siteDir);
console.log('Unique text strings found:', textSet.size);
const sorted = Array.from(textSet).sort((a,b) => b.length - a.length);
sorted.forEach(t => console.log(t));
