// Arrays Beispiel
// Jedes Element in einem Array kann einzeln angesprochen werden
// Jedes Element hat einen eigenen Drehwinkel 
// Jedes Element dreht sich mit eigener Geschwindigkeit, wird immer schneller je weiter rechts es ist

let drehwinkel=[];//aktueller Drehwinkel
let drehwinkelIncrement=[]; //geschwindigkeit der Rotation
let anzahl=10;
let abstand;

function setup() {
  createCanvas(windowWidth, windowHeight);
  abstand = width / (anzahl - 1);

  for (let i = 0; i < anzahl; i++) {
    drehwinkel[i] = 0; //Anfangsdrehwinkel
    drehwinkelIncrement[i] = (i + 1) / 100; //Geschwindigkeit der Rotation abhängig von der Position im Array
  }
}

function draw() {
  background(255);
  for (let i = 0; i < anzahl; i++) {
    push();
    translate(i * abstand + abstand / 2, height / 2);
    rotate(drehwinkel[i]);
    rectMode(CENTER);
    fill(0);
    rect(0, 0, 50, 50);
    pop();

    drehwinkel[i] = drehwinkel[i] + drehwinkelIncrement[i]; //jedes Element hat seine eigene Rotationsgeschwindigkeit
  }
}
