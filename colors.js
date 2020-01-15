//*
var colors = []
gama = new Array(256).fill(0)
gama = gama.map((element, index) => {
    return rgbToHex(index)
})

for (let index = 0; index < gama.length; index += 16) {
    let inverse_element = gama[gama.length - index - 1]
    let element = gama[index]
    colors.push("#" + element + "0000")
}

for (let index = 0; index < gama.length / 2; index += 4) {
    let inverse_element = gama[gama.length - index - 1]
    let element = gama[index]
    colors.push("#FF" + element + "00")
}
for (let index = gama.length / 2; index < gama.length; index++) {
    let inverse_element = gama[gama.length - index - 1]
    let element = gama[index]
    colors.push("#FF" + element + "00")
}

for (let index = 0; index < gama.length; index++) {
    let inverse_element = gama[gama.length - index - 1]
    let element = gama[index]
    colors.push("#FFFF" + element)
}
colors.push("#FFFFFF")
//color = colors.reverse()

function rgbToHex(rgb) {
    var hex = Number(rgb).toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
};

function rgb(r, g, b) {
    var red = rgbToHex(r);
    var green = rgbToHex(g);
    var blue = rgbToHex(b);
    return "#" + red + green + blue;
};
