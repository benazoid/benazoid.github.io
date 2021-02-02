var PVector = function(x,y){
  this.x = x;
  this.y = y;
}
var cookies;
function draw(){
  cookies = document.cookie
    .split(';')
    .map(cookie => cookie.split('='))
    .reduce((accumulator, [key, value]) => ({ ...accumulator, [key.trim()]: decodeURIComponent(value) }), {});
}
