var flickerSize, flickerFreq;
var luminancePlane, lumPlaneSize;
var lum;
var activeColor;
var labVals;
var rgbCols;

function setup() {
  initialize();
}

function initialize() {
  createCanvas(windowWidth, windowHeight);
  calculateSizes();
  colorMode(RGB, 1, 1, 1, 1);
  noStroke();
  noFill();
  rectMode(CENTER);
  textSize(30);
  textAlign(CENTER, CENTER);

  setFrameRate(60);
  flickerFreq = 60;

  lum = 0.5;
  generateLuminancePlane(lum, lumPlaneSize);
  activeColor = 1;
  labVals = [[lum, 0, 0.2], [lum, 0, -0.2]];
  setCols();
}

function draw() {
  background(0.5);
  drawLuminancePlane(width * 0.13, width * 0.13);

  if (0.5 < round(0.5 + sin(PI * millis() * flickerFreq / 1000) / 2)) {
    fill(rgbCols[0], 1, 1);
  }
  else {
    fill(rgbCols[1], 1, 1);
  }
  ellipse(width * 0.5, height * 0.66, flickerSize, flickerSize);

  strokeWeight(4);
  if (activeColor == 0) {
    stroke(1);
  }
  fill(rgbCols[0], 1, 1);
  rect(width * 0.33, height * 0.33, flickerSize / 2, flickerSize / 2);
  noStroke();
  if (activeColor == 1) {
    stroke(1);
  }
  fill(rgbCols[1], 1, 1);
  rect(width * 0.66, height * 0.33, flickerSize / 2, flickerSize / 2);
  noStroke();
  strokeWeight(1);

  fill(1);
  text(flickerFreq + '\t' + round(frameRate()), width * 0.5, height * 0.33);

  flickerFreq = round(map(mouseX, 0, width, 1, 2)) * 30;
}

function windowResized() {
  createCanvas(windowWidth, windowHeight);
  calculateSizes();
}

function calculateSizes() {
  flickerSize = round(min(width, height) * 0.33);
  lumPlaneSize = round(min(width, height) * 0.5);
}

function setCols() {
  rgbCols = labVals.map(x => colArrayToCol(LABtoRGB([100 * x[0], 128 * x[1], 128 * x[2]])));
}

function drawLuminancePlane(x, y) {
  image(luminancePlane, x - lumPlaneSize / 2, y - lumPlaneSize / 2);

  fill(1);
  ellipse(
    x + lumPlaneSize * 0.5 * labVals[activeColor][1],
    y + lumPlaneSize * 0.5 * labVals[activeColor][2],
    10, 10
  )
}

function generateLuminancePlane(l, size) {
  luminancePlane = createImage(size, size);
  var lstar = 100 * l;
  luminancePlane.loadPixels();
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      var astar = map(i, 0, size, -128, 128);
      var bstar = map(j, 0, size, -128, 128);
      var [r, g, b] = LABtoRGB([lstar, astar, bstar]);
      writeColorToImage(luminancePlane, i, j, r, g, b, 1);
    }
  }

  luminancePlane.updatePixels();
}

function writeColorToImage(image, x, y, red, green, blue, alpha) {
  var index = (x + y * image.width) * 4;
  image.pixels[index] = 255 * red;
  image.pixels[index + 1] = 255 * green;
  image.pixels[index + 2] = 255 * blue;
  image.pixels[index + 3] = 255 * alpha;
}

function changeLuminance(change) {
  lum = constrain(lum + change, 0, 1);
  labVals = labVals.map(x => [lum, x[1], x[2]]);
  setCols();
  generateLuminancePlane(lum, lumPlaneSize)
}

function changeActiveColor(change, aOrB) {
  labVals[activeColor][aOrB] = constrain(labVals[activeColor][aOrB] + change, -1, 1);
  setCols();
}

function keyPressed() {
  if (key === 's') {
    changeLuminance(0.01);
  } else if (key === 'a') {
    changeLuminance(-0.01);
  } else if (key === ' ') {
    activeColor = (activeColor + 1) % 2;
  } else if (keyCode === UP_ARROW) {
    changeActiveColor(-0.01, 2);
  } else if (keyCode === DOWN_ARROW) {
    changeActiveColor(0.01, 2);
  } else if (keyCode === LEFT_ARROW) {
    changeActiveColor(-0.01, 1);
  } else if (keyCode === RIGHT_ARROW) {
    changeActiveColor(0.01, 1);
  }
}