import colorControl from './ColorControl.js'

class GradientGenerator {
    initialGradient = [{
            position: '10',
            color: '#ff0000'
        },
        {
            position: '40',
            color: '#ffff00'
        },
        {
            position: '70',
            color: '#00ff77'
        }
    ]

    constructor(mainElement) {
        this.mainElement = mainElement;
        this.initialGradient.forEach(obj => {
            let tempObj = colorControl.createNewControl(obj);
            this.mainElement.append(tempObj);
        })

        this.gradientColors = this.createGradientColors();
        this.cacheColorsElements = [];
        this.saveCache();

        this.insertColor = false;

        // Event Handler to Add New Color
        this.mainElement.addEventListener('click', (ev) => {
            if (this.insertColor) {
                let cantColors = this.gradientColors.length;

                let totalLenght = this.mainElement.getClientRects()[0].width;
                let newPosition = parseInt(ev.layerX * 100 / totalLenght);

                let newElements = this.gradientColors.map(el => el.parentEl)
                let indx = this.gradientColors.findIndex(el => el.positionEl.value > newPosition)
                indx = (indx === -1) ? cantColors : indx;

                let color1 = '#000000';
                let color2 = '#ffffff';

                if ((indx === cantColors) && (cantColors > 0)) {
                    color1 = this.gradientColors[cantColors - 1].getColor();
                } else if ((indx === 0) && (cantColors > 0)) {
                    color2 = this.gradientColors[0].getColor();
                } else {
                    color1 = this.gradientColors[indx - 1].getColor();
                    color2 = this.gradientColors[indx].getColor();
                }

                let newColor = colorControl.getIntermediateColor(color1, color2);
                let newElement = colorControl.createNewControl({
                    position: newPosition,
                    color: newColor
                })

                newElements.splice(indx, 0, newElement);
                this.updateElements(newElements);

                this.mainElement.classList.remove('add-new');
                this.insertColor = false;
            }
        })
    }

    createGradiant(size = 100) {
        let colors = [{
                color: '#000000',
                position: 0
            },
            ...this.gradientColors.map(gc => {
                return {
                    color: gc.getColor(),
                    position: gc.getPosition()
                }
            }), {
                color: '#ffffff',
                position: 100
            }
        ];

        let response = [];
        for (let i = 0; i < colors.length - 1; i++) {
            const color1 = colors[i];
            const color2 = colors[i + 1];

            let cantSubColors = size * (color2.position - color1.position) / 100

            if (cantSubColors > 0) {
                if (i === 0) response.push(color1.color);

                let color1RGB = colorControl.hexToRGb(color1.color);
                let color2RGB = colorControl.hexToRGb(color2.color);

                let deltaRGB = {
                    red: parseInt((color2RGB.red - color1RGB.red) / cantSubColors),
                    green: parseInt((color2RGB.green - color1RGB.green) / cantSubColors),
                    blue: parseInt((color2RGB.blue - color1RGB.blue) / cantSubColors)
                };

                for (let sc = 1; sc <= cantSubColors; sc++) {
                    let nextColor = {
                        red: color1RGB.red + sc * deltaRGB.red,
                        green: color1RGB.green + sc * deltaRGB.green,
                        blue: color1RGB.blue + sc * deltaRGB.blue
                    };
                    response.push(colorControl.rgbToHex(nextColor));
                }

                response.push(color2.color);
            }
        }

        return response
    }

    createGradientColors() {
        let elements = this.mainElement.getElementsByClassName('gradient-color');
        let gcs = [...elements].map(color => {
            let gc = new colorControl(color)
            this.configListeners(gc);
            return gc;
        })

        this.updatePositionsLimits(gcs);
        this.setGradientBg(this.mainElement, gcs);

        return gcs;
    }

    configListeners(gc) {
        gc.setDeleteClick(() => {
            this.mainElement.removeChild(gc.getParent());
            this.gradientColors = this.createGradientColors();
            this.setGradientBg(this.mainElement, this.gradientColors);
        });

        gc.setPositionInput(() => {
            this.updatePositionsLimits(this.gradientColors);
            this.setGradientBg(this.mainElement, this.gradientColors);
        });

        gc.setValueInput(() => {
            gc.changeBg();
            this.setGradientBg(this.mainElement, this.gradientColors);
        });
    }

    updateElements(newElements) {
        this.gradientColors.forEach(gc => {
            this.mainElement.removeChild(gc.parentEl);
        })
        newElements.forEach(el => this.mainElement.appendChild(el))

        this.gradientColors = this.createGradientColors();
        this.updatePositionsLimits(this.gradientColors);
        this.setGradientBg(this.mainElement, this.gradientColors);
    }

    updateAllPositions() {
        this.gradientColors.forEach(c => c.changePosition())
    }

    updatePositionsLimits(gcs) {
        let minlimit = 0;
        let maxlimit = 100;
        gcs.forEach((gc, indx) => {
            let hasNext = (indx + 1 !== gcs.length)
            if (hasNext) {
                maxlimit = gcs[indx + 1].getPosition();
            } else {
                maxlimit = 100;
            }

            gc.setPositionLimits(minlimit, maxlimit);
            minlimit = gc.getPosition();
        })
    }

    saveCache() {
        this.cacheColorsElements = this.gradientColors.map(gc => gc.parentEl);
    }

    addNewColor() {
        this.insertColor = true;
        this.mainElement.classList.add('add-new');
    }

    cancelNewColors() {
        this.insertColor = false;
        this.mainElement.classList.remove('add-new');
        this.updateElements(this.cacheColorsElements);
    }

    acceptChangedColors() {
        this.insertColor = false;
        this.mainElement.classList.remove('add-new');
        this.saveCache()
    }

    setGradientBg(element, gcs) {
        element.style.border = '1px solid #aaa';
        element.style.background = `
        linear-gradient(to right, 
            #000000 0%,
            ${gcs.length > 0 ?
                gcs.map(gc => `${gc.getColor()} ${gc.getPosition()}%`).join(",") + ','
                : ''
            }
            #ffffff 100%
        )`;
    }
}

export default GradientGenerator;