let grid = [
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0,
  0,0,0,0,0,0,0,0,0,0
];
let calc = [
  "","","","","","","","","","",
  "","","","","","","","","","",
  "","","","","","","","","","",
  "","","","","","","","","","",
  "","","","","","","","","","",
  "","","","","","","","","","",
  "","","","","","","","","","",
  "","","","","","","","","","",
  "","","","","","","","","","",
  "","","","","","","","","",""
];

let time, pos, xs = [], ys = [], x, y, stop = [0,0], play = false, touching = false;

let calcY = function(index){
  return Math.floor(index/10);
};
let calcX = function(index){
  return index-(calcY(index)*10);
};

let findPos = function(x,y){
  let gridX = x;
  let gridY = y;
  while(gridX % 60){
    gridX --;
  }
  while(gridY % 60){
    gridY --;
  }
  return [gridX/60, gridY/60];
};

let findIndex = function(x,y){
  return y*10 + x;
};

let check = function(x,y){
  return grid[findIndex(x,y)] == 1;
};

let replace = function(ind, nu){
  if(grid[ind] == 1 && calc[ind] == ""){
    calc[ind] = nu + 1;
  }
  if(grid[ind] == 2){
    touching = true;
  }
};

let Player = function(x,y){
  this.x = x;
  this.y = y;
};
Player.prototype.draw = function() {
  noStroke();
  fill(0, 255, 17);
  ellipse(this.x*60+30,this.y*60+30,40,40);
};
Player.prototype.move = function(direction){
  switch(direction){
    case "up":
      this.y -= 1;
      break;
    case "down":
      this.y += 1;
      break;
    case "left":
      this.x -= 1;
      break;
    case "right":
      this.x += 1;
      break;
  }
};

let player = new Player(0,0);

function setup(){
  createCanvas(600,600);
}

draw = function() {
  //Drawing grid
  for(let i = 0; i < grid.length; i++){
    switch(grid[i]){
      case 1:
        fill(255, 255, 255);
        break;
      case 0:
        fill(0, 0, 0);
        break;
      case 2:
        fill(81, 0, 255);
        break;
      case 3:
        fill(255, 0, 0);
        break;
    }
    noStroke();
    rect(calcX(i)*60,calcY(i)*60,60,60);
    fill(255, 0, 255);
    text(calc[i],calcX(i)*60+10,calcY(i)*60+40);
  }

  if(mouseIsPressed){
    //Calculating x and y positions based off of mouse position
    grid[findIndex(findPos(mouseX,mouseY)[0],findPos(mouseX,mouseY)[1])] = 1;
  }

  if(play){
    let num = 0;
    while(!touching){
      for(let i = 0; i < grid.length; i++){
        if(calc[i] == num){
          let index = findIndex(calcX(i)-1,calcY(i));
          replace(index,num);
          index = findIndex(calcX(i),calcY(i)-1);
          replace(index,num);
          index = findIndex(calcX(i)+1,calcY(i));
          replace(index,num);
          index = findIndex(calcX(i),calcY(i)+1);
          replace(index,num);
        }
      }
      num ++;
    }
    num = 101;
    let index = findIndex(player.x,player.y-1);
    if(calc[index] < num && calc[index] !== ""){
      num = calc[index];
    }
    index = findIndex(player.x,player.y+1);
    if(calc[index] < num && calc[index] !== ""){
      num = calc[index];
    }
    index = findIndex(player.x-1,player.y);
    if(calc[index] < num && calc[index] !== ""){
      num = calc[index];
    }
    index = findIndex(player.x+1,player.y);
    if(calc[index] < num && calc[index] !== ""){
      num = calc[index];
    }
    xs = [];
    ys = [];
    xs.push(player.x);
    ys.push(player.y);
    while(num >= 0){
      let xPos = xs[xs.length-1];
      let yPos = ys[ys.length-1];
      let index = findIndex(xPos,yPos-1);
      if(calc[index] == num){
        xs.push(xPos);
        ys.push(yPos-1);
        continue;
      }
      index = findIndex(xPos,yPos+1);
      if(calc[index] == num){
        xs.push(xPos);
        ys.push(yPos+1);
        continue;
      }
      index = findIndex(xPos-1,yPos);
      if(calc[index] == num){
        xs.push(xPos-1);
        ys.push(yPos);
        continue;
      }
      index = findIndex(xPos+1,yPos);
      if(calc[index] == num){
        xs.push(xPos+1);
        ys.push(yPos);
        continue;
      }
      num --;
    }
    play = 0;
    time = 0;
    pos = 0;
  }
  if(play == 0){
    player.draw();
    time++;
    if(time % 30 == 0){
      pos ++;
    }
    if(pos < xs.length){
      player.x = xs[pos];
      player.y = ys[pos];
    }
  }
};

keyPressed = function(){
  //println(keyCode);
  if(keyCode == 65 && stop[0] == 0){
    grid[findIndex(findPos(mouseX,mouseY)[0],findPos(mouseX,mouseY)[1])] = 2;
    stop[0] = 1;
  }
  if(keyCode == 68 && stop[1] == 0){
    grid[findIndex(findPos(mouseX,mouseY)[0],findPos(mouseX,mouseY)[1])] = 3;
    stop[1] = 1;
  }
  if(keyCode == 83){
    grid[findIndex(findPos(mouseX,mouseY)[0],findPos(mouseX,mouseY)[1])] = 0;
  }
  if(keyCode == 10 && stop[1] == 1 && stop[1] == 1){
    play = true;
    for(let i = 0; i < grid.length; i++){
      if(grid[i] == 2){
        player.x = calcX(i);
        player.y = calcY(i);
        break;
      }
    }
    for(let i = 0; i < grid.length; i++){
      if(grid[i] == 3){
        calc[findIndex(calcX(i),calcY(i))] = 0;
      }
    }
  }
};
