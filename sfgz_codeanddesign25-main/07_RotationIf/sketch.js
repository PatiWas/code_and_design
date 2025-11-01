let angle = 11;//Starting angle


let grow = 1;
function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  background(0)
}

function draw() {
  background(0, 5);
  fill(255, 20)
  stroke(255)
  

  // turn back if angle is above 170 degrees
  if(abs(int(angle)) >= 170) { 
    grow= grow * -1;
  }

  

  // turn back if angle is below 10 degrees
  if(abs(int(angle)) <= 10) {
    grow= grow * -1;
    console.log("flip");
    console.log(angle);
  }

  translate(width / 2, height / 2);
  rotate(-90);
  push();
  
  rotate(angle);
  ellipse(200, 0, 400,50);
  pop()
  push();
  
  rotate(angle * -1);
  ellipse(200, 0, 400,50);
  pop();
  angle += grow;

  
}
