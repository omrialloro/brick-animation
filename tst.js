var http = require('http');
var port = 9000;
http.createServer(function (req,res){
  res.writeHead(200,{'Content-Type':'text/plain'});
  res.end('Hello World\n')
}).listen(port)
console.log('Listening on port', port)
