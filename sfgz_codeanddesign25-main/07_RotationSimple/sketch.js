let drehwinkel=0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
}

function draw() {
  background(220);

  rectMode(CENTER);
 


 
    push();
    translate(width/2, height/2);
    rotate(drehwinkel);
    fill(0,0,255);
    rect(0, 0, 100,100);
    pop();

   
 

  drehwinkel=drehwinkel+1;
}
