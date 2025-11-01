let anzahl = 10;
let spaltenBreite;

function setup() {
  createCanvas(windowWidth, windowHeight);
  spaltenBreite=width/anzahl;
}

function draw() {
  background(0);
  noStroke();

  for(let i=0;i<anzahl;i=i+1){
    let distanz = dist(mouseX, mouseY, i*100, height/2);
    let maxDistanz = dist(0,0,width, height);
    let attract = map(distanz, 0, maxDistanz, 0.9, 0.1);

    ellipse(i*spaltenBreite+spaltenBreite/2,height*attract,spaltenBreite*attract,spaltenBreite*attract);
  }
}
