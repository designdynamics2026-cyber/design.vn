const fs = require('fs');
const file = 'C:/Users/SAM/OneDrive/Desktop/design.vn/site/index.html';
let c = fs.readFileSync(file, 'utf8');

// Hubtown testimonial: Sarah Mitchell → Hemant Shah
c = c.replace(/>Sarah Mitchell</g, '>Hemant Shah<');
c = c.replace(/>Founder — Hubtown Creative</g, '>Co-Founder & Executive Chairman — Hubtown Ltd.<');

// Floema testimonial: Marie Dupont → Ana Quinta
c = c.replace(/>Marie Dupont</g, '>Ana Quinta<');
c = c.replace(/>Brand Manager — Floema</g, '>Managing Partner — Floema<');

// Also fix in JSON-LD schema
c = c.replace(/"name": "Sarah Mitchell"/g, '"name": "Hemant Shah"');
c = c.replace(/"name": "Marie Dupont"/g, '"name": "Ana Quinta"');

fs.writeFileSync(file, c, 'utf8');
console.log('Done');
