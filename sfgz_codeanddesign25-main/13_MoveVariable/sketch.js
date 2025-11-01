let posX = 0

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  noStroke();

  rect(posX, height / 2 - 25, 50, 50);

  //posX = posX + 2;

  if (posX < width - 50) {
    posX = posX + 2;
  }
}
