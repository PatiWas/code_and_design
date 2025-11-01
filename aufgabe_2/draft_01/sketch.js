
function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0, 0, 255);  // Blue background
  noFill(0);  // no fill
  stroke(255, 255, 0);  // Yellow stroke
  
  for(let i = 0; i < 10; i++) {
    ellipse(mouseX + (i * 30), mouseY, 50, 500);  // Follow mouse with original ellipse style
  }
}

/*function keyPressed(){
  if(key=='s'){
    saveCanvas('screenshot.png')
  }*/

