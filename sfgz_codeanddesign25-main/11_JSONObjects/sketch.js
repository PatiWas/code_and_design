// Array, das JSON Objects enthält, nicht bloss einen einfachen Wert
// JSON Objects können mehrere Eigenschaften haben
// Geschwindigkeit,aktueller Drehwinkel, Groesse, Farbe, Position etc.
// System wird gestoert von Userinteraktion
// Wenn die Maus nahe ist, stoppen die Elemente ihre Rotation und sind nicht mehr synchronisiert
// kann sich das System wieder stabilisieren, wenn die Maus weg ist?


let elemente = []; //Array mit JSON Objects
/*
[
  {
    drehwinkel:0,
    increment:0.01,
    groesse:50
  }, 
]

*/

let anzahl = 20;
let abstand;

function setup() {
  createCanvas(windowWidth, windowHeight);
  abstand = width / (anzahl - 1);
  // Initialisiere das Array mit JSON Objects
  for (let i = 0; i < anzahl; i++) {
    elemente[i] = {
      drehwinkel: 0,
      increment: (i + 1) / 200,
      groesse: (anzahl - i) * 20 + 20
    };
  }
}

function draw() {
  background(255);
  fill(0)
  for (let i = 0; i < anzahl; i++) {
    push();
    translate(i * abstand + abstand / 2, height / 2);
    rotate(elemente[i].drehwinkel);
    
    line(0, 0, elemente[i].groesse, 0);
    ellipse(0, 0, 5);
    pop();

    let distanz = dist(mouseX, mouseY, i * abstand + abstand / 2, height / 2);
    //Wenn die Maus nahe ist, stoppen
    if (distanz > 200) {
     elemente[i].drehwinkel += elemente[i].increment; //jedes Element hat seine eigene Rotationsgeschwindigkeit
    }else{
      elemente[i].drehwinkel += 0; //stoppen
    }
  }
}
