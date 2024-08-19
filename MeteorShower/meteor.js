
// -1 to 1
function normalish(){
    let sum = 0;
    let ct = 3;
    for(let i = 0; i < ct; i++){
        sum += Math.random();
    }
    return ((sum/ct)*2)-1;
}


class Meteor{

    constructor(xi, yi, xf, yf, explodes){

        this.xi = xi;
        this.yi = yi;
        this.x = xi;
        this.y = yi;
        this.angle = Math.atan2((yf-yi),(xf-xi));
        this.speed = Math.random() * 10 + 5;
        this.lifeTime = Math.sqrt((xf-xi)*(xf-xi) + (yf-yi)*(yf-yi));

        this.explodes = explodes;

        this.life = 0;
        this.ptArr = [];

        let density = 3;
        if(Math.random() > 0.75){

            for(let i = 0; i < this.lifeTime; i += (1/density)){
                let t = i/this.lifeTime;
                let power = 3;
                let brightness = Math.pow(t, 2);
                this.ptArr.push(brightness);
            }

        }
        else if(this.lifeTime < 400){
            
            for(let i = 0; i < this.lifeTime; i += (1/density)){
                let t = i/this.lifeTime;
                let brightness = Math.exp(-(4.5*t-2)*(4.5*t-2));
                this.ptArr.push(brightness);
            }

        } 

    }

    update(){
        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);
        this.life += this.speed/this.lifeTime;
    }

    draw(){
        
        let mBright;
        if(this.life < 0.5){
            mBright = Math.min(30 * this.life*this.life, 1);
        } else{
            mBright = Math.min(Math.exp(-10*Math.max(this.life - 0.75, 0)), 1);
        }
        let exBump = -150*(this.life-0.6)*(this.life-0.6) + 2;

        if(this.explodes){
            mBright = Math.max(mBright, exBump)
        }

        let da = Math.PI/20 * mBright;

        da = Math.max(0, da);

        let length = 20 * mBright;

        let x1 = this.x + length * Math.cos(this.angle + da);
        let y1 = this.y + length * Math.sin(this.angle + da);

        let x2 = this.x + length * Math.cos(this.angle - da);
        let y2 = this.y + length * Math.sin(this.angle - da);
        
        stroke(255 * mBright);
        if(da > 0)
            bezier(this.x, this.y, x1, y1, x2, y2, this.x, this.y);

        for(let i = 0; i < this.ptArr.length; i++){
            let t = i/this.ptArr.length;
            if(t > this.life){
                break;
            }

            let brightness = this.ptArr[i] * Math.exp(-5 * Math.max(0, this.life - 1));

            // 70-90 deg, 100%, 90-95%
            colorMode(HSL , 360, 100, 100)
            let hue = (Math.random()*2 - 1) * 10 + 80;
            let br = (Math.random()*2 - 1) * 2.5 + 87.5;
            stroke(hue, 100, br, brightness)
            
            let px = (t*this.lifeTime) * Math.cos(this.angle) + this.xi;
            let py = (t*this.lifeTime) * Math.sin(this.angle) + this.yi;

            strokeWeight(0.1);
            point(px, py);
        }

    }

    static random(maxX, maxY){
        let xi = Math.random() * maxX;
        let yi = Math.random() * (maxY/2);
        let angle = Math.random() * (2*Math.PI)/3 + Math.PI/6;
        let distance = 300 + 200 * normalish();

        let xf = xi + distance * Math.cos(angle);
        let yf = yi + distance * Math.sin(angle);

        let explodes = Math.random() > 0.85;
        
        return new Meteor(xi, yi, xf, yf, true);
    }

    /*
    lifetime

    t = 0:
    color = 0
    start fade in

    t = 0.1:
    fully apparent
    
    t = 0.15:
    line starts


    */

}


class Star{

    constructor(x, y, bright, twinkle){
        this.x = x;
        this.y = y;
        this.bright = bright;
        this.twinkle = twinkle;

        this.t = -1;
    }

    draw(width, height){
        if(this.twinkle){
            if(Math.random() < 0.5){
                this.t *= -1;
            }
        }

        stroke(245 + 5 * this.t)
        strokeWeight(this.bright + this.t/20);


        point(this.x * width,this.y * height)

    }

    static random(){
        let x = Math.random();
        let y = Math.random();
        let bright = normalish() + 1;
        let twinkle = Math.random() < 0.95;

        return new Star(x, y, bright, twinkle);
    }

}