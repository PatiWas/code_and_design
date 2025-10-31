// create the Slider Parameters I want to control
let SizeSlider;
let DistanceSlider;
let DistanceSlider2
let HueSlider;

// here I set up the scene
function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  ellipseMode(CENTER);

  // this the slider to control the circle size
  SizeSlider = createSlider(10, 500, 100); // (min, max, defaultvalue, step)
  SizeSlider.position(20, 20); // (x, y)
  SizeSlider.style('width', '500px'); // (property, value (of said property))

  // this is the slider to control the distance apart, horizontally
  DistanceSlider = createSlider(-windowHeight, windowWidth / 2, 100);
  DistanceSlider.position(20, 50);
  DistanceSlider.style('width','500px');

  // this is the slider to control the distance apart, vertically
  DistanceSlider2 = createSlider(-windowHeight, windowWidth / 2, 100);
  DistanceSlider2.position(20, 80);
  DistanceSlider2.style('width','500px');

  // this is the slider to control hue blending
  HueSlider = createSlider(0, 255, 100);
  HueSlider.position(20, 110);
  HueSlider.style('width', '500px');
}

function draw() {
  background(255,0);

  // here we create values and which slider controls what
  let size = SizeSlider.value();
  let distance = DistanceSlider.value();
  let distance2 = DistanceSlider2.value();
  let hue = HueSlider.value();

  // here we create positions and where they be at
  let centerX = windowWidth / 2;
  let centerY = windowHeight / 2;

  // here is the transparent fill for the hue and position for left circle
  fill(255, hue, 0, 50); // red, green, blue, alpha(opacity?)/ the "hue" is mapped with the hueslider, so "blue"
  circle(centerX - distance, centerY-distance2, size);

  // here is the transparent fill for the hue and position for right circle
  fill(hue, 0, 255, 50); // hue, saturation, brightness, alpha
  circle(centerX + distance, centerY+distance2, size);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
