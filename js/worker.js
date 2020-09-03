self.importScripts('workerUtils/Painter.js')

this.myPainter;
this.currentFractal;

self.onmessage = function (e) {
    switch (e.data.action) {
        case 'init':
            this.ctx = e.data.canvas.getContext("2d");
            this.myPainter = new Painter(e.data.canvas);
            break;

        case 'setColors':
            this.myPainter.setColors(e.data.colors);
            this.myPainter.cleanCache()
            break;

        case 'changeType':
            this.currentFractal = e.data.type;
            break

        case 'draw':
            draw(this.currentFractal)
            break;

        case 'changeAxis':
            this.myPainter.setAxis({
                x: e.data.params.a,
                y: e.data.params.b
            })

            // Only Madelbrot show axis
            if (this.currentFractal === 'mandelbrot')
                draw('mandelbrot')

            break;

        case 'random':
            // Random fractal works on Julia Set
            this.currentFractal = 'julia';
            draw('random')
            break;
    }
}

function draw(fractalCase) {
    switch (fractalCase) {
        case 'mandelbrot':
            this.myPainter.dibujarMandelbrot();
            break;

        case 'julia':
            this.myPainter.dibujarJulia();
            break;

        case 'random':
            this.myPainter.dibujarJuliaRandom();
            break;
    }

    let canvas = this.myPainter.getCanvas()
    this.ctx.drawImage(canvas, 0, 0);

    let axis = this.myPainter.getAxis();
    postMessage({
        done: true,
        params: {
            a: axis.x,
            b: axis.y
        }
    });
}