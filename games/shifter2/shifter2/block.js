class Block{
  constructor(recs, type, level, settings, moveSettings){
    this.createThis(recs);

    this.level = level;
    //console.log(Level.levels.length);
    this.levelName = Level.levels[this.level].name;
    this.type = type;

    this.vel = createVector(0,0);
    this.colls = [[],[],[],[]]; // right,left,top,bottom
    this.canMoveVert = true;
    this.canMoveHoriz = true;

    this.canJump = false;
    this.spaceUp = 0;
    this.coyote = 0;

    this.settings = Level.NormSettings;
    for(let i = 0; i < Level.settings.length; i++){
      if(settings == Level.settings[i].name){
        this.settings = Level.settings[i];
      }
    }
    this.moveSettings = Level.NormMoveSettings;
    for(let i = 0; i < Level.moveSettings.length; i++){
      if(moveSettings == Level.moveSettings[i].name){
        this.moveSettings = Level.moveSettings[i];
      }
    }
  }

  //Important stuff
  show(go){
    if(this !== Level.levels[this.level].blocks[Level.levels[this.level].player]){
      if(go){this.nonPlayerMove();}

      let points = this.moveSettings.points;
      for(let i = 0; i < points.length; i++){
        let j = (i + 1 == points.length) ? 0 : i + 1;
        stroke(0);
        fill(0);
        strokeWeight(3);
        let off = createVector(this.size.x/2 + 25 - Level.levels[this.level].cam.loc.x, this.size.y/2 + 25 - Level.levels[this.level].cam.loc.y);
        point(points[i].x+this.moveOrigin.x+off.x,points[i].y+this.moveOrigin.y+off.y);
        strokeWeight(1);
        line(points[i].x+this.moveOrigin.x+off.x,points[i].y+this.moveOrigin.y+off.y,points[j].x+this.moveOrigin.x+off.x,points[j].y+this.moveOrigin.y+off.y);
      }
    }
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
      rect(this.loc.x + this.recs[i].loc.x - Level.levels[this.level].cam.loc.x + 25,this.loc.y + this.recs[i].loc.y - Level.levels[this.level].cam.loc.y + 25,this.recs[i].size.x,this.recs[i].size.y);
    }
  }
  move(){
    //x velocity
    if(keys[Keys.d] && this.vel.x < this.settings.maxVel){
      this.vel.x += this.settings.accel;
    }
    else if(keys[Keys.a] && this.vel.x > -this.settings.maxVel){
      this.vel.x -= this.settings.accel;
    }
    else if(!keys[Keys.d] && !keys[Keys.a] && this.vel.x != 0){
      this.vel.x /= 1 + (1/this.settings.slow)/30;
    }
    if(Math.abs(this.vel.x) < 0.05){
      this.vel.x = 0;
    }

    //y velocity
    if(this.vel.y < 50 && !(this.colls[3].length)){
      this.vel.y += this.settings.gravity;
    }
    if(this.colls[2].length){
      this.vel.y += this.settings.gravity;
    }

    //Jumping
    if(this.coyote >= 0){
      this.coyote ++;
    }
    if(this.coyote > 8){
      this.coyote = -1;
    }
    this.canJump = false;
    if(this.colls[0].length || this.colls[1].length || this.colls[3].length || this.coyote){
      this.canJump = true;
    }
    if(keys[Keys.space] && this.canJump){
      if(this.colls[3].length || this.coyote > 0){
        this.loc.y -= 1;
        this.vel.y = -this.settings.jumpAmount;
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
          this.vel.x += this.settings.wallJumpX;
          this.vel.y = -this.settings.wallJumpY;
        }
      }
      else if(this.colls[1].length){
        let c = 0;
        for(let i = 0 ; i < this.colls[1].length; i++){
          if(this.colls[1][i] === true || (this.colls[1][i] instanceof Block && this.colls[1][i].type == "hard")){
            c++;
          }
        }
        if(c){
          this.loc.x --;
          this.vel.x -= this.settings.wallJumpX;
          this.vel.y = -this.settings.wallJumpY;
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

    this.canMoveHoriz = !(this.colls[0].length && this.colls[1].length);
    this.canMoveVert = !(this.colls[2].length && this.colls[3].length);

    for(let i = 0; i < this.colls[3].length; i++){
      if(this.colls[3][i] instanceof Block && this.colls[3][i].moveSettings.points.length){
        this.loc.x += (this.colls[3][i].vel.x);
        this.loc.y += (this.colls[3][i].vel.y);
      }
    }
    this.loc.x += this.vel.x;
    this.loc.y += this.vel.y;
  }

  collide(b){
    let ind;
    let ns = [];
    let is = [];
    for(let i = 0; i < this.recs.length; i++){
      for(let j = 0; j < b.recs.length; j++){
        let r1 = this.recs[i].getRealRect(this.loc);
        let r2 = b.recs[j].getRealRect(b.loc);

        ind = (this.collideSide(r1,r2));
        if(ind+1){
          if(b.type == "dead"){
            Level.levels[this.level].reset();
          }
          let br = b.recs[j].getRealRect(b.loc);
          let tr = this.recs[i];
          this.colls[ind].push(b);

          if(((ind == 0 || ind ==1) && !this.canMoveHoriz) || ((ind == 2 || ind == 3) && !this.canMoveVert)){
            b.collide(this);
            return;
          }

          if(!new Rectangle(r1.loc.x+1,r1.loc.x+1,r1.size.x-2,r1.size.x-2).collide(new Rectangle(r2.loc.x+1,r2.loc.x+1,r2.size.x-2,r2.size.x-2))){
            return;
          }

          if(ind == 0){
            this.loc.x = br.loc.x + br.size.x - tr.loc.x;
            this.vel.x = 0;
          }
          if(ind == 1){
            this.loc.x = br.loc.x - tr.size.x - tr.loc.x;
            this.vel.x = 0;
          }
          if(ind == 2){
            this.loc.y = br.loc.y + br.size.y - tr.loc.y;
            this.vel.y = 0;
          }
          if(ind == 3){
            this.loc.y = br.loc.y - tr.size.y - tr.loc.y;
            this.vel.y = 0;
            this.coyote = 0;
          }
          else{
            this.coyote = -1;
          }
          if(this.colls[ind][this.colls[ind].length-1].type != "hard" && keys[Keys.l] && this === Level.levels[this.level].blocks[Level.levels[this.level].player]){
            this.moveOrigin = createVector(this.loc.x,this.loc.y);
            Level.levels[this.level].swap(b);
            this.pointNum = 0;
          }
        }
      }
    }
  }
  wallCollide(){
    let ct = 0;
    if(this.loc.x + this.size.x >= Level.levels[this.level].width){
      this.loc.x = Level.levels[this.level].width - this.size.x;
      this.vel.x = 0;
      this.colls[1].push(true);
      ct++;
    }
    if(this.loc.x <= 0){
      this.loc.x = 0;
      this.vel.x = 0;
      this.colls[0].push(true);
      ct++;
    }
    if(this.loc.y <= 0){
      this.loc.y = 0;
      this.vel.y = 0;
      this.colls[2].push(true);
      ct++;
    }
    if(this.loc.y + this.size.y > Level.levels[this.level].height){
      this.loc.y = Level.levels[this.level].height - this.size.y;
      this.vel.y = 0;
      this.colls[3].push(true);
      ct++;
    }
    return ct > 0;
  }
  collideSide(r1,r2){
    let e = this.rectRectClamp(r2.loc.x,r2.loc.y,r2.size.x,r2.size.y,r1.loc.x,r1.loc.y);
    let b = this.rectRectClamp(r1.loc.x,r1.loc.y,r1.size.x,r1.size.y,r2.loc.x,r2.loc.y);
    if(Level.levels[this.level].swapTime > 1 && e.collide(b)){
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
  nonPlayerMove(){
    let points = this.moveSettings.points;
    if(points.length && this.moveSettings.type == 'line'){
      if(this.wallCollide()){
        this.pointNum++;
      }
      if(this.pointNum > points.length-1){
        this.pointNum = 0;
      }
      let currPoint = points[this.pointNum];
      let nextPoint = (this.pointNum != points.length-1) ? points[this.pointNum + 1] : points[0];
      let stop = false;
      for(let i = 0; i < this.colls.length; i++){
        if(this.colls[i].length){
          stop = true;
          break;
        }
      }
      if(!this.stopTime && !stop){
        let ang = atan2((this.loc.y)-(nextPoint.y+this.moveOrigin.y),this.loc.x-(nextPoint.x+this.moveOrigin.x)) + Math.PI;
        let d = dist(this.loc.x, this.loc.y, nextPoint.x+this.moveOrigin.x, nextPoint.y+this.moveOrigin.y);
        this.vel = createVector(this.moveSettings.speed * cos(ang), this.moveSettings.speed * sin(ang));
        if(d <= this.moveSettings.speed * 2){
          this.loc.x += d*cos(ang);
          this.loc.y += d*sin(ang);
          this.stopTime = millis();
        }
        else{
          this.loc.x += this.vel.x;
          this.loc.y += this.vel.y;
        }
      }
      else{
        this.vel = createVector(0,0);
        if(this.stopTime && (millis()-this.stopTime)/1000 > this.moveSettings.stop){
          this.pointNum++;
          if(this.pointNum > points.length-1){
            this.pointNum = 0;
          }
          this.stopTime = 0;
        }
        this.colls = [[],[],[],[]];
      }
    }
  }

  //Less important stuff
  getRect(){
    return new Rectangle(this.loc.x,this.loc.y,this.size.x,this.size.y);
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

  //Constructor stuff
  createThis(recs){
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
    this.size.x -= this.loc.x;
    this.size.y -= this.loc.y;
    this.recs = recs;
  }
  createNewBlock(loc){
    let b = new Block(this.recs,this.type,this.level,this.settings.name,this.moveSettings.name);
    if(loc){
      b.loc = loc;
    }
    else{
      b.loc = createVector(this.loc.x, this.loc.y);
    }
    b.initMove();
    return b;
  }
  initMove(){
    if(!this.moveSettings.points.length){return;}
    let points = this.moveSettings.points;
    let offset = createVector(
      points[0].x,
      points[0].y
    );
    this.moveOrigin = createVector(this.loc.x,this.loc.y);
    this.pointNum = 0;
    this.stopTime = 0;
    for(let i = 0; i < points.length; i++){
      points[i].x -= offset.x;
      points[i].y -= offset.y;
    }
  }
  addToLevel(){
    Level.levels[this.level].addBlocks(this);
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
  ptIntersect(pt){
    return (pt.x > this.loc.x && pt.y > this.loc.y && pt.x < this.loc.x + this.size.x && pt.y < this.loc.y + this.size.y);
  }
}

/*
  types
  -hard
  -dead
  -start
  -end
*/
