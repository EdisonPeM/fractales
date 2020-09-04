import colorControl from './ColorControl.js'

class GradientGenerator {
    mainElement = null;
    gradientColors = [];
    insertColor = false;

    cacheGradient = [];
    initialGradient = [{
            color: '#ff0000',
            position: '10'
        },
        {
            color: '#ffff00',
            position: '40'
        },
        {
            color: '#00ff77',
            position: '70'
        }
    ]

    constructor(mainElement) {
        this.mainElement = mainElement;
        this.init();

        // Event Handler to Add New Color
        this.mainElement.addEventListener('click', (ev) => {
            if (this.insertColor) {
                let cantColors = this.gradientColors.length;

                let totalLenght = this.mainElement.clientWidth;
                let newPosition = parseInt(ev.layerX * 100 / totalLenght);

                let indx = this.gradientColors.findIndex(gc => gc.getPosition() > newPosition)
                // indx = (indx === -1) ? cantColors : indx;

                let color1 = '#000000';
                let color2 = '#ffffff';

                if ((cantColors > 0)) {
                    if (indx < 0) {
                        color1 = this.gradientColors[cantColors - 1].getColor();
                    } else if (indx === 0) {
                        color2 = this.gradientColors[0].getColor()
                    } else {
                        color1 = this.gradientColors[indx - 1].getColor();
                        color2 = this.gradientColors[indx].getColor();
                    }
                }

                let newColor = colorControl.getIntermediateColor(color1, color2);

                this.addElement({
                    position: newPosition,
                    color: newColor
                }, indx)

                this.changeGradientBg();

                this.mainElement.classList.remove('add-new');
                this.insertColor = false;
            }
        })
    }

    init(colorsToGradient = this.initialGradient) {
        this.cleanElements();
        colorsToGradient.forEach(obj => {
            this.addElement(obj)
        })
        this.changeGradientBg();
        this.saveCache();
    }

    cleanElements() {
        this.gradientColors = [];
        this.mainElement.innerHTML = '';
    }

    addElement(obj, indx = -1) {
        let colorEl = new colorControl(obj)

        let newElement = colorEl.getElement();

        if (this.gradientColors[indx]) {
            let nextElement = this.gradientColors[indx].getElement();
            this.mainElement.insertBefore(newElement, nextElement);
            this.gradientColors.splice(indx, 0, colorEl)
        } else {
            this.mainElement.appendChild(newElement)
            this.gradientColors.push(colorEl)
        }

        this.configListeners(colorEl);
        // Update Element view
        colorEl.changePosition();
    }

    configListeners(gc) {
        gc.setDeleteClick(() => {
            this.gradientColors = this.gradientColors.filter(els => els !== gc);
            this.changeGradientBg();
        });

        gc.setPositionInput(() => {
            this.updatePositionsLimits();
            this.changeGradientBg();
        });

        gc.setValueInput(() => {
            this.changeGradientBg();
        });
    }

    changeGradientBg() {
        let gcs = this.gradientColors;
        this.mainElement.style.border = '1px solid #aaa';
        this.mainElement.style.background = `
        linear-gradient(to right, 
            #000000 0%,
            ${gcs.length > 0 ?
                gcs.map(gc => `${gc.getColor()} ${gc.getPosition()}%`).join(",") + ','
                : ''
            }
            #ffffff 100%
        )`;
    }

    updatePositionsLimits() {
        let minlimit = 0;
        let maxlimit = 100;

        this.gradientColors.forEach((gc, indx) => {
            let hasNext = (indx + 1 !== this.gradientColors.length)

            if (hasNext) {
                let nextgc = this.gradientColors[indx + 1];
                maxlimit = nextgc.getPosition();
            } else {
                maxlimit = 100;
            }

            gc.setPositionLimits(minlimit, maxlimit);
            minlimit = gc.getPosition();
        })
    }

    // ----------------------------------------------------
    // ----------------------------------------------------
    // ----------------------------------------------------
    updateAllPositions() {
        this.gradientColors.forEach(c => c.changePosition())
    }

    saveCache() {
        this.cacheGradient = this.gradientColors.map(el => {
            return {
                color: el.getColor(),
                position: el.getPosition()
            }
        })
    }

    addNewColor() {
        this.insertColor = true;
        this.mainElement.classList.add('add-new');
    }

    cancelNewColors() {
        this.insertColor = false;
        this.mainElement.classList.remove('add-new');

        this.init(this.cacheGradient);
    }

    acceptChangedColors() {
        this.insertColor = false;
        this.mainElement.classList.remove('add-new');
        this.saveCache();
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

}

export default GradientGenerator;

// createGradientColors(elements) {
//     let gcs = elements.map(color => {
//         let gc = new colorControl(color)
//         this.configListeners(gc);
//         return gc;
//     })

//     this.updatePositionsLimits(gcs);
//     this.changeGradientBg(this.mainElement, gcs);

//     return gcs;
// }

// updateElements(newElements) {
//     this.cleanElements()

//     newElements.forEach(el => this.mainElement.appendChild(el))

//     this.gradientColors = this.createGradientColors();
//     this.updatePositionsLimits(this.gradientColors);
//     this.changeGradientBg();
// }