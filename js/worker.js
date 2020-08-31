self.importScripts('./painter.js')
self.importScripts('./colors.js')

let ctx;
let myPainter;
let fractalName;

self.onmessage = function (e) {
    // console.log(e.data);
    switch (e.data.action) {
        case 'init':
            let canva = e.data.canva;
            ctx = e.data.canva.getContext("2d");

            myPainter = new Painter(canva.width, canva.height, colors);
            break;

        case 'changeType':
            fractalName = e.data.type;
            break

        case 'draw':
            pintar()
            break;

        case 'changeAxis':
            myPainter.setParams(e.data.params)

            // Only Madelbrot show axis
            if (fractalName === 'mandelbrot') pintar()
            break;
    }
}

function pintar() {
    switch (fractalName) {
        case 'julia':
            let cnvsJ = myPainter.dibujarJulia();
            ctx.drawImage(cnvsJ, 0, 0);

            postMessage({
                message: 'Julia pintado con Exito',
                params: myPainter.getParams(),
                done: true
            });

            break;

        case 'mandelbrot':
            let cnvsM = myPainter.dibujarMandelbrot();
            ctx.drawImage(cnvsM, 0, 0);

            postMessage({
                message: 'Mandelbrot pintado con Exito',
                params: myPainter.getParams(),
                done: true
            });

            break;

        default:
            postMessage({
                message: 'No se pintó nada',
                done: true
            });
            break;
    }
}