function sumArray(array) {
    return array.reduce((a, b) => a + b, 0);
}

function numFreqArray(array, num) {
    var flatArray = array.flat();
    return flatArray.filter(v => v === num).length / flatArray.length;
}

function getAllIndices(array, val) {
    var indices = [];
    var i = -1;
    while ((i = array.indexOf(val, i + 1)) != -1) {
        indices.push(i);
    }
    return indices;
}

function getAllIndices2D(array, val) {
    var indices = [];
    for (var i = 0; i < array.length; i++) {
        var tempIndices = getAllIndices(array[i], val);
        for (var j = 0; j < tempIndices.length; j++) {
            indices.push([i, tempIndices[j]]);
        }
    }
    return indices;
}

function getEveryNthElement(array, n) {
    return array.filter(function (value, index, Arr) {
        return index % n == 0;
    });
}

function breakup1DArray(array, n) {
    const newArray = [];
    while (array.length) newArray.push(array.splice(0, n));
    return newArray;
}

function uintArrayToNormalArray(array) {
    return Array.prototype.slice.call(array);
}

function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}