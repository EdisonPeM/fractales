import GradientGenerator from './GradientGenerator.js';

/* ----------------------------------- */
/*     Document Fixed Range Styles     */
/* ----------------------------------- */
const parm_a = document.getElementById('parm_a');
const parm_b = document.getElementById('parm_b');

function setRangeSize() {
    parm_b.style.width = parm_a.getClientRects()[0].width + 'px';
}

document.addEventListener('DOMContentLoaded', setRangeSize);
window.addEventListener('resize', setRangeSize);

/* ----------------------------------- */
/*            Update Output            */
/* ----------------------------------- */
const output = document.getElementById('output');

function updateOutput() {
    parm_a.title = parm_a.value;
    parm_b.title = parm_b.value;
    output.innerText = `c = (${(+parm_a.value).toFixed(
        3
    )}) + (${(+parm_b.value).toFixed(3)})i`;
}

parm_a.addEventListener('input', updateOutput);
parm_b.addEventListener('input', updateOutput);

/* ----------------------------------- */
/*        Create Color Generator       */
/* ----------------------------------- */
const colorsControl = document.querySelector('.gradient-controls');
const myColorGen = new GradientGenerator(colorsControl);
window.addEventListener('resize', () => {
    if (modal.style.display !== 'none') {
        myColorGen.updateAllPositions();
    }
});

/* ----------------------------------- */
/*        Control of Modal             */
/* ----------------------------------- */
const modal = document.querySelector('.modal');
modal.style.left = 0;
modal.style.display = 'none';

document.querySelector('#changeColors').addEventListener('click', () => {
    modal.style.display = '';
    setTimeout(() => {
        modal.style.opacity = 1;
    });
    myColorGen.updateAllPositions();
});

/* ----------------------------------- */
/*             Modal Events            */
/* ----------------------------------- */
document.querySelector('#add').addEventListener('click', addColor);
document.querySelector('#accept').addEventListener('click', acceptColorChange);
document
    .querySelector('.close-modal')
    .addEventListener('click', cancelColorChange);
document.addEventListener('keyup', (e) => {
    if (e.code === 'Escape') {
        cancelColorChange();
    }

    if (e.code === 'Enter') {
        acceptColorChange();
    }
});

function addColor() {
    myColorGen.addNewColor();
}

function acceptColorChange() {
    myColorGen.acceptChangedColors();
    closeModal();

    // When accept the colors, repaint the fractals
    let colors = myColorGen.createGradiant();
    myWorker.postMessage({
        action: 'setColors',
        colors,
    });
    drawFractal();
}

function cancelColorChange() {
    myColorGen.cancelNewColors();
    closeModal();
}

function closeModal() {
    modal.style.opacity = '';
    setTimeout(() => {
        modal.style.display = 'none';
    }, 200);
}

/* ----------------------------------- */
/*     Verify Browser Compatibility    */
/* ----------------------------------- */
if (!window.OffscreenCanvas) {
    alert('Su navegador no soporta esta aplicación');
}

/* ----------------------------------- */
/*            Create Workers           */
/* ----------------------------------- */
let drawingInProcess = false;
const spinner = document.getElementById('spinner');
let myWorker = new Worker('js/worker.js');

/* ----------------------------------- */
/*      Transfer Canvas to worker      */
/* ----------------------------------- */
const miCanva = document.getElementById('miCanva');

let ctrlKeyPessed = false;
let shiftKeyKeyPessed = false;

document.addEventListener('keydown', (e) => {
    if (e.code === 'ControlLeft' || e.code === 'ControlRight') {
        ctrlKeyPessed = true;
    }

    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        shiftKeyKeyPessed = true;
    }

    if (ctrlKeyPessed) miCanva.classList.add('zoom-in');
    if (shiftKeyKeyPessed) miCanva.classList.add('zoom-out');
    if (ctrlKeyPessed && shiftKeyKeyPessed) miCanva.classList.add('move');
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ControlLeft' || e.code === 'ControlRight') {
        ctrlKeyPessed = false;
    }
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        shiftKeyKeyPessed = false;
    }

    if (!ctrlKeyPessed) miCanva.classList.remove('zoom-in');
    if (!shiftKeyKeyPessed) miCanva.classList.remove('zoom-out');
    if (!ctrlKeyPessed || !shiftKeyKeyPessed) miCanva.classList.remove('move');
});

let transferCanva = miCanva.transferControlToOffscreen();
myWorker.postMessage(
    {
        action: 'init',
        canvas: transferCanva,
    },
    [transferCanva]
);

/* ----------------------------------- */
/*        send Colors to worker        */
/* ----------------------------------- */
myWorker.postMessage({
    action: 'setColors',
    colors: myColorGen.createGradiant(),
});

/* ------------------------------------------ */
/*    Add Message Event Listener to Worker    */
/* ------------------------------------------ */
myWorker.addEventListener('message', function (oEvent) {
    if (oEvent.data.done) {
        spinner.style.display = 'none';
        drawingInProcess = false;

        // fixed range sliders values
        if (oEvent.data.params) {
            parm_a.value = oEvent.data.params.a || parm_a.value;
            parm_b.value = oEvent.data.params.b || parm_b.value;

            updateOutput();
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
        type: fractalName,
    });
}

juliaBtn.addEventListener('click', () => changeFractalType('julia'));
mandelbrotBtn.addEventListener('click', () => changeFractalType('mandelbrot'));

/* ----------------------------------- */
/*        Send Messages to draw        */
/* ----------------------------------- */
function drawFractal() {
    if (drawingInProcess) return;
    startDraw();

    // Send Message to worker
    myWorker.postMessage({
        action: 'draw',
        params: {
            a: +parm_a.value,
            b: +parm_b.value,
        },
    });
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
            b: +parm_b.value,
        },
    });
}

parm_a.addEventListener('input', changeAxis);
parm_b.addEventListener('input', changeAxis);

/* ----------------------------------- */
/*       Messages to random draw       */
/* ----------------------------------- */
const randomBtn = document.getElementById('randomBtn');
randomBtn.addEventListener('click', function (ev) {
    if (drawingInProcess) return;
    startDraw();

    // Send Message to worker
    myWorker.postMessage({
        action: 'random',
    });
});

function startDraw() {
    drawingInProcess = true;

    // Use SetTimeOut to wait the worker response message
    setTimeout(() => {
        if (drawingInProcess) {
            spinner.style.display = '';
        }
    }, 0);
}
