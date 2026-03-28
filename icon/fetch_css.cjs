const https = require('https');
const fs = require('fs');

https.get('https://cdn.prod.website-files.com/69c773b68211f0dc7da25e7a/css/test-852679.webflow.shared.fde2e2714.css', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    fs.writeFileSync('styles.css', data);
    console.log('Done');
  });
}).on('error', (err) => {
  console.error(err);
});
