var luminancePlane;

function setup() {
    createCanvas(500, 500);
    colorMode(RGB, 1, 1, 1, 1);

    drawLuminancePlane();
}

function drawLuminancePlane() {
    drawLuminancePlane = createImage(250, 250); // same as new p5.Image(100, 100);
    
    drawLuminancePlane.loadPixels();
    for (var y = 0; y < 250; y++) {
        for (x = 0; x < 250; x++) {
            var red = random(1);
            var green = random(1);
            var blue = random(1);
            var alpha = 1;
            writeColorToImage(drawLuminancePlane, x, y, red, green, blue, alpha);
        }
    }
    drawLuminancePlane.updatePixels();
}

function draw() {
    background(0.5);
    image(drawLuminancePlane, 100, 100);
}

function writeColorToImage(image, x, y, red, green, blue, alpha) {
    var index = (x + y * width) * 4;
    image.pixels[index] = 255*red;
    image.pixels[index + 1] = 255*green;
    image.pixels[index + 2] = 255*blue;
    image.pixels[index + 3] = 255*alpha;
}