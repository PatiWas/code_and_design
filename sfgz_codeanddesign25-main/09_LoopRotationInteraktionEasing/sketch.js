let drehwinkel = 0;
let anzahl = 50;
let abstand;

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  abstand = width / (anzahl - 1);
}

function draw() {
  background(255);
  fill(0);
  rectMode(CENTER);

  for (let i = 0; i < anzahl; i = i + 1) {
    push();
    translate(i * abstand, height / 2);
    //Distanz zum Zeichnungsmittelpunkt
    let distanz = dist(mouseX, mouseY, i * abstand, height / 2);
    //Abhängig von der Distanz verschieben, bei viel Distanz gegen unten, bei wenig gegen oben
    //Statt linearem Mapping jetzt mit Easing
    let yposShift = easeInOutExpo(map(distanz, 0, height, 0, 1)) * 200 - 100;
    //Rotations- und Zeichenpunkt verschieben in der y-Achse 
    translate(0, yposShift);
    //rotieren
    rotate(drehwinkel);

    line(0, 0, 500, 0);
    ellipse(0, 0, 5);
    pop();

  }

  drehwinkel = drehwinkel + 1;
}

// Exponential Easing Funktion
// Quelle: https://easings.net/#easeInOutExpo
// Eingabe: Wert zwischen 0 und 1
// Ausgabe: Wert zwischen 0 und 1
function easeInOutExpo(x) {
  return x === 0
    ? 0
    : x === 1
      ? 1
      : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2
        : (2 - Math.pow(2, -20 * x + 10)) / 2;

}