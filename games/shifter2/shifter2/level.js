class Level{
  static timeCount;
  static levels = [];
  static level = 0;
  static settings = [];
  static moveSettings = [];
  static window;

  static NormSettings = {
    name: 'default controller',
    accel: 0.8,
    slow: 0.1,
    maxVel: 3,
    gravity: 0.75,
    jumpAmount: 10,
    wallJumpX: 6,
    wallJumpY: 13
  }
  static NormMoveSettings = {
    name: 'default movement',
    points: [],
    speed: 0,
    stop: 0,
    type: 'line'
  }

  static go(go, focus){
    Level.levels[Level.level].update(go, focus);
  }
  constructor(name, w, h, bs){
    this.name = name;
    this.width = w;
    this.height = h;
    this.blockStore = bs;
    this.blocks = [];
    for(let i = 0 ; i < bs.length; i++){
      this.blocks.push(bs[i].createNewBlock());
    }
    for(let i = 0; i < bs.length; i++){
      if(bs[i].type == 'start'){
        this.player = i;
      }
    }
    this.swapTime = 100;
    this.cam = new Cam();

    this.settings = [];
    this.moveSettings = [];
    this.settings.push(Level.NormSettings);
    this.moveSettings.push(Level.NormMoveSettings);
    this.window = createVector(650,650);
  }
  addBlocks(block, loc){
    if(block.type == 'start'){
      this.player = this.blocks.length;
    }
    this.blocks.push(block.createNewBlock(loc));
    this.blockStore.push(block);
  }
  addWords(w, ps){
    words = w;
    this.wordPlaces = ps;
  }

  update(go, focus){
    background(255);
    if(focus){this.moveCam(focus);}
    if(keys[Keys.r]){
      this.reset();
    }
    let play = this.blocks[this.player];
    for(let i = 0 ; i < this.blocks.length; i++){
      this.blocks[i].show(go);
      if(go && this.blocks[i] !== play && play.getRect().collide(this.blocks[i].getRect())){
        play.collide(this.blocks[i]);
      }
    }
    if(go){
      play.wallCollide();
      play.move();

      play.colls = [[],[],[],[]];
      if(this.swapTime < 100){
        this.swapTime++;
      }
    }

    strokeWeight(25);
    stroke(100);
    noFill();
    rect(-this.cam.loc.x+12,-this.cam.loc.y+12,this.width+25,this.height+25)
    noFill();
    strokeWeight(1);
    stroke(10);
    rect(0,0,this.window.x-1,this.window.y-1);
  }
  moveCam(block){
    fill(0);
    noFill();
    let play = block;

    let d = dist(this.cam.loc.x, this.cam.loc.y, play.loc.x-((this.window.x-50)/2), play.loc.y-((this.window.y-50)/2));
    if(d < 3){
      this.cam.moveLoc(play.loc.x-((this.window.x-50)/2),play.loc.y-((this.window.y-50)/2));
    }
    else{
      let ang = findAng(this.cam.loc,createVector(play.loc.x-((this.window.x-50)/2),(play.loc.y-((this.window.y-50)/2))));
      this.cam.moveLoc(this.cam.loc.x + (-d/14)*cos(ang),this.cam.loc.y + (-d/14)*sin(ang));
    }

    if(this.cam.loc.x < 5){
      this.cam.loc.x = 0
    }
    if(this.width-(this.cam.loc.x+this.window.x-50) < 5){
      this.cam.loc.x = this.width - (this.window.x - 50);
    }
    if(this.cam.loc.y < 20){
      this.cam.loc.y = 0
    }
    if(this.height-(this.cam.loc.y+this.window.y+50) < 5){
      this.cam.loc.y = this.height - (this.window.y-50);
    }
  }
  swap(b){
    if(this.swapTime > 10){
      for(let i = 0; i < this.blocks.length; i++){
        if(this.blocks[i] === b){
          b.vel = createVector(0,0);
          this.player = i;
          this.swapTime = 0;
          this.swapTrans = true;
        }
      }
    }
  }
  spaceUp(){
    this.blocks[this.player].spaceUp++;
  }
  reset(){
    this.blocks = [];
    for(let i = 0 ; i < this.blockStore.length; i++){
      this.blocks.push(this.blockStore[i].createNewBlock());
    }
    for(let i = 0; i < this.blockStore.length; i++){
      if(this.blockStore[i].type == 'start'){
        this.player = i;
      }
    }
    this.swapTime = 100;
  }
  getLevelCode(){
    let s = '';
    s += this.name + ',' + this.width + ',' + this.height + '|';
    for(let i = 0; i < this.settings.length; i++){
      let st = this.settings[i];
      if(st === Level.NormSettings){continue;}
      s += '{' + st.name + ',' + st.accel + ',' + st.slow + ',' + st.maxVel + ',' + st.gravity + ',' + st.jumpAmount + ',' + st.wallJumpX + ',' + st.wallJumpY + '}'
    } s += '|';
    for(let i = 0; i < Level.moveSettings.length; i++){
      let st = Level.moveSettings[i];
      if(st == Level.NormMoveSettings){continue;}
      s += '{';
      for(let j = 0; j < st.points.length; j++){
        s += st.points[j].x + ',' + st.points[j].y + ','
      } s+=';'
      s += st.name + ',' + st.speed + ',' + st.stop + ',' + st.type + '}';
    } s += '|';
    for(let i = 0; i < this.blockStore.length; i++){
      let recs = this.blockStore[i].recs;
      let block = this.blockStore[i];
      let ps = this.blockStore[i].moveSettings.points;
      s += '{' + block.loc.x + ',' + block.loc.y + ',' + block.type + ',' + block.settings.name + ',' + block.moveSettings.name + ';';
      for(let j = 0; j < recs.length; j++){
        s += recs[j].loc.x + ',' + recs[j].loc.y + ',' + recs[j].size.x + ',' + recs[j].size.y + ';';
      }
      s += '}';
    } s += '|';

    return s;
  }
  static createFromCode(code){
    function findSect(until){
      let curr = '';
      while(code[ci] != until){
        curr += code[ci]
        ci++;
      }
      ci++;
      if(curr/1){
        return curr/1;
      }
      return curr;
    }
    let name, level;
    let size = createVector(0,0);
    let ci = 0; //code index
    let index = Level.levels.length;
    name = findSect(',');
    size.x = findSect(',');
    size.y = findSect('|');


    while(code[ci] != '|'){
      if(code[ci] != '{'){break;}
      let name = findSect(',');let accel = findSect(',');let slow = findSect(',');let maxVel = findSect(',');let gravity = findSect(',');let jumpAmount = findSect(',');let wallJumpX = findSect(',');let wallJumpY = findSect('}');
      let newSet = {
        name: name ,accel: accel, slow: slow, maxVel: maxVel, gravity: gravity,
        jumpAmount: jumpAmount, wallJumpX: wallJumpX, wallJumpY: wallJumpY
      }
      Level.settings.push(newSet);
    } ci+=2;
    while(code[ci] != '|'){
      let points = [];
      while(code[ci] != ';'){
        let x = findSect(','); let y = findSect(',');
        points.push(createVector(x,y));
      }ci++;
      let name = findSect(',');let speed = findSect(',');let stop = findSect(',');let type = findSect('}');
      let newSet = {
        name:name, speed:speed, stop: stop, type: type, points: points
      }
      let tot = 0;
      for(let i = 0 ; i < Level.moveSettings.length; i++){
        if(Level.moveSettings[i].name != name){
          tot++;
        }
      }
      if(tot == 0){
        Level.moveSettings.push(newSet);
      }
    } ci+=2;

    Level.levels.push(new Level(name, size.x, size.y, []));

    let blocks = [];
    while(code[ci-1] != '|'){
      let loc = createVector(findSect(','),findSect(','));
      let type = findSect(','); let set = findSect(',');let mov = findSect(';');
      let recs = [];
      while(code[ci] != '}'){
        recs.push(new Rectangle(findSect(','),findSect(','),findSect(','),findSect(';')));
      }
      let r = new Block(recs,type,index,set,mov).createNewBlock(loc);
      r.addToLevel();
      ci+=2;
    }
    return level;
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
  moveKeys(funct){
    let sp = 7;
    if(keys[Keys.left]){
      this.loc.x-=sp;
      funct();
    }
    if(keys[Keys.right]){
      this.loc.x+=sp;
      funct();
    }
    if(keys[Keys.up]){
      this.loc.y-=sp;
      funct();
    }
    if(keys[Keys.down]){
      this.loc.y+=sp;
      funct();
    }
  }
}

let keys = [];
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
  'p':	80,
  'q':	81,
  'r':	82,
  's':	83,
  't':	84,
  'u':	85,
  'v':	86,
  'w':	87,
  'x':	88,
  'y':	89,
  'z':	90,
  'leftWin': 91,
  'rightWin':	92,
  'select':	93,
  'num0':	96,
  'num1':	97,
  'num2':	98,
  'num3':	99,
  'num4':	100,
  'num5':	101,
  'num6':	102,
  'num7':	103,
  'num8':	104,
  'num9':	105,
  'astriks':	106,
  'plus':	107,
  'minus':	109,
  'decimal':	110,
  'divide':	111,
  'f1':	112,
  'f2':	113,
  'f3':	114,
  'f4':	115,
  'f5':	116,
  'f6':	117,
  'f7':	118,
  'f8':	119,
  'f9':	120,
  'f10':	121,
  'f11':	122,
  'f12':	123,
  'numLock':	144,
  'scrollLock':	145,
  'computer':	182,
  'calculator':	183,
  'semi colon':	186,
  'equals':	187,
  'comma':	188,
  'hyphen':	189,
  'period':	190,
  'foward slash':	191,
  'open brackets':	219,
  'back slash':	220,
  'close brackets':	221,
  'quote':	222,
}
function keyPressed(){
  keys[keyCode] = true;
}
function keyReleased(){
  keys[keyCode] = false;

  if(keyCode == Keys.space){
    Level.levels[Level.level].spaceUp();
  }
}

function findAng(a,b){
  let theta = (a.y >= b.y) ? Math.atan((a.x-b.x)/(a.y-b.y))+(1.5*Math.PI) : Math.atan((a.x-b.x)/(a.y-b.y))+(0.5*Math.PI);
  return -theta;
}
