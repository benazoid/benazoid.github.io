console.log("epicp5 loaded");
let camera;

class Epic{
  static findAng(x1,y1,x2,y2){
    let theta = (y2 >= y1) ? Math.atan((x2-x1)/(y2-ye1))+(Math.PI) : Math.atan((x2-x1)/(y2-y1))+(2*Math.PI);
    return -theta;
  }
  static clamp(min,max,value){
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
  static rectCircle(rectX,rectY,rectW,rectH,circX,circY,circDia){
    return dist(Epic.clamp(rectX,rectX+rectW,circX),Epic.clamp(rectY,rectY+rectH,circY),circX,circY) <= circDia/2;
  }
  static rectRect(x1,y1,w1,h1,x2,y2,w2,h2){
    return x1 + w1 > x2 && x2 + w2 > x1 && y1 + h1 > y2 && y2 + h2 > y1;
  }
  static pointRect(x,y,x2,y2,w,h){
    return x > x2 && y > y2 && x < x2+w && y < y2 + h;
  }
  static epicError(message){
    console.log("\nHello there this is epicp5.\n" + message + " :)\n ");
  }
}

//Sprites
let sprites = [];
class Sprite{
  constructor(x,y,w,h){
    //Position
    this.x = x;
    this.y = y;
    //Size
    this.w = w;
    this.h = h;
    if(!w || !h){
      
      Epic.epicError("You should probably define a width and height of your sprite");
    }
    //Animation
    this.frame = 0;
    //Physics
    this.vel = new p5.Vector(0,0);
    this.hitboxes = [];
  }
  show(){
    if(!this.animation){
      if(this.h){
        rect(this.x-camera.x,this.y-camera.y,this.w,this.h);
      }
      else{
        point(this.x-camera.x,this.y-camera.y)
      }
    }
    else{
      push();
      scale(camera.scale,camera.scale);
      image(this.animation[this.frame],this.x-camera.x,this.y-camera.y);
      pop();
      if(frameCount % this.fr == 0){
        this.frame++;
        this.frame *= (this.frame < this.animation.length) | 0;
      }
    }
  }
  setAnimation(ani,fr){
    this.animation = ani;
    this.fr = fr;
    this.fr = (fr) ? fr : 0;
    if(!(this.animation.length+1)){
      this.animation = [this.animation];
    }
  }
  update(){
    this.x += this.vel.x * deltaTime;
    this.y += this.vel.y * deltaTime;
  }
}
function createSprite(x,y,w,h){
  let sprite = new Sprite(x,y,w,h);
  sprites.push(sprite);
  return sprite;
};

//Textures
class Spritesheet{
  constructor(sheet,w,h,amount){
    this.sheet = sheet.get();
    this.ani = [];
    for(let i = 0; i < amount; i++){
      let pos = {
        x: (i % (this.sheet.width/w)) * w,
        y: Math.floor(i / (this.sheet.width/w)) * h,
      };
      let img = this.sheet.get(pos.x,pos.y,w,h);
      this.ani.push(img);
    }
  }
}

//Keys
let Keys = {
  codes: [],
  'backspace': 8,
  'tab': 9,
  'enter': 13,
  'shift': 16,
  'ctrl':	17,
  'alt':	18,
  'pause': 19,
  'caps':	20,
  'escape':	27,
  'pageUp':	33,
  'space':	32,
  'pageDown':	34,
  'end':	35,
  'home':	36,
  'left':	37,
  'up':	38,
  'right': 39,
  'down':	40,
  'printScreen': 44,
  'insert':	45,
  'delete':	46,
  '0':	48,
  '1':	49,
  '2':	50,
  '3':	51,
  '4':	52,
  '5':	53,
  '6':	54,
  '7':	55,
  '8':	56,
  '9':	57,
  'a':	65,
  'b':	66,
  'c':	67,
  'd':	68,
  'e':	69,
  'f':	70,
  'g':	71,
  'h':	72,
  'i':	73,
  'j':	74,
  'k':	75,
  'l':	76,
  'm':	77,
  'n':	78,
  'o':	79,
  "p":	80,
  "q":	81,
  'r':	82,
  "s":	83,
  "t":	84,
  "u":	85,
  "v":	86,
  "w":	87,
  "x":	88,
  "y":	89,
  "z":	90,
  "leftWin": 91,
  "rightWin":	92,
  "select":	93,
  "num0":	96,
  "num1":	97,
  "num2":	98,
  "num3":	99,
  "num4":	100,
  "num5":	101,
  "num6":	102,
  "num7":	103,
  "num8":	104,
  "num9":	105,
  "astriks":	106,
  "plus":	107,
  "minus":	109,
  "decimal":	110,
  "divide":	111,
  "f1":	112,
  "f2":	113,
  "f3":	114,
  "f4":	115,
  "f5":	116,
  "f6":	117,
  "f7":	118,
  "f8":	119,
  "f9":	120,
  "f10":	121,
  "f11":	122,
  "f12":	123,
  "numLock":	144,
  "scrollLock":	145,
  "computer":	182,
  "calculator":	183,
  "semi colon":	186,
  "equals":	187,
  "comma":	188,
  "hyphen":	189,
  "period":	190,
  "foward slash":	191,
  "open brackets":	219,
  "back slash":	220,
  "close brackets":	221,
  "quote":	222,
}
function keyCheck(key){
  return Keys.codes[key];
}
function keyPressed(){
  Keys.codes[keyCode] = true;
}
function keyReleased(){
  Keys.codes[keyCode] = false;
}

//Camera
class Camera{
  constructor(){
    this.x = 0;
    this.y = 0;
    this.scale = 1;
  }
  showSprites(){
    for(const sprite of sprites){
      if(sprite.w){
        if(Epic.rectRect(sprite.x,sprite.y,sprite.w,sprite.h,this.x,this.y,width,height)){
          sprite.show();
        }
      }
      else{
        if(Epic.pointRect(sprite.x,sprite.y,this.x,this.y,this.x+width,this.y+height)){
          sprite.show();
        }
      }
    }
  }
}
camera = new Camera();
