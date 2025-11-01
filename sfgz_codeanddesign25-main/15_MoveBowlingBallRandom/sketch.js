let posX, posY;
let xBewegung, yBewegung;

function setup() {
  createCanvas(windowWidth, windowHeight);
  posX = width / 2;
  posY = height / 2;

  //Bewegung in x- und y-Richtung mit zufaelligen Werten initialisieren

}

function draw() {
  background(0, 10);
  noStroke();
  ellipse(posX, posY, 50, 50);

  xBewegung = random(-3, 3);
  yBewegung = random(-3, 3);

  //Bewegen der Kugel
  posX = posX + xBewegung;
  posY = posY + yBewegung;

  //Umkehren der Bewegungsrichtung bei Kollision mit Rand

  //Rechter Rand 
  if (posX > width) {
    posX = 0;
  }

  // Linker Rand
  if (posX < 0) {
    posX = width;
  }

  //Unterer Rand
  if (posY > height) {
    posY = 0;
  }

  //Oberer Rand
  if (posY < 0) {
    posY = height;
  }
}
