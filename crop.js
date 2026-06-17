const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/', { waitUntil: 'load', timeout: 20000 });
  await page.waitForTimeout(4000);
  // Crop just hero bottom-right card area
  await page.screenshot({ 
    path: 'C:/Users/SAM/OneDrive/Desktop/design.vn/hero-cards-crop.png',
    clip: { x: 900, y: 400, width: 540, height: 450 }
  });
  await browser.close();
  console.log('Done');
})();
