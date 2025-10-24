let XSlider;
let Yslider;
let HueSlider;

function setup (){
  createCanvas(windowWidth, windowHeight)

XSlider = createSlider (0, 255, 10)
XSlider.position (20,20);

YsliderSlider = createSlider (0, 255, 10)
YsliderSlider.position (20,40);

HueSlider = createSlider (0, 255, 10)
HueSlider.position (20,60);

}

function draw() {
  stroke(150,50,70)
  let xposition=XSlider.value();
  line(50,100)
}






/*let kreismitte;
let groesseSlider;
let moreCircles; 

function setup() {
  createCanvas(windowWidth, windowHeight)
 kreismitte = createSlider (0,windowWidth,50)
 kreismitte.position(50,50);
  
  groesseSlider = createSlider (0,255,10)
  groesseSlider.position(50,100);
  background(170,40,70)
  
  moreCircles = createSlider (0,255,10)
  moreCircles.position (50,75)
}

function draw() {
  stroke(150,50,70)
  let groesse=groesseSlider.value();
  ellipse(windowWidth/2-100, windowHeight/2, groesse)
  ellipse(windowWidth/2+100, windowHeight/2, groesse)

  stroke(150,50,70)
  let laenge kreismitte. value()
  ellipse(windowWidth/2, windowHeight/2, laenge)

  stroke(150,50,70)
  let laenge1=moreCircles. value();
  ellipse(windowWidth/2, windowHeight/2-100, laenge1)
  ellipse(windowWidth/2, windowHeight/2+100, laenge1)
}
/*