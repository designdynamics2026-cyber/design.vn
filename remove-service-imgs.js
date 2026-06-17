const fs = require('fs');
const file = 'C:/Users/SAM/OneDrive/Desktop/design.vn/site/index.html';
let c = fs.readFileSync(file, 'utf8');

// Remove all service-card-img divs (capitolium, thorgal, floema)
c = c.replace(/<div class="service-card-img"><img loading="lazy" src="\/696db0cd2780ac54df960dfb\/capitolium\.jpeg"[^>]+><\/div>/g, '');
c = c.replace(/<div class="service-card-img"><img loading="lazy" src="\/696db0cd2780ac54df960dfb\/thorgal\.jpeg"[^>]+><\/div>/g, '');
c = c.replace(/<div class="service-card-img"><img loading="lazy" src="\/696db0cd2780ac54df960dfb\/floema\.jpeg"[^>]+><\/div>/g, '');

fs.writeFileSync(file, c, 'utf8');
console.log('Done — images removed from service section');
