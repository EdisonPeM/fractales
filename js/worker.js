self.importScripts('workerUtils/Painter.js')
self.importScripts('workerUtils/colors.js')

this.myPainter;
this.currentFractal;

self.onmessage = function (e) {
    // console.log(e.data);
    switch (e.data.action) {
        case 'init':
            let canva = e.data.canva;
            // let colors = colors

            this.myPainter = new Painter(canva);
            this.myPainter.setColors(colors);
            break;

        case 'changeType':
            this.currentFractal = e.data.type;
            break

        case 'draw':
            pintar(this.currentFractal)
            break;

        case 'changeAxis':
            this.myPainter.setAxis({
                x: e.data.params.a,
                y: e.data.params.b
            })

            // Only Madelbrot show axis
            if (this.currentFractal === 'mandelbrot')
                pintar('mandelbrot')

            break;

        case 'random':
            this.currentFractal = 'julia';
            pintar('random')
            break;
    }
}

function pintar(fractalCase) {
    let done = true;
    let message = 'No se pintó nada';

    switch (fractalCase) {
        case 'julia':
            done = this.myPainter.dibujarJulia();
            message = done ? 'Julia pintado con Exito' : 'Error pintando Julia';
            break;

        case 'mandelbrot':
            done = this.myPainter.dibujarMandelbrot();
            message = done ? 'Mandelbrot pintado con Exito' : 'Error pintando Mandelbrot';
            break;

        case 'random':
            done = this.myPainter.dibujarJuliaRandom();
            message = done ? ' pintado con Exito' : 'Error pintando Fractal Aleatorio';
            break;
    }

    let axis = this.myPainter.getAxis();
    postMessage({
        done,
        message,
        params: {
            a: axis.x,
            b: axis.y
        }
    });
}