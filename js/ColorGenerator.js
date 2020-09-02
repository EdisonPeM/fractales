class ColorGenerator {
    constructor() {
        this.gama = new Array(256).fill(0).map((e, index) => this.rgbToHex(index))
        this.colors = ["#000000"]
    }

    generateColors() {
        this.addColor(16, 1, 0, 0)
        this.addColor(16, 1, 1, 0)
        this.addColor(16, 0, 1, 0)
        this.addColor(16, 0, 1, 1)
        this.addColor(16, 1, 1, 1)

        return this.colors;
    }

    /**------- FUNCIONES -----------**/
    addColor(cantidad, r, g, b) {
        let base = this.colors[this.colors.length - 1]
        let salto = parseInt(256 / cantidad)
        if (256 % salto != 0) salto--;
        let element_red, element_green, element_blue
        for (let index = salto; index < this.gama.length; index += salto) {
            if (r) element_red = parseInt(base[1]) < 2 ? this.gama[index] : base.substr(1, 2)
            else element_red = parseInt(base[1]) < 2 ? base.substr(1, 2) : this.gama[this.gama.length - 1 - index]

            if (g) element_green = parseInt(base[3]) < 2 ? this.gama[index] : base.substr(3, 2)
            else element_green = parseInt(base[3]) < 2 ? base.substr(3, 2) : this.gama[this.gama.length - 1 - index]

            if (b) element_blue = parseInt(base[5]) < 2 ? this.gama[index] : base.substr(5, 2)
            else element_blue = parseInt(base[5]) < 2 ? base.substr(5, 2) : this.gama[this.gama.length - 1 - index]

            this.colors.push("#" + element_red + element_green + element_blue)
        }
    }
    /**------- FUNCION AUXILIAR -----------**/
    rgbToHex(rgb) {
        var hex = Number(rgb).toString(16);
        if (hex.length < 2) {
            hex = "0" + hex;
        }
        return hex;
    };

    rgb(r, g, b) {
        var red = this.rgbToHex(r);
        var green = this.rgbToHex(g);
        var blue = this.rgbToHex(b);
        return "#" + red + green + blue;
    };
}

export default ColorGenerator;