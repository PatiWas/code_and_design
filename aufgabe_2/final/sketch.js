

// Array to store points
let points = [];
// Track which point is being dragged
let selectedPoint = null;
// Maximum distance for connecting lines
const MAX_DISTANCE = 300;
// Wobble settings
const WOBBLE_AMOUNT = 5;
const WOBBLE_SPEED = 0.02;

function setup() {
  // Create canvas and set background
  createCanvas(windowWidth, windowHeight);
  background(0);
  
  // Set color mode to HSB for rainbow colors
  colorMode(HSB);
  strokeWeight(2);
}

function draw() {
  // Reset background each frame
  background(0);
  
  // Draw filled shapes and connections between points
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      // Calculate distance between points
      let d = dist(points[i].x, points[i].y, points[j].x, points[j].y);
      
      // Only draw if points are within MAX_DISTANCE
      if (d < MAX_DISTANCE) {
        // For closer points, create filled shape
        if (d < MAX_DISTANCE * 0.5) {
          // Find a third point to create a triangle
          for (let k = j + 1; k < points.length; k++) {
            let d2 = dist(points[j].x, points[j].y, points[k].x, points[k].y);
            let d3 = dist(points[i].x, points[i].y, points[k].x, points[k].y);
            
            if (d2 < MAX_DISTANCE * 0.5 && d3 < MAX_DISTANCE * 0.5) {
              // Create random fill color
              noStroke();
              fill(random(360), 70, 100, 0.3); // Lower opacity for blend effect
              
              // Draw triangle between three points
              beginShape();
              vertex(points[i].x, points[i].y);
              vertex(points[j].x, points[j].y);
              vertex(points[k].x, points[k].y);
              endShape(CLOSE);
            }
          }
        }
        
        // Draw connecting lines
        stroke(map(d, 0, MAX_DISTANCE, 0, 360), 100, 100);
        strokeWeight(2);
        line(points[i].x, points[i].y, points[j].x, points[j].y);
      }
    }
  }
  
  // Update and draw points with wobble
  noStroke();
  for (let point of points) {
    if (point === selectedPoint) {
      // Selected point is yellow
      fill(60, 100, 100);
    } else {
      // Normal points are white
      fill(255);
      // Only wobble points that aren't selected
      point.x = point.baseX + sin(frameCount * WOBBLE_SPEED + point.offset) * WOBBLE_AMOUNT;
      point.y = point.baseY + cos(frameCount * WOBBLE_SPEED + point.offset) * WOBBLE_AMOUNT;
    }
    circle(point.x, point.y, 50);
  }
}

// When mouse is pressed
function mousePressed() {
  // Check if we clicked near any existing point
  for (let point of points) {
    let d = dist(mouseX, mouseY, point.x, point.y);
    if (d < 25) { // Increased click area to half the circle size
      selectedPoint = point;
      return;
    }
  }
  
  // If we didn't click on any point, create a new one
  points.push({ 
    x: mouseX, 
    y: mouseY,
    baseX: mouseX, // Store original position
    baseY: mouseY,
    offset: random(1000) // Random starting point for wobble
  });
}

// When mouse is dragged
function mouseDragged() {
  if (selectedPoint) {
    // Update position if a point is selected
    selectedPoint.x = mouseX;
    selectedPoint.y = mouseY;
    selectedPoint.baseX = mouseX;
    selectedPoint.baseY = mouseY;
  }
}

// When mouse is released
function mouseReleased() {
  // Deselect point when mouse is released
  selectedPoint = null;
}

// Function to handle window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
