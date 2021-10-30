// var http = require('http');
// var port = 9000;

// http.createServer(function (req,res){
//   res.writeHead(200,{'Content-Type':'text/plain'});
//   res.end('Hello World\n')
// }).listen(port)
// console.log('Listening on port', port)


const express = require('express')
const fs = require('fs')


app = express()

app.listen(5000)
console.log("listening to port 5000")

app.get('/check',function (req,res){
  console.log("running")
  res.send("ok")
}
)
