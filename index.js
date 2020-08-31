// Document Actions
const parm_a = document.getElementById('parm_a')
const parm_b = document.getElementById('parm_b')

function setRangeSize() {
    parm_b.style.width = parm_a.getClientRects()[0].width + 'px';
}

document.addEventListener('DOMContentLoaded', setRangeSize)
window.addEventListener('resize', setRangeSize)
// 
/*
var miCanva = document.getElementById("miCanva");
var ctx = miCanva.getContext("2d");

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
    // ctx.fillRect(x_0, 0, 1, p);
    // ctx.fillRect(0, y_0, q, 1);
    ctx.fillRect(x, 0, 1, p);
    ctx.fillRect(0, y, q, 1);
}

function dibujar(funcionFractal) {
    getValues()

    for (let i = 0; i < p; i++) {
        for (let j = 0; j < q; j++) {
            n = funcionFractal(i, j);
            ctx.fillStyle = colors[n];
            ctx.fillRect(i, j, 1, 1);
        }
    }
}

function getValues() {
    let a = document.getElementById("c_a").value - 0
    let b = document.getElementById("c_b").value - 0
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
    xn = xmin + nx * dx;
    yn = ymin + ny * dy;
    n = 0

    do {
        xn1 = xn_1(xn, yn, c[0])
        yn1 = yn_1(xn, yn, c[1])
        r = rn(xn1, yn1);

        n++;
        xn = xn1
        yn = yn1
    } while (r <= M && n < N);

    if (n == N) n = 0;
    return n
}

function mandelbrot(nx, ny) {
    xn = xmin + nx * dx;
    yn = ymin + ny * dy;
    n = 0
    zx = 0
    zy = 0
    do {
        zx1 = xn_1(zx, zy, xn)
        zy1 = yn_1(zx, zy, yn)
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
*/