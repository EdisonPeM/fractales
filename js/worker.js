self.importScripts('./colors.js')

/**
 * // ctx2.fillStyle = "black";
 // ctx2.fillRect(origin, 50, 1, 50);
 // ctx.drawImage(canvas2, 0, 0)
 params = e.data.params;
 console.log(params);
 if (fractalName === 'julia') {
     postMessage({
         message: 'Done',
         done: true
     });
 }*/
let ctx;

// DobleBuffer
let cnvsJ;
let ctxJ;
let cnvsM;
let ctxM;

let fractalName = '';
let params = {
    a: 0,
    b: 0
};

self.onmessage = function (e) {
    switch (e.data.action) {
        case 'init':
            let canva = e.data.canva;
            ctx = e.data.canva.getContext("2d");

            cnvsJ = new OffscreenCanvas(canva.width, canva.height);
            ctxJ = cnvsJ.getContext("2d");

            cnvsM = new OffscreenCanvas(canva.width, canva.height);
            cnvsJ = cnvsM.getContext("2d");
            break;

        case 'changeType':
            fractalName = e.data.type;
            break

        case 'draw':

            break;
    }
}

// document.getElementById('juliaBtn').addEventListener('click', dibujarJulia)
// document.getElementById('mandelbrotBtn').addEventListener('click', dibujarMandelbrot)

//* 
/*
var xmin, ymin, xmax, ymax, c, dx, dy;
var p = parseInt(miCanva.width)
var q = parseInt(miCanva.height)
var N = colors.length;
var M = 100

function dibujarJulia() {
    xmin = -1.5
    ymin = -1.5
    xmax = 1.5
    ymax = 1.5

    dibujar(julia)
}

function dibujarMandelbrot() {
    xmin = -2.5
    ymin = -1.75
    xmax = 1
    ymax = 1.75

    dibujar(mandelbrot)

    let x = (c[0] - xmin) / dx;
    let x_0 = (-xmin) / dx;
    let y = q - (c[1] - ymin) / dx;
    let y_0 = (-ymin) / dx;

    ctx.fillStyle = "white";
    ctx.fillRect(x_0, 0, 1, p);
    ctx.fillRect(0, y_0, q, 1);
    ctx.fillRect(x, 0, 1, p);
    ctx.fillRect(0, y, q, 1);
}

function dibujar(currentCtx, funcionFractal) {
    getValues()

    for (let i = 0; i < p; i++) {
        for (let j = 0; j < q; j++) {
            let n = funcionFractal(i, j);
            currentCtx.fillStyle = colors[n];
            currentCtx.fillRect(i, j, 1, 1);
        }
    }
}

function getValues() {
    let a = params.a - 0
    let b = params.b - 0
    if (isNaN(a)) a = 0
    if (isNaN(b)) b = 0
    c = [a, b]
    dx = (xmax - xmin) / (p - 1);
    dy = (ymax - ymin) / (q - 1);
}

function dibujarColores() {
    cambiar_colores()
    let N = colors.length
    let dy = q / N
    for (let i = 0; i < 3; i++) {
        for (let i = 0; i < N; i++) {
            ctx.fillStyle = colors[i];
            ctx.fillRect(0, i * dy, p, dy);
        }
    }
}

function julia(nx, ny) {
    let xn = xmin + nx * dx;
    let yn = ymin + ny * dy;
    let n = 0;
    let r = 0;

    do {
        let xn1 = xn_1(xn, yn, c[0])
        let yn1 = yn_1(xn, yn, c[1])
        r = rn(xn1, yn1);

        n++;
        xn = xn1
        yn = yn1
    } while (r <= M && n < N);

    if (n == N) n = 0;
    return n
}

function mandelbrot(nx, ny) {
    let xn = xmin + nx * dx;
    let yn = ymin + ny * dy;
    let n = 0
    let zx = 0
    let zy = 0
    let r = 0
    do {
        let zx1 = xn_1(zx, zy, xn)
        let zy1 = yn_1(zx, zy, yn)
        r = rn(zx1, zy1)

        n++;
        zx = zx1
        zy = zy1
    } while (r <= M && n < N);

    if (n == N) n = 0;
    return n
}

function xn_1(xn, yn, x) {
    return Math.pow(xn, 2) - Math.pow(yn, 2) + x
}

function yn_1(xn, yn, y) {
    return 2 * xn * yn + y
}

function rn(xn, yn) {
    return Math.pow(xn, 2) + Math.pow(yn, 2)
}
//*/