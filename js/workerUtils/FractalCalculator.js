class FractalCalculator {
    defaultValues = {
        julia: {
            xmin: -1.5,
            ymin: -1.5,
            xmax: 1.5,
            ymax: 1.5,
        },

        mandelbrot: {
            amin: -2.5,
            bmin: -1.75,
            amax: 1,
            bmax: 1.75,
        },
    };

    constructor(q, p, N) {
        this.setValues(this.defaultValues.julia);
        this.setValues(this.defaultValues.mandelbrot);

        // Number of Iterations
        this.M = 100;

        this.q = q;
        this.p = p;

        // Set params
        this.setDz(q, p);
        this.setDa(q, p);
        this.setN(N);
    }

    setValues(values) {
        // coords to Julia
        if (values.xmin) this.xmin = values.xmin;
        if (values.ymin) this.ymin = values.ymin;
        if (values.xmax) this.xmax = values.xmax;
        if (values.ymax) this.ymax = values.ymax;

        // coords to Mandelbrot
        if (values.amin) this.amin = values.amin;
        if (values.bmin) this.bmin = values.bmin;
        if (values.amax) this.amax = values.amax;
        if (values.bmax) this.bmax = values.bmax;
    }

    getValues() {
        return {
            // coords to Julia
            xmin: this.xmin.toFixed(5),
            ymin: this.ymin.toFixed(5),
            xmax: this.xmax.toFixed(5),
            ymax: this.ymax.toFixed(5),

            // coords to Mandelbrot
            amin: this.amin.toFixed(5),
            bmin: this.bmin.toFixed(5),
            amax: this.amax.toFixed(5),
            bmax: this.bmax.toFixed(5),
        };
    }

    zoomXY(x, y, factor = 1) {
        if (factor === 0) {
            this.setValues(this.defaultValues.julia);
        } else {
            let xn = this.xmin + x * this.dx;
            let yn = this.ymax - y * this.dy;

            let tx = (this.xmax - this.xmin) / 2;
            let ty = (this.ymax - this.ymin) / 2;

            this.xmin = xn - tx * factor;
            this.xmax = xn + tx * factor;

            this.ymin = yn - ty * factor;
            this.ymax = yn + ty * factor;
        }

        this.setDz(this.q, this.p);
    }

    zoomAB(a, b, factor) {
        let an = this.amin + a * this.da;
        let bn = this.bmin + b * this.db;

        if (factor === 0) {
            this.setValues(this.defaultValues.mandelbrot);
        } else {
            let ta = (this.amax - this.amin) / 2;
            let tb = (this.bmax - this.bmin) / 2;

            this.amin = an - ta * factor;
            this.amax = an + ta * factor;

            this.bmin = bn - tb * factor;
            this.bmax = bn + tb * factor;
        }

        this.setDa(this.q, this.p);
        return { an, bn };
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
        return {
            x: (q * (x - this.amin)) / (this.amax - this.amin),
            y: p - (p * (y - this.bmin)) / (this.bmax - this.bmin),
        };
    }

    generateRandomAxis() {
        return {
            x: Math.random() * (this.xmax - this.xmin) + this.xmin,
            y: Math.random() * (this.ymax - this.ymin) + this.ymin,
        };
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
            let zx1 = this.xn_1(zx, zy, an);
            let zy1 = this.yn_1(zx, zy, bn);
            r = this.rn(zx1, zy1);

            n++;
            zx = zx1;
            zy = zy1;
        } while (r <= this.M && n < this.N);

        // Fixed Colors overflow
        if (n >= this.N) n = 0;
        return n;
    }

    // Julia Algirhtm
    calculateJulia(a, b, px_x, px_y) {
        // Calculate each value of z per pixel
        let xn = this.xmin + px_x * this.dx;
        let yn = this.ymax - px_y * this.dy;
        // let yn = this.ymin + px_y * this.dy;

        // Initialize controls
        let n = 0;
        let r = 0;

        // Iterate the function
        do {
            let xn1 = this.xn_1(xn, yn, a);
            let yn1 = this.yn_1(xn, yn, b);
            r = this.rn(xn1, yn1);

            n++;
            xn = xn1;
            yn = yn1;
        } while (r <= this.M && n < this.N);

        // Fixed Colors overflow
        if (n >= this.N) n = 0;
        return n;
    }

    /* ---------------------------- */
    /*      Auxiliar Functions      */
    /* ---------------------------- */
    // Cuadratic Real Part
    xn_1(x, y, a) {
        return Math.pow(x, 2) - Math.pow(y, 2) + a;
    }

    // Cuadratic Imaginary Part
    yn_1(x, y, b) {
        return 2 * x * y + b;
    }

    // Radius^2 of a vector
    rn(x, y) {
        return Math.pow(x, 2) + Math.pow(y, 2);
    }
}
