



let canvas;
let meteorArr = [];
let starArr = [];

function setup(){
    canvas = createCanvas(400,400);
    background(0);

    for(let i = 0; i < 200; i++){
        starArr.push(Star.random())
    }
}

function keyPressed(){
    if(key == 'f'){
        let fs = fullscreen();
        fullscreen(!fs);
    }

    if(key == 't'){
        textTime = !textTime;
    }

}

function keyReleased(){
    resizeCanvas(windowWidth, windowHeight)
}

function mousePressed(){
    meteorArr.push(Meteor.random(width, height));
}


let textTime = false;

function drawText(){

    textSize(36);
    textFont('Courier New')
    fill(100)
    noStroke();

    if(textTime){
        text(" Meteor Shower\nby Steve Martin\n  other text", width/2 - 150, 200)
    }

}

let meteorTime = Math.random() * 100 + 100;


function draw(){
    meteorTime--;
    if(meteorTime < 0){
        meteorTime = Math.random() * 100 + 100;
        meteorArr.push(Meteor.random(width, height));

        console.log("hi")
    }

    background(0);

    drawText()

    for(let i = 0; i < starArr.length; i++){
        starArr[i].draw(width, height);
    }

    for(let i = 0 ; i < meteorArr.length; i++){
        meteorArr[i].draw();
        meteorArr[i].update();

        if(meteorArr[i].life > 3){
            meteorArr.splice(i, 1)
            i++;
        }
    }




}

