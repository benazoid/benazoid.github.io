class Enemy extends Obj{
  constructor(x,y,width,height,settings){
    super(x,y,settings);
    this.w = width;
    this.h = height;
    this.type = settings.type;
    this.color = settings.color;
  }
  show(){
    stroke(1);
    fill(this.color);
    noStroke();
    rect(this.x+(width/2-camera.x) ,this.y+(height/2-camera.y),this.w,this.h);
  }
  collide(){
    if(collideRectCircle(this.x,this.y,this.w,this.h,player.x,player.y,player.dia)){
      player.dead = true;
      player.deadType = this.color;
    }
  }
}

class Box extends Obj{
  constructor(x,y,w,h,settings){
    super(x,y,settings);
    this.w = w;
    this.h = h;
    this.settings = settings;
    this.index = boxes.length;
    this.scaleX = 0;
    this.scaleY = 0;
    this.function = settings.function;
    if(settings.function == "changePoint"){
      checks.push(this);
    }
  }
  show(){
    drawBox(this.x+(width/2-camera.x) + this.scaleX ,this.y+(height/2-camera.y) + this.scaleY,this.w + this.scaleX,this.h + this.scaleY,this.function);
  }
  collide(i){
    let x = clamp(this.x,this.x+this.w,player.x);
    let y = clamp(this.y,this.y+this.h,player.y);
    if(player.x < this.x){
      x = this.x;
    }
    else if(player.x > this.x + this.w){
      x = this.x + this.w;
    }
    let theta = findAng(x,y,player.x,player.y);
    if(player.boxGrounds.length > area.length){
      player.boxGrounds.pop();
    }
    player.boxGrounds[i] = (y == this.y && rectCircle(this.x-0.1,this.y-0.1,this.w+0.1,this.h+0.1,player.x,player.y,player.dia,player.dia));

    if(rectCircle(this.x-0.1,this.y-0.1,this.w+0.1,this.h+0.1,player.x,player.y,player.dia,player.dia)){
      if(this.function == "changePoint"){
        respawn.changePoint(this.x+this.w/2,this.y-player.rad);
        respawn.box = this;
      }
      if(y == this.y){
        player.boxGrounds[i] = "bottom";
        //Friction
        if(this.settings.move){
          let dif = player.x-this.x;
          player.x = this.x + dif + this.speed * ((this.point | 0)*2-1);
        }
      }
      else if(y == this.y + this.h){
        player.boxGrounds[i] = "top";
      }
      else if(x == this.x){
        player.boxGrounds[i] = "right";
      }
      else if(x == this.x + this.w){
        player.boxGrounds[i] = "left";
      }
    }

    if(dist(x,y,player.x,player.y) <= player.dia/2 && !collidePointRect(player.x,player.y,this.x,this.y,this.w,this.h)){
      while(dist(x,y,player.x,player.y) <= player.dia/2){
        let changeX = round(cos(theta) * 100) / 100;
        let changeY = round(sin(theta) * 100) / 100;
        player.x += changeY/10;
        player.y -= changeX/10;
      }
    }
  }
}

class Words{
  constructor(text,x,y,color){
    this.x = x;
    this.y = y;
    this.text = text;
    if(color){
      this.color = color;
    }
    else{
      this.color = "black";
    }
  }
  show(){
    text(this.text,this.x+(width/2-camera.x),this.y+(height/2-camera.y));
  }
}
