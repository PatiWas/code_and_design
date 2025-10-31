

let drehwinkel=0; // we just randomly create a value that we can manipulate
let drehwinkelminus=0
//let bild;

//function preload(){
  //bild=loadImage("images/bildhaus.png");
//}


function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  rectMode(CENTER);
}


function draw() {
//tint(255, 50);
//image(bild,0,0,windowWidth,windowHeight);
//image(bild,0,0,1000,1000 );

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

function keyPressed(){
  if(key=='s'){
    saveCanvas('screenshot.png')
  }
}
