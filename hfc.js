var flickerSize, flickerFreq;
var col1, col2;
var luv2rgbLookupTable;
var rows;

function preload() {
  luv2rgbLookupTable = loadTable('LUV2RGB_lookup.csv', 'csv','header');
}

function setup() {
  initialize();
}

function initialize() {
  createCanvas(windowWidth, windowHeight);
  calculateSizes();
  colorMode(HSB, 1, 1, 1, 1);
  noStroke();
  noFill();
  rectMode(CENTER);
  textSize(30);
  textAlign(CENTER, CENTER);

  setFrameRate(50);
  flickerFreq = 30;

  rows = luv2rgbLookupTable.findRows('0.5', 'l');
  print(rows.length);
}

function luv2rgb(l, u, v){
  //function that uses the luv2rgb lookup table to find rgb form a luv input
}

function draw() {
  background(0.5);
  if (0.5 < round(0.5 + sin(PI * millis() * flickerFreq / 1000) / 2)) {
    fill(col1, 1, 1);
  }
  else {
    fill(col2, 1, 1);
  }
  ellipse(width * 0.5, height * 0.66, flickerSize, flickerSize);

  fill(col1, 1, 1);
  rect(width * 0.33, height * 0.33, flickerSize / 2, flickerSize / 2);
  fill(col2, 1, 1);
  rect(width * 0.66, height * 0.33, flickerSize / 2, flickerSize / 2);

  fill(1);
  text(flickerFreq + '\t' + round(frameRate()), width * 0.5, height * 0.33);

  col1 = map(mouseX, 0, width, 0, 1);
  col2 = map(mouseY, 0, height, 0, 1);
}

function windowResized() {
  createCanvas(windowWidth, windowHeight);
  calculateSizes();
}

function calculateSizes() {
  flickerSize = round(min(width, height) * 0.33);
}