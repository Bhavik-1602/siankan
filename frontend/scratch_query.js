const https = require('https');

https.get('https://laqxhbkgsisvjumyrmnt.supabase.co/storage/v1/object/public/products/festive_choli.png', (res) => {
  console.log('Status code:', res.statusCode);
  console.log('Content-Type:', res.headers['content-type']);
  res.on('data', (d) => {
    console.log(d.toString().substring(0, 300));
  });
}).on('error', (e) => {
  console.error(e);
});
