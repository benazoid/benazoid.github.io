let levels = [];
let keys = [];
let level = 0;
let cam, canvas;
let timeCount = 0;
let lastTime = 0;
let frameCount = 0;

function setup(){
  canvas = createCanvas(600,600);
  canvas.parent('canvas');
  //canvas.position(window.innerWidth/2-width/2,window.innerHeight/2-height/2);
  levels.push(new Level(1200,600,[]));
  levels[0].addBlocks(new Block([new Rectangle(100,100,50,100)],"start",[],0,0,0));
  levels[0].addBlocks(new Block([new Rectangle(300,500,100,100)],"dead",[],0,0,0));
  cam = new Cam();
  //console.log(levels[0].getLevelCode());
}

let blockScript = document.createElement("script");
blockScript.setAttribute("src", "block.js");
document.body.appendChild(blockScript);
let levelScript = document.createElement("script");
levelScript.setAttribute("src", "level.js");
document.body.appendChild(levelScript);

function draw(){
  frameCount ++;
  timeCount = millis();
  //canvas.position(window.innerWidth/2-width/2,window.innerHeight/2-height/2);
  background(100);
  fill(255);
  rect(0,0,width,height);

  levels[level].show();
  stroke(0);
  noFill();
}

function keyPressed(){
  keys[keyCode] = true;
}
function keyReleased(){
  keys[keyCode] = false;
  if(keyCode == Keys.space){
    levels[level].spaceUp();
  }
}

class Cam{
  constructor(){
    this.loc = createVector(0,0);
    this.zoom = 100;
  }

  moveLoc(x,y){
    this.loc = createVector(x,y);
  }
}

let Keys = {
  codes: [],
  'backspace': 8,
  'tab': 9,
  'enter': 13,
  'shift': 16,
  'ctrl':	17,
  'alt':	18,
  'pause': 19,
  'caps':	20,
  'escape':	27,
  'pageUp':	33,
  'space':	32,
  'pageDown':	34,
  'end':	35,
  'home':	36,
  'left':	37,
  'up':	38,
  'right': 39,
  'down':	40,
  'printScreen': 44,
  'insert':	45,
  'delete':	46,
  '0':	48,
  '1':	49,
  '2':	50,
  '3':	51,
  '4':	52,
  '5':	53,
  '6':	54,
  '7':	55,
  '8':	56,
  '9':	57,
  'a':	65,
  'b':	66,
  'c':	67,
  'd':	68,
  'e':	69,
  'f':	70,
  'g':	71,
  'h':	72,
  'i':	73,
  'j':	74,
  'k':	75,
  'l':	76,
  'm':	77,
  'n':	78,
  'o':	79,
  "p":	80,
  "q":	81,
  'r':	82,
  "s":	83,
  "t":	84,
  "u":	85,
  "v":	86,
  "w":	87,
  "x":	88,
  "y":	89,
  "z":	90,
  "leftWin": 91,
  "rightWin":	92,
  "select":	93,
  "num0":	96,
  "num1":	97,
  "num2":	98,
  "num3":	99,
  "num4":	100,
  "num5":	101,
  "num6":	102,
  "num7":	103,
  "num8":	104,
  "num9":	105,
  "astriks":	106,
  "plus":	107,
  "minus":	109,
  "decimal":	110,
  "divide":	111,
  "f1":	112,
  "f2":	113,
  "f3":	114,
  "f4":	115,
  "f5":	116,
  "f6":	117,
  "f7":	118,
  "f8":	119,
  "f9":	120,
  "f10":	121,
  "f11":	122,
  "f12":	123,
  "numLock":	144,
  "scrollLock":	145,
  "computer":	182,
  "calculator":	183,
  "semi colon":	186,
  "equals":	187,
  "comma":	188,
  "hyphen":	189,
  "period":	190,
  "foward slash":	191,
  "open brackets":	219,
  "back slash":	220,
  "close brackets":	221,
  "quote":	222,
}

function findAng(a,b){
  let theta = (a.y >= b.y) ? Math.atan((a.x-b.x)/(a.y-b.y))+(1.5*Math.PI) : Math.atan((a.x-b.x)/(a.y-b.y))+(0.5*Math.PI);
  return -theta;
}
