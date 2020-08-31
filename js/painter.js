class Painter {
    // Canvas to Julia Fractal
    cnvsJ;
    ctxJ;

    // Julia Cache canvas
    cnvsJ_cache;
    ctxJ_cache;

    // Canvas to Mandelbrot Fractal
    cnvsM;
    ctxM;

    // Mandelbrot Cache canvas
    cnvsM_cache;
    ctxM_cache;

    // Cache controls
    has_cnvsJ_cache = false;
    has_cnvsM_cache = false;

    // Size of all Canvas
    width;
    height;

    // Values of Z
    xmin = -1.5;
    ymin = -1.5;
    xmax = 1.5;
    ymax = 1.5;
    dx;
    dy;

    // Values of C
    amin = -2.5;
    bmin = -1.75;
    amax = 1;
    bmax = 1.75;
    da;
    db;

    // Params
    a = null;
    b = null;

    // Number of Iterations
    M = 100;

    // Colors to "Escape Time Algorithm"
    colors;
    N;

    constructor(canvaWidth, canvaHeight, colors) {
        this.width = canvaWidth || 0;
        this.height = canvaHeight || 0;

        // Create new canvases
        this.cnvsJ = new OffscreenCanvas(this.width, this.height);
        this.ctxJ = this.cnvsJ.getContext("2d");

        this.cnvsM = new OffscreenCanvas(this.width, this.height);
        this.ctxM = this.cnvsM.getContext("2d");

        this.cnvsM_cache = new OffscreenCanvas(this.width, this.height);
        this.ctxM_cache = this.cnvsM_cache.getContext('2d')

        this.cnvsJ_cache = new OffscreenCanvas(this.width, this.height);
        this.ctxJ_cache = this.cnvsJ_cache.getContext('2d')

        // Set steps sizes
        this.dx = (this.xmax - this.xmin) / this.width;
        this.dy = (this.ymax - this.ymin) / this.height;

        this.da = (this.amax - this.amin) / this.width;
        this.db = (this.bmax - this.bmin) / this.height;

        // Set Colors
        this.colors = colors;
        this.N = colors.length;
    }

    // Get and set Params
    getParams() {
        return {
            a: this.a,
            b: this.b
        }
    }

    setParams(params) {
        // Clean Julia Caché
        if ((this.a !== params.a) || (this.b !== params.b)) this.has_cnvsJ_cache = false;

        this.a = params.a;
        this.b = params.b;

        this.clean(this.ctxJ);
        this.clean(this.ctxM);
    }

    // Clean Canvasses
    clean(ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, this.width, this.height);
    }

    /* ---------------------------- */
    /*       Drawing Functions      */
    /* ---------------------------- */
    dibujarMandelbrot() {
        // Evaluate existent Caché
        if (!this.has_cnvsM_cache) {
            this.dibujar(this.ctxM, this.calculateMandelbrot.bind(this))

            // Save the mandelbrot drawing in caché
            this.ctxM_cache.drawImage(this.cnvsM, 0, 0);
            this.has_cnvsM_cache = true;
        } else {
            this.ctxM.drawImage(this.cnvsM_cache, 0, 0);
        }

        // Draw Axis
        let cnvs_x = this.width * (this.a - this.amin) / (this.amax - this.amin);
        let cnvs_y = this.height - this.height * (this.b - this.bmin) / (this.bmax - this.bmin);

        this.ctxM.fillStyle = 'white';
        this.ctxM.fillRect(cnvs_x, 0, 1, this.height);
        this.ctxM.fillRect(0, cnvs_y, this.width, 1);

        return this.cnvsM
    }

    dibujarJulia() {
        // Evaluate existent Caché
        if (!this.has_cnvsJ_cache) {
            this.dibujar(this.ctxJ, this.calculateJulia.bind(this));

            // Save the julia drawing in caché
            this.ctxJ_cache.drawImage(this.cnvsJ, 0, 0);
            this.has_cnvsJ_cache = true;
        } else {
            this.ctxJ.drawImage(this.cnvsJ_cache, 0, 0);
        }

        return this.cnvsJ;
    }

    // General function to draw
    dibujar(currentCtx, funcionFractal) {
        let n = 0
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                n = funcionFractal(i, j);
                currentCtx.fillStyle = colors[n];
                currentCtx.fillRect(i, j, 1, 1);
            }
        }
    }

    /* ----------------------------------- */
    /*    Cuadratic Functions Algorithms   */
    /* ----------------------------------- */
    // Mandelbrot Algirhtm
    calculateMandelbrot(px_x, px_y) {
        // Calculate each value of c per pixer
        let an = this.amin + px_x * this.da;
        let bn = this.bmin + px_y * this.db;

        // Fixed Z0 = 0 + 0i
        let zx = 0;
        let zy = 0;

        // Initialize controls
        let n = 0;
        let r = 0;

        // Iterate the function
        do {
            let zx1 = this.xn_1(zx, zy, an)
            let zy1 = this.yn_1(zx, zy, bn)
            r = this.rn(zx1, zy1)

            n++;
            zx = zx1
            zy = zy1
        } while (r <= this.M && n < this.N);

        // Fixed Colors overflow
        if (n >= this.N) n = 0;
        return n
    }

    // Julia Algirhtm
    calculateJulia(px_x, px_y) {
        // Calculate each value of z per pixel
        let xn = this.xmin + px_x * this.dx;
        let yn = this.ymin + px_y * this.dy;

        // Initialize controls
        let n = 0;
        let r = 0;

        // Iterate the function
        do {
            let xn1 = this.xn_1(xn, yn, this.a)
            let yn1 = this.yn_1(xn, yn, this.b)
            r = this.rn(xn1, yn1);

            n++;
            xn = xn1
            yn = yn1
        } while (r <= this.M && n < this.N);

        // Fixed Colors overflow
        if (n >= this.N) n = 0;
        return n
    }

    /* ---------------------------- */
    /*      Auxiliar Functions      */
    /* ---------------------------- */

    // Cuadratic Real Part
    xn_1(x, y, a) {
        return Math.pow(x, 2) - Math.pow(y, 2) + a
    }

    // Cuadratic Imaginary Part
    yn_1(x, y, b) {
        return 2 * x * y + b
    }

    // Radius^2 of a vector
    rn(x, y) {
        return Math.pow(x, 2) + Math.pow(y, 2)
    }
}

/* -------------------------- */
/*      Others Functions      */
/* -------------------------- */
// dibujarColores() {
//     // cambiar_colores()
//     let dy = this.height / N
//     for (let i = 0; i < 3; i++) {
//         for (let i = 0; i < N; i++) {
//             ctx.fillStyle = colors[i];
//             ctx.fillRect(0, i * dy, this.width, dy);
//         }
//     }
// }