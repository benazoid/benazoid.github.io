class Block{
  constructor(recs, t, ps, sp, le, mt){
    this.loc = createVector(recs[0].loc.x,recs[0].loc.y);
    this.size = createVector(0,0);
    for(let i = 0; i < recs.length; i++){
      if(recs[i].loc.x < this.loc.x){
        this.loc.x = recs[i].loc.x;
      }
      if(recs[i].loc.y < this.loc.y){
        this.loc.y = recs[i].loc.y;
      }
      if(recs[i].loc.x + recs[i].size.x > this.size.x){
        this.size.x = recs[i].loc.x + recs[i].size.x;
      }
      if(recs[i].loc.y + recs[i].size.y > this.size.y){
        this.size.y = recs[i].loc.y + recs[i].size.y;
      }
    }
    for(let i = 0; i < recs.length; i++){
      recs[i].loc.x -= this.loc.x;
      recs[i].loc.y -= this.loc.y;
    }
    this.points = ps;
    this.recs = recs;
    this.size.x -= this.loc.x;
    this.size.y -= this.loc.y;

    this.type = t;
    this.speed = sp;
    this.vel = createVector(0,0);
    this.level = le;
    this.colls = [[],[],[],[]]; // right,left,top,bottom
    this.canJump = false;
    this.spaceUp = 0;
    this.coyote = 0;
    this.moveType = 0;
  }

  static createNewBlock(block){
    let b = new Block(block.recs,block.type,block.end,block.speed,block.level);
    b.loc = createVector(block.loc.x, block.loc.y);
    return b;
  }

  show(){
    noStroke();
    fill(200);
    if(this.type == "end"){
      fill(255, 191, 64);
    }
    if(this.type == "start"){
      fill(163, 204, 255);
    }
    if(this.type == "hard"){
      fill(100);
    }
    if(this.type == "dead"){
      fill(255,0,0);
    }
    for(let i = 0; i < this.recs.length; i++){
      rect(this.loc.x + this.recs[i].loc.x - cam.loc.x ,this.loc.y + this.recs[i].loc.y - cam.loc.y,this.recs[i].size.x,this.recs[i].size.y);
    }
  }

  /*
    types
    -standard
    -hard
    -dead
    -start
    -end
  */

  move(){
    let acc = 0.1;
    if(keys[Keys.d] && this.vel.x < 4){
      this.vel.x += 0.5;
    }
    else if(keys[Keys.a] && this.vel.x > -4){
      this.vel.x -= 0.5;
    }
    else if(!keys[Keys.d] && !keys[Keys.a] && this.vel.x != 0){
      this.vel.x /= 1 + (1/acc)/30;
    }
    if(Math.abs(this.vel.x) < 0.05){
      this.vel.x = 0;
    }
    if(this.vel.y < 50 && !(this.colls[3].length)){
      this.vel.y += 0.75;
    }

    if(this.coyote >= 0){
      this.coyote ++;
    }
    if(this.coyote > 8){
      this.coyote = -1;
    }

    this.loc.x += this.vel.x;
    this.loc.y += this.vel.y;

    this.canJump = false;

    if(this.colls[0].length || this.colls[1].length || this.colls[3].length || this.coyote){
      this.canJump = true;
    }

    if(keys[Keys.space] && this.canJump){
      if(this.colls[3].length || this.coyote > 0){
        this.loc.y -= 1;
        this.vel.y = -14;
        if(this.coyote > 0){
          this.coyote = -1;
        }
      }
      else if(this.colls[0].length){
        let c = 0;
        for(let i = 0 ; i < this.colls[0].length; i++){
          if(this.colls[0][i] === true || (this.colls[0][i] instanceof Block && this.colls[0][i].type == "hard")){
            c++;
          }
        }
        if(c){
          this.loc.x ++;
          this.vel.x += 5;
          this.vel.y = -11;
        }
      }
      else if(this.colls[1].length){
        let c = 0;
        for(let i = 0 ; i < this.colls[0].length; i++){
          if(this.colls[0][i] === true || (this.colls[0][i] instanceof Block && this.colls[0][i].type == "hard")){
            c++;
          }
        }
        if(c){
          this.loc.x ++;
          this.vel.x -= 5;
          this.vel.y = -11;
        }
      }
    }

    if(this.spaceUp == 1){
      this.vel.y/=2;
      this.spaceUp++;
    }
    if(this.canJump){
      this.spaceUp = 0;
    }
  }
  collide(b){
    let ind;
    let ns = [];
    let is = [];
    for(let i = 0; i < this.recs.length; i++){
      for(let j = 0; j < b.recs.length; j++){
        ind = (this.collideSide(this.recs[i].getRealRect(this.loc),b.recs[j].getRealRect(b.loc)));
        if(ind+1){
          if(b.type == "dead"){
            levels[this.level].reset();
          }
          let br = b.recs[j].getRealRect(b.loc);
          let tr = this.recs[i];
          this.colls[ind].push(b);
          if(ind == 0){
            this.loc.x = br.loc.x + br.size.x - tr.loc.x + 1;
            this.vel.x = 0;
          }
          if(ind == 1){
            this.loc.x = br.loc.x - tr.size.x - tr.loc.x - 1;
            this.vel.x = 0;
          }
          if(ind == 2){
            this.loc.y = br.loc.y + br.size.y - tr.loc.y + 1;
            this.vel.y = 0;
          }
          if(ind == 3){
            this.loc.y = br.loc.y - tr.size.y - tr.loc.y - 1;
            this.vel.y = 0;
            this.coyote = 0;
          }
          else{
            this.coyote = -1;
          }
          if(this.colls[ind][this.colls[ind].length-1].type != "hard" && keys[Keys.l]){
            levels[this.level].swap(b);
          }
        }
      }
    }
  }

  getRect(){
    return new Rectangle(this.loc.x,this.loc.y,this.size.x,this.size.y);
  }

  wallCollide(){
    if(this.loc.x + this.size.x >= levels[this.level].width){
      this.loc.x = levels[this.level].width - this.size.x;
      this.vel.x = 0;
      this.colls[1].push(true);
    }
    if(this.loc.x <= 0){
      this.loc.x = 0;
      this.vel.x = 0;
      this.colls[0].push(true);
    }
    if(this.loc.y <= 0){
      this.loc.y = 0;
      this.vel.y = 0;
      this.colls[2].push(true);
    }
    if(this.loc.y + this.size.y > levels[this.level].height){
      this.loc.y = levels[this.level].height - this.size.y;
      this.vel.y = 0;
      this.colls[3].push(true);
    }
  }
  clamp(min,max,value){
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
  rectRectClamp(r1X,r1Y,r1W,r1H,rx,ry){
    let r2W = (r1W < r1H) ? r1W : r1H;
    let x = this.clamp(r1X,r1X+r1W-r2W,rx);
    let y = this.clamp(r1Y,r1Y+r1H-r2W,ry);
    return new Rectangle(x,y,r2W,r2W);
  }
  collideSide(r1,r2){
    let e = this.rectRectClamp(r2.loc.x,r2.loc.y,r2.size.x,r2.size.y,r1.loc.x,r1.loc.y);
    let b = this.rectRectClamp(r1.loc.x,r1.loc.y,r1.size.x,r1.size.y,r2.loc.x,r2.loc.y);
    if(levels[level].swapTime > 1 && e.collide(b)){
      let p1 = createVector(e.loc.x+(e.size.x/2),e.loc.y+(e.size.y/2));
      let p2 = createVector(b.loc.x+(b.size.x/2),b.loc.y+(b.size.y/2));
      let d = createVector(Math.abs(p1.x-p2.x),Math.abs(p1.y-p2.y));
      if(d.x == d.y){
        return -1;
      }
      if(d.x > d.y){
        if(p1.x > p2.x){ //Left
          return 1;
        }
        else{//Right
          return 0;
        }
      }
      else {
        if(p1.y > p2.y){//Bottom
          return 3;
        }
        else{//Top
          return 2;
        }
      }
    }
    return -1;
  }
}

class Rectangle{
  constructor(x,y,w,h){
    this.loc = createVector(x,y);
    this.size = createVector(w,h);
  }
  getRealRect(loc){
    return new Rectangle(this.loc.x + loc.x,this.loc.y + loc.y,this.size.x,this.size.y);
  }
  collide(r2){
    return (this.loc.y + this.size.y + 1 > r2.loc.y && r2.loc.y + r2.size.y + 1> this.loc.y) && (this.loc.x + this.size.x > r2.loc.x - 1 && r2.loc.x + r2.size.x + 1 > this.loc.x);
  }
}
