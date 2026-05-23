const fs = require('fs');
const buf = fs.readFileSync('public/sitemap.xml');
console.log(buf.slice(0, 50));
