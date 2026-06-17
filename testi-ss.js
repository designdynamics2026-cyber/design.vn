const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/', { waitUntil: 'load', timeout: 20000 });
  await page.waitForTimeout(3000);
  await page.evaluate(() => window.scrollTo(0, 1800));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'C:/Users/SAM/OneDrive/Desktop/design.vn/testimonials-ss.png' });
  await browser.close();
  console.log('Done');
})();
