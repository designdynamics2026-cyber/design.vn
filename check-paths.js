const fs = require('fs');
const html = fs.readFileSync('site/index.html', 'utf-8');
const lines = html.split('\n');
lines.forEach((line, i) => {
  // Extract src and href values that are absolute paths
  const matches = line.match(/(?:src|href)="([^"]+)"/g);
  if (matches) {
    matches.forEach(m => {
      const val = m.replace(/(?:src|href)="/, '').replace('"', '');
      if (val.startsWith('/') && !val.startsWith('//')) {
        console.log(val);
      }
    });
  }
});
