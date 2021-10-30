let num_rows = 30
let num_column = 30
let fps = 12;
let time_ms = 1000/fps;
let is_play = false;

let num_states = 6
let num_frames = 0
let current_frame = 0
let is_loop = false
let ttt = 0
let current_color = 0;
let frames_handle = []
let xxxx = 0;
let undo_array = [];
let undo_hist_len = 20;
let mash_toggle = true;
let num_oscillation_color = 1;
let num_gradient_color = 0;
const oscillator_col = 1000;
let Animations = {};
let toggle_capselock = false;
let num_animations = 0;
let max_num_animations = 3
let color_element_ids_dict = {}

// let port = "http://localhost:3000"

let port = "http://3.69.98.116:3000"


let action_right = document.querySelector(".action.right")
let action_left = document.querySelector(".action.left")
let timeline = document.querySelector(".timeline")
let nav = document.querySelector("nav")


// console.log(action.style)
action_left.style.visibility = "hidden"
action_right.style.visibility = "hidden"
timeline.style.visibility = "hidden"
nav.style.visibility = "hidden"


let time_for_demo = 0;

  async function playDemo(){
    let data =  await fetch(port + `/demo`, {method: 'GET' }).then(res => res.json())
    rendered_frames = data.data
    time_ms =data.speed
    run_rendered_frames(rendered_frames)
    time_for_demo = rendered_frames.length*time_ms
    return time_for_demo
    // console.log(data.data)
  }
  time_for_demo=  playDemo()
  setTimeout(()=>{
    console.log(time_for_demo)
    setTimeout(()=>{
      action_left.style.visibility = "visible"
      action_right.style.visibility = "visible"
      timeline.style.visibility = "visible"
      nav.style.visibility = "visible"

      state_array = []
      CreateStateArray()
      set_configuration(state_array)
      time_ms = 1000/fps;
      current_frame = 0;
      // document.querySelector(".button_create.clear").click()

    },time_for_demo)

  },1000)
//   console.log(time_for_demo)
//

// let port = "http://3.69.98.116:3000"
// let port = "ec2-3-69-98-116.eu-central-1.compute.amazonaws.com:3000"



let cb = colorOscillatorCb('#ff0000', '#3333cc', 50);
// #ff6699 #9966ff 44
const bckColor = "#383636"

// #1a0000 #ff471a 10 השיכה
// #cca300 #ff471a 10 שקיעה
// #b38600 #4d3900 10
// #2fb6b6 #103d3d 10


paint_state = 0

let color_dict  = {
  0:(r,c)=>'#171616',
  1:(r,c)=>'#B51F1F',
  2:(r,c)=>'#cb4406',
  3:(r,c)=>'#F3F1E0',
  4:(r,c)=>'#cb9d06',
  5:(r,c)=>'#065684',
}


let color_dict1  = {
  0:(r,c)=>'#171616',
  1:(r,c)=>'#B51F1F',
  2:(r,c)=>'#cb4406',
  3:(r,c)=>'#F3F1E0',
  4:(r,c)=>'#cb9d06',
  5:(r,c)=>'#065684',
}


currentFrame = ()=>current_frame;
color_dict[oscillator_col] = (r,c)=>cb(currentFrame())

let color_dict2  = {
  0:(r,c)=>'red',
  1:(r,c)=>'blue',
  2:(r,c)=>'white',
  3:(r,c)=>'black',
  4:(r,c)=>'Yellow',
  5:(r,c)=>'magenta',
}

let color_dict3  = {
  0:(r,c)=>'#28b7ce',
  1:(r,c)=>'#21c17c',
  2:(r,c)=>'#e27940',
  3:(r,c)=>'#1f286d',
  4:(r,c)=>'#dd6cb8',
  5:(r,c)=>'#f2e672',
}


let color_dict4  = {
  0:(r,c)=>'#4ba8e2',
  1:(r,c)=>'#0b22b6',
  2:(r,c)=>'#919191',
  3:(r,c)=>'#2d2d2d',
  4:(r,c)=>'#ffffff',
  5:(r,c)=>'#f21449',
}
//
// #28b7ce yellow (white)
// #21c17c pink (red)
// #e27940 dark blue (black)
// #1f286d orange (yellow)
// #dd6cb8 turkiz (orange)
// #f2e672 light blue (blue)

function createDataDict(){
  let data_dict = {}
  data_dict["colors"] ={};
  for (const x in color_dict) {
    data_dict["colors"][x] = color_dict[x]()
    }
  data_dict["oscillator_colors"] ={};
  data_dict["gradient_colors"] = {};
  data_dict["animation_colors"] = {};
  data_dict["num_column"] = num_column
  data_dict["num_rows"] = num_rows

  return data_dict
}

let data_dict = createDataDict();

 async function CheckServer(){
   is_on = true
  let xx = await fetch(port+`/check`, {method: 'GET' }).then(res => res)
  console.log(xx)
  try {
    let xx = await fetch(port+`/check`, {method: 'GET' }).then(res => res)
    console.log("server on")
  }
  catch {
    console.log("server is off")
    is_on = false
  }
  return is_on
}

// tttt = CheckServer()

function MkColorsBtns(){

  for (let i = 0;i<num_states;i++){
    let xx = i+1
    elemet_id = "color"+xx
    let col = document.getElementById("color"+xx);
    color_element_ids_dict[i] = elemet_id

    col.style.backgroundColor = color_dict[i](0,0)
    col.addEventListener("click",function(){
    this.style.borderBlockColor = "blue"
    this.style.borderTopColor = "green"
    if (current_color>=num_states){
      current_color = i;
    }
    else if (current_color!=i){
      document.getElementById(`color${current_color+1}`).style.borderBlockColor = "black"
      current_color = i;
      }
    }

  )
  }
}

function allowDrop(ev) {
  ev.preventDefault();
}
function drag(ev) {
  data = ev.dataTransfer.setData("text", ev.target.id);
}

function dragDrop(ev){
  ev.preventDefault()
  console.log(ev.dataTransfer)
  var id = ev.dataTransfer.getData("text");
  deleteColor(id)

}

// col = document.getElementById("color1000").addEventListener("click",function(){
//   current_color = oscillator_col;
//   color_element_ids_dict[oscillator_col] = "color1000"
// }
// )

MkColorsBtns()

frames = [];

let state_array = [];

function CreateStateArray(){
  for (let r = 0; r < num_rows; r++) {
    let col = []
    for (let c = 0; c < num_column;  c++){
      col.push(0)
    }
    state_array.push(col)
  }
}
CreateStateArray()

function createAllButtons(){
  for  (let r = 0; r < num_rows; r++){
    for  (let c = 0; c < num_column; c++){
      const b = createButtons(c,r);
      document.querySelector(".grid").appendChild(b);
    }
  }
}

function createButtons(c,r){
  const buttonEl = document.createElement("button");
  const button_id= `${c}_${r}`;
  buttonEl.id = button_id;
  return buttonEl;
}

createAllButtons()

function eraseFrame(){
  frames.splice(current_frame, 1)
  if (current_frame >= frames.length){
    current_frame -= current_frame;
  }

  set_configuration(frames[current_frame])
  state_array = frames[current_frame];
  let y = document.querySelector('.newframe_count');
  document.querySelector('.newframe_count').innerHTML = `<h3>${current_frame}</h3>`;
  document.getElementById('frame_slider').value = current_frame;
}

document.querySelector(".newframe_btn").addEventListener("click", function(){
  let e = this
  handleNewFrame()
}
)

document.querySelector(".button_create_ocs").addEventListener("click", function(){
  let e = this
  var data = window.prompt("Enter two colors codes and number of frames");
  num_oscillation_color +=1;
  s_data = data.split(' ');
  let col1 = s_data[0]
  let col2 = s_data[1]
  let n = Number(s_data[2])
  let id = num_oscillation_color*1000
  newOscillatingColor(col1, col2, n, id)
}
)

function newOscillatingColor(col1, col2, n, id){
  let color_cb = colorOscillatorCb(col1, col2, n);
  data_dict["oscillator_colors"][id] = [col1, col2, n]
  let bb = document.createElement(`color${id}`);
  bb.id = `color${id}`;
  color_element_ids_dict[id] = bb.id
  bb.class = "color"
  bb.style.width = "50px";
  bb.style.backgroundColor = color_cb(0);
  bb.style.height = "50px";
  bb.style.borderRadius = "40%";
  bb.style.cursor =  "pointer";
  bb.style.border = `2px solid #000`;
  bb.draggable= true;
  bb.addEventListener('dragstart', drag, false);

  color_dict[id] = (r,c)=>color_cb(currentFrame())
  document.querySelector(".pattern_selector").appendChild(bb);
  document.getElementById(bb.id).addEventListener("click", function(){
    current_color = id;
  })
}

document.querySelector(".button_create_grd").addEventListener("click", function(){
  let e = this
  var data = window.prompt("Enter two colors codes and a flag (r or c)");
  num_gradient_color +=1;
  s_data = data.split(' ');
  let col1 = s_data[0]
  let col2 = s_data[1]
  let flag = s_data[2]
  let id = num_gradient_color*10000
  newGradientColor(col1, col2, flag, id)
}
)

function newGradientColor(col1, col2, flag, id){
  let color_cb =   gradientColorCb(col1, col2, flag);
  data_dict["gradient_colors"][id] =[col1, col2, flag]
  let bb = document.createElement(`color${id}`);
  bb.id = `color${id}`;
  color_element_ids_dict[id] = bb.id;
  bb.class = "color"
  bb.style.width = "50px";
  bb.style.backgroundColor = color_cb(0,0);
  bb.style.height = "40px";
  bb.style.borderRadius = "50%";
  bb.style.cursor =  "pointer";
  bb.style.border = `2px solid #000`;
  bb.draggable= true;
  bb.addEventListener('dragstart', drag, false);
  color_dict[id] = (r,c)=>color_cb(r,c)
  document.querySelector(".color_selector").appendChild(bb);
  document.getElementById(bb.id).addEventListener("click", function(){
    current_color = id;
  })
}


function handleNewFrame(){
  let cc = copyFrame(state_array)
  const body = document.querySelector("body")
  body.style.backgroundColor = "#fff";
  setTimeout(function(){
  body.style.backgroundColor = bckColor;
  }
,50);
  frames.push(cc)
  let x = document.getElementById('frame_slider');
  // x.max = rames.length
  x.max = Math.max(frames.length,12)
  x.value = frames.length
  let y = document.querySelector(".newframe_count");
  current_frame = frames.length -1;
  set_configuration(frames[current_frame])
  y.innerHTML = `<p>${frames.length}</p>`
}


document.querySelector(".play").addEventListener("click", function(){
  handlePlay();
}
)

function handlePlay(){
  num_frames = frames.length

  let total_animation_time = num_frames*time_ms;
  if (is_play){
    stopAnimation()
    is_play = !is_play;
  }
  else {
    if (!is_loop){
      is_play = !is_play;
      if (current_frame>frames.length-2){
        current_frame = 0;
      }
      let num_remain_frames = run_frames();
      xxxx = setTimeout(function(){
        is_play = false;
        current_frame = 0;
      },num_remain_frames*time_ms)
    }
    else {
      run_frames();
      ttt = setInterval(function() {
      run_all_frames();
      },frames.length*time_ms);
      is_play = !is_play;
    }
  }
}

document.querySelector(".loop").addEventListener("click", function(){
  is_loop = !is_loop;
  if (is_loop){
    this.style.backgroundColor = `#fff`
    this.style.backgroundColor = "green"
  }
  else {
    clearInterval(ttt)
    stopAnimation()
    this.style.backgroundColor = "#9DF49D"
    setTimeout(function(){
      is_play = !is_play;
      current_frame = 0;
    }
  ,current_frame*time_ms)
  }
})

function stopAnimation(){
  clearTimeout(xxxx)
  clearInterval(ttt)
  for (let i = 0; i< frames_handle.length ; i++){
    clearTimeout( frames_handle[i]);
  }
  frames_handle = [];
}
// document.querySelector(".button_create.reset").addEventListener("click", function() {
//   resetAnimation()
// })


document.querySelector(".button_create.reset").addEventListener("click", function() {
  resetAnimation()
})

document.querySelector(".button_create.clear").addEventListener("click", function() {
  state_array = []
  CreateStateArray()
  set_configuration(state_array)
})

function resetAnimation(){
  frames = [];
  let num_frames = 0
  frame_slider = document.getElementById('frame_slider');
  frame_slider.value = 0;
  // document.getElementById('frame_slider').value =0;
  document.querySelector('.newframe_count').innerHTML = '<h3>0</h3>';
  frame_slider.max = 12;
}

function AddButtonsToEventListener(){
  for (let c = 0; c < num_column; c++) {
    for (let r = 0; r < num_rows; r++){
      let id = `${c}_${r}`;
      document.getElementById(id).addEventListener("click", function(){
      pressButton(this)
      })
      }
   }
}
AddButtonsToEventListener()

function set_configuration(xx){

  for (let c = 0; c < num_column; c++){
    for (let r = 0; r < num_rows; r++){
      let state = xx[r][c];
      let id = `${c}_${r}`;
      let x = document.getElementById(id)
      color_brick(c,r,state)
    }
  }
}

function set_configuration_with_frame_index(frame, index){
  for (let c = 0; c < num_column; c++){
    for (let r = 0; r < num_rows; r++){
      let state = frame[r][c];
      let id = `${c}_${r}`;
      let x = document.getElementById(id)
      x.style.backgroundColor = color_dict[state](r,c)
      x.innerHTML = ``
    }
  }
}

function set_configuration_rendered(frame){
  for (let c = 0; c < num_column; c++){
    for (let r = 0; r < num_rows; r++){
      let x = document.getElementById(`${c}_${r}`)
      x.style.backgroundColor = frame[c][r];
      // x.innerHTML = ``
    }
  }
}

function copyFrame(ref_frame){
  let fame_copy = [];
  for (let i = 0; i < num_rows; i++) {
    let col = []
    for (let ii = 0; ii < num_column;  ii++){
      let val = ref_frame[i][ii];
      col.push(val)
    }
    fame_copy.push(col)
  }
  return fame_copy
}

  function run_frames(){
    current_frame = Math.min(current_frame,frames.length)
    let num_frames_ = frames.length - current_frame ;
    current_frame_ = current_frame
    for (let i = 0; i < frames.length - current_frame ; i++){
      s = setTimeout(function() {
        j  = i + current_frame_
        set_configuration_with_frame_index(frames[j],j);
        document.querySelector('.newframe_count').innerHTML = `<h3>${j}</h3>`;
        current_frame = j;
        document.getElementById('frame_slider').value = j;
      },i*time_ms );
      frames_handle.push(s)
    }
    return num_frames_;
  }

  function run_rendered_frames(rendered_frames){
    current_frame = Math.min(current_frame,frames.length)
    let num_frames_ = rendered_frames.length - current_frame ;
    current_frame_ = current_frame
    for (let i = 0; i < rendered_frames.length - current_frame ; i++){
      s = setTimeout(function() {
        j  = i + current_frame_
        set_configuration_rendered(rendered_frames[j]);
        // document.querySelector('.newframe_count').innerHTML = `<h3>${j}</h3>`;
        current_frame = j;
        document.getElementById('frame_slider').value = j;
      },i*time_ms );
    }
  }



function run_all_frames(){
  let num_frames = frames.length;
  for (let i = 0; i < num_frames; i++){
    s = setTimeout(function() {
      set_configuration_with_frame_index(frames[i],i);
      current_frame = i;
      document.querySelector('.newframe_count').innerHTML = `<h3>${i}</h3>`;
      document.getElementById('frame_slider').value = i;
    },i*time_ms );
    frames_handle.push(s)
  }
}

function updateFps(){
  document.querySelector(".fps_count").innerHTML =  `<h3>${fps}</h3>`
  time_ms = 1000/fps;
}

document.querySelector(".fps_plus").addEventListener("click", function(){
  fps += 1;
  updateFps()
})
document.querySelector(".fps_minus").addEventListener("click", function(){
  fps -= 1;
  updateFps()
})

for (let i=0;i<10;i++){
  shapeStr = `shape${i+1}`
  document.getElementById(shapeStr).addEventListener("click", function(){
    if (i!=paint_state){
      prev_shape = `shape${paint_state+1}`
      x = document.getElementById(prev_shape).style.borderBlockColor = "black"
    }
    paint_state = i;
    this.style.borderBlockColor = "blue"
    this.style.borderTopColor = "green"
  }
  )
}

function pressButton(x){
  handleUndu()
  if (paint_state==0){
     inds = x.id.split('_');
    c = inds[0]
    r = inds[1]
    state_array[r][c] = current_color
    color_brick(c,r,current_color)
  }
  else if(paint_state==1){
     inds = x.id.split('_');
    c = inds[0]
    r = inds[1]
    recurrsive_coloring(c,r, state_array[r][c])
    pp=0
  }
  else if(paint_state==2){
     inds = x.id.split('_');
    c = inds[0]
    r = inds[1]
    right_coloring(c,r, state_array[r][c])
  }
  else if(paint_state==3){
     inds = x.id.split('_');
    c = inds[0]
    r = inds[1]
    left_coloring(c,r, state_array[r][c])
  }
  else if(paint_state==4){
     inds = x.id.split('_');
    c = inds[0]
    r = inds[1]
    up_coloring(c,r, state_array[r][c])
  }
  else if(paint_state==5){
     inds = x.id.split('_');
    c = inds[0]
    r = inds[1]
    down_coloring(c,r, state_array[r][c])
  }
  else if(paint_state==6){
     inds = x.id.split('_');
    c = inds[0]
    r = inds[1]
    twooclock_coloring(c,r)
  }
  else if(paint_state==7){
     inds = x.id.split('_');
    c = inds[0]
    r = inds[1]
    fouroclock_coloring(c,r)
  }
  else if(paint_state==8){
     inds = x.id.split('_');
    c = inds[0]
    r = inds[1]
    eightoclock_coloring(c,r)
  }
  else if(paint_state==9){
     inds = x.id.split('_');
    c = inds[0]
    r = inds[1]
    tenoclock_coloring(c,r)
  }
}

function color_brick(c,r,color){
  let x = document.getElementById(`${c}_${r}`)
  if (color<num_states||color>=1000){
    x.style.backgroundColor = color_dict[color](r,c)
    x.innerHTML = ``
  }
  else {
    index = color - num_states +1
    x.style.backgroundColor = color_dict[color](r,c)
    x.innerHTML = `<h3>${index}</h3>`
  }

}
function down_coloring(c,r,color){
  id = `${c}_${r}`;
  let x = document.getElementById(id)
  state_array[r][c] = current_color
  color_brick(c,r,current_color)
  if (r>0){
    down_coloring(c,r-1, color)
  }
}

function up_coloring(c,r,color){
  id = `${c}_${r}`;
  let x = document.getElementById(id)
  state_array[r][c] = current_color
  color_brick(c,r,current_color)
  if (r<num_rows -1){
    up_coloring(c,Number(r)+Number(1), color)
  }
}
function left_coloring(c,r,color){
  id = `${c}_${r}`;
  let x = document.getElementById(id)
  state_array[r][c] = current_color
  color_brick(c,r,current_color)
  if (c>0){
    left_coloring(c-1,r, color)
  }
}
function right_coloring(c,r,color){
  id = `${c}_${r}`;
  let x = document.getElementById(id)
  state_array[r][c] = current_color
  color_brick(c,r,current_color)

  if (c<num_column - 1){
    right_coloring(Number(c)+Number(1),r, color)
  }
}

pp = 0
function recurrsive_coloring(c,r, color){
  pp +=1
  if (pp>num_rows*num_column){//******
    return
  }
    id = `${c}_${r}`;
    let x = document.getElementById(id)
    state_array[r][c] = current_color
    color_brick(c,r,current_color)
    x.style.backgroundColor = color_dict[current_color](r,c)
    if (c>0 && state_array[r][c-1]==color){
      recurrsive_coloring(Number(c)-1,r, color)
    }
    if (r>0 && state_array[r-1][c]==color){
      recurrsive_coloring(Number(c),Number(r)-1, color)

    }
    if (c<num_column - 1 && state_array[r][Number(c)+Number(1)]==color){
      recurrsive_coloring(Number(c)+Number(1),r, color)
    }
    if (r<num_rows-1 && state_array[Number(r)+Number(1)][c]==color){
      recurrsive_coloring(c, Number(r)+Number(1), color)
    }
}

function twooclock_coloring(c,r){
  id = `${c}_${r}`;
  let x = document.getElementById(id)
  state_array[r][c] = current_color
  color_brick(c,r,current_color)

  if (c<num_column - 1 && 0<r){
    twooclock_coloring(Number(c)+ Number(1),Number(r)-Number(1))
  }

}
function fouroclock_coloring(c,r){
  id = `${c}_${r}`;
  let x = document.getElementById(id)
  state_array[r][c] = current_color
  color_brick(c,r,current_color)
  if (c<num_column - 1 && r<num_rows-1){
    fouroclock_coloring(Number(c)+ Number(1),Number(r)+Number(1))
  }
}
function eightoclock_coloring(c,r){
  id = `${c}_${r}`;
  let x = document.getElementById(id)
  state_array[r][c] = current_color
  color_brick(c,r,current_color)

  if (0<c && r<num_rows-1){
    eightoclock_coloring(Number(c)- Number(1),Number(r)+Number(1))
  }
}
function tenoclock_coloring(c,r){
  id = `${c}_${r}`;
  let x = document.getElementById(id)
  state_array[r][c] = current_color
  color_brick(c,r,current_color)

  if (0<c && 0<r){
    tenoclock_coloring(Number(c)- Number(1),Number(r)- Number(1))
  }
}



const xx = document.querySelector(".grid");
xx.style.gridTemplateColumns = `repeat(${num_column}, 1fr)`;

const frame_ind_input = document.querySelector('input[type="range"].slider#frame_slider');
frame_ind_input.onchange = handleFrameChange

function handleSpeedChange(e){
  time_ms = e.target.value
}

function handleFrameChange(e){
  let slide_index = e.target.value;
  let num_frames = frames.length
  let frame_index = slide_index

  current_frame = frame_index
  set_configuration(frames[frame_index])
  state_array = frames[frame_index];
  let y = document.querySelector('.newframe_count');
  document.querySelector('.newframe_count').innerHTML = `<h3>${frame_index}</h3>`;
}

function ChangeScheme(val){
if (val=="default"){
  color_dict_ = color_dict1
}
else if (val =="caribean"){
  color_dict_ = color_dict2
}
else if (val=="futuristic"){
  color_dict_ = color_dict3
}
else {
  color_dict_ = color_dict4
}
for (let i=0;i<6;i++){
  color_dict[i] = color_dict_[i]
}

}

set_configuration(state_array)
const scheme_input  = document.getElementById("scheme")
scheme_input.onchange = handleScheme

function handleScheme(e){
  let val = e.target.value
  ChangeScheme(val)
  set_configuration(state_array)
  MkColorsBtns()
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function createRandFrame(){
  let rand_color  = getRandomInt(num_states);
  let rand_shape  = getRandomInt(19);
  let rand_r = getRandomInt(num_rows);
  let rand_c = getRandomInt(num_column);
  current_color = rand_color;
  prev_color = state_array[rand_r][rand_c]

  let shapes_dict = {
    0:recurrsive_coloring,
    1:up_coloring,
    2:down_coloring,
    3:left_coloring,
    4:right_coloring,
    5:tenoclock_coloring,
    6:fouroclock_coloring,
    7:twooclock_coloring,
    8:eightoclock_coloring
  }
  try {
  if (rand_shape==0||rand_shape>8){
    id = `${rand_c}_${rand_r}`;
    let x = document.getElementById(id)
    color = state_array[rand_r][rand_c]

    if (prev_color!=current_color){
      recurrsive_coloring(rand_c, rand_r,prev_color )
      pp=0
    }
  }

  else if (rand_shape<8){
    shapes_dict[rand_shape](rand_c, rand_r, state_array[rand_r][rand_c])
  }

  }
  catch(error){
    console.log(error)
    console.log("rand_shape")
    console.log(rand_shape)
    console.log("id")
    console.log(id)
    console.log("current_color")
    console.log(current_color)
    console.log(prev_color)
  }
}

function CreateRandAnimation(){
  num_frames = 20
  resetAnimation()

  for (let j=0; j<num_frames; j++){
    handleNewFrame()
    for (let i=0; i<50; i++){
      createRandFrame();
    }
  }
}

function StoreAnimation(index){
  let frames_ = [];
  for (let i=0;i<frames.length;i++){
    frames_.push(copyFrame(frames[i]));
  }
  Animations[index] = frames_;
}

// function CreatAnimationButtons(n,id){
//
//   // let bb = document.createElement("action_buttons");
//   // bb.id = `animation${n}`;
//   // bb.innerHTML = `<h3>${n}</h3>`
//   animation_id = "pattern"+n
//   bb = document.getElementById(animation_id)
//   bb.innerHTML = `<h3>${n}</h3>`
//   // document.querySelector(".right_action").appendChild(bb);
//   document.getElementById(animation_id).addEventListener("click", function(){
//     frames = Animations[id]
//     set_configuration(frames[current_frame])
//   })
// }

function CreatAnimationColor(n,id){
  const bb = document.createElement("pattern")
  console.log(bb)
  console.log(bb)
  console.log(bb)

  bb.id  = "pattern"+n;
  bb.draggable= true;
  bb.innerHTML = `<h3>${n}</h3>`

  // let bb = document.createElement("color");
  // bb.id = `animation_color${n}`;
  color_element_ids_dict[id] = bb.id
  bb.class = "color"
  bb.style.width = "50px";
  bb.style.height = "50px";
  bb.style.borderRadius = "50%";
  bb.style.cursor =  "pointer";
  bb.style.border = `2px solid #000`;
  bb.style.textAlign = 'center'
  // bb.draggable= true;


  // bb.innerHTML = `<h2>${n}</h2>`
  bb.addEventListener('dragstart', drag, false);
  document.querySelector(".pattern_selector").appendChild(bb);
  document.getElementById(bb.id).addEventListener("click", function(){
    current_color = id
  })
}



document.querySelector(".create_pattern").addEventListener("click", function(){
  // if (num_animations == max_num_animations){
  //   num_animations =0;
  // }
  num_animations += 1
  let index = num_states + num_animations - 1
  StoreAnimation(index)
  // CreatAnimationButtons(num_animations,index)
  CreatAnimationColor(num_animations, index)
  let x = colorAnimationCb(Animations[index])
  color_dict[index] = x;
})

function deleteColor(id){
  var elem = document.getElementById(id);
  console.log(elem);
  elem.remove(elem);
}

//'http://localhost:3000/gif'
document.querySelector(".extract.save_btn").addEventListener("click", function(){
  const prefix = window.prompt("enter gif name")
  name = prefix+String(Date.now())
  data = {"name":name,"speed":Math.round(time_ms),"data": renderAnimation()}

  fetch(port + '/gif', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  aaa =  document.createElement(`a`);
  aaa.href = port+`/download/${name}`
  console.log(aaa.href)
  aaa.click()
})


document.querySelector(".save.save_btn").addEventListener("click", function(){
  const session_name = window.prompt("Save session as");

  for (let i in Animations){
    data_dict["animation_colors"][i] = Animations[i];
  }
  data_dict["frames"] = frames;
  data_dict["session_name"] = session_name;
  data_dict["rendered_animation"] = renderAnimation()
  fetch(port+'/api', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data_dict),
  })
})

document.querySelector(".load.save_btn").addEventListener("click",async function(){
  // const session_name = window.prompt("Enter session name here");
  let fn_list = await fetch(port+`/api/sessions`, {method: 'GET' }).then(res => res.json())
  const session_name = window.prompt("Enter session name from the following list   " + fn_list);
   let data = await fetch(port + `/api/${session_name}`, {method: 'GET' }).then(res => res.json())
   LoadSession(data)
   console.log(`num_animations ${num_animations}`)
})

function LoadSession(data){
  oscillator_colors = data["oscillator_colors"]
  for (const x in oscillator_colors){
    col1 = oscillator_colors[x][0]
    col2 = oscillator_colors[x][1]
    n = oscillator_colors[x][2]
    colorOscillatorCb(col1, col2, n)
    color_dict[x] = (r,c)=>color_cb(currentFrame())
    newOscillatingColor(col1, col2, n, x)
  }
  animation_colors = data["animation_colors"]
  let nn = 0;
  Animations = animation_colors;
  for (let index in animation_colors){
    // nn +=1
    num_animations +=1
    color_dict[index] = colorAnimationCb(animation_colors[index])
    // CreatAnimationButtons(num_animations,index)
    CreatAnimationColor(num_animations, index)
  }
  gradient_colors = data["gradient_colors"]
  for (let x in gradient_colors){
    col1 = gradient_colors[x][0]
    col2 = gradient_colors[x][1]
    flag = gradient_colors[x][2]
    newGradientColor(col1, col2, flag, x)
  }
  frames = data["frames"]
}

function rgbToH(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if(result){
      var r= parseInt(result[1], 16);
      var g= parseInt(result[2], 16);
      var b= parseInt(result[3], 16);

      return [r,g,b]
  }
  return null;
}

function create_bool_array(){
  let b = [];
  let nb = [];
  for (let r = 0; r < num_rows; r++) {
    let col = []
    let ncol = []

    for (let c = 0; c < num_column;  c++){
      col.push(state_array[r][c]>0)
      ncol.push(state_array[r][c]==0)
    }
    b.push(col)
    nb.push(ncol)

  }
  return [b, nb]
  }

  document.querySelector(".button_errows.up").addEventListener("click",function(){
    CyclUp()
  })

  document.querySelector(".button_errows.down").addEventListener("click",function(){
    CyclDown()
  })
  document.querySelector(".button_errows.left").addEventListener("click",function(){
    CyclLeft()
  })

  document.querySelector(".button_errows.right").addEventListener("click",function(){
    CyclRight()
  })

  function CyclUp(){
    let cc = copyFrame(state_array)
    cc = cc.slice(1)
    state_array = [...cc,...[state_array][0]];
    set_configuration(state_array)
  }

  function CyclDown(){
    let cc = copyFrame(state_array)
    cc = cc.slice(0,num_rows-1)
    state_array = [...[state_array[Number(num_rows)-1]],...cc];
    set_configuration(state_array)
  }

  function CyclLeft(){
    let cc = copyFrame(state_array)
    for (let r=0;r<num_rows;r++){
      cc[r] = [...cc[r].slice(1),...[state_array[r][0]] ]
      state_array = cc;
      set_configuration(state_array)
    }
  }

  function CyclRight(){
    let cc = copyFrame(state_array)
    n = Number(num_column)-1
    for (let r=0;r<num_rows;r++){
      cc[r] = [...[state_array[r][Number(num_rows)-1]],...cc[r].slice(0,n)];
      state_array = cc;
      set_configuration(state_array)
    }

  }

  command_on = false

  document.addEventListener("keydown", (e) => {
    if(e.keyCode == 91){
      command_on = true
      command_event =  setTimeout(()=>{
        command_on = false
      },1000)
    }
    else if (e.keyCode == 90) {
      if (command_on){
        clearTimeout(command_event)
        Undo()
        command_on = true
        command_event =  setTimeout(()=>{
          command_on = false
        },1000)

      }
    }
})

  document.body.onkeyup = function(e){
      if(e.keyCode == 13){
        e.preventDefault();
        handleNewFrame()
      }
      if(e.keyCode == 40){
        if (toggle_capselock){
          e.preventDefault();
          current_frame = 0
          updateFrame()
        }
        else {
          CyclDown()
        }
      }
      if(e.keyCode == 37){
        e.preventDefault();
        if (toggle_capselock){
          if (current_frame>0){
            current_frame -= 1
          }
          else{
            current_frame = frames.length-1;
          }
          updateFrame()
        }
        else {
          CyclLeft()
        }

      }
      if(e.keyCode == 39){
        if (toggle_capselock){
          e.preventDefault();
          if (current_frame<frames.length-1){
            current_frame += 1
          }
          else{
            current_frame = 0;
          }
          updateFrame()
        }
        else {
          CyclRight()
        }

      }
      if(e.keyCode == 38){
        if (toggle_capselock){
          e.preventDefault();
          current_frame = frames.length-1
          updateFrame()
        }
        else {
          CyclUp()
        }
      }
      if(e.keyCode == 32){
        e.preventDefault();
        handlePlay()
      }
      if (e.keyCode == 9){
        toggle_capselock = !toggle_capselock;
      }
  }

  function handleUndu(){
    undo_array.push(copyFrame(state_array))
    if (undo_array.length>=undo_hist_len-1){
      undo_array = undo_array.slice(1)
    }
  }

  function updateFrame(){
    set_configuration(frames[current_frame])
    state_array = frames[current_frame];
    document.querySelector('.newframe_count').innerHTML = `<h3>${current_frame}</h3>`;
    document.getElementById('frame_slider').value = current_frame;
  }

  document.querySelector(".undo").addEventListener("click",function(){
    Undo()
  })

  document.querySelector(".button_create.reverse").addEventListener("click",function(){
    frames.reverse()
  })

  function Undo(){
    if (undo_array.length>0){
      state_array = undo_array[undo_array.length-1]
      undo_array = undo_array.slice(0,undo_array.length-1)
    }
    frames[current_frame] = state_array;
    set_configuration(frames[current_frame])

  }

  function createMash(frames_array1, frames_array2, frames_master, col1, col2 ){
    l = frames_master.length

    if( frames_array1.length<frames_master.length){
      frames_array1 = makeItEqual(frames_array1, frames_master)
    }
    else{
      frames_array1.slice(0,l)
     }

     if( frames_array2.length<frames_master.length){
       frames_array2 = makeItEqual(frames_array2, frames_master)
     }
     else{
       frames_array2.slice(0,l)
      }

     mashed_frames = []
     for (let i = 0; i < frames_array1.length; i++){
       let x = createMashedFrame(frames_array1[i], frames_array2[i], col1, col2, frames_master[i])
       mashed_frames.push(x)
     }
     return mashed_frames
  }

  function createMashedFrame(frame1, frame2, col1, col2, master_frame){
    mashed_frame = [];
    for (let r = 0; r < num_rows; r++) {
      let rr = [];
      for (let c = 0; c < num_column ; c++){
        let id = `${c}_${r}`;
        if (master_frame[r][c]==col1){
          rr.push(frame1[r][c])
        }
        else if (master_frame[r][c]==col2) {
          rr.push(frame2[r][c])
        }
        else {
          rr.push(master_frame[r][c])
        }
      }
      mashed_frame.push(rr)
     }
     return mashed_frame
  }

  function colorAnimationCb(animation){
    function f(r,c){
      let l = animation.length
      x = animation[current_frame%l];
      return color_dict[x[r][c]](r,c)
    }
    return f
  }

  function colorOscillatorCb(col1, col2, num_frames){
    let col1_rgb = hexToRgb(col1)
    let col2_rgb = hexToRgb(col2)
    let r_diff = col2_rgb[0]-col1_rgb[0]
    let g_diff = col2_rgb[1]-col1_rgb[1]
    let b_diff = col2_rgb[2]-col1_rgb[2]

    let r_step = r_diff/num_frames
    let g_step = g_diff/num_frames
    let b_step = b_diff/num_frames

    function cb(i){
      if (i==0){
        r =col1_rgb[0]
        g = col1_rgb[1]
        b = col1_rgb[2]
      }
      else {
        let ii = i%(2*num_frames);
        if (ii<num_frames){
          r = Math.round(col1_rgb[0] +ii*r_step)
          g = Math.round(col1_rgb[1] +ii*g_step)
          b = Math.round(col1_rgb[2] +ii*b_step)

        }
        else {
          jj = 2*num_frames-ii;
          r = Math.round(col1_rgb[0] +jj*r_step)
          g = Math.round(col1_rgb[1] +jj*g_step)
          b = Math.round(col1_rgb[2] +jj*b_step)
        }

      }
      return rgbToH(r, g, b)
    }
    return cb
  }

  function gradientColorCb(col1, col2,flag){
    f = function(r,c) {
      if (flag=="r"){
        let cb_ = colorOscillatorCb(col1, col2, num_rows)
        return cb_(r)
      }

      else if (flag=="c") {
        let cb_ = colorOscillatorCb(col1, col2, num_column)
        return cb_(c)
      }
      else{
        alert("not the right format!")
        return false
      }
    }
    return f
  }

  function renderAnimation(){
    rendered_frames = []
    for (let f=0; f<frames.length;f++){
      current_frame = f
      let rf = renderFrame(frames[f])
      rendered_frames.push(rf)
    }
    return rendered_frames
  }

  function renderFrame(frame){
    let render_frame = []
    for (let c = 0; c < num_column; c++){
      let col = []
      for (let r = 0; r < num_rows; r++){
        let state = frame[r][c];
        col.push(color_dict[state](r,c))
      }
      render_frame.push(col)
    }
    return render_frame
  }
