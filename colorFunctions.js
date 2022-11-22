function LABtoXYZ([l, a, b]) {

    const var_Y = (l + 16) / 116
    const var_X = a / 500 + var_Y
    const var_Z = var_Y - b / 200

    //D65/2° standard illuminant.
    var ref_X = 95.047;
    var ref_Y = 100;
    var ref_Z = 108.883;

    const [X, Y, Z] = [var_X, var_Y, var_Z]
        .map(n => Math.pow(n, 3) > 0.008856
            ? Math.pow(n, 3)
            : (n - 16 / 116) / 7.787)

    return [X * ref_X, Y * ref_Y, Z * ref_Z]
}

function XYZtoRGB([X, Y, Z]) {
    //X, Y and Z input refer to a D65/2° standard illuminant.

    let var_X = X / 100
    let var_Y = Y / 100
    let var_Z = Z / 100

    var var_R = var_X * 3.2406 + var_Y * -1.5372 + var_Z * -0.4986
    var var_G = var_X * -0.9689 + var_Y * 1.8758 + var_Z * 0.0415
    var var_B = var_X * 0.0557 + var_Y * -0.2040 + var_Z * 1.0570

    return [var_R, var_G, var_B]
        .map(n => n > 0.0031308
            ? 1.055 * Math.pow(n, (1 / 2.4)) - 0.055
            : 12.92 * n)
        .map(n => n)
}

function filterInvalidRGB([r, g, b]) {
    if (
        r < 0 || r > 1 || g < 0 || g > 1 || b < 0 || b > 1
    ) {
        return [0, 0, 0]
    }
    else {
        return [r, g, b]
    }
}

function colArrayToCol(arr) {
    if (arr.length == 3) {
        return color(arr[0], arr[1], arr[2])
    }
    else {
        return color(arr[0], arr[1], arr[2], arr[3])
    }
}

function LABtoRGB([l, a, b]) {
    return filterInvalidRGB(XYZtoRGB(LABtoXYZ([l, a, b])));
}