let drehwinkel=0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
}

function draw() {
  background(220);

  rectMode(CENTER);
 


  for(let i=0;i<10;i=i+1){
    //jedes Rechteck individuell drehen
    //das heisst, jedes hat seinen Drehmittelpunkt 
    //wo ist der ??
    push();
    translate(i*200, height/2);
    rotate(drehwinkel);
    fill(0,0,255);
    rect(0, 0, 100,100);
    pop();

    fill(0);
    ellipse(i*200, height/2, 5);
  }

  drehwinkel=drehwinkel+1;
}
