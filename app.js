const http = require('http')
const os = require('os')
const path = require('path')
const express = require('express')
const fs = require('fs')
const PNG = require('pngjs').PNG;


app = express()

app.use(express.json({limit: '25mb'}));

app.use(express.static('public'))
// app.use(express.json({limit:'1mb'}))
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
})

app.listen(3000)
console.log("listening to port 3000")

app.get('/check',function (req,res){
  console.log("running")
}
)

app.get('/api/sessions', function (req, res) {
  let json_files_list = [];
  files = fs.readdirSync(__dirname+"/saved_sessions")
  files.forEach(file => {
      if (path.extname(file) == ".json")
        json_files_list.push(path.basename(file,".json"));
    })

  var filenames_list = JSON.stringify(json_files_list)
  res.send(filenames_list)
})

app.get('/api/:filename', function (req, res) {
  const filename = req.params.filename

  var data = fs.readFileSync(`saved_sessions/${filename}.json`)
  var data_str = JSON.parse(data)
  res.send(data_str)

})

app.post('/api',(request, response)=>{
  var data = JSON.stringify(request.body)
  var data_str = JSON.parse(data)
  if (!fs.existsSync('saved_sessions')){
    fs.mkdirSync('saved_sessions')
  }
  fs.writeFile(`saved_sessions/${data_str["session_name"]}.json`, data, function (err) {
  if (err) return console.log(err);
  });

})

app.post('/gif',(request, response)=>{
  var data = JSON.stringify(request.body)
  var data_str = JSON.parse(data)

  var name = data_str["name"]
  var speed = data_str["speed"]
  console.log(`speed ${speed}`)
  var frames = data_str["data"]

  xoxox = makePngs(name,speed,frames)
  // spawn('python3', ['convert_png.py'])
  if (!fs.existsSync('extracted_gifs')){
    fs.mkdirSync('extracted_gifs')
  }

  setTimeout(() => { spawn('python3', ['convert_png.py']); }, 20000);




  fs.writeFile(`extracted_gifs/${data_str["name"]}.json`, data, function (err) {
  if (err) return console.log(err);
  });

})



var spawn = require('child_process').spawn

function makePngs(name,speed, frames){


let margin = 0;
let brick_dim = [7, 10];

num_rows = 30
num_cols = 30

let w = num_rows*(brick_dim[1]+margin)+margin
let h = num_cols*(brick_dim[0]+margin)+margin

for (let i = 0;i<frames.length;i++){
  frame = frames[i]
var png = new PNG({
    width: w,
    height: h,
    filterType: -1
});


for (var y = 0; y < png.height; y++) {
    for (var x = 0; x < png.width; x++) {
        var idx = (png.width * y + x) << 2;
        png.data[idx  ] = 40; // red
        png.data[idx+1] = 30; // green
        png.data[idx+2] = 40; // blue
        png.data[idx+3] = 0; // alpha (0 is transparent)
    }
}

function rgbToH(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function colorBrick(c,r,rgb){
  start_h = c*(margin + brick_dim[0])
  start_w = r*(margin + brick_dim[1])
  for (var y = start_h; y < start_h + brick_dim[0]; y++) {
      for (var x = start_w ; x < start_w+brick_dim[1]; x++) {
          var idx = (png.width * y + x) << 2;
          png.data[idx  ] = rgb[0]; // red
          png.data[idx+1] = rgb[1]; // green
          png.data[idx+2] = rgb[2]; // blue
          png.data[idx+3] = rgb[3]; // alpha (0 is transparent)
      }
  }
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if(result){
      var r= parseInt(result[1], 16);
      var g= parseInt(result[2], 16);
      var b= parseInt(result[3], 16);

      return [r,g,b,240]
  }
  return null;
}


for (let r = 0; r < num_rows; r++) {
  for (let c = 0; c < num_cols;  c++){
    rgb = hexToRgb(frame[r][c])
    colorBrick(c,r,rgb)
  }
}

if (!fs.existsSync('pngs_container')){
  fs.mkdirSync('pngs_container')
}
png.pack().pipe(fs.createWriteStream(`pngs_container/${name}_${speed}_${i}.png`));

}
return null;
}
