

let drehwinkel=0; // we just randomly create a value that we can manipulate
let drehwinkelminus=0


function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  rectMode(CENTER);
}


function draw() {
  background(0);

push();
//Koordinatensystem verschieben
  translate(width/2, height/2);
// rotieren
  rotate(drehwinkel);

  rect(0, 0, 200, 200)

pop();

push();
//Koordinatensystem verschieben
  translate(width/2-200, height/2);
// rotieren
  rotate(drehwinkelminus);

  rect(0, 0, 200, 200)

pop();


fill(255,0,0)
// Koordinatensystem zurück gesetzt
rect(0,0,400,400)

drehwinkel = drehwinkel +1;
drehwinkelminus = drehwinkelminus -1;

}
