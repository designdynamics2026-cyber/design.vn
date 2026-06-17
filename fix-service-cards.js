const fs = require('fs');
const file = 'C:/Users/SAM/OneDrive/Desktop/design.vn/site/index.html';
let c = fs.readFileSync(file, 'utf8');

// ─── BRAND IDENTITY (desktop) ────────────────────────────────────────────────
// Add image + rewrite text
c = c.replace(
  '<div class="hover-content-para"><p class="para-2">Helping businesses build a distinctive, memorable, and consistent brand. Creating deep connections with target customers.</p></div>',
  '<div class="service-card-img"><img loading="lazy" src="/696db0cd2780ac54df960dfb/capitolium.jpeg" alt="Capitolium brand identity project" style="width:100%;height:220px;object-fit:cover;border-radius:12px;margin-bottom:20px;"></div><div class="hover-content-para"><p class="para-2">We craft bold, cohesive visual identities that set brands apart — from logo and typography to complete brand systems that resonate, inspire trust, and endure.</p></div>'
);

// ─── BRAND IDENTITY (tablet) ─────────────────────────────────────────────────
c = c.replace(
  '<div class="hover-content-para"><p class="para-2">Helping you build a distinctive, memorable, and consistent brand. Creating deep connections with target customers.</p></div>',
  '<div class="service-card-img"><img loading="lazy" src="/696db0cd2780ac54df960dfb/capitolium.jpeg" alt="Capitolium brand identity project" style="width:100%;height:220px;object-fit:cover;border-radius:12px;margin-bottom:20px;"></div><div class="hover-content-para"><p class="para-2">We craft bold, cohesive visual identities that set brands apart — from logo and typography to complete brand systems that resonate, inspire trust, and endure.</p></div>'
);

// ─── WEBSITE DESIGN (appears twice — both desktop and tablet same text) ───────
// Replace first occurrence (desktop)
let designOld = '<div class="hover-content-para"><p class="para-2">We focus on creating intuitive, engaging, user-centered digital experiences that deliver practical results for businesses.</p></div>';
let designNew = '<div class="service-card-img"><img loading="lazy" src="/696db0cd2780ac54df960dfb/thorgal.jpeg" alt="Thorgal website design project" style="width:100%;height:220px;object-fit:cover;border-radius:12px;margin-bottom:20px;"></div><div class="hover-content-para"><p class="para-2">We design stunning, high-converting digital experiences where beauty meets function — crafted to engage users and authentically reflect the spirit of your brand.</p></div>';

c = c.replace(designOld, designNew);
// Replace second occurrence (tablet)
c = c.replace(designOld, designNew);

// ─── WEBSITE DEVELOPMENT (appears twice — both desktop and tablet same text) ──
let devOld = '<div class="hover-content-para"><p class="para-2">Helping businesses transform ideas into high-quality digital solutions.</p></div>';
let devNew = '<div class="service-card-img"><img loading="lazy" src="/696db0cd2780ac54df960dfb/floema.jpeg" alt="Floema website development project" style="width:100%;height:220px;object-fit:cover;border-radius:12px;margin-bottom:20px;"></div><div class="hover-content-para"><p class="para-2">We build performant, polished websites using modern low-code and custom solutions — translating sophisticated designs into flawless, fast-loading digital products.</p></div>';

c = c.replace(devOld, devNew);
// Replace second occurrence (tablet)
c = c.replace(devOld, devNew);

fs.writeFileSync(file, c, 'utf8');
console.log('Done — service cards updated with images and new text');
