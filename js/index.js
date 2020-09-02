import ColorGenerator from './ColorGenerator.js'

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
/*            Update Output            */
/* ----------------------------------- */
const output = document.getElementById('output');

function updateOutput() {
    parm_a.title = parm_a.value;
    parm_b.title = parm_b.value;
    output.innerText = `c = (${(+parm_a.value).toFixed(3)}) + (${(+parm_b.value).toFixed(3)})i`
}

parm_a.addEventListener('input', updateOutput);
parm_b.addEventListener('input', updateOutput);

/* ----------------------------------- */
/*     Verify Browser Compatibility    */
/* ----------------------------------- */
if (!window.OffscreenCanvas) {
    alert('Su navegador no soporta esta aplicación')
}

/* ----------------------------------- */
/*            Create Workers           */
/* ----------------------------------- */
let drawingInProcess = false;
const spinner = document.getElementById('spinner');
let myWorker = new Worker("js/worker.js");

/* ----------------------------------- */
/*      Transfer Canvas to worker      */
/* ----------------------------------- */
const miCanva = document.getElementById("miCanva");
let transferCanva = miCanva.transferControlToOffscreen();
myWorker.postMessage({
    action: 'init',
    canvas: transferCanva
}, [transferCanva]);

/* ----------------------------------- */
/*        Create Color Generator       */
/*      And send Colors to worker      */
/* ----------------------------------- */
let colorGen = new ColorGenerator();
myWorker.postMessage({
    action: 'setColors',
    colors: colorGen.generateColors()
});

/* ------------------------------------------ */
/*    Add Message Event Listener to Worker    */
/* ------------------------------------------ */
myWorker.addEventListener("message", function (oEvent) {
    if (oEvent.data.done) {
        spinner.style.display = 'none'
        drawingInProcess = false;

        // fixed range sliders values
        if (oEvent.data.params) {
            parm_a.value = oEvent.data.params.a || parm_a.value;
            parm_b.value = oEvent.data.params.b || parm_b.value;

            updateOutput()
        }
    }
});

/* --------------------------------------- */
/*    Events to send Messages to Worker    */
/* --------------------------------------- */
const juliaBtn = document.getElementById('juliaBtn');
const mandelbrotBtn = document.getElementById('mandelbrotBtn');

function changeFractalType(fractalName) {
    if (drawingInProcess) return;

    myWorker.postMessage({
        action: 'changeType',
        type: fractalName
    })
}

juliaBtn.addEventListener('click', () => changeFractalType('julia'))
mandelbrotBtn.addEventListener('click', () => changeFractalType('mandelbrot'))

/* ----------------------------------- */
/*        Send Messages to draw        */
/* ----------------------------------- */
function drawFractal() {
    if (drawingInProcess) return;
    drawingInProcess = true;

    // Use SetTimeOut to wait the worker response message
    setTimeout(() => {
        if (drawingInProcess) {
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

/* ---------------------------------------- */
/*     Messages to change axis on input     */
/* ---------------------------------------- */
function changeAxis() {
    if (drawingInProcess) return;

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

/* ----------------------------------- */
/*       Messages to random draw       */
/* ----------------------------------- */
const randomBtn = document.getElementById('randomBtn');
randomBtn.addEventListener('click', function (ev) {
    if (drawingInProcess) return;
    drawingInProcess = true;

    // Use SetTimeOut to wait the worker response message
    setTimeout(() => {
        if (drawingInProcess) {
            spinner.style.display = ''
        }
    }, 0)

    // Send Message to worker
    myWorker.postMessage({
        action: 'random'
    })
})