// Method to import other scripts provided by Web Worker
importScripts('./FractalCalculator.js')

class Painter {
    constructor(realCanvas) {
        // Work with the canvases
        this.canvas = realCanvas;
        this.ctx = realCanvas.getContext("2d");;
        this.width = realCanvas.width || 0;
        this.height = realCanvas.height || 0;

        // Mandelbrot Cache canvas
        this.cnvsM_cache = new OffscreenCanvas(this.width, this.height);
        this.ctxM_cache = this.cnvsM_cache.getContext('2d')
        this.has_cnvsM_cache = false;

        // Julia Cache canvas
        this.cnvsJ_cache = new OffscreenCanvas(this.width, this.height);
        this.ctxJ_cache = this.cnvsJ_cache.getContext('2d')
        this.has_cnvsJ_cache = false;

        // Params
        this.x = 0;
        this.y = 0;

        // Initialize Colors
        this.colors = [];

        // Fractals Algorithms
        this.myCalc = new FractalCalculator(this.width, this.height, this.colors.length);
    }

    setColors(colors) {
        this.colors = colors;
        this.myCalc.setN(colors.length);
    }

    // Get and set Params
    getAxis() {
        return {
            x: this.x,
            y: this.y
        }
    }

    setAxis(axis) {
        // Clean Julia Caché
        if ((this.x !== axis.x) || (this.y !== axis.y))
            this.has_cnvsJ_cache = false;

        this.x = axis.x;
        this.y = axis.y;
    }

    /* ---------------------------- */
    /*       Drawing Functions      */
    /* ---------------------------- */
    dibujarMandelbrot() {
        // Evaluate existent Caché
        if (!this.has_cnvsM_cache) {
            this.dibujar((x, y) => this.myCalc.calculateMandelbrot(x, y))

            // Save the mandelbrot drawing in caché
            this.ctxM_cache.drawImage(this.canvas, 0, 0);
            this.has_cnvsM_cache = true;
        } else {
            this.ctx.drawImage(this.cnvsM_cache, 0, 0);
        }

        // Draw Axis
        let {
            coor_x,
            coor_y
        } = this.myCalc.calculateAxis(this.x, this.y, this.width, this.height);

        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(coor_x, 0, 1, this.height);
        this.ctx.fillRect(0, coor_y, this.width, 1);

        return true;
    }

    dibujarJulia() {
        // Evaluate existent Caché
        if (!this.has_cnvsJ_cache) {
            this.dibujar((x, y) => this.myCalc.calculateJulia(this.x, this.y, x, y));

            // Save the julia drawing in caché
            this.ctxJ_cache.drawImage(this.canvas, 0, 0);
            this.has_cnvsJ_cache = true;
        } else {
            this.ctx.drawImage(this.cnvsJ_cache, 0, 0);
        }

        return true;
    }

    // General function to draw
    dibujar(funcionFractal) {
        let n = 0
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                n = funcionFractal(i, j);
                this.ctx.fillStyle = this.colors[n];
                this.ctx.fillRect(i, j, 1, 1);
            }
        }
    }

    dibujarJuliaRandom() {
        this.x = Math.random() * (this.xmax - this.xmin) + this.xmin;
        this.y = Math.random() * (this.ymax - this.ymin) + this.ymin;
        this.has_cnvsJ_cache = false;

        return this.dibujarJulia();
    }
}