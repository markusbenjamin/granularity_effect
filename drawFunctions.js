function drawHermannGridToBuffer(n, r, gS, bC, vC, hC, x, y, hOnV, buffer) {
    var sW = (r / (1 + r)) * (1 / n);
    var bW = (1 / (1 + r)) * (1 / n);
    var shrink = 1 / ((n + 1) * sW + n * bW);

    var coords = [];
    for (var i = 1; i <= n + 1; i++) {
        coords.push(sW * (i - 1) + bW * (i - 1) - 0.5);
    }

    buffer.fill(bC);
    buffer.rect(x, y, gS, gS);
    buffer.noFill();

    var barCenters = [];

    if (hOnV) {
        buffer.fill(vC);
        buffer.stroke(vC);
        for (var i = 1; i <= n + 1; i++) {
            buffer.beginShape();
            buffer.vertex(x + gS * shrink * (coords[i - 1] + sW / 2), y + gS * shrink * (-0.5 + sW / 2 - sW));
            buffer.vertex(x + gS * shrink * (coords[i - 1] - sW / 2), y + gS * shrink * (-0.5 + sW / 2 - sW));
            buffer.vertex(x + gS * shrink * (coords[i - 1] - sW / 2), y + gS * shrink * (0.5 + sW / 2));
            buffer.vertex(x + gS * shrink * (coords[i - 1] + sW / 2), y + gS * shrink * (0.5 + sW / 2));
            buffer.endShape(CLOSE);

            barCenters.push(x + gS * shrink * (coords[i - 1]));
        }
    }

    buffer.fill(hC);
    buffer.stroke(hC);
    for (var i = 1; i <= n + 1; i++) {
        buffer.beginShape();
        buffer.vertex(x + gS * shrink * (-0.5 - sW / 2), y + gS * shrink * (coords[i - 1] - sW / 2));
        buffer.vertex(x + gS * shrink * (-0.5 - sW / 2), y + gS * shrink * (coords[i - 1] + sW / 2));
        buffer.vertex(x + gS * shrink * (0.5 + sW / 2), y + gS * shrink * (coords[i - 1] + sW / 2));
        buffer.vertex(x + gS * shrink * (0.5 + sW / 2), y + gS * shrink * (coords[i - 1] - sW / 2));
        buffer.endShape(CLOSE);
    }

    if (hOnV == false) {
        buffer.fill(vC);
        buffer.stroke(vC);
        for (var i = 1; i <= n + 1; i++) {
            buffer.beginShape();
            buffer.vertex(x + gS * shrink * (coords[i - 1] + sW / 2), y + gS * shrink * (-0.5 + sW / 2 - sW));
            buffer.vertex(x + gS * shrink * (coords[i - 1] - sW / 2), y + gS * shrink * (-0.5 + sW / 2 - sW));
            buffer.vertex(x + gS * shrink * (coords[i - 1] - sW / 2), y + gS * shrink * (0.5 + sW / 2));
            buffer.vertex(x + gS * shrink * (coords[i - 1] + sW / 2), y + gS * shrink * (0.5 + sW / 2));
            buffer.endShape(CLOSE);
        }
    }

    buffer.noFill();
    buffer.noStroke();

    return barCenters;
}

function buffer2BW(buffer, mode) {
    buffer.loadPixels();
    for (var i = 0; i < buffer.width; i++) {
        for (var j = 0; j < buffer.height; j++) {
            var pixel = buffer.get(i, j);
            if (mode == 0) {
                buffer.set(i, j, color(floor(pixel[0] / 255)));
            }
            else if (mode == 1) {
                buffer.set(i, j, color(ceil(pixel[0] / 255)));
            }
        }
    }
    buffer.updatePixels();
}

function partOfBufferToArray(buffer, x, y, w, h) {
    var bufferPartAsImage = buffer.get(x, y, w, h);
    bufferPartAsImage.loadPixels();
    return breakup1DArray(uintArrayToNormalArray(getEveryNthElement(bufferPartAsImage.pixels, 4)), h);
}

function howManyIterations(dotRatio, fillingRatio) {
    return round((-37.5484 - 36.181 * pow(dotRatio, 1.9948)) * log(1 - fillingRatio) / pow(dotRatio, 1.9948));
}

function drawGranularMask(x, y, w, h, dotRatio, fillingRatio, buffer) {
    var dotRadius = round(min(w, h)) * dotRatio * 0.5;

    buffer.loadPixels();
    var tempArray = partOfBufferToArray(buffer, round(x - w / 2), round(y - h / 2), round(w), round(h));

    var preRatio = 1 - numFreqArray(tempArray, 255);
    var counterStart = 0;

    var preIterationsEquivalent = howManyIterations(dotRatio, preRatio);

    var startIterations = round(0.9 * (howManyIterations(dotRatio, fillingRatio) - howManyIterations(dotRatio, preRatio)));

    for (var n = 0; n < 0; n++) {
        var posX = round(random(w));
        var posY = round(random(h));

        for (var i = floor(-dotRadius); i <= ceil(dotRadius); i++) {
            for (var j = floor(-dotRadius); j <= ceil(dotRadius); j++) {
                if (
                    0 <= posX + i &&
                    posX + i < w &&
                    0 <= posY + j &&
                    posY + j < h &&
                    dist(0, 0, i, j) < dotRadius
                ) {
                    tempArray[posX + i][posY + j] = 0;
                }
            }
        }
        counterStart++;
    }

    var enRouteRatio = 1 - numFreqArray(tempArray, 255);
    var counterFinish = 0;

    //legyen egyszer definiált, globális dot points array a további gyorsítás érdekében

    while (1 - numFreqArray(tempArray, 255) < fillingRatio) {
        var posX = round(random(w));
        var posY = round(random(h));

        for (var i = floor(-dotRadius); i <= ceil(dotRadius); i++) {
            for (var j = floor(-dotRadius); j <= ceil(dotRadius); j++) {
                if (
                    0 <= posX + i &&
                    posX + i < w &&
                    0 <= posY + j &&
                    posY + j < h &&
                    dist(0, 0, i, j) < dotRadius
                ) {
                    tempArray[posX + i][posY + j] = 0;
                }
            }
        }
        counterFinish++;
    }

    var postRatio = 1 - numFreqArray(tempArray, 255);
    //console.log(preRatio + "\t" + enRouteRatio + "\t" + postRatio + "\t" + preIterationsEquivalent + "\t" + counterStart + "\t" + counterFinish + "\t" + (preIterationsEquivalent + counterStart + counterFinish));
    console.log(postRatio + "\t" + (preIterationsEquivalent + counterStart + counterFinish));

    var indices = getAllIndices2D(tempArray, 0);

    var col = color(random(0.25, 0.75));

    buffer.loadPixels();
    for (var i = 0; i < indices.length; i++) {
        buffer.set(
            round(x - w / 2) + indices[i][0],
            round(y - h / 2) + indices[i][1],
            col
        );
    }
    buffer.updatePixels();

    return tempArray;
}
