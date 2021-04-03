let keys = [];
let Keys = {
  up: 32, //space
  down: 83, //s
  left: 65, //a
  right: 68, //d
  changeView: 80, //p
}
let respawn;
let player;
let grav = 0.2;
let boxes = [];
let area = [];
let camera;
let view = 1;
let obsticles = [];
let obArea = [];
let parts = [];
let words = [];
let checks = [];
let pressedKeys = [];
let flyMode = false;
let flyKeys = [72,73,84,72,69,82,69];

let curCheck = 2;

function findAng(x1,y1,x2,y2){
  let theta = (y2 >= y1) ? Math.atan((x2-x1)/(y2-y1))+(Math.PI) : Math.atan((x2-x1)/(y2-y1))+(2*Math.PI);
  return -theta;
}
function clamp(min,max,value){
  if(value < min){
    return min;
  }
  else if(value < max){
    return value;
  }
  else{
    return max;
  }
}
function rectCircle(rectX,rectY,rectW,rectH,circX,circY,circDia){
  let x = clamp(rectX,rectX+rectW,circX);
  let y = clamp(rectY,rectY+rectH,circY);
  if(dist(x,y,circX,circY) <= circDia/2){
    return true;
  }
  return false;
}
function getInd(list,find){
  for(let i = 0; i < list.length; i++){
    if(find === list[i]){
      return i;
    }
  }
  return false;
}

function keyPressed(){
  pressedKeys.push(keyCode);
  keys[keyCode] = true;
  if(keyCode == Keys.left || keyCode == Keys.right && !flyMode){
    player.vel.x = 3;
  }

  //Jump
  if(player.canJump && keyCode == Keys.up && player.jumpReset){
    player.vel.y = -player.jumpForce;
    if(!(player.boxGrounds.includes("left") || player.boxGrounds.includes("right"))){
      player.jumpAmount ++;
    }
    if(player.jumpAmount >= player.jumpTimes){
      player.jumpReset = false;
    }
    if(player.touchWall){
      player.changeBack = true;
    }


  }

}
function keyReleased(){
  keys[keyCode] = false;
  if(keyCode == Keys.left || keyCode == Keys.right){
    player.vel.x = 3;
  }
  if(keyCode == Keys.up){
    player.jumpStop = true;
  }
}

function drawBox(x,y,w,h,type){
  /*let big = Math.max(w,h);
  let sml = Math.min(w,h);
  let offX;
  let offY;
  if(big == w){
    offX = sml;
    offY = 0;
  }
  else{
    offX = 0;
    offY = sml;
  }
  rect(x,y,w,h);
  for(let i = 0; i < big; i+= sml){
    if(big == w){
      line(x+i,y,x+i+offX,y+sml);
      line(x+i+sml,y,x+i,y+sml);
    }
    if(big == h){
      line(x,y+i,x+sml,y+sml+i);
      line(x+sml,y+i,x,y+sml+i);
    }
  }*/

  if(type == "changePoint"){
    noStroke();
    fill(242, 255, 102);
    rect(x,y,w,h);
    fill(199, 209, 88);
    rect(x+3,y+3,w-6,h-6);
    fill(242, 255, 102);
    rect(x+6,y+6,w-12,h-12);
    fill(199, 209, 88);
    rect(x+8,y+8,7,3);
    rect(x+8,y+8,3,7);
    rect(x+w-16,y+8,7,3);
    rect(x+w-12,y+8,3,7);
    rect(x+w-16,y+h-11,7,3);
    rect(x+w-12,y+h-15,3,7);
    rect(x+8,y+h-11,7,3);
    rect(x+8,y+h-15,3,7);
    if(w > 100){
      for(let i = 50; i < w; i += 50){
        if(i < w - 30){
          rect(x+i,y+5,4,4);
          rect(x+i+4,y+8,4,4);
          rect(x+i-25,y+h-9,4,4);
          rect(x+i-29,y+h-12,4,4);
        }
      }
    }
    if(h > 100){
      for(let i = 50; i < h; i += 50){
        if(i < h - 30){
          rect(x+6,y+i,4,4);
          rect(x+9,y+i+4,4,4);
          rect(x+w-9,+y+i-25,4,4);
          rect(x+w-12,y+i-29,4,4);
        }
      }
    }
  }
  else{
    noStroke();
    fill(66, 245, 153);
    rect(x,y,w,h);
    fill(55, 179, 115);
    rect(x+3,y+3,w-6,h-6);
    fill(66, 245, 153);
    rect(x+6,y+6,w-12,h-12);
    fill(55, 179, 115);
    rect(x+8,y+8,7,3);
    rect(x+8,y+8,3,7);
    rect(x+w-16,y+8,7,3);
    rect(x+w-12,y+8,3,7);
    rect(x+w-16,y+h-11,7,3);
    rect(x+w-12,y+h-15,3,7);
    rect(x+8,y+h-11,7,3);
    rect(x+8,y+h-15,3,7);
    if(w > 100){
      for(let i = 50; i < w; i += 50){
        if(i < w - 30){
          rect(x+i,y+5,4,4);
          rect(x+i+4,y+8,4,4);
          rect(x+i-25,y+h-9,4,4);
          rect(x+i-29,y+h-12,4,4);
        }
      }
    }
    if(h > 100){
      for(let i = 50; i < h; i += 50){
        if(i < h - 30){
          rect(x+6,y+i,4,4);
          rect(x+9,y+i+4,4,4);
          rect(x+w-9,+y+i-25,4,4);
          rect(x+w-12,y+i-29,4,4);
        }
      }
    }
  }
}

class Particle{
  constructor(parent){
    this.parent = parent;
    this.x = parent.x;
    this.y = parent.y;
    this.dir = random(parent.startA,parent.endA) * PI/180;
    this.fade = 0;
  }
  show(){
    colorMode(RBGA);
    fill(this.parent.color,this.fade);
    noStroke();
    rect(this.x,this.y);
  }
  move(){
    this.x += cos(this.dir);
    this.y += sin(this.dir);
  }
}

class Particles{
  constructor(x,y,startA,endA,size,amount,color){
    this.x = x;
    this.y = y;
    //In degrees
    this.startA = startA;
    this.endA = endA;
    this.amt = intensity;
    this.col = color;
    this.index = parts.length - 1;
  }
  make(){

  }
}

class Obj{
  constructor(x,y,settings){
    this.x = x;
    this.y = y;
    this.set = settings;
    this.canMove = settings.move;
    this.start = new p5.Vector(x,y);
    this.end = new p5.Vector(settings.x2,settings.y2);
    this.speed = settings.speed;
    this.point = true;
    this.dir = this.findAng();
    this.box = [];
  }
  findAng(){
    let theta = (this.end.y >= this.start.y) ? Math.atan((this.end.x-this.start.x)/(this.end.y-this.start.y))+(1.5*Math.PI) : Math.atan((this.end.x-this.start.x)/(this.end.y-this.start.y))+(0.5*Math.PI);
    return -theta;
  }
  move(){
    if(this.canMove){
      if(this.point){
        this.x += cos(this.dir) * this.speed;
        this.y += sin(this.dir) * this.speed;
      }
      else{
        this.x -= cos(this.dir) * this.speed;
        this.y -= sin(this.dir) * this.speed;
      }

      let rectX = min(this.start.x,this.end.x);
      let rectY = min(this.start.y,this.end.y);
      let othX = max(this.start.x,this.end.x);
      let othY = max(this.start.y,this.end.y);
      this.box = [rectX,rectY,rectX-othX,rectY-othY];
      stroke(1);
      if(!(this.x >= rectX && this.y >= rectY && this.x <= othX && this.y <= othY)){
        this.point = !this.point;
      }
    }
  }
}

class Respawn{
  constructor(){
    this.x = -75;
    this.y = 384;
  }
  changePoint(x,y){
    curCheck = getInd(checks,this);
    this.x = x;
    this.y = y;
  }
  update(){
    let check = checks[curCheck];
  }
}
