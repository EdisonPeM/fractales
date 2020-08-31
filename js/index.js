/* ----------------------------------- */
/*     Document Fixed Range Styles     */
/* ----------------------------------- */
const parm_a = document.getElementById('parm_a')
const parm_b = document.getElementById('parm_b')

function setRangeSize() {
    parm_b.style.width = parm_a.getClientRects()[0].width + 'px';
}

document.addEventListener('DOMContentLoaded', setRangeSize)
window.addEventListener('resize', setRangeSize)

/* ----------------------------------- */
/*            Create Workers           */
/* ----------------------------------- */
let inProcess = false;
const spinner = document.getElementById('spinner');
let myWorker = new Worker("js/worker.js");
myWorker.addEventListener("message", function (oEvent) {
    if (oEvent.data.done) {
        spinner.style.display = 'none'
        inProcess = false;
    }
    // console.log(oEvent.data);
});

/* ----------------------------------- */
/*      Transfer Canvas to worker      */
/* ----------------------------------- */
const miCanva = document.getElementById("miCanva");
let transferCanva = miCanva.transferControlToOffscreen()

myWorker.postMessage({
    action: 'init',
    canva: transferCanva
}, [transferCanva]);

/* ----------------------------------- */
/*        Adding Buttons Events        */
/* ----------------------------------- */
const juliaBtn = document.getElementById('juliaBtn');
const mandelbrotBtn = document.getElementById('mandelbrotBtn');

juliaBtn.addEventListener('click', function (ev) {
    if (inProcess) return;

    myWorker.postMessage({
        action: 'changeType',
        type: 'julia'
    })
})

mandelbrotBtn.addEventListener('click', function (ev) {
    if (inProcess) return;

    myWorker.postMessage({
        action: 'changeType',
        type: 'mandelbrot'
    })
})

/* ----------------------------------- */
/*        Send Messages to draw        */
/* ----------------------------------- */
function drawFractal() {
    if (inProcess) return;

    inProcess = true;
    setTimeout(function () {
        if (inProcess) {
            spinner.style.display = ''
        }
    }, 0)

    // Send Message to worker
    myWorker.postMessage({
        action: 'draw',
        params: {
            a: +parm_a.value,
            b: +parm_b.value
        }
    })
}

parm_a.addEventListener('change', drawFractal);
parm_b.addEventListener('change', drawFractal);
juliaBtn.addEventListener('click', drawFractal);
mandelbrotBtn.addEventListener('click', drawFractal);

function changeAxis() {
    if (inProcess) return;

    // Send Message to worker
    myWorker.postMessage({
        action: 'changeAxis',
        params: {
            a: +parm_a.value,
            b: +parm_b.value
        }
    })
}

parm_a.addEventListener('input', changeAxis);
parm_b.addEventListener('input', changeAxis);