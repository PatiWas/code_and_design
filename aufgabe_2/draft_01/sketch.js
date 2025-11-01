
// Arrays to store positions of each ellipse
let xPositions = [];
let yPositions = [];
// Rotation state
let rotAngles = [];
let rotSpeeds = [];
const numEllipses = 50;
const easing = 0.2; // Controls how smooth the following motion is (0-1)

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Use HSB so we can easily create a rainbow gradient
  colorMode(HSB, 360, 100, 100);
  // Use degrees for easier rotation control
  angleMode(DEGREES);
  // Initialize all ellipses at the center
  for (let i = 0; i < numEllipses; i++) {
    xPositions[i] = width/2;
    yPositions[i] = height/2;
    rotAngles[i] = random(0, 360);
    // Give each ellipse a small random rotation speed (degrees/frame)
    rotSpeeds[i] = random(-2, 2);
  }
}

function draw() {
  background(0, 0, 0);  // background
  noFill();  // no fill
  
  // Update positions with smooth following
  for(let i = 0; i < numEllipses; i++) {
    let targetX, targetY;
    let randomOffsetX = random(-10, 10);
    let randomOffsetY = random(-10, 10);
    
    if (i === 0) {
      // First ellipse follows mouse
      targetX = mouseX + randomOffsetX;
      targetY = mouseY + randomOffsetY;
    } else {
      // Other ellipses follow the one in front of them
      targetX = xPositions[i-1] - 10 + randomOffsetX; // Keep 30 pixels spacing
      targetY = yPositions[i-1] + randomOffsetY;
    }
    
    // Smooth movement using linear interpolation
    xPositions[i] += (targetX - xPositions[i]) * easing;
    yPositions[i] += (targetY - yPositions[i]) * easing;
    
    // Calculate HSB color for this ellipse (rainbow)
    let progress = i / (numEllipses - 1); // 0 to 1
    let hue = lerp(1, 260, progress);
    stroke(hue, 100, 100);

    // Update rotation angle and draw rotated ellipse
    rotAngles[i] += rotSpeeds[i];
    push();
    translate(xPositions[i], yPositions[i]);
    rotate(rotAngles[i]);
    // draw centered at (0,0) because we've translated
    ellipse(0, 0, windowWidth, windowHeight);
    pop();
  }
}

/*function keyPressed(){
  if(key=='s'){
    saveCanvas('screenshot.png')
  }*/

