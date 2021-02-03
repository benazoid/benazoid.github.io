var world = {
  version: "1.1.0",
  grav: 0.25,
  currPlayer: 0,
  level: 0,
  done: false,
  timer: true,
  time: 0,
  sizeX: 500,
  sizeY: 500,
  scaleX: 500/600,
  scaleY: 500/600
};
var x;
var y;
function setup(){
  createCanvas(world.sizeX,world.sizeY);
}

var keys = [];
var collisions = [];
var underBlock;
var underNum;
var player;
var jumpForce = 8 * (world.scaleY/0.8);;
var time;
var spaceUp = false;
var wait = false;
var waitTime = 11;
var ons = [false,false,false,false];
document.cookie = "hello";

var keyNums = {
  left: 65,
  leftKey: "a",
  right: 68,
  rightKey: "d",
  jump: 32,
  jumpKey: "space",
  swap: 76,
  swapKey: "l"
};

var Block = function(x,y,width,height,type,link,message){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.velocity = new PVector(2,0);
  this.maxVel = 5;
  this.accel = 0.05;
  this.type = type;
  if(this.type == "player"){
    this.inControl = true;
  }
  else{
    this.inControl = false;
  }
  this.link = link;
  this.message = message;
};
const level0 = {
  start: new Block(288,322,21,21,"start",false),
  player: false,
  end: new Block(250,450,130,130,"end", 2, "Start Game"),
  blocks: [/*new Block(132,458,122,122,"block",2, "Settings")*/]
};
const level1 = {
  start: new Block(288,322,21,21,"start",false),
  player: false,
  end: new Block(250,450,100,100,"end", 1, "exit"),
  blocks: [new Block(10,458,80,80,"block","left", "left - " + keyNums.leftKey),new Block(130,458,80,80,"block","right", "right - " + keyNums.rightKey),new Block(370,458,80,80,"block","jump", "jump - " + keyNums.jumpKey),new Block(490,458,80,80,"block","swap", "swap - " + keyNums.swapKey)]
};
const level2 = {
  start: new Block(262,479,49,49,"start"),
  player: new Block(12,537,56,56,"player"),
  end: new Block(526,543,54,54,"end"),
  blocks: []
};
const level3 = {
  start: new Block(111,516,49,49,"start"),
  player: new Block(29,558,39,39,"player"),
  end: new Block(521,289,61,61,"end"),
  blocks: [new Block(220,468,45,45,"block"),new Block(322,404,49,49,"block"),new Block(427,339,56,56,"block")]
};
const level4 = {
  start: new Block(281,534,25,25,"start"),
  player: new Block(282,562,21,21,"player"),
  end: new Block(288,322,21,21,"end"),
  blocks: [new Block(282,496,26,26,"block")]
};
const level5 = {
  start: new Block(289,462,43,43,"start"),
  player: new Block(355,467,45,45,"player"),
  end: new Block(5,145,40,40,"end"),
  blocks: [new Block(224,459,43,43,"block"),new Block(157,455,44,44,"block")]
};

var levels = [level0,level2,level3,level4,level5];
var levelMaps = [];

Block.prototype.moveBlock = function(){
  if(this.inControl){
    if(keys[keyNums.left] && !keys[keyNums.right]){
      this.x -= this.velocity.x;
      if(this.velocity.x < this.maxVel){
        this.velocity.x += this.accel;
      }
    }
    else if(keys[keyNums.right] && !keys[keyNums.left]){
      this.x += this.velocity.x;
      if(this.velocity.x < this.maxVel){
        this.velocity.x += this.accel;
      }
    }
    if(!keys[keyNums.left] && !keys[keyNums.right]){
      this.velocity.x = 2 * world.scaleX;
    }
    this.y += this.velocity.y;
    this.velocity.y += world.grav;
  }
};
Block.prototype.draw = function() {
  noFill();
  noStroke();
  if(this.type == "end"){
    fill(255, 191, 64);
  }
  if(this.type == "start"){
    fill(163, 204, 255);
  }
  if(this.type == "block" || this.type == "player"){
    fill(209, 206, 197);
  }
  rect(this.x,this.y,this.width,this.height);
  fill(0, 0, 0);
  textSize(this.width/6.5);
  if(this.message !== undefined){
    text(this.message,this.x+5,this.y+this.height/1.8);
  }
  noFill();
};
Block.prototype.collide = function(object,e){
  if((this.y + this.height + 1 > object.y && object.y + object.height + 1> this.y)&&(this.x + this.width > object.x - 1 && object.x + object.width + 1 > this.x) && this !== object){
    var x1 = (this.x + floor((this.width)/2));
    var y1 = (this.y + floor((this.height)/2));
    var x2 = (object.x +floor((object.width)/2));
    var y2 =(object.y+floor((object.height)/2));
    var dir;
    var horiz;
    var vert;
    var distH;
    var distV;
    if(x1 > x2){
      horiz = "left";
    }
    else{
      horiz = "right";
    }
    distH = abs(x1-x2);
    if(y1 > y2){
      vert = "top";
    }
    else{
      vert = "bottom";
    }
    distV = abs(y1-y2);
    if(distH > distV){
      dir = horiz;
    }
    else{
      dir = vert;
    }
    if(this == player){
      underBlock = object;
      underNum = e;
    }
    return dir;
    }
    if(this !== player){
      underBlock = false;
    }
    return false;
};
var blocks = [new Block(155,348,20,20,"player"),new Block(220,568,30,30,"block"),new Block(283,568,30,30,"block")];

Block.prototype.hit = function(){
  for(var i = 0; i < blocks.length; i++){
    if(blocks[i] !== this){
      var col = this.collide(blocks[i],i);
      if(col == "right"){
        this.x = blocks[i].x - this.width - 1;
        this.velocity.x = 0;
      }
      else if(col == "left"){
        this.x = blocks[i].x + blocks[i].width + 1;
        this.velocity.x = 0;
      }
      else if(col == "top"){
        this.y = blocks[i].y + blocks[i].height + 1;
        this.velocity.y = 0;
      }
      else if(col == "bottom"){
        this.y = blocks[i].y - this.height;
        if(!keys[keyNums.jump]){
          this.velocity.y = 0;
        }
      }
    }
  }
  if(this.x > width - this.width){
    this.x = width - this.width;
    this.velocity.x = 0;
    collisions.push("right");
  }
  if(this.x < 0){
    this.x = 0;
    this.velocity.x = 0;
    collisions.push("left");
  }
  if(this.y < 0){
    this.y = 0;
    this.velocity.y = 0;
    collisions.push("top");
  }
  if(this.y > height - this.height){
    this.y = height - this.height;
    this.velocity.y = 0;
    collisions.push("bottom");
  }
};

function nextLevel(){
  if(world.level < levels.length){
    blocks = [];
    var level = levels[world.level];
    var blo = level.start;
    function bloPush(){
      blocks.push(new Block(blo.x*world.scaleX,blo.y*world.scaleY,blo.width*world.scaleX,blo.height*world.scaleY,blo.type,blo.link,blo.message));
    }
    bloPush();
    if(levels[world.level].player){
      blo = level.player;
      bloPush();
    }
    blo = level.end;
    bloPush();
    for(var i = 0; i < level.blocks.length; i++){
      blo = level.blocks[i];
      bloPush();
    }
    if(levels[world.level].player){
      world.currPlayer = 1;
    }
    else{
      world.currPlayer = 0;
      blocks[0].inControl = true;
    }
  }
  else{
    world.done = true;
  }
}
Block.prototype.change = function(){
  if(!collisions.includes("top") && waitTime > 10){
    waitTime = 0;
    wait = true;
    underBlock.inControl = true;
    player.inControl = false;
    world.currPlayer = underNum;
    if(underBlock.link){
      if(underBlock.link % 1 == 0){
        world.level = underBlock.link - 1;
      }
      else {
        switch (underBlock.link) {
          case "left":
            ons[0] = true;
            break;
          case "right":
            ons[1] = true;
            break;
          case "jump":
            ons[2] = true;
            break;
          case "swap":
            ons[3] = true;
            break;
        }
      }
      nextLevel();
    }
    else if((underBlock.type == "start" && player.type == "end")||(underBlock.type == "end" && player.type == "start")){
      world.level++;
      nextLevel();
    }
  }
};
function leftChange(){
  keyNums.left = keyCode;
  keyNums.leftKey = key;
}
function rightChange(){
  keyNums.right = keyCode;
  keyNums.rightKey = key;
}
function jumpChange(){
  keyNums.jump = keyCode;
  keyNums.jumpKey = key;
}
function swapChange(){
  keyNums.swap = keyCode;
  keyNums.swapKey = key;
}

nextLevel();
function draw () {
  background(255, 255, 255);
  if(!world.done){
    player = blocks[world.currPlayer];
    collisions = [];
    for(var i = 0; i < blocks.length; i++){
      blocks[i].draw();
      var collide = player.collide(blocks[i],i);
      if(collide){
        collisions.push(collide);
      }
      if(blocks[i] == player){
        underBlock = false;
      }
    }
    player.moveBlock();
    player.hit();

    if(keys[keyNums.jump] && collisions.includes("bottom")){
      player.velocity.y = -jumpForce;
    }
    if(spaceUp){
      player.velocity.y = player.velocity.y/2;
      spaceUp = false;
    }

    if(underBlock && keys[keyNums.swap] && !collisions.includes("top") && !collisions.includes("bottom") && wait){
      underBlock.change();
    }
    if(world.timer && world.level > 0){
      world.time ++;
      textSize(20);
      fill(0,0,0);
      text(Math.floor(world.time/frameRate()*10*deltaTime)/100,20,20);
      time = Math.floor(world.time/frameRate()*10*deltaTime)/100;
      noFill();
    }
    else if(world.level < 1){
      fill(0,0,0);
      textSize(12);
      text("Version " + world.version,30*world.scaleX,30*world.scaleY);
    }
    if(wait){
      waitTime ++;
    }
  }
  else{
    fill(0, 0, 0);
    textSize(40*world.scaleY);
    text("               YAY\n\n         YOU WON :)\n\nPRESS R TO RESTART\n\n             "+time,50*world.scaleX,128*world.scaleY);
  }
  for(var i = 0; i < ons.length; i++){
    if(ons[i]){
      fill(172, 175, 181);
      rect(100,100,400,100);
      fill(0,0,0);
      textSize(30);
      text("Press key to change control",120,130);
      noFill();
    }
  }
  if(world.level == 0){
    if(mouseIsPressed && mouseX > level0.end.x * world.scaleX && mouseY > level0.end.y * world.scaleY && mouseX < (level0.end.x + level0.end.width)*world.scaleX && mouseY < (level0.end.y + level0.end.height)*world.scaleY){
      world.level = 1;
      nextLevel();
    }
    noFill();
    stroke(0,0,0);
    rect(350,20,20,20);
    textSize(8);
    text("i",359,35);
    strokeWeight(2);
    point(360,25);
    strokeWeight(1);
    if(mouseX > 350 && mouseY > 20 && mouseX < 370 && mouseY < 40){
      textSize(25);
      fill(0,0,0);
      var space = keyNums.jumpKey;
      if(keyNums.jump == 32){
        space = "space";
      }
      text("Get the orange and blue blocks together",20,100);
      text("press " + keyNums.leftKey + " to go left and " + keyNums.rightKey + " to go right",50,150);
      text("press " + space + " to jump",125,200);
      text("If you are toutching another block,\n you can press " + keyNums.swapKey + " to change into it",50,250);
    }
  }
};

function keyReleased(){
  keys[keyCode] = false;
  if(keyCode === keyNums.jump){
    spaceUp = true;
  }
};
function keyPressed(){
  keys[keyCode] = true;
  if(underBlock && keys[keyNums.swap] && !collisions.includes("top")){
    underBlock.change();
    player.velocity.x = 0;
    player.velocity.y = 0;
  }
  for(var i = 0; i < ons.length; i++){
    if(ons[i] && !keys[keyNums.swap]){
      switch(i){
        case 0:
          leftChange();
          underBlock.message = "left - " + key;
          break;
        case 1:
          rightChange();
          underBlock.message = "right - " + key;
          break;
        case 2:
          jumpChange();
          underBlock.message = "jump - " + key;
          break;
        case 3:
          swapChange();
          underBlock.message = "swap - " + key;
          break;
      }
      ons[i] = false;
    }
  }
  if(keyCode == 82){
    world.level = 0;
    world.time = 0;
    world.done = false;
    nextLevel();
  }
};
