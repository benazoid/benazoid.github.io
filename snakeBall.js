class Ball{
  constructor(x,y,h){
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.index = snake.length;
    this.size = 20;
    this.h = h;
  }
  draw(){
    noStroke();
    fill(this.h,100,100);
    ellipse(this.x,this.y,10,10);
  }
  move(){
    if(keys[Keys.count]){
      this.angle -= 0.08;
    }
    if(keys[Keys.clock]){
      this.angle += 0.08;
    }
    this.x += cos(this.angle) * 3;
    this.y += sin(this.angle) * 3;

    if(snake.length > this.size){
      snake.splice(1,1);
    }
    if(frameCount % 1 == 0){
      snake.push(new Ball(this.x,this.y,this.h));
    }

    this.h ++;
    if(this.h > 100){
      this.h = 0;
    }
  }
}
