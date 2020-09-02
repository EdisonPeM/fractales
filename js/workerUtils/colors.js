var gama = new Array(256).fill(0).map((e, index) => rgbToHex(index))

var colors
cambiar_colores()

function cambiar_colores() {
    colors = ["#000000"]

    let first_tam = ""; // document.getElementById("first_tam").value
    let second_tam = "" // document.getElementById("second_tam").value
    let third_tam = "" // document.getElementById("third_tam").value
    let fourth_tam = "" // document.getElementById("fourth_tam").value
    let fifth_tam = "" // document.getElementById("fifth_tam").value

    agregar("Rojo", first_tam == "" ? 16 : first_tam - 0)
    agregar("Amarillo", second_tam == "" ? 16 : second_tam - 0)
    agregar("Verde", third_tam == "" ? 16 : third_tam - 0)
    agregar("Cyan", fourth_tam == "" ? 16 : fourth_tam - 0)
    agregar("Blanco", fifth_tam == "" ? 16 : fifth_tam - 0)
}

/**------- FUNCIONES -----------**/
function agregar(color, cantidad = 16) {
    if (color === "Rojo")
        generic(cantidad, 1, 0, 0)
    if (color === "Amarillo")
        generic(cantidad, 1, 1, 0)
    if (color === "Verde")
        generic(cantidad, 0, 1, 0)
    if (color === "Cyan")
        generic(cantidad, 0, 1, 1)
    if (color === "Azul")
        generic(cantidad, 0, 0, 1)
    if (color === "Violeta")
        generic(cantidad, 1, 0, 1)
    if (color === "Blanco")
        generic(cantidad, 1, 1, 1)
}

function generic(cantidad, r, g, b) {
    let base = colors[colors.length - 1]
    let salto = parseInt(256 / cantidad)
    if (256 % salto != 0) salto--;
    let element_red, element_green, element_blue
    for (let index = salto; index < gama.length; index += salto) {
        if (r) element_red = parseInt(base[1]) < 2 ? gama[index] : base.substr(1, 2)
        else element_red = parseInt(base[1]) < 2 ? base.substr(1, 2) : gama[gama.length - 1 - index]

        if (g) element_green = parseInt(base[3]) < 2 ? gama[index] : base.substr(3, 2)
        else element_green = parseInt(base[3]) < 2 ? base.substr(3, 2) : gama[gama.length - 1 - index]

        if (b) element_blue = parseInt(base[5]) < 2 ? gama[index] : base.substr(5, 2)
        else element_blue = parseInt(base[5]) < 2 ? base.substr(5, 2) : gama[gama.length - 1 - index]

        colors.push("#" + element_red + element_green + element_blue)
    }
}
/**------- FUNCION AUXILIAR -----------**/
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