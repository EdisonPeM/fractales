var miCanva = document.getElementById("miCanva");
var ctx = miCanva.getContext("2d");

var xmin, ymin, xmax, ymax, M, c, dx, dy;
var p = parseInt(miCanva.width)
var q = parseInt(miCanva.height)
var N = colors.length;

function dibujarJulia() {
    xmin = -2
    ymin = -2
    xmax = 2
    ymax = 2

    M = 100
    dibujar(julia)
}

function dibujarMandelbrot() {
    xmin = -2.5
    ymin = -1.75
    xmax = 1
    ymax = 1.75

    M = 100
    dibujar(mandelbrot)
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
    /*
    ctx.fillStyle = "white";
    ctx.fillRect(p / 2, 0, 1, p);
    ctx.fillRect(0, q / 2, 3 * q / 2, 1);
    //*/
}

function xn_1(xn, yn) {
    return Math.pow(xn, 2) - Math.pow(yn, 2) + c[0]
}

function yn_1(xn, yn) {
    return 2 * xn * yn + c[1]
}

function rn(xn, yn) {
    return Math.pow(xn, 2) + Math.pow(yn, 2)
}

function getValues() {
    let a = parseFloat(document.getElementById("c_a").value)
    let b = parseFloat(document.getElementById("c_b").value)
    if (isNaN(a)) a = 0
    if (isNaN(b)) b = 0
    c = [a, b]
    dx = (xmax - xmin) / (p - 1);
    dy = (ymax - ymin) / (q - 1);
}

function dibujarColores() {
    let N = colors.length
    let dy = q / N
    for (let i = 0; i < N; i++) {
        ctx.fillStyle = colors[i];
        ctx.fillRect(0, i * dy, p, dy);
        //ctx.strokeText(colors[i], 0, i * dy + dy);
    }
}

function julia(nx, ny) {
    let xn1, yn1, r
    xn = xmin + nx * dx;
    yn = ymin + ny * dy;
    n = 0

    do {
        xn1 = xn_1(xn, yn)
        yn1 = yn_1(xn, yn)
        r = rn(xn1, yn1);

        n++;
        xn = xn1
        yn = yn1
    } while (r <= M && n < N);

    if (n == N) n = 0;
    return n
}

function mandelbrot(nx, ny) {
    dx = (xmax - xmin) / (p - 1);
    xn = xmin + nx * dx;
    yn = ymin + ny * dy;
    n = 0
    zx = 0
    zy = 0
    do {
        zx1 = zx_1(zx, zy, xn)
        zy1 = zy_1(zx, zy, yn)
        r = rn(zx1, zy1)

        n++;
        zx = zx1
        zy = zy1
    } while (r <= M && n < N);

    if (n == N) n = 0;
    return n
}

function zx_1(xn, yn, x) {
    return Math.pow(xn, 2) - Math.pow(yn, 2) + x
}

function zy_1(xn, yn, y) {
    return 2 * xn * yn + y
}