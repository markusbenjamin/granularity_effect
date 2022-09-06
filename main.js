var hgLayer, granularLayer;
var stimSize;
var barCenters;

var alma;

function setup() {
  createCanvas(windowWidth, windowHeight);

  calculateSizes();
  initialize();

  background(0.5);
}

function initialize() {
  colorMode(HSB, 1, 1, 1, 1);
  rectMode(CENTER);
  noFill();
  noStroke();

  hgLayer = createGraphics(stimSize, stimSize);
  hgLayer.colorMode(RGB, 1);
  hgLayer.noSmooth();
  hgLayer.rectMode(CENTER);
  hgLayer.background(1);
  barCenters = drawHermannGridToBuffer(7, 1 / 3, stimSize, color(0), color(1), color(1), stimSize * 0.5, stimSize * 0.5, true, hgLayer);
  //barCenters = shuffleArray(barCenters);
  buffer2BW(hgLayer, 1);

  granularLayer = createGraphics(stimSize, stimSize);
  granularLayer.colorMode(RGB, 1);
  granularLayer.noSmooth();
  granularLayer.rectMode(CENTER);
  granularLayer.background(1);

  var dotRatio = 0.25;
  var fillingRatio = 0.25;
  for (var i = 0; i < barCenters.length; i++) {
    if (random(1) < 0.5) {
      drawGranularMask(stimSize * 0.5, barCenters[i], stimSize, stimSize / 29, dotRatio, fillingRatio, granularLayer);
      drawGranularMask(barCenters[i], stimSize * 0.5, stimSize / 29, stimSize, dotRatio, fillingRatio, granularLayer);
    }
    else {
      drawGranularMask(barCenters[i], stimSize * 0.5, stimSize / 29, stimSize, dotRatio, fillingRatio, granularLayer);
      drawGranularMask(stimSize * 0.5, barCenters[i], stimSize, stimSize / 29, dotRatio, fillingRatio, granularLayer);
    }
  }
  buffer2BW(granularLayer, 0);
  //granularLayer.save("test.png");
}

function draw() {
  //background(0.5);
  //image(hgLayer, width * 0.5 - stimSize * 0.5, height * 0.5 - stimSize * 0.5);
  image(granularLayer, width * 0.5 - stimSize * 0.5, height * 0.5 - stimSize * 0.5);
}

function windowResized() {
  createCanvas(windowWidth, windowHeight);

  calculateSizes();
  initialize();
}

function calculateSizes() {
  stimSize = round(min(width, height) * 0.75);
}