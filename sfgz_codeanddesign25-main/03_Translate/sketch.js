let distX = 0;
let distY = 0;

function setup() {
  createCanvas(500, 500);
  background(250);
  fill(255, 0, 0);
  angleMode(DEGREES);
}

function draw() {
  background(220);
  stroke(150);
  strokeWeight(1)
  //Basis Gitter
  for (let i = 0; i < 10; i++) {
    line(0, 50 * i, width, 50 * i);
    line(50 * i, 0, 50 * i, height);
  }

  distX = mouseX;
  distY = mouseY;
  
  push();
  translate(distX, distY);
  
  text("x = " + distX, 7, 20);
  text("y = " + distY, 7, 35);
  
  stroke(0);
  strokeWeight(3)
  
  //Verschobenes Gitter
  for (let i = 0; i < 10; i++) {
    line(0, 50 * i, width, 50 * i);
    line(50 * i, 0, 50 * i, height);
  }
  pop();
}
