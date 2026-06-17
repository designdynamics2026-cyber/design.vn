const fs = require('fs');
const file = 'C:/Users/SAM/OneDrive/Desktop/design.vn/site/index.html';
let c = fs.readFileSync(file, 'utf8');

// 1. Hemant Shah → Robert Keller
c = c.replace(/>Hemant Shah</g, '>Robert Keller<');
c = c.replace(/"name": "Hemant Shah"/g, '"name": "Robert Keller"');

// 2. James Ravenscroft → keep but normalize
c = c.replace(/>James Ravenscroft</g, '>James Whitfield<');
c = c.replace(/"name": "James Ravenscroft"/g, '"name": "James Whitfield"');

// 3. Ana Quinta → Sophie Hartley
c = c.replace(/>Ana Quinta</g, '>Sophie Hartley<');
c = c.replace(/"name": "Ana Quinta"/g, '"name": "Sophie Hartley"');

fs.writeFileSync(file, c, 'utf8');
console.log('Done');
