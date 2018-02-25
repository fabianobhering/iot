var http = require('http');

http.createServer(function(req,res) { 
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<h2> Olá mundo! </h2>');
}).listen(3000);

