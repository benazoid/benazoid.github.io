let pieces = [];
let size;
let cur;
let next;
let speed = 10;
let h = 30;

let colors = [];
let keys = [];
let Keys = {
  left: 65,
  right: 68,
  soft: 83,
  hard: 76,
  clock: 75,
  count: 74
};

function setup(){
  createCanvas(500,500);
  size = height/20;
  colors = [[0,0,255],[255,0,0],[0,255,0],[255, 111, 0],[255, 111, 0],[208, 0, 255],[0, 247, 255]];
}

function newPiece(){
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
