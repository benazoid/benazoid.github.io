function setup(){
  createCanvas(600,600);
}

var keys = [];
var collisions = [];
var underBlock;
var underNum;
var player;
var world = {
    grav: 0.2,
    currPlayer: 0,
    level: 0,
    done: false
};
var keys = {
    left: 65,
    right: 68,
    jump: 32,
    swap: 76
};

var Block = function(x,y,width,height,type,link,message){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocity = new PVector(2,0);
    this.maxVel = 5;
    this.accel = 0.05;
    this.type = type;
    if(this.type == "player"){
        this.inControl = true;
    }
    else{
        this.inControl = false;
    }
    this.link = link;
    this.message = message;
};
var level0 = {
    start: new Block(288,322,21,21,"start",false),
    player: false,
    end: new Block(374,450,130,130,"end", 1, "Start Game"),
    blocks: [new Block(132,458,122,122,"block",2, "Settings")]
};
var level1 = {
  start: new Block(288,322,21,21,"start",false),
  player: false,
  end: new Block(374,450,130,130,"end", 0, "exit"),
  blocks: [new Block(132,458,122,122,"block",2, "Settings")]
};
var level2 = {
    start: new Block(262,479,49,49,"start"),
    player: new Block(12,537,56,56,"player"),
    end: new Block(526,543,54,54,"end"),
    blocks: []
};
var level3 = {
    start: new Block(111,516,49,49,"start"),
    player: new Block(29,558,39,39,"player"),
    end: new Block(521,289,61,61,"end"),
    blocks: [new Block(220,468,45,45,"block"),new Block(322,404,49,49,"block"),new Block(427,339,56,56,"block")]
};
var level4 = {
    start: new Block(281,534,25,25,"start"),
    player: new Block(282,562,21,21,"player"),
    end: new Block(288,322,21,21,"end"),
    blocks: [new Block(282,496,26,26,"block")]
};
var level5 = {
    start: new Block(289,462,43,43,"start"),
    player: new Block(355,467,45,45,"player"),
    end: new Block(5,145,40,40,"end"),
    blocks: [new Block(224,459,43,43,"block"),new Block(157,455,44,44,"block")]
};

var levels = [level0,level2,level3,level4,level5];
Block.prototype.moveBlock = function(){
    if(this.inControl){
        if(keys[keys.left] && !keys[keys.right]){
            this.x -= this.velocity.x;
            if(this.velocity.x < this.maxVel){
                this.velocity.x += this.accel;
            }
        }
        else if(keys[keys.right] && !keys[keys.left]){
            this.x += this.velocity.x;
            if(this.velocity.x < this.maxVel){
                this.velocity.x += this.accel;
            }
        }
        if(!keys[keys.left] && !keys[keys.right]){
            this.velocity.x = 2;
        }
        this.y += this.velocity.y;
        this.velocity.y += world.grav;
    }
};
Block.prototype.draw = function() {
    noFill();
    noStroke();
    if(this.type == "end"){
        fill(255, 191, 64);
    }
    if(this.type == "start"){
        fill(163, 204, 255);
    }
    if(this.type == "block" || this.type == "player"){
      fill(209, 206, 197);
    }
    rect(this.x,this.y,this.width,this.height);
    fill(0, 0, 0);
    textSize(this.width/6.5);
    text(this.message,this.x+10,this.y+this.height/1.8);
};
Block.prototype.collide = function(object,e){
    if((this.y + this.height + 1 > object.y && object.y + object.height + 1> this.y)&&(this.x + this.width > object.x - 1 && object.x + object.width + 1 > this.x) && this !== object){
        var x1 = (this.x + floor((this.width)/2));
        var y1 = (this.y + floor((this.height)/2));
        var x2 = (object.x +floor((object.width)/2));
        var y2 =(object.y+floor((object.height)/2));
        var dir;
        var horiz;
        var vert;
        var distH;
        var distV;
        if(x1 > x2){
            horiz = "left";
        }
        else{
            horiz = "right";
        }
        distH = abs(x1-x2);
        if(y1 > y2){
            vert = "top";
        }
        else{
            vert = "bottom";
        }
        distV = abs(y1-y2);
        if(distH > distV){
            dir = horiz;
        }
        else{
            dir = vert;
        }
        if(this == player){
            underBlock = object;
            underNum = e;
        }
        return dir;
    }
    if(this !== player){
        underBlock = false;
    }
    return false;
};
var blocks = [new Block(155,348,20,20,"player"),new Block(220,568,30,30,"block"),new Block(283,568,30,30,"block")];

Block.prototype.hit = function(){
    for(var i = 0; i < blocks.length; i++){
        if(blocks[i] !== this){
            var col = this.collide(blocks[i],i);
            if(col == "right"){
                this.x = blocks[i].x - this.width - 1;
                this.velocity.x = 0;
            }
            else if(col == "left"){
                this.x = blocks[i].x + blocks[i].width + 1;
                this.velocity.x = 0;
            }
            else if(col == "top"){
                this.y = blocks[i].y + blocks[i].height + 1;
                this.velocity.y = 0;
            }
            else if(col == "bottom"){
                this.y = blocks[i].y - this.height;
                if(!keys[keys.jump]){
                    this.velocity.y = 0;
                }
            }
        }
    }
    if(this.x > width - this.width){
        this.x = width - this.width;
        this.velocity.x = 0;
        collisions.push("right");
    }
    if(this.x < 0){
        this.x = 0;
        this.velocity.x = 0;
        collisions.push("left");
    }
    if(this.y < 0){
        this.y = 0;
        this.velocity.y = 0;
        collisions.push("top");
    }
    if(this.y > height - this.height){
        this.y = height - this.height;
        this.velocity.y = 0;
        collisions.push("bottom");
    }
};
function nextLevel(){
    if(levels[world.level].player){
        world.currPlayer = 1;
    }
    else{
        world.currPlayer = 0;
        levels[world.level].start.inControl = true;
    }
    if(world.level < levels.length){
        blocks = [];
        var level = levels[world.level];
        blocks.push(level.start);
        if(levels[world.level].player){
            blocks.push(level.player);
        }
        blocks.push(level.end);
        for(var i = 0; i < level.blocks.length; i++){
            blocks.push(level.blocks[i]);
        }
    }
    else{
        world.done = true;
    }
}
Block.prototype.change = function(){
    if(!collisions.includes("top")){
        underBlock.inControl = true;
        player.inControl = false;
        world.currPlayer = underNum;
        if(underBlock.link){
            world.level = underBlock.link;
            nextLevel();
        }
        else if((underBlock.type == "start" && player.type == "end")||(underBlock.type == "end" && player.type == "start")){
            world.level++;
            nextLevel();
        }
    }

};

nextLevel();
function draw () {
    background(255, 255, 255);
    if(!world.done){
        player = blocks[world.currPlayer];
        collisions = [];
        for(var i = 0; i < blocks.length; i++){
            blocks[i].draw();
            var collide = player.collide(blocks[i],i);
            if(collide){
                collisions.push(collide);
            }
            if(blocks[i] == player){
                underBlock = false;
            }
        }
        player.moveBlock();
        player.hit();
        fill(0,0,0);
        //text(blocks[1].inControl,10,10);
        noFill();
        if(keys[keys.jump] && collisions.includes("bottom")){
            player.velocity.y = -8;
        }
        if(underBlock && keys[keys.swap] && !collisions.includes("top") && !collisions.includes("bottom")){
            underBlock.change();
        }
    }
    else{
        fill(0, 0, 0);
        textSize(50);
        text("      YAY\n\nYOU WON :)\n\n    PRESS\n  RESTART",161,128);
    }
};

keyReleased = function(){
    keys[keyCode] = false;
};
keyPressed = function(){
    keys[keyCode] = true;
    if(underBlock && keys[keys.swap] && !collisions.includes("top")){
        underBlock.change();
        player.velocity.x = 0;
        player.velocity.y = 0;
    }
};
