import colorControl from './colorControl.js'

class GradientGenerator {
    initialGradient = [{
            position: '10',
            color: '#ff0000'
        },
        // {
        //     position: '30',
        //     color: '#ff7700'
        // },
        {
            position: '50',
            color: '#ffff00'
        },
        // {
        //     position: '70',
        //     color: '#77ff77'
        // },
        {
            position: '90',
            color: '#00ffff'
        }
    ]

    constructor(mainElement) {
        this.mainElement = mainElement;
        this.initialGradient.forEach(obj => {
            let tempObj = colorControl.createNewControl(obj);
            this.mainElement.append(tempObj);
        })

        this.gradientColors = this.createGradientColors();
        this.saveCache()

        this.insertColor = false;
        this.cacheColorsElements = [];

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

    getGradientColors() {
        return this.gradientColors.map(gc => {
            return {
                color: gc.getColor(),
                position: gc.getPosition()
            }
        });
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