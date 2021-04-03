let img;
function preload(){
  img = loadImage('https://benazoid.com/images/block.png');
}
function setup(){
  createCanvas(700,500);
}

boxes = [
  new Box(-4000,400,4400,50,{move:false}),
  new Box(-100,399,50,50,{function:"changePoint"}),
  new Box(2000,400,500,50,{move:false}),
  new Box(2285,399,50,50,{function:"changePoint"}),
  new Box(2550,-300,50,500,{move:false}),
  new Box(2750,-300,50,700,{move:false}),
  new Box(2750,-300,500,50,{move:false}),
  new Box(3217,-800,1500,50,{move:false}),
  new Box(3417,-800,50,50,{function:"changePoint"}),
  new Box(3600,-1700,50,700,{move:false}),
  new Box(3600,-1700,700,50,{move:false}),
];
obsticles = [
  new Enemy(10,300,20,20,{move:true,x2:300,y2:300,speed:1,color:"green"}),
  new Enemy(2312,0,20,20,{move:false,color:"blue"}),
];
words = [
  new Words("Hi there how are you",100,250),
  new Words("green squares kill you, but give you four jumps instead of two",2000,250),
  new Words("try getting over this gap",540,270),
  new Words("try some wall jumping now",2500,250),
  new Words("this ledge is pretty high up",3217,-700),
  new Words("noice\n\n\n                      blue squares give you a jump boost",3413,-1000),
];

respawn = new Respawn();
respawn.x = checks[curCheck].x + checks[curCheck].w/2;
respawn.y = checks[curCheck].y - checks[curCheck].h/2;
player = new Player();



let changeNames = ["Jumps", "Speed", "Jump Force","Reverse Gravity"];
let changeCols = ["green","red","blue","black"]

camera = new Camera();

function draw(){
  background(235, 245, 240);
  noFill();
  stroke(0);
  rect(0,0,width,height);
  area = [];
  obArea = [];
  for(let i = 0; i < boxes.length; i++){
    let box = boxes[i];
    if(box.canMove){
      area.push(i);
    }
    else if(collideRectRect(box.x,box.y,box.w,box.h,player.x-width/2,player.y-height/2,width,height)){
      area.push(i);
    }
  }
  for(let i = 0; i < obsticles.length; i++){
    let ob = obsticles[i];
    if(collideRectRect(0,0,width,height,ob.box[0],ob.box[1],ob.box[2],ob.box[3])){
      obArea.push(i);
    }
    else if(collideRectRect(camera.x-width/2,camera.y-height/2,width,height,ob.x,ob.y,ob.w,ob.h)){
      obArea.push(i);
    }

    //Cheat codes
    if(pressedKeys.length >= flyKeys.length){
      for(let i = 0; i < pressedKeys.length-flyKeys.length+1; i++){
        let amt = 0;
        for(let j = 0; j < flyKeys.length; j++){
          if(pressedKeys[i + j] == flyKeys[j]){
            amt++;
          }
        }
        if(amt == flyKeys.length){
          if(flyMode){
            flyMode = false;
            console.log("fly mode disabled");
          }
          else{
            flyMode = true;
            console.log("fly mode enabled");
          }
          pressedKeys = [];
        }
      }
    }
  }


  //Class functions


  player.move();
  player.physics();
  player.collide();
  player.obsticles();
  camera.move();
  player.show();
  player.die();
  respawn.update();

  for(word of words){
    word.show();
  }

  //Displaying Changables

  let amt = 0;
  for(let i = 0; i < player.changables.length; i++){
    let change = player.changables[i];
    if(change){
      let amt = player.changeTime[i]/player.maxTime[i];
      fill(0);
      text(changeNames[i],i*100 + 10,20)
      fill(changeCols[i]);
      arc(i * 100 + 43,40,20,20,0,TWO_PI*(amt),PIE);
      player.changeTime[i] -= (1/60);
      if(player.changeTime[i] < 0){
        player.changables[i] = false;
        player.changeTime[i] = player.maxTime[i];
        console.log(i);
      }
      //player.jumpTimes = 2;
      player.maxSpeed = 6;
      player.jumpForce = 8;
      //Make with math???
      player.jumpTimes = 2 + ((player.changables[0] | 0) * 2);
      if(player.x > 10000){
        player.gravWay = player.changables[3];
      }
      if(player.changables[i]){
        switch(i){
          case 0:
            player.jumpTimes = 4;
            break;
          case 1:
            player.maxSpeed = 15;
            break;
          case 2:
            player.jumpForce = 15;
        }
      }
    }
  }
}
