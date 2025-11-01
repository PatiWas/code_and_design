
// Arrays to store positions of each ellipse
let xPositions = [];
let yPositions = [];
const numEllipses = 100;
const easing = 0.1; // Controls how smooth the following motion is (0-1)
const baseSize = 1000; // Original size for ellipses
let ellipseSize = baseSize; // Current size for ellipses
let isEnlarged = false; // Track if ellipses are currently enlarged


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
    
    // Calculate HSB color for this ellipse (rainbow)
    let progress = i / (numEllipses - 1); // 0 to 1
    let hue = lerp(1, 260, progress);
    stroke(hue, 100, 100);
    noFill();  // Remove fill
    
    ellipse(xPositions[i], yPositions[i], ellipseSize, ellipseSize);

    // Smooth movement using linear interpolation
    xPositions[i] += (targetX - xPositions[i]) * easing;
    yPositions[i] += (targetY - yPositions[i]) * easing;


  }
}

function mouseClicked() {
  if (!isEnlarged) {
    ellipseSize = baseSize + 500; // Increase to larger size
  } else {
    ellipseSize = baseSize; // Return to original size
  }
  isEnlarged = !isEnlarged; // Toggle the state
  console.log('Mouse clicked! New size:', ellipseSize);
  return false; // Prevent default behavior
}
