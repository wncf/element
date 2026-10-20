const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname);
const port = 4578;

http.createServer((req, res) => {
  const file = path.join(root, decodeURIComponent(req.url.split('?')[0]));
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': file.endsWith('.css') ? 'text/css' : 'text/html' });
    res.end(data);
  });
}).listen(port, () => console.log('listening on ' + port));
