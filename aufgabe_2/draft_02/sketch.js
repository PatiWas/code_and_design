
// Arrays to store positions of each ellipse
let xPositions = [];
let yPositions = [];
const numEllipses = 50;
const easing = 0.2; // Controls how smooth the following motion is (0-1)


function setup() {
  createCanvas(windowWidth, windowHeight);
  // Use HSB so we can easily create a rainbow gradient
  colorMode(HSB, 360, 100, 100);
  // Use degrees for easier rotation control
  for (let i = 0; i < numEllipses; i++) {
    xPositions[i] = width/2;
    yPositions[i] = height/2;
  }
}

function draw() {
  background(HSB, 0,0,255);  // background

  
  // Update positions with smooth following
  for(let i = 0; i < numEllipses; i++) {
    let targetX, targetY;
    let randomOffsetX = random(-5, 5);
    let randomOffsetY = random(-5, 5);
    
    if (i === 0) {
      // First ellipse follows mouse
      targetX = mouseX + randomOffsetX;
      targetY = mouseY + randomOffsetY;
    } else {
      // Other ellipses follow the one in front of them
      targetX = xPositions[i-1] - 10 + randomOffsetX; // Keep 30 pixels spacing
      targetY = yPositions[i-1] + randomOffsetY;
    }
    
ellipse(xPositions[i], yPositions[i], 1000, 1000);

    // Smooth movement using linear interpolation
    xPositions[i] += (targetX - xPositions[i]) * easing;
    yPositions[i] += (targetY - yPositions[i]) * easing;
    
    // Calculate HSB color for this ellipse (rainbow)
    let progress = i / (numEllipses - 1); // 0 to 1
    let hue = lerp(1, 260, progress);
    let oppositeHue = (hue + 180) % 360;  // Calculate opposite hue
    stroke(hue, 100, 100);
    fill(oppositeHue, 100, 100);  // Fill with opposite color


  }
}

