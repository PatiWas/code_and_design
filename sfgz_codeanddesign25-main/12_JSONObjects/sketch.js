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
    drehwinkelShould: 0,
    increment:0.01,
    groesse:50
  }, 
]

*/

let anzahl = 30;
let abstand;

function setup() {
  createCanvas(windowWidth, windowHeight);
  abstand = width / (anzahl - 1);
  // Initialisiere das Array mit JSON Objects
  for (let i = 0; i < anzahl; i++) {
    elemente[i] = {
      drehwinkel: 0,
      drehwinkelShould: 0,
      increment: 0.01,
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

    line(elemente[i].groesse * -1, 0, elemente[i].groesse, 0);
    ellipse(elemente[i].groesse * -1, 0, 5);
    ellipse(elemente[i].groesse, 0, 5);
    pop();

    let distanz = dist(mouseX, mouseY, i * abstand + abstand / 2, height / 2);
    //Wenn die Maus nahe ist, Drehwinkel verlangsamen, sonst normal weiterlaufen lassen
    if (distanz > 300 && mouseX >= 0 && mouseY >= 0) {
      elemente[i].drehwinkel += elemente[i].increment; 
      
      //angleichen des aktuellen Drehwinkels an den Solldrehwinkel wenn die Maus weg ist
      if (elemente[i].drehwinkel < elemente[i].drehwinkelShould) {
        let distanzWinkel = elemente[i].drehwinkelShould - elemente[i].drehwinkel;
        if (distanzWinkel > 0.01) {
          elemente[i].drehwinkel += distanzWinkel / 20; //langsam wieder angleichen, System stabilisieren
        }
      }
    } else {
      elemente[i].drehwinkel += map(distanz, 0, 300, 0, elemente[i].increment); //verlangsmen
    }
    elemente[i].drehwinkelShould += elemente[i].increment; //sollte Drehwinkel immer weiterlaufen lassen


  }
}
