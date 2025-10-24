//variable table, these are the names of diverse variables that you can then use below
let durchmesser;
durchmesser=10;

let stop;
stop=40

let x, y;

function setup() {
  createCanvas(400, 400);
  //x=random(width);
  //y=random(height);
}

function draw() {
  background(220);

  // random x and y within the canvas
  let x = random(50, 100);
  let y = random(100, 50);
  
  fill(255, 0, 0);
  ellipse(x, y, durchmesser, durchmesser);

  fill(255, 0, 0);
  ellipse(x, y, durchmesser, durchmesser);

    // increase only if smaller than "stop" which is now 400
  if (durchmesser < stop) {
    durchmesser = durchmesser + 1;
  }
}
