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

    if (i * abstand < width/2) {
      //rotieren uhrzeigersinn
      rotate(drehwinkel);
    }else{
      //rotieren gegenuhrzeigersinn
      rotate(drehwinkel * -1);
    }


    line(0, 0, 500, 0);
    ellipse(0, 0, 5);
    pop();

  }

  drehwinkel = drehwinkel + 1;
}
