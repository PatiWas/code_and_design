

// array for points
let points = [];
// selected point, null = no value
let selectedPoint = null;

// constant value -> cannot be changed
// Maximum distance for connecting lines + wobble effect
const MAX_DISTANCE = 400;
const WOBBLE_AMOUNT = 5;
const WOBBLE_SPEED = 0.02;

function setup() {
  
  createCanvas(windowWidth, windowHeight);
  background(0);

  colorMode(HSB);
  strokeWeight(0);
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
        if (d < MAX_DISTANCE) {
          // Find a third point to create a triangle
          for (let k = j + 1; k < points.length; k++) {
            let d2 = dist(points[j].x, points[j].y, points[k].x, points[k].y);
            let d3 = dist(points[i].x, points[i].y, points[k].x, points[k].y);
            // fill the triangle
            if (d2 < MAX_DISTANCE & d3 < MAX_DISTANCE) {
              noStroke();
              fill(0);
              
              // vertext to draw the triangle between the three points
              beginShape();
              vertex(points[i].x, points[i].y);
              vertex(points[j].x, points[j].y);
              vertex(points[k].x, points[k].y);
              endShape(CLOSE);
            }
          }
        }
        
        // connect lines
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
      noFill();
      stroke(255);
    } else {
        fill(255);
      // wobble effect, do not wobble point selected
        point.x = point.baseX + sin(frameCount * WOBBLE_SPEED + point.offset) * WOBBLE_AMOUNT;
        point.y = point.baseY + cos(frameCount * WOBBLE_SPEED + point.offset) * WOBBLE_AMOUNT;
    
      }
    circle(point.x, point.y, 40);
  }
}

// if mouse is pressed
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
    baseX: mouseX,
    baseY: mouseY,
    offset: random(2000) // Random starting point for wobbling
  });
}

// When mouse is dragged
function mouseDragged() {
  if (selectedPoint) {
    // Update position if point is selected
    selectedPoint.x = mouseX;
    selectedPoint.y = mouseY;
    selectedPoint.baseX = mouseX;
    selectedPoint.baseY = mouseY;
  }
}

// When mouse is released
function mouseReleased() {
selectedPoint = null;
}

// window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

}

