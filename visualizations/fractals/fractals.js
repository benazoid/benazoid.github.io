//Makes sure the function doesnt get out of hand
let i = 0;

//The points on the triangle
let xs = [0,500,250];
let ys = [500,500,100];

function newPoint(x,y){
  let num = Math.floor(Math.random()*xs.length);
  let end = new p5.Vector((x+xs[num])/2,(y+ys[num])/2);
  point(end);
  i++;
  if(i < 50){
    newPoint(end.x,end.y);
  }
}

function setup(){
  createCanvas(500,500);
  for(let i = 0; i < xs.length-1; i++){
    line(xs[i],ys[i],xs[i+1],ys[i+1]);
  }
  line(xs[xs.length-1],ys[xs.length-1],xs[0],ys[0]);
  newPoint();
}

function draw(){
  i = 0;
  newPoint();
}
