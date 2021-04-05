class Block{
  constructor(parent,x,y,ind){
    this.parent = parent;
    this.x = x;
    this.y = y;
    this.xPos = this.parent.x + this.x;
    this.yPos = this.parent.y + this.y;
    this.ind = ind;
    this.eee = 0;
    this.fall = 0;
  }
  show(){
    let c = this.parent.color;
    this.xPos = this.parent.x + this.x;
    this.yPos = this.parent.y + this.y + this.fall;
    noStroke();
    fill(colors[c][0],colors[c][1],colors[c][2]);
    rect((this.xPos)*size+(width/4),(this.yPos)*size,size,size);
    fill(0);
    //text(this.parent.falling,(this.xPos+5)*size+3,(this.yPos)*size+10);
    if(this.eee){
      for(let i = this.ind+1; i < this.parent.blocks.length; i++){
        this.parent.blocks[i].ind--;
      }
      this.parent.blocks.splice(this.ind,1);
    }
    if(h <  2 && this.yPos < 0){
      pieces = [];
      Piece.next();
      h = 30;
      cur = 0;
    }
  }
  collide(dir){
    this.xPos = this.parent.x + this.x;
    this.yPos = this.parent.y + this.y + this.fall;
    if((dir == "right" && this.xPos == 9) || (dir == "left" && this.xPos == 0) || (dir == "down" && this.yPos == 19)){
      return false;
    }
    for(const piece of pieces){
      if(piece !== this.parent){
        for(const block of piece.blocks){
          if((dir == "left" && block.xPos+1 == this.xPos && this.yPos == block.yPos)||(dir == "right" && block.xPos-1 == this.xPos && this.yPos == block.yPos)||(dir == "down" && block.yPos-1 == this.yPos && this.xPos == block.xPos)){
            return false;
          }
        }
      }
    }
    return true;
  }
  rotate(){
    if(this.xPos < 0 || this.yPos < 0 || this.xPos > 9 || this.yPos > 19){
      //return false;
    }
    for(const piece of pieces){
      if(piece !== this.parent){
        //console.log(12);
        for(const block of piece.blocks){
          if(this.xPos == block.xPos && this.yPos == block.yPos){
            return false;
          }
        }
      }
    }
    return true;
  }
}



class Piece{
  constructor(x){
    this.x = x;
    this.y = -3;
    this.id = pieces.length;
    this.rot = 0;
    this.color = Math.floor(Math.random()*7);
    this.falling = true;
  }
  show(){
    for(const block of this.blocks){
      block.show();
    }
  }
  blockSet(){
    let num = 0;
    for(let i = 0; i < this.tex.length; i++){
      for(let j = 0; j < this.tex[i].length; j++){
        if(this.tex[i][j]){
          this.blocks.push(new Block(this,j,i,num));
          num++;
        }
      }
    }
  }
  move(){
    //Gravity
    let col = true;
    for(const block of this.blocks){
      if(!block.collide("down")){
        col = false;
      }
    }
    if(frameCount % speed == 0 && col){
      this.y ++;
    }
    else if (frameCount % speed == 0){
      if(pieces[cur] == this){
        if(h > this.y){
          h = this.y;
        }
        Piece.next();
      }
    }
  }
  static next(){
    let ran = Math.floor(Math.random() * 7);
    let piece;
    switch (ran) {
      case 0:
        pieces.push(new I(2));
        break;
      case 1:
        pieces.push(new O(2));
        break;
      case 2:
        pieces.push(new L(2));
        break;
      case 3:
        pieces.push(new J(2));
        break;
      case 4:
        pieces.push(new T(2));
        break;
      case 5:
        pieces.push(new S(2));
        break;
      case 6:
        pieces.push(new Z(2));
        break;
    }
    cur += 1;
    let amt = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    for(const piece of pieces){
      for(const block of piece.blocks){
        amt[block.yPos]++;
      }
    }
    for(let i = 0; i < amt.length; i++){
      if(amt[i] == 10){
        for(const piece of pieces){
          for(const block of piece.blocks){
            if(block.yPos == i){
              block.eee = 1;
            }
            else{
              block.falling = true;
            }
          }
        }
      }
    }
  }

  rotate(){
    this.rot += Math.PI/2;
    for(const block of this.blocks){
      let prev = new p5.Vector(block.xPos,block.yPos);
      block.xPos = 0 + block.x + block.parent.off.x;
      block.yPos = 0 + block.y + block.parent.off.y;
      stroke(0,255,0);
      point(block.xPos,block.yPos);
      block.x = Math.round((block.xPos * Math.cos(Math.PI/2) - block.yPos * Math.sin(Math.PI/2))*10)/10;
      block.y = Math.round((block.xPos * Math.sin(Math.PI/2) + block.yPos * Math.cos(Math.PI/2))*10)/10;
    }
  }
}


//Blocks
class O extends Piece{
  constructor(x){
    super(x);
    this.tex = [
      [1,1],
      [1,1]
    ];
    this.blocks = [];
    this.blockSet();
    this.off = new p5.Vector(0,-1);
  }
}
class I extends Piece{
  constructor(x){
    super(x);
    this.tex = [
      [1],
      [1],
      [1],
      [1],
    ];
    this.blocks = [];
    this.blockSet();
    this.off = new p5.Vector(1,-2);
  }
}
class J extends Piece{
  constructor(x){
    super(x);
    this.tex = [
      [0,1],
      [0,1],
      [1,1]
    ];
    this.blocks = [];
    this.blockSet();
    this.off = new p5.Vector(0,-2);
  }
}
class L extends Piece{
  constructor(x){
    super(x);
    this.tex = [
      [1,0],
      [1,0],
      [1,1]
    ];
    this.blocks = [];
    this.blockSet();
    this.off = new p5.Vector(1 ,-1);
  }
}
class S extends Piece{
  constructor(x){
    super(x);
    this.tex = [
      [0,1,1],
      [1,1,0]
    ];
    this.blocks = [];
    this.blockSet();
    this.off = new p5.Vector(-1,-1);
  }
}
class Z extends Piece{
  constructor(x){
    super(x);
    this.tex = [
      [1,1,0],
      [0,1,1]
    ];
    this.blocks = [];
    this.blockSet();
    this.off = new p5.Vector(-1,-1);
  }
}
class T extends Piece{
  constructor(x){
    super(x);
    this.tex = [
      [0,1,0],
      [1,1,1]
    ];
    this.blocks = [];
    this.blockSet();
    this.off = new p5.Vector(0,-2);
  }
}
