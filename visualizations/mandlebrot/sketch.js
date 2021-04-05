let iterations = 255;
let inc = 1;

let curX = -2.5;
let curY = -1;
let curW = 3.5;

let curArea = [];

class Point{
  constructor(x,y,val){
    this.x = x;
    this.y = y;
    this.val = val;
  }
  show(){
    colorMode(HSB,100);
    stroke(1/this.val*255,100,100);
    strokeWeight(1);
    point(this.x,this.y);
  }
}

function make(x,y,w){
  let h = w/1.75;
  for(let i = 0; i < width; i += inc){
    for(let j = 0; j < height; j += inc){
      let x0 = map(i,0,width,x,x+w);
      let y0 = map(j,0,height,y,y+h);
      let x1 = 0;
      let y1 = 0;
      let it = 0;
      let pow = 2;

      while(Math.pow(x1,pow) + Math.pow(y1,pow) <= 4 && it < iterations){
        let xtemp = Math.pow(x1,pow) - Math.pow(y1,pow) + x0;
        y1 = pow*x1*y1 + y0;
        x1 = xtemp;
        it++;
      }
      // while(x1*x1 + y1*y1 <= 4 && it < iterations){
      //   x1++;
      //   y1++;
      //   it++;
      // }
      curArea.push(new Point(i,j,it));
    }
  }
}

function setup(){
  createCanvas(700,400);
  make(curX,curY,curW);
}

let newX;
let newY;

function mousePressed(){
  newX = map(mouseX,0,width,curX,curX+curW);
  newY = map(mouseY,0,height,curY,curY+curW/1.75);
}
function mouseReleased(){
  curW = map(mouseX,0,width,curX,curX+curW) - newX;
  curX = newX;
  curY = newY;
  make(curX,curY,curW/1.75);
}

function draw(){
  for(const pt of curArea){
    pt.show();
  }
  if(mouseIsPressed){
    //colorMode();
    stroke('rbg(0)');
    noFill();
    //rect(mouseX,mouseY,);
    rect(map(curX,0,width,curX,curX+curW),map(curY,0,height,curY,curY+curW/1.75),mouseX,mouseY);
  }
}
