class colorControl {
    constructor(element) {
        this.parentEl = element;
        this.deleteEl = element.children[0];
        this.positionEl = element.children[1];
        this.valueEl = element.children[2];

        // Update Element view
        this.changeBg();
        this.changePosition();

        // Add Elements basic Listeners
        this.positionEl.addEventListener('input', function (ev) {
            if (+this.value < +this.dataset.min)
                this.value = this.dataset.min;

            if (+this.value > +this.dataset.max)
                this.value = this.dataset.max;
        });

        this.positionEl.addEventListener('input', () => {
            this.changePosition();
        });

        this.valueEl.addEventListener('input', () => {
            this.changeBg();
        });
    }

    // Getters
    getParent() {
        return this.parentEl;
    }

    getColor() {
        return this.valueEl.value;
    }

    getPosition() {
        return +this.positionEl.value;
    }

    // Setters
    setDeleteClick(action) {
        this.deleteEl.onclick = action;
    }

    setPositionInput(action) {
        this.positionEl.oninput = action;
    }

    setValueInput(action) {
        this.valueEl.oninput = action;
    }

    setPositionLimits(minlimit, maxlimit) {
        this.positionEl.dataset.min = minlimit;
        this.positionEl.dataset.max = maxlimit;
    }

    // Inherit Actions
    changeBg() {
        let color = this.valueEl.value
        this.deleteEl.style.setProperty("--gb-color", color)
        this.deleteEl.style.setProperty("--color", colorControl.getCorrectTextColor(color));

        this.positionEl.style.setProperty("--gb-color", color)
        this.positionEl.style.setProperty("--color", colorControl.getCorrectTextColor(color));
    }

    changePosition() {
        let pos = this.positionEl.value
        let totalLenght = this.positionEl.getClientRects()[0].width;
        let left = `${(totalLenght - 15) * pos / 100 + 15/2}px`;

        this.deleteEl.style.left = left;
        this.valueEl.style.left = left;
    }

    // Static Utilities
    static createNewControl({
        position,
        color
    }) {
        let gradientColor = document.createElement('div')
        gradientColor.className = "gradient-color"
        gradientColor.innerHTML = `
            <button class="color-delete">X</button>
            <input class="color-position" type="range" value="${position}" min="0" max="100" step="1">
            <input class="color-value" type="color" value="${color}">
        `
        return gradientColor
    }

    static getIntermediateColor(hex1, hex2) {
        let rgb1 = colorControl.hexToRGb(hex1);
        let rgb2 = colorControl.hexToRGb(hex2);

        let newRGB = colorControl.getIntermediateColorRGB(rgb1, rgb2);

        return colorControl.rgbToHex(newRGB);
    }

    static getIntermediateColorRGB(rgb1, rgb2) {
        return {
            red: parseInt((rgb2.red + rgb1.red) / 2),
            green: parseInt((rgb2.green + rgb1.green) / 2),
            blue: parseInt((rgb2.blue + rgb1.blue) / 2),
        };
    }


    // https://codepen.io/davidhalford/pen/ywEva?editors=0010
    static getCorrectTextColor(hex) {
        let threshold = 130; /* about half of 256. Lower threshold equals more dark text on dark background  */

        let {
            red,
            green,
            blue,
        } = colorControl.hexToRGb(hex);

        let cBrightness = (red * 299 + green * 587 + blue * 114) / 1000;
        if (cBrightness > threshold) {
            return "#000000";
        } else {
            return "#ffffff";
        }
    }

    static hexToRGb(hex) {
        function cutHex(h) {
            return h.charAt(0) == "#" ? h.substring(1, 7) : h;
        }

        let red = parseInt(cutHex(hex).substring(0, 2), 16);
        let green = parseInt(cutHex(hex).substring(2, 4), 16);
        let blue = parseInt(cutHex(hex).substring(4, 6), 16);

        return {
            red,
            green,
            blue
        }
    }

    static rgbToHex(rgb) {
        let r = rgb.red.toString(16);
        let g = rgb.green.toString(16);
        let b = rgb.blue.toString(16);

        if (r.length == 1) r = "0" + r;
        if (g.length == 1) g = "0" + g;
        if (b.length == 1) b = "0" + b;

        return "#" + r + g + b;
    }
}

export default colorControl;