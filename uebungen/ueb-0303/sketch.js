let posX = 0;
let threshold;
let posY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  threshold = windowWidth/2;
}

function draw() {
  background(220);

  if(posX < threshold){
  fill(255,0,0)
  }else{
    fill(0,255,0)
  }

  if(frameCount % 10 == 0){
    posY = random(100);
  }

  rect(posX, posY, 50, 50)

  posX = posX + 1;

  //posY = random (windowHeight)
  // % ist Modulo

}
