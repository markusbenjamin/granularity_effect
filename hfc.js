var flickerSize;

function setup() {
  createCanvas(windowWidth, windowHeight);

  background(0.5);
}

function initialize() {
  colorMode(HSB, 1, 1, 1, 1);
  calculateSizes();
}

function draw() {
    background(0.5);
    fill(millis()/100000,1,1);
    ellipse(width*0.5, height*0.5, flickerSize, flickerSize);
}

function windowResized() {
  createCanvas(windowWidth, windowHeight);

  initialize();
}

function calculateSizes() {
    flickerSize = round(min(width, height) * 0.25);
}