let rotiere = 0;

function preload() {}

function setup() {
  createCanvas(500, 500);
  background(250);
  strokeWeight(1);
  angleMode(DEGREES);
  textAlign(CENTER);
  textSize(50);
  stroke(150);
  
  slider = createSlider(0, 360, 0);
  slider.position(width, 30);
}

function draw() {
  background(220);
  rotiere = slider.value();

  //Gitter 
  for (let i = 0; i < 10; i++) {
    for (let k = 0; k < 10; k++) {
      rect(50 * i, 50 * k, 50, 50);
      
      
    }
  }


  //Buchstaben

  for (let i = 0; i < 10; i++) {
    for (let k = 0; k < 10; k++) {
      
      push();
      rotate(rotiere);
      text("a", 50 * i, 50 * k, 50, 50);
      pop();
    }
  }
}
