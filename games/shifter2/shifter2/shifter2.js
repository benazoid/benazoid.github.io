let canvas, copyButton, playButton, playInput, insertButton, insertInput;
let timeCount = 0;
let lastTime = 0;
let settingsOpen = false;
let Move;

let blockScript = document.createElement("script");
blockScript.setAttribute("src", "block.js");
document.body.appendChild(blockScript);
let levelScript = document.createElement("script");
levelScript.setAttribute("src", "level.js");
document.body.appendChild(levelScript);
//p5.disableFriendlyErrors = true;

function setup(){
  canvas = createCanvas(650,650);
  canvas.position(windowWidth/2-width/2,windowHeight/2-height/2);
  Move = {
    name: 'new movement',
    points: [createVector(200,200),createVector(300,200),createVector(250,150)],
    speed: 1,
    stop: 0.5,
    type: "line",
  }
  //Level.moveSettings.push(Move);

  Level.levels.push(Level.createFromCode('test,1200,600||{0,0,100,0,50,-100,;new movement,1,2,line}|{100,100,start,default controller,default movement;0,0,20,80;;0,0,80,20;}{200,400,end,default controller,new movement;0,0,20,60;}|'));
}

function draw(){
  let player = Level.levels[Level.level].blocks[Level.levels[level.level].player];
  Level.go(true,player);

  if(keys[Keys.p] && !settingsOpen){
    settingsOpen = true;
    openSettings();
  }
  if(!settingsOpen){
    canvas.position(windowWidth/2-width/2,windowHeight/2-height/2);
  }
}

function copyLevelCode(){
  navigator.clipboard.writeText(Level.levels[Level.level].getLevelCode());
}
function openSettings(){
  canvas.position(25,windowHeight/2-height/2);
  copyButton = createButton("copy level code to clipboard");
  copyButton.mousePressed(copyLevelCode);
  copyButton.position(width+25,100);
  copyButton.size(185,22);

  playButton = createButton("play level code");
  //copyButton.mousePressed(copyLevelCode);
  playButton.position(width+25,150);
  playButton.size(185,22);

  playInput = createInput('');
  playInput.position(width+25,175);
  playInput.size(177,15);

  insertButton = createButton("add level code to levels");
  //copyButton.mousePressed(copyLevelCode);
  insertButton.position(width+25,225);
  insertButton.size(185,22);

  insertInput = createInput('');
  insertInput.position(width+25,250);
  insertInput.size(177,15);
  let p = createP("note - this data will only be stored on your device, to let others play your levels you must send them your level code");
  p.position(width+25,300);
  p.size(200,100);
}
