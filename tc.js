const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/', { waitUntil: 'load', timeout: 20000 });
  await page.waitForTimeout(4000);
  await page.evaluate(() => window.scrollTo(0, 5800));
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'C:/Users/SAM/OneDrive/Desktop/design.vn/testi-check.png' });
  await browser.close();
  console.log('Done');
})();
