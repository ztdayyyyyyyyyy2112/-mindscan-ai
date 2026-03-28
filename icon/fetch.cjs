const https = require('https');
const fs = require('fs');

https.get('https://test-852679.webflow.io/', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    fs.writeFileSync('page.html', data);
    console.log('Done');
  });
}).on('error', (err) => {
  console.error(err);
});
