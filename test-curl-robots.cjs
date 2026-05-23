const https = require('https');
https.get('https://geo-stamp-camera.vercel.app/robots.txt', (res) => {
  console.log('StatusCode:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Data:', data));
});
