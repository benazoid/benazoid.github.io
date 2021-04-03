let walkingSheet, walkingAni, player;

function preload(){
  walkingSheet = loadImage("https://benazoid.com/images/blorbImgs/walking.png");
}

function setup(){
  createCanvas(500,500);
  walkingAni = new Spritesheet(walkingSheet,100,100,5);

  player = createSprite(30,30,100,100);
  player.setAnimation(walkingAni.ani,5);
}

function draw(){
  background(255);
  noFill();
  rect(0,0,width,height);
  camera.showSprites();
  if(keyCheck(Keys.a)){
    camera.x -= 5;
  }
  if(keyCheck(Keys.d)){
    camera.x += 5;
  }
  if(keyCheck(Keys.k)){
    camera.scale /= 0.95;
  }
  if(keyCheck(Keys.l)){
    camera.scale *= 0.95;
  }
}
