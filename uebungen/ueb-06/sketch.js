
function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
 
  background(0, 50);
  noFill();
  stroke(255);

  for (let i = 0; i < 10; i++) {
  // plan: y position ist abhängig von distanz von maus zur mitte
    let distanz = dist(mouseX, mouseY, i*200, height/2);
    let yPos = map(distanz, 0, width, 0, 300);
    ellipse(i*200, height/2 - yPos,200,200); 
  }

 /* background(220);

// plan: durchmesser der ellipse abhängig von distanz der maus
  let durchmesser;
// distanz des zentrums der ellipse zur maus messen
  let distanz = dist(mouseX, mouseY, width/2, height/2);
  durchmesser = map(distanz, 0, width/2, 10, windowHeight)
  
  ellipse(width/2, height/2, durchmesser, durchmesser);
  */



}
