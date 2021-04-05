function setup(){
  createCanvas(500,500);
  rectMode(CENTER);
  angleMode(DEGREES);
}
var Keys = {
  forward: 87,
  backward: 83,
  counter: 65,
  clock: 68
};
var keys = [];
var level = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];
var blocks = [];
var enemies = [];
var look = false;

for(var i = 0; i < level.length; i++){
  for(var j = 0; j < level[i].length; j++){
    if(level[i][j]){
      blocks.push([i*25+12.5,j*25+12.5]);
    }
  }
}

function touching(x,y){
  for(var i = 0; i < blocks.length; i++){
    var x2 = blocks[i][0];
    var y2 = blocks[i][1];
    if(x > x2-13 && y > y2-13 && x < x2+13 && y < y2+13){
      return blocks[i];
    }
  }
  if(x < 0 || y < 0 || x > 500 || y > 500){
    return true;
  }
  return false;
}

function Player(){
  //Position
  this.x = 200;
  this.y = 200;
  this.angle = 270;
  //Size
  this.width = 20;
  this.height = 20;
  //Attributes
  this.speed = 2;
  this.view = [];
}
Player.prototype.move = function(){
  if(keys[Keys.forward]){
    this.x += this.speed * cos(this.angle);
    this.y += this.speed * sin(this.angle);
  }
  if(keys[Keys.backward]){
    this.x -= this.speed * cos(this.angle);
    this.y -= this.speed * sin(this.angle);
  }
  if(keys[Keys.counter]){
    this.angle -= 3;
  }
  if(keys[Keys.clock]){
    this.angle += 3;
  }
};
Player.prototype.cast = function(){
  if(!touching(this.x,this.y)){
    this.view = [];
    for(var i = -80; i < 80; i++){
      var x = this.x;
      var y = this.y;
      while(!touching(x,y)){
        x += 2 * cos(this.angle + i /1.5);
        y += 2 * sin(this.angle + i /1.5);
      }
      if(look){
        line(this.x,this.y,x,y);
      }
      var fish = this.angle - (this.angle+i/1.5);
      this.view.push(20000/(dist(this.x,this.y,x,y)*cos(fish)));
    }
  }
};
Player.prototype.collide = function(object){
  if(this.x > object[0]-14 && this.y > object[1]-14 && this.x < object[0]+14 && this.y < object[1]+14){
    var x1 = this.x;
    var y1 = this.y;
    var x2 = object[0];
    var y2 = object[1];
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
    return dir;
  }
  return false;
};

function Enemy(x,y){
  this.x = x;
  this.y = y;
  this.length = 20;
  this.width = 20;
  this.health = 10;
}

Enemy.prototype.cast = function(){
  if(!touching(this.x,this.y)){
    this.view = [];
    for(var i = -80; i < 80; i++){
      var x = this.x;
      var y = this.y;
      while(!touching(x,y)){
        x += 2 * cos(this.angle + i /1.5);
        y += 2 * sin(this.angle + i /1.5);
      }
      if(look){
        line(this.x,this.y,x,y);
      }
      var fish = this.angle - (this.angle+i/1.5);
      this.view.push((dist(this.x,this.y,x,y))*cos(fish));
    }
  }
};

var player = new Player();

function draw(){
  background(255);
  for(var i = 0; i < blocks.length; i++){
    var x = blocks[i][0];
    var y = blocks[i][1];
    if(look){
      rect(blocks[i][0],blocks[i][1],25,25);
    }
    var coll = player.collide(blocks[i]);
    if(coll){
      switch(coll){
        case "right":
          player.x = x - 12.5;
          break;
        case "left":
          player.x = x + 12.5;
          break;
        case "top":
          player.y = y + 12.5;
          break;
        case "bottom":
          player.y = y - 12.5;
          break;
      }
    }
  }
  player.move();
  player.cast();
  push();
  translate(player.x,player.y);
  rotate(player.angle);
  if(look){
    line(0,0,20,0);
    rect(0,0,player.width,player.height);
  }
  pop();
  var w = 3.1;
  for(var i = 0; i < player.view.length; i++){
    fill(player.view[i], 187, 187);
    noStroke();
    if(!look){
      rect(i*w+w/2,(500-player.view[i]/2)/2,w,player.view[i]/2);
      rect(i*w+w/2,(500+player.view[i]/2)/2,w,player.view[i]/2);
    }
    stroke(0);
    noFill();
  }
}
function keyPressed(){
  keys[keyCode] = true;
  if(keyCode == 80){
    if(look){
      look = false;
    }
    else{
      look = true;
    }
  }
}
function keyReleased(){
  keys[keyCode] = false;
}
