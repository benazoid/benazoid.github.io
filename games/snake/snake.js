//Game{
var myCanvas;
function setup(){
  myCanvas = createCanvas(500,500);
  myCanvas.parent("snakeCanvas");
  colorMode(HSB,100);
  xPos = Math.random() * width;
  yPos = Math.random() * height;
}
snake = [new Ball(250,250,0)]
function draw(){
  let x = snake[0].x;
  let y = snake[0].y;
  background(0,0,360);
  stroke('rgba(176, 195, 212,0.5)');
  strokeWeight(3);
  line(0,0,0,height);
  line(0,0,width,0);
  line(0,height,width,height);
  line(width,height,width,0)
  strokeWeight(1);
  snake[0].move();
  for(let i = 0; i < snake.length; i++){
    snake[i].draw();
  }
  fill('rgba(176, 195, 212,0.5)');
  ellipse(xPos,yPos,20,20);
  textSize(50);
  text(snake[0].size-20,220,60);
  if(collideCircleCircle(xPos,yPos,20,x,y,10)){
    snake[0].size += 5;
    let check = true;
    while(check){
      xPos = Math.random() * width;
      yPos = Math.random() * height;
      for(let i = 0; i < snake.length; i++){
        let thisX = snake[i].x;
        let thisY = snake[i].y;
        if(!collideCircleCircle(thisX,thisY,10,xPos,yPos,20)){
          check = false;
        }
      }
    }
  }
  check = true;
  for(let i = 6; i < snake.length-6; i++){
    if(collideCircleCircle(x,y,10,snake[i].x,snake[i].y,10)){
      check = false;
      console.log(1);
    }
  }
  if(x < 0 || x > width || y < 0 || y > height || !check){
    snake[0].size = 20;
    snake[0].x = 250;
    snake[0].y = 250;
    snake.splice(1,snake.length-20);
  }
}
function keyPressed(){
  keys[keyCode] = true;
}
function keyReleased(){
  keys[keyCode] = false;
}
