class Level{
  constructor(w, h, bs){
    this.width = w;
    this.height = h;
    this.blockStore = bs;
    this.blocks = [];
    for(let i = 0 ; i < bs.length; i++){
      this.blocks.push(Block.createNewBlock(bs[i]));
    }
    for(let i = 0; i < bs.length; i++){
      if(bs[i].type == "start"){
        this.player = i;
      }
    }
    this.swapTime = 100;
  }

  addBlocks(block){
    if(block.type == "start"){
      this.player = this.blocks.length;
    }
    this.blocks.push(Block.createNewBlock(block));
    this.blockStore.push(block);
  }

  addWords(w, ps){
    words = w;
    this.wordPlaces = ps;
  }

  show(){
    fill(255);
    stroke(0);
    rect(-cam.loc.x,-cam.loc.y,this.width,this.height)
    this.moveCam();
    let play = this.blocks[this.player];

    for(let i = 0 ; i < this.blocks.length; i++){
      this.blocks[i].show();
      if(this.blocks[i] !== play && play.getRect().collide(this.blocks[i].getRect())){
        play.collide(this.blocks[i]);
      }
    }
    play.wallCollide();

    play.move();

    play.colls = [[],[],[],[]];
    if(this.swapTime < 100){
      this.swapTime++;
    }
  }

  moveCam(){
    fill(0);
    noFill();
    let play = this.blocks[this.player];

    let d = dist(cam.loc.x, cam.loc.y, play.loc.x-(width/2), play.loc.y-(height/2));
    if(d < 3){
      cam.moveLoc(play.loc.x-(width/2),play.loc.y-(height/2));
    }
    else{
      let ang = findAng(cam.loc,createVector(play.loc.x-(width/2),(play.loc.y-(height/2))));
      cam.moveLoc(cam.loc.x + (-d/14)*cos(ang),cam.loc.y + (-d/14)*sin(ang));
    }

    if(cam.loc.x < 5){
      cam.loc.x = 0
    }
    if(this.width-(cam.loc.x+width) < 5){
      cam.loc.x = this.width - width;
    }
    if(cam.loc.y < 20){
      cam.loc.y = 0
    }
    if(this.height-(cam.loc.y+height) < 5){
      cam.loc.y = this.height - height;
    }
  }

  swap(b){
    if(this.swapTime > 10){
      for(let i = 0; i < this.blocks.length; i++){
        if(this.blocks[i] === b){
          b.vel = createVector(0,0);
          this.player = i;
          this.swapTime = 0;
          this.swapTrans = true;
        }
      }
    }
  }

  spaceUp(){
    this.blocks[this.player].spaceUp++;
  }

  reset(){
    console.log(this.blockStore.length);
    this.blocks = [];
    for(let i = 0 ; i < this.blockStore.length; i++){
      this.blocks.push(Block.createNewBlock(this.blockStore[i]));
    }
    for(let i = 0; i < this.blockStore.length; i++){
      if(this.blockStore[i].type == "start"){
        this.player = i;
      }
    }
    this.swapTime = 100;
  }

  getLevelCode(){
    let s = "";
    s += this.width + "," + this.height + "|";
    for(let i = 0; i < this.blockStore.length; i++){
      let recs = this.blockStore[i].recs;
      let block = this.blockStore[i];
      let ps = this.blockStore[i].points;
      s += block.type + "," + block.speed + "," + block.moveType + ".";
      for(let j = 0; j < recs.length; j++){
        s += recs[j].loc.x + "," + recs[j].loc.y + "," + recs[j].size.x + "," + recs[j].size.y + ".";
      }
      for(let j = 0; j < ps.length; j++){
        s += ps[j].x + "," + ps[j].y + "|";
      }
    }
    return s;
  }
}
