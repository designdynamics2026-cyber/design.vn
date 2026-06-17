const fs = require('fs');
const path = require('path');

const files = [
  'site/index.html',
  'site/about/index.html',
  'site/contact/index.html',
  'site/projects/index.html',
  'site/projects/xay-dung-su-hien-dien-chuyen-nghiep-nhung-day-thu-vi-cho-start-up-cong-nghe-dang-len/index.html',
  'site/projects/goi-tron-net-sang-trong-cua-khach-san-boutique-vao-mot-khong-gian-so-day-tinh-te/index.html',
  'site/projects/dinh-hinh-dien-mao-truc-tuyen-cho-doi-ngu-van-hanh-homestay-dang-tren-da-but-pha/index.html',
];

const base = 'C:/Users/SAM/OneDrive/Desktop/design.vn/';

// Instagram block to replace (the full <a> tag with instagram link)
const instaOld = /<a [^>]*href="https:\/\/www\.instagram\.com\/studio\.daodesign\/"[^>]*class="link-block-7 w-inline-block"><div class="div-block-20-copy"><img loading="lazy" src="[^"]*pixel_instagram\.png" alt=""><div class="text-block-9">studio\.daodesign<\/div><\/div><\/a>/g;

const phoneNew = `<div class="div-block-20-copy"><img loading="lazy" src="/696db0cd2780ac54df960dfb/69807d7781bcb5165398e84a_pixel_globe.png" alt=""><div class="text-block-9">+91 98765 43210</div></div><div class="div-block-20-copy"><img loading="lazy" src="/696db0cd2780ac54df960dfb/69807d7781bcb5165398e84a_pixel_globe.png" alt=""><div class="text-block-9">+1 (310) 555-0147</div></div>`;

files.forEach(f => {
  const filepath = base + f;
  if (!fs.existsSync(filepath)) return;
  let c = fs.readFileSync(filepath, 'utf8');

  // 1. Vietnam → India
  c = c.replace(/based in Vietnam/g, 'based in India');

  // 2. addressCountry VN → IN (JSON-LD)
  c = c.replace(/"addressCountry": "VN"/g, '"addressCountry": "IN"');

  // 3. Instagram link → two phone number divs
  c = c.replace(instaOld, phoneNew);

  // 4. Gmail in mailto href
  c = c.replace(/mailto:studiodaodesign@gmail\.com[^""]*/g, 'mailto:support@designdynamics.com');

  // 5. Gmail visible text
  c = c.replace(/studiodaodesign@gmail\.com/g, 'support@designdynamics.com');

  // 6. JSON-LD sameAs instagram
  c = c.replace(/"https:\/\/www\.instagram\.com\/studio\.daodesign\/"/g, '"https://www.designdynamics.com"');

  fs.writeFileSync(filepath, c, 'utf8');
  console.log('Updated:', f);
});

console.log('All done!');
