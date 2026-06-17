const fs = require('fs');
const file = 'C:/Users/SAM/OneDrive/Desktop/design.vn/site/index.html';
let c = fs.readFileSync(file, 'utf8');

// ── FIX JSON-LD SCHEMA (lines 31-65) ──────────────────────────────────────
c = c.replace(/"name": "Thu Hang"/g, '"name": "Sarah Mitchell"');
c = c.replace(/"name": "Long Nguyen"/g, '"name": "James Ravenscroft"');
c = c.replace(/"name": "Joe Zhou"/g, '"name": "Marie Dupont"');
c = c.replace(
  /Website chạm đúng đến giá trị cốt lõi của thương hiệu từ màu sắc, bố cục đến nội dung\. Team S\.Sens rất hài lòng khi nhận được sản phẩm cũng như cách làm việc của Design Dynamics/g,
  'Design Dynamics delivered a digital experience that truly reflects our brand. From the very first meeting to the final launch, the process was smooth, strategic, and inspiring.'
);
c = c.replace(
  /Chuyên nghiệp, sản phẩm chỉn chu và tư duy thẩm mỹ hiện đại\. Một người đồng hành đáng tin cậy/g,
  'Working with Design Dynamics was an exceptional experience. Their strategic thinking and modern aesthetic sensibility elevated our digital presence far beyond what we had imagined.'
);
c = c.replace(
  /One of those guys i know off don.t need the best equipment, a piece of paper can draw a landscape of awesomeness to impress the crowd\./g,
  'From brief to final handoff, the collaboration was seamless. Design Dynamics understood our vision intuitively and crafted something truly memorable and refined.'
);

// ── FIX VISIBLE HTML TESTIMONIALS (all variants of Joe Zhou quote) ─────────
// Match any apostrophe variant (straight, curly, html entity)
const joeOld = /“One of those guys i know off don[’'&#x27;]t need the best equipment, a piece of paper can draw a landscape of awesomeness to impress the crowd\.”/g;
const joeNew = '“From brief to final handoff, the collaboration was seamless. Design Dynamics understood our vision intuitively and crafted something truly memorable and refined.”';
c = c.replace(joeOld, joeNew);

// Also catch any remaining variant with ASCII quotes
c = c.replace(/"One of those guys i know off don.t need the best equipment, a piece of paper can draw a landscape of awesomeness to impress the crowd\."/g,
  '"From brief to final handoff, the collaboration was seamless. Design Dynamics understood our vision intuitively and crafted something truly memorable and refined."'
);

// Fix remaining names in HTML
c = c.replace(/>Joe Zhou</g, '>Marie Dupont<');
c = c.replace(/>Thu Hang</g, '>Sarah Mitchell<');
c = c.replace(/>Long Nguyen</g, '>James Ravenscroft<');

// Fix remaining titles
c = c.replace(/>S\.Sens Homes - Founder</g, '>Founder — Hubtown Creative<');
c = c.replace(/>The Martec - CTO</g, '>Brand Manager — Floema<');
c = c.replace(/>The Martec - Tech Lead</g, '>Creative Director<');

fs.writeFileSync(file, c, 'utf8');
console.log('Done');
