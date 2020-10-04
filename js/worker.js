self.importScripts('workerUtils/Painter.js');

this.myPainter;
this.currentFractal;

self.onmessage = function (e) {
    switch (e.data.action) {
        case 'init':
            this.myPainter = new Painter(e.data.canvas);
            break;

        case 'setColors':
            this.myPainter.setColors(e.data.colors);
            this.myPainter.cleanCache();
            break;

        case 'changeType':
            this.currentFractal = e.data.type;
            break;

        case 'draw':
            draw(this.currentFractal);
            break;

        case 'changeAxis':
            this.myPainter.setAxis({
                x: e.data.params.a,
                y: e.data.params.b,
            });

            // Only Madelbrot show axis
            if (this.currentFractal === 'mandelbrot') draw('mandelbrot');
            break;

        case 'random':
            // Random fractal works on Julia Set
            this.currentFractal = 'julia';
            draw('random');
            break;

        case 'zoom-in':
            zoom(e.data.center, 0.5);
            break;

        case 'zoom-out':
            zoom(e.data.center, 2);
            break;

        case 'move':
            zoom(e.data.center, 1);
            break;

        case 'zoom-default':
            zoom(e.data.center, 0);
            break;
    }
};

function draw(fractalCase) {
    drawFractal(fractalCase).then((done) => {
        let axis = this.myPainter.getAxis();
        postMessage({
            done,
            params: {
                a: axis.x,
                b: axis.y,
            },
        });
    });
}

async function drawFractal(fractalCase) {
    switch (fractalCase) {
        case 'mandelbrot':
            return this.myPainter.dibujarMandelbrot();
        case 'julia':
            return this.myPainter.dibujarJulia();
        case 'random':
            return this.myPainter.dibujarJuliaRandom();
        default:
            return true;
    }
}

function zoom(pointCenter, scale) {
    if (this.currentFractal == 'mandelbrot')
        this.myPainter.zoomM(pointCenter, scale);

    if (this.currentFractal == 'julia')
        this.myPainter.zoomJ(pointCenter, scale);

    draw(this.currentFractal);
}