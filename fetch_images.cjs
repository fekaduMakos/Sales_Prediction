const https = require('https');
const queries = ['cooking oil bottle', 'canned tuna', 'milk powder', 'pasta package', 'sugar bag'];
queries.forEach(q => {
  const url = 'https://unsplash.com/s/photos/' + encodeURIComponent(q);
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const match = data.match(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9\-]+[^\"']+/);
      if (match) {
        console.log(q + ': ' + match[0].split('?')[0] + '?w=600&q=80&auto=format&fit=crop');
      } else {
        console.log(q + ': NOT FOUND');
      }
    });
  });
});
