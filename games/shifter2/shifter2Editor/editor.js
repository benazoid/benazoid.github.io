let canvas, level, player, focus, cursorRect, rectStage, realMouse, screenType;
let view = 'main';
let go = true;

let blockScript = document.createElement("script");
blockScript.setAttribute("src", "../shifter2/block.js");
document.body.appendChild(blockScript);
let levelScript = document.createElement("script");
levelScript.setAttribute("src", "../shifter2/level.js");
document.body.appendChild(levelScript);
let code = 'test,1200,600||{0,0,100,0,50,-100,;new movement,1,2,line}|{100,100,start,default controller,default movement;0,0,30,80;0,0,80,30;}{1100,400,end,default controller,new movement;0,0,20,60;}|'

function setup(){
  canvas = createCanvas(1000,650);
  realMouse = createVector(0,0);
  Level.levels.push(Level.createFromCode(code));
  level = Level.levels[Level.level];
  player = level.blocks[level.player];
  mainScreen();
}

function draw(){
  realMouse = createVector(mouseX - 25 + level.cam.loc.x, mouseY - 25 + level.cam.loc.y);
  level.cam.moveKeys(noFocus);
  canvas.position(windowWidth/2 - width/2,windowHeight/2 - height/2);
  level = Level.levels[Level.level];
  player = level.blocks[level.player];
  let block = focus;
  if(focus){
    block = (focus == 'player') ? player : focus;
  }

  Level.go(go,block);

  showEditor();
  if(block && focus != 'player'){
    noFill();
    stroke(200);
    strokeWeight(2);
    rect(block.loc.x - level.cam.loc.x + 23, block.loc.y - level.cam.loc.y + 23, block.size.x+4, block.size.y+4);
  }
}

function showEditor(){
  stroke(0);
  strokeWeight(3);
  fill(200);
  rect(650,1,350-2,650-3);
  if(screenType == 'main'){line(650,200,1000,200);}

  if(cursorRect){
    noFill();
    strokeWeight(1);
    rect(cursorRect.loc.x+25 - level.cam.loc.x ,cursorRect.loc.y+25 - level.cam.loc.y ,cursorRect.size.x,cursorRect.size.y);
    switch(rectStage){
      case 1:
        cursorRect.loc.x = mouseX-25 + level.cam.loc.x;
        cursorRect.loc.y = mouseY-25 + level.cam.loc.y;
        break;
      case 2:
        cursorRect.size.x = Math.abs(mouseX-cursorRect.loc.x-25+level.cam.loc.x);
        cursorRect.size.y = Math.abs(mouseY-cursorRect.loc.y-25+level.cam.loc.y);
        break;
      case 3:
        level.addBlocks(new Block([cursorRect], 'basic', Level.level));
        blockScreen(level.blocks[level.blocks.length-1]);
        cursorRect = false;
    }
  }
}

function mainScreen(){
  removeElements();
  screenType = 'main';
  focus = 'player';
  let createBlock = createButton('create block');
  createBlock.position(level.window.x + 20, 10);
  createBlock.elt.onclick = function(){
    createBlock.elt.blur();
    cursorRect = new Rectangle(mouseX,mouseY,100,100);
    rectStage = 1;
  }
  let browseLevels = createButton('browse levels');
  browseLevels.position(level.window.x + 20, 625);
  browseLevels.elt.onclick = browse;
  pauseButton();
}
function blockScreen(block){
  screenType = 'block';
  removeElements();
  focus = block;
  pauseButton();
}
function browse(){
  screenType = 'browse';
  removeElements();
  go = false;
}

function mousePressed(){
  if(mouseX <= 650){
    if(cursorRect){
      rectStage++;
    }
    else{
      let count = 0;
      for(let i = 0; i < level.blocks.length; i++){
        for(let j = 0; j < level.blocks[i].recs.length; j++){
          if(level.blocks[i].recs[j].getRealRect(level.blocks[i].loc).ptIntersect(realMouse)){
            blockScreen(level.blocks[i]);
            count++;
          }
        }
      }
      if(count == 0){
        mainScreen();
      }
    }
  }
}

function pauseButton(){
  let pause = createButton('');
  pause.position(level.window.x + 300, 10);
  pause.elt.innerText = (go) ? 'pause' : 'play';
  pause.elt.onclick = function(){
    pause.elt.blur();
    go = !go;
    pause.elt.innerText = (go) ? 'pause' : 'play';
  }
}
function noFocus(){
  focus = false;
}
function getInd(item, list){
  for(let i = 0; i < list.length; i++){
    if(list[i] == item){
      return i;
    }
  }
}
