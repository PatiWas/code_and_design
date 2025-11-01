function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  angleMode(DEGREES);
}

function draw() {
  background(0);

  push();
  translate(width/2, height/2);
  rotate(45);
  fill(250)
  rect(0,0,200,400);
  stroke(255)
  strokeWeight(10)
  line(100, 0, 200,0)
  pop();


  fill(255,0,0)
  rect(0,0,200,400);
}
