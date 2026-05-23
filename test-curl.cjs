const https = require('https');
https.get('https://geo-stamp-camera.vercel.app/sitemap.xml', (res) => {
  console.log('StatusCode:', res.statusCode);
  console.log('Headers:', res.headers);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Data:', data.substring(0, 100)));
});
