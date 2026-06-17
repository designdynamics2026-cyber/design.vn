const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  const sites = [
    { url: 'https://hubtown.co.in/', file: 'hubtown.jpeg' },
    { url: 'https://www.collabcapitolium.fr/', file: 'capitolium.jpeg' },
  ];

  for (const site of sites) {
    try {
      await page.goto(site.url, { waitUntil: 'load', timeout: 30000 });
      await page.waitForTimeout(3000);
      await page.screenshot({ path: `C:/Users/SAM/OneDrive/Desktop/design.vn/site/696db0cd2780ac54df960dfb/${site.file}`, type: 'jpeg', quality: 90 });
      console.log('Done: ' + site.file);
    } catch(e) {
      console.log('Error ' + site.file + ': ' + e.message);
    }
  }

  await browser.close();
})();
