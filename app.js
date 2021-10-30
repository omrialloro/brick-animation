const http = require('http')
const os = require('os')
const path = require('path')
const express = require('express')
const fs = require('fs')
const PNG = require('pngjs').PNG;


app = express()

app.use(express.json({limit: '25mb'}));

app.use(express.static('public'))
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
  res.send("ok")
}
)

app.get('/download/:filename', (req,res)=>{
  let filename = req.params.filename
  gif_path = `extracted_gifs/${filename}.gif`
  let is_ready = false
  const intervalObj = setInterval(function() {

      let file = gif_path;
      let fileExists = fs.existsSync(file);
      if (fileExists){
        is_ready = fs.statSync(gif_path).size>100
      }
      console.log("is exists:"+fileExists)
      console.log("is ready:"+is_ready)

      if (is_ready) {
          clearInterval(intervalObj);
          setTimeout(()=>{res.download(gif_path);
          console.log("READY")
          },4000)
          // setTimeout(()=>{fs.unlinkSync(gif_path)},10000)
      }
  }, 2000);
})

function checkFilesReady(name,num_files){
  files = fs.readdirSync(name)
  if (files.length!=num_files){
    return false
  }
  else {
    is_ready = true
    tot_size = 0
    for(let i=0; i<num_files; i++){
      let stat = fs.statSync(name+"/"+files[i])
      tot_size += stat.size
      if (stat.size<10){
        is_ready = false
      }
    }
    console.log(tot_size)
    return is_ready
  }
}
// app.get('/check', function (req, res) {
//   res.send("ok")
// })

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

app.get('/demo', function (req, res) {
  var data = fs.readFileSync(`demo.json`)
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
  console.log("*******")
  var name = data_str["name"]
  console.log("name is:" +name)
  var speed = data_str["speed"]
  console.log(`speed is:${speed}`)
  var frames = data_str["data"]
  let num_files = frames.length
  console.log("number of frames is:"+ num_files)

  fs.writeFile(`extracted_gifs/${data_str["name"]}.json`, data, function (err) {
    if (err) return console.log(err);
  });

  makePngs(name,speed,frames)
  console.log("exit makePngs")
  if (!fs.existsSync('extracted_gifs')){
    fs.mkdirSync('extracted_gifs')
  }


let counter = 0
  const intervalObj = setInterval(function() {
    counter +=1
    console.log("counter is" +counter)
      let is_ready = checkFilesReady(name, num_files)
      console.log("is_ready: "+ is_ready)
      if (is_ready&&counter>10) {
        clearInterval(intervalObj);
        setTimeout(()=>{
          console.log("files are ready")
          console.log('calling python...');
          spawn('python3', ['convert_png.py',name, speed])
        },3000)
      }
  }, 500);

// const tmot = setTimeout(()=>{
//   // console.log("suspicious!")
//   console.log('calling python...');
//
//   // clearInterval(intervalObj);
//   spawn('python3', ['convert_png.py',name, speed])
// },5000)
//   fs.writeFile(`extracted_gifs/${data_str["name"]}.json`, data, function (err) {
//   if (err) return console.log(err);
//   });
})


var spawn = require('child_process').spawn

function makePngs(name,speed, frames){

let margin = 0;
let brick_dim = [10, 10];

num_rows = 30
num_cols = 30

let w = num_rows*(brick_dim[1]+margin)+margin
let h = num_cols*(brick_dim[0]+margin)+margin

fs.mkdirSync(name)


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


for (let r = 0; r < num_rows; r++) {
  for (let c = 0; c < num_cols;  c++){
    rgb = hexToRgb(frame[r][c])
    colorBrick(c,r,rgb)
  }
}
png.pack().pipe(fs.createWriteStream(`${name}/${i}.png`));


}
return null;
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

function rgbToH(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
