class Player{
  constructor(){
    this.x = respawn.x;
    this.y = respawn.y;
    this.dia = 30;
    this.rad = this.dia/2;
    this.vel = new p5.Vector(0,0);
    this.acc = 0.05;
    this.touchGround = false;
    this.jumpStop = false;
    this.jumpReset = false;
    this.boxGrounds = [];
    this.jumpAmount = 0;
    this.touchWall = false;
    this.changeBack = false;
    this.grav = true;
    this.dead = false;
    //Changables
    this.jumpForce = 8;
    this.maxSpeed = 6;
    this.jumpTimes = 2;
    this.gravWay = false;
    this.changables = [false,false,false,false];
    this.maxTime = [10,15,10,15];
    this.changeTime = [10,15,10,15];
  }
  show(){
    fill(170, 62, 152);
    noStroke();
    ellipse(this.x+(width/2-camera.x),this.y+(height/2-camera.y),this.dia,this.dia);
    fill(68, 100, 173);
    arc(width/2,height/2,this.dia,this.dia,0,TWO_PI*(this.jumpAmount/this.jumpTimes),PIE);
  }
  move(){
    if(flyMode){
      if(keys[Keys.left]){
        this.x -= 5;
      }
      if(keys[Keys.right]){
        this.x += 5;
      }
      if(keys[Keys.up]){
        this.y -= 5;
      }
      if(keys[Keys.down]){
        this.y += 5;
      }
      this.grav = false;
    }
    else{
      this.grav = true;
      if(keys[Keys.left]){
        this.x -= this.vel.x;
        if(this.vel.x < this.maxSpeed){
          this.vel.x += this.acc;
        }
      }
      if(keys[Keys.right]){
        this.x += this.vel.x;
        if(this.vel.x < this.maxSpeed){
          this.vel.x += this.acc;
        }
      }
      if(this.y > 900){
        this.dead = true;
        this.deadType = "black";
      }
    }
  }

  physics(){
    if(this.changeBack){
      this.canJump = false;
      if(!this.touchWall){
        this.changeBack = false;
      }
    }
    if(!this.canJump){
      this.jumpReset = true;
    }
    if(this.touchGround){
      this.canJump = true;
    }
    if(!this.touchWall && this.jumpAmount <= this.jumpTimes){
      this.canJump = true;
    }
    if(!this.touchGround){
      if(this.vel.y < 10 && this.grav){
        this.vel.y += grav;
      }
    }
    else if(!keys[Keys.up] && this.touchGround){
      //Gets called when first touching ground
      this.vel.y = 0;
      this.jumpReset = true;
      this.jumpAmount = 0;
    }
    if(this.grav){
      this.y += this.vel.y * ((this.gravWay | 0) * 2 - 1) * -1;
    }
    if(this.jumpStop){
      this.vel.y /= 2;
      this.jumpStop = false;
    }
  }
  collide(){
    for(let i = 0; i < area.length; i++){
      let num = area[i];
      boxes[num].move();
      boxes[num].show();
      boxes[num].collide(i);
    }
    this.touchGround = false;
    if(this.boxGrounds.includes("bottom")){
      this.touchGround = true;
    }
    if(this.boxGrounds.includes("top")){
      this.jumpStop = true;
    }
    if(this.boxGrounds.includes("left") || this.boxGrounds.includes("right")){
      if(!this.canJump && !this.changeBack){
        this.canJump = true;
      }
      this.touchWall = true;
    }
    else{
      this.touchWall = false;
      if(!this.touchGround && this.jumpAmount >= this.jumpTimes){
        this.canJump = false;
      }
    }
  }
  obsticles(){
    for(let i = 0; i < obArea.length; i++){
      let ob = obsticles[obArea[i]];
      ob.move();
      ob.show();
      ob.collide();
    }
  }
  die(){
    if(this.dead){
      this.dia *= 0.85;
      this.rad = this.dia/2;
      let i = getInd(changeCols,this.deadType);
      if(i !== 3){
        this.changables[i] = true;
      }
      this.vel.y = 0;
    }
    if(this.dia < 2){
      this.dead = false;
      for(let i = 0; i < this.changeTime.length; i++){
        this.changeTime[i] = this.maxTime[i];
      }

      this.dia = 30
      this.x = respawn.x;
      this.y = respawn.y;
      this.jumpAmount = 0;
    }
    if(this.deadType == "black" && player.x > 10000){
      console.log(12312341);
      this.changables[3] = true;
    }
  }
}

class Camera{
  constructor(){
    this.x = 0;
    this.y = 0;
    this.scale = 1;
  }
  move(){
    this.x = player.x;
    this.y = player.y;
  }
}
