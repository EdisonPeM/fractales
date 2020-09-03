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