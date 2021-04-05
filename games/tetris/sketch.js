pieces = [new I(1)];
cur = 0;

function draw(){
  background(255);
  noFill();
  rect(0,0,width,height);
  for(let i = 0; i < 10; i+=1){
    for(let j = 0; j < 20; j++){
      stroke(175, 181, 189);
      rect(i*size+width/4,j*size,size,size);
      stroke(0);
      rect(width/4,1,size*10,height-2);
    }
  }

  for(const piece of pieces){
    piece.show();
    piece.move();
  }

  if(keys[Keys.soft]){
    speed = 4;
    console.log(12);
  }
  else{
    speed = 10;
  }
}

function keyPressed(){
  if(keyCode == Keys.hard){
    let col = true;
    for(const block of pieces[cur].blocks){
      if(!block.collide("down")){
        col = false;
      }
    }
    let c = cur;
    while(col){
      col = true;
      for(const block of pieces[cur].blocks){
        console.log(block.collide("down"));
        if(!block.collide("down")){
          col = false;
        }
      }
      pieces[cur].y++;
    }
    console.log(c);
    pieces[cur].y-= 1;
  }
  if(keyCode == Keys.left){
    let col = true;
    for(const block of pieces[cur].blocks){
      if(!block.collide("left")){
        col = false;
      }
    }
    pieces[cur].x -= col | 0;
  }
  else if(keyCode == Keys.right){
    let col = true;
    for(const block of pieces[cur].blocks){
      if(!block.collide("right")){
        col = false;
      }
    }
    pieces[cur].x += col | 0;
  }

  if(keyCode == Keys.clock){
    pieces[cur].rotate();
    let check = true;
    for(const block of pieces[cur].blocks){
      if(!block.rotate()){
        check = false;
      }
    }
    if(!check){
      for(let i = 0; i < 3; i++){
        console.log(124189);
        pieces[cur].rotate();
      }
    }
  }

  keys[keyCode] = true;
}
function keyReleased(){
  keys[keyCode] = false;
}
