class FractalCalculator {
    constructor(q, p, N) {
        // coords to Julia
        this.xmin = -1.5;
        this.ymin = -1.5;
        this.xmax = 1.5;
        this.ymax = 1.5;

        // coords to Mandelbrot
        this.amin = -2.5;
        this.bmin = -1.75;
        this.amax = 1;
        this.bmax = 1.75;

        // Number of Iterations
        this.M = 100;

        // Set params
        this.setDz(q, p);
        this.setDa(q, p);
        this.setN(N);
    }

    setDz(q, p) {
        this.dx = (this.xmax - this.xmin) / q;
        this.dy = (this.ymax - this.ymin) / p;
    }

    setDa(q, p) {
        this.da = (this.amax - this.amin) / q;
        this.db = (this.bmax - this.bmin) / p;
    }

    setN(N) {
        this.N = N;
    }

    /* ----------------------------------- */
    /*          Get Axis of a coor         */
    /* ----------------------------------- */
    calculateAxis(x, y, q, p) {
        let coor_x = q * (x - this.amin) / (this.amax - this.amin);
        let coor_y = p - p * (y - this.bmin) / (this.bmax - this.bmin);

        return {
            coor_x,
            coor_y
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
    calculateJulia(a, b, px_x, px_y) {
        // Calculate each value of z per pixel
        let xn = this.xmin + px_x * this.dx;
        let yn = this.ymin + px_y * this.dy;

        // Initialize controls
        let n = 0;
        let r = 0;

        // Iterate the function
        do {
            let xn1 = this.xn_1(xn, yn, a)
            let yn1 = this.yn_1(xn, yn, b)
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