let drehwinkel=0;
let increment=0.05; //geschwindigkeit der Rotation
let sliderIncrement; //steuerung der geschwindigkeit über slider

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  angleMode(DEGREES);
  sliderIncrement = createSlider(0, 5, increment, 0.01);
  sliderIncrement.position(10, 10);
}

function draw() {
  background(255, 10);
  increment = sliderIncrement.value();

  rectMode(CENTER);
 


  for(let i=0;i<10;i=i+1){
 
    push();
    translate(i*200, height/2);
    rotate(drehwinkel);
    fill(0,0,255);
    rect(0, 0, 100,100);
    pop();

    fill(0);
    ellipse(i*200, height/2, 5);
  }

  drehwinkel=drehwinkel+increment;//geschwindigkeit der Rotation abhängig vom slider
}
