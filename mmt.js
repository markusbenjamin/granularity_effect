var flickerSize, flickerFreq;
var luminancePlanes, lumPlaneSize;

var mmtAreaSize, mmtFreq, mmtN, mmtStrokes;
var mmtMixedRects;


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
  imageMode(CENTER);
  textSize(30);
  textAlign(CENTER, CENTER);


  labVals = [[0.2, 0, 0], [0.8, 0,  0]];
  luminancePlanes = [
    generateLuminancePlane(labVals[0][0], lumPlaneSize),
    generateLuminancePlane(labVals[1][0], lumPlaneSize)
  ];
  activeColor = 1;


  setFrameRate(60);
  flickerFreq = 0;

  mmtFreq = 2;
  mmtN = 8;
  mmtStrokes = 6;
  setCols();
}

function draw() {
  flickerFreq = roundTo((frameRate() + flickerFreq) / 2, 5);

  background(0);

  runLuminancePlanes(width * 0.1, width * 0.1, activeColor);
  drawLuminancePlanes(width * 0.1, width * 0.1);
  //drawHfc(true);
  drawMmt(true);
}

function drawMmt(withInfo) {
  var mmtStroke = floor((millis() % (mmtStrokes * 1000 / mmtFreq)) / (1000 / mmtFreq));
  var mmtShift = [0, 0.5, 0, -0.5][mmtStroke]

  var n = mmtN;
  for (var i = 1; i <= n; i++) {
    if (mmtStroke == 0 || mmtStroke == 2) {
      fill(rgbCols[i % 2]);
      stroke(rgbCols[i % 2]);
      rect(
        map(
          i + mmtShift,
          1,
          n + 1,
          (width - mmtAreaSize) / 2 + 0.5 * mmtAreaSize / n,
          width - (width - mmtAreaSize) / 2 + 0.5 * mmtAreaSize / n
        ),
        height * 0.6,
        mmtAreaSize / n,
        mmtAreaSize / n
      );
    }
    else if (mmtStroke == 1 || mmtStroke == 3) {
      image(
        mmtMixedRects[i % 2],
        map(
          i + mmtShift,
          1,
          n + 1,
          (width - mmtAreaSize) / 2 + 0.5 * mmtAreaSize / n,
          width - (width - mmtAreaSize) / 2 + 0.5 * mmtAreaSize / n
        ),
        height * 0.6
      )
    }
  }
  noFill();
  noStroke();
}

function drawHfc(withInfo) {
  if (0.5 < round(0.5 + sin(PI * millis() * flickerFreq / 1000) / 2)) {
    fill(rgbCols[0], 1, 1);
  }
  else {
    fill(rgbCols[1], 1, 1);
  }
  ellipse(width * 0.5, height * 0.5, flickerSize, flickerSize);

  if (withInfo) {
    fill(1);
    text(flickerFreq + '\n' + round(frameRate()), width * 0.1, height * 0.9);
    fill(
      colArrayToCol(LABtoRGB([transpose(labVals).map(x => (x[0] + x[1]) / 2)].map(x => [100 * x[0], 128 * x[1], 128 * x[2]])[0]))
    );
  }
}

function generateMixedRect(w, h, lumOffset) {
  var mixedRectImg = createImage(w, h);

  mixedRectImg.loadPixels();
  for (var i = 0; i < w; i++) {
    for (var j = 0; j < h; j++) {
      var lstar = (labVals[(i + j) % 2][0] + lumOffset) * 100;
      var astar = labVals[(i + j) % 2][1] * 128;
      var bstar = labVals[(i + j) % 2][2] * 128;
      var [r, g, b] = LABtoRGB([lstar, astar, bstar]);
      writeColorToImage(mixedRectImg, i, j, r, g, b, 1);
    }
  }

  mixedRectImg.updatePixels();
  return mixedRectImg;
}

function windowResized() {
  createCanvas(windowWidth, windowHeight);
  calculateSizes();
}

function calculateSizes() {
  flickerSize = round(min(width, height) * 0.7);
  lumPlaneSize = round(min(width, height) * 0.33);
  mmtAreaSize = width * 1.2;
}

function setCols() {
  rgbCols = labVals.map(x => colArrayToCol(LABtoRGB([100 * x[0], 128 * x[1], 128 * x[2]])));
  mmtMixedRects = [
    generateMixedRect(mmtAreaSize / mmtN, mmtAreaSize / mmtN, 0.05),
    generateMixedRect(mmtAreaSize / mmtN, mmtAreaSize / mmtN, -0.05)
  ];
}

function drawLuminancePlanes(x, y) {
  image(luminancePlanes[0], x, y);
  image(luminancePlanes[1], width - x, y);

  strokeWeight(2);
  for (var c = 0; c < 2; c++) {
    if (c == activeColor) { stroke(1) } else { stroke(0.75) };
    fill(rgbCols[c]);
    ellipse(
      [0, 1][c] * width + [1, -1][c] * x + lumPlaneSize * 0.5 * labVals[c][1],
      y + lumPlaneSize * 0.5 * labVals[c][2],
      20, 20
    )
  }
  noStroke();
  noFill();
  strokeWeight(1);
}

function runLuminancePlanes(x, y, c) {
  if (mouseIsPressed) {
    if (
      c == 0 &&
      x - lumPlaneSize * 0.5 < mouseX &&
      mouseX < x + lumPlaneSize * 0.5 &&
      y - lumPlaneSize * 0.5 < mouseY &&
      mouseY < y + lumPlaneSize * 0.5
    ) {
      setActiveColor(
        map(mouseX, x - lumPlaneSize * 0.5, x + lumPlaneSize * 0.5, -1, 1),
        1
      );
      setActiveColor(
        map(mouseY, y - lumPlaneSize * 0.5, y + lumPlaneSize * 0.5, -1, 1),
        2
      );
    } else if (
      c == 1 &&
      width - x - lumPlaneSize * 0.5 < mouseX &&
      mouseX < width - x + lumPlaneSize * 0.5 &&
      y - lumPlaneSize * 0.5 < mouseY &&
      mouseY < y + lumPlaneSize * 0.5
    ) {
      setActiveColor(
        map(mouseX, width - x - lumPlaneSize * 0.5, width - x + lumPlaneSize * 0.5, -1, 1),
        1
      );
      setActiveColor(
        map(mouseY, y - lumPlaneSize * 0.5, y + lumPlaneSize * 0.5, -1, 1),
        2
      );
    }
  }
}

function generateLuminancePlane(l, size) {
  var lstar = 100 * l;

  var lumPlaneImg = createImage(size, size);
  lumPlaneImg.loadPixels();
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      var astar = map(i, 0, size, -128, 128);
      var bstar = map(j, 0, size, -128, 128);
      var [r, g, b] = LABtoRGB([lstar, astar, bstar]);
      writeColorToImage(lumPlaneImg, i, j, r, g, b, 1);
    }
  }

  lumPlaneImg.updatePixels();
  return lumPlaneImg;
}

function writeColorToImage(image, x, y, red, green, blue, alpha) {
  var index = (x + y * image.width) * 4;
  image.pixels[index] = 255 * red;
  image.pixels[index + 1] = 255 * green;
  image.pixels[index + 2] = 255 * blue;
  image.pixels[index + 3] = 255 * alpha;
}

function setActiveColor(val, coord) {
  labVals[activeColor][coord] = constrain(val, -1, 1);
  if (coord === 0) {
    luminancePlanes[activeColor] = generateLuminancePlane(labVals[activeColor][coord], lumPlaneSize);
  }
  setCols();
}

function changeActiveColor(change, coord) {
  labVals[activeColor][coord] = constrain(labVals[activeColor][coord] + change, -1, 1);
  if (coord === 0) {
    luminancePlanes[activeColor] = generateLuminancePlane(labVals[activeColor][coord], lumPlaneSize);
  }
  setCols();
}

function keyPressed() {
  if (key === 's') {
    changeActiveColor(0.01, 0);
  } else if (key === 'a') {
    changeActiveColor(-0.01, 0);
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