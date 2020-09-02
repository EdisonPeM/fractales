self.importScripts('./Painter.js')
self.importScripts('./colors.js')

let ctx;
let myPainter;
let fractalName;

self.onmessage = function (e) {
    // console.log(e.data);
    switch (e.data.action) {
        case 'init':
            let canva = e.data.canva;
            // let colors = colors

            myPainter = new Painter(canva);
            myPainter.setColors(colors);
            break;

        case 'changeType':
            fractalName = e.data.type;
            break

        case 'draw':
            pintar(fractalName)
            break;

        case 'changeAxis':
            myPainter.setAxis({
                x: e.data.params.a,
                y: e.data.params.b
            })

            // Only Madelbrot show axis
            if (fractalName === 'mandelbrot') pintar('mandelbrot')
            break;

        case 'random':
            fractalName = 'julia';
            pintar('random')
            break;
    }
}

function pintar(fractalCase) {
    let done = true;
    let message = 'No se pintó nada';

    switch (fractalCase) {
        case 'julia':
            done = myPainter.dibujarJulia();
            message = done ? 'Julia pintado con Exito' : 'Error pintando Julia';
            break;

        case 'mandelbrot':
            done = myPainter.dibujarMandelbrot();
            message = done ? 'Mandelbrot pintado con Exito' : 'Error pintando Mandelbrot';
            break;

        case 'random':
            done = myPainter.dibujarJuliaRandom();
            message = done ? ' pintado con Exito' : 'Error pintando Fractal Aleatorio';
            break;
    }

    let axis = myPainter.getAxis();
    postMessage({
        done,
        message,
        params: {
            a: axis.x,
            b: axis.y
        }
    });
}