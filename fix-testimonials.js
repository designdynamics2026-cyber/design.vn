const fs = require('fs');
const file = 'C:/Users/SAM/OneDrive/Desktop/design.vn/site/index.html';
let c = fs.readFileSync(file, 'utf8');

// ── TESTIMONIAL TEXT REWRITES ──────────────────────────────────────────────

// Quote 1 (Thu Hang / S.Sens) — two variants in the HTML
c = c.replace(
  /"The website captures the core values of the brand - from colors and layout to content\. The S\.Sens team is very satisfied with both the product and the studio's working approach\."/g,
  '"Design Dynamics delivered a digital experience that truly reflects our brand. From the very first meeting to the final launch, the process was smooth, strategic, and inspiring."'
);
c = c.replace(
  /"The website captures the core values of the brand - from colors and layout to content\. The S\.Sens team is very satisfied with both the product and Design Dynamics's working approach\."/g,
  '"Design Dynamics delivered a digital experience that truly reflects our brand. From the very first meeting to the final launch, the process was smooth, strategic, and inspiring."'
);

// Quote 2 (Long Nguyen)
c = c.replace(
  /"Having had the opportunity to work with Design Dynamics, I am very pleased with the meticulous communication and design expertise of the studio\." ?/g,
  '"Working with Design Dynamics was an exceptional experience. Their strategic thinking and modern aesthetic sensibility elevated our digital presence far beyond what we had imagined."'
);

// Quote 3 (Joe Zhou) — with html entity and without
c = c.replace(
  /"One of those guys i know off don&#x27;t need the best equipment, a piece of paper can draw a landscape of awesomeness to impress the crowd\."/g,
  '"From brief to final handoff, the collaboration was seamless. Design Dynamics understood our vision intuitively and crafted something truly memorable and refined."'
);
c = c.replace(
  /"One of those guys i know off don't need the best equipment, a piece of paper can draw a landscape of awesomeness to impress the crowd\."/g,
  '"From brief to final handoff, the collaboration was seamless. Design Dynamics understood our vision intuitively and crafted something truly memorable and refined."'
);

// ── NAMES ─────────────────────────────────────────────────────────────────
c = c.replace(/>Thu Hang</g, '>Sarah Mitchell<');
c = c.replace(/>Long Nguyen</g, '>James Ravenscroft<');
c = c.replace(/>Joe Zhou</g, '>Marie Dupont<');

// ── TITLES ────────────────────────────────────────────────────────────────
c = c.replace(/>S\.Sens Homes - Founder</g, '>Founder — Hubtown Creative<');
c = c.replace(/>Founder - S\.Sens Homes</g, '>Founder — Hubtown Creative<');
c = c.replace(/>The Martec - Tech Lead</g, '>Creative Director<');
c = c.replace(/>Tech Lead - The Martec</g, '>Creative Director<');
c = c.replace(/>The Martec - CTO</g, '>Brand Manager — Floema<');
c = c.replace(/>CTO - The Martec</g, '>Brand Manager — Floema<');

// ── REMOVE EXTERNAL LINK REDIRECT BUTTONS (LinkedIn icons) ────────────────
c = c.replace(/<a[^>]+linkedin\.com[^>]*>[\s\S]*?<\/a>/g, '');

fs.writeFileSync(file, c, 'utf8');
console.log('Done');
