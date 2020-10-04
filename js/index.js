import GradientGenerator from './GradientGenerator.js';

/* ----------------------------------- */
/*     Document Fixed Range Styles     */
/* ----------------------------------- */
const parm_a_range = document.querySelector('#parm_a');
const parm_b_range = document.querySelector('#parm_b');
const parm_a = document.querySelector('#parm_a input');
const parm_b = document.querySelector('#parm_b input');

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
    parm_a_range.dataset.min = parm_a.min;
    parm_a_range.dataset.max = parm_a.max;

    parm_b.title = parm_b.value;
    parm_b_range.dataset.min = parm_b.min;
    parm_b_range.dataset.max = parm_b.max;

    output.innerText = `
        c = (${(+parm_a.value).toFixed(5)}) + (${(+parm_b.value).toFixed(5)})i
    `;
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
        }

        // change limits if is necesary
        if (oEvent.data.limits) {
            parm_a.min = oEvent.data.limits.amin || '-2.5';
            parm_a.max = oEvent.data.limits.amax || '1';
            parm_b.min = oEvent.data.limits.bmin || '-1.75';
            parm_b.max = oEvent.data.limits.bmax || '1.75';
        }

        if (oEvent.data.zoomLevel) {
            setZoomLevel(oEvent.data.zoomLevel);
        }

        updateOutput();
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

/* ----------------------------------- */
/*           Messages to Zoom          */
/* ----------------------------------- */
function setZoomLevel(zoomLevel) {
    if (zoomLevel <= 0) zoomLevel--;
    document.querySelector('.zoom-level').textContent = 'Zoom x' + zoomLevel;
}

let zoomInAction = false;
let zoomOutAction = false;
let moveAction = false;

document.addEventListener('keydown', (e) => {
    if (e.code === 'ControlLeft' || e.code === 'ControlRight') {
        zoomInAction = true;
    }

    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        zoomOutAction = true;
    }

    if (zoomInAction) miCanva.classList.add('zoom-in');
    if (zoomOutAction) miCanva.classList.add('zoom-out');
    if (zoomInAction && zoomOutAction) miCanva.classList.add('move');
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ControlLeft' || e.code === 'ControlRight') {
        zoomInAction = false;
    }
    if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        zoomOutAction = false;
    }

    if (!zoomInAction) miCanva.classList.remove('zoom-in');
    if (!zoomOutAction) miCanva.classList.remove('zoom-out');
    if (!zoomInAction || !zoomOutAction) miCanva.classList.remove('move');
});

miCanva.addEventListener('click', function (ev) {
    let action = 'none';
    if (ev.ctrlKey || zoomInAction) action = 'zoom-in';
    if (ev.shiftKey || zoomOutAction) action = 'zoom-out';
    if ((ev.ctrlKey && ev.shiftKey) || moveAction) action = 'move';

    if (action == 'none') return;
    if (drawingInProcess) return;
    startDraw();

    myWorker.postMessage({
        action,
        center: {
            x: (ev.offsetX * miCanva.width) / miCanva.clientWidth,
            y: (ev.offsetY * miCanva.height) / miCanva.clientHeight,
        },
    });
});

let zoomIn = document.getElementById('zoom-in');
let zoomOut = document.getElementById('zoom-out');
let zoomMove = document.getElementById('zoom-move');
let zoomHome = document.getElementById('zoom-home');

zoomIn.addEventListener('click', function () {
    zoomInAction = true;
    zoomOutAction = false;
    moveAction = false;

    zoomIn.classList.add('active');
    zoomOut.classList.remove('active');
    zoomMove.classList.remove('active');

    miCanva.classList.add('crosshair');
});

zoomOut.addEventListener('click', function () {
    zoomInAction = false;
    zoomOutAction = true;
    moveAction = false;

    zoomIn.classList.remove('active');
    zoomOut.classList.add('active');
    zoomMove.classList.remove('active');

    miCanva.classList.add('crosshair');
});

zoomMove.addEventListener('click', function () {
    zoomInAction = false;
    zoomOutAction = false;
    moveAction = true;

    zoomIn.classList.remove('active');
    zoomOut.classList.remove('active');
    zoomMove.classList.add('active');

    miCanva.classList.add('crosshair');
});

zoomHome.addEventListener('click', function () {
    zoomInAction = false;
    zoomOutAction = false;
    moveAction = false;

    zoomIn.classList.remove('active');
    zoomOut.classList.remove('active');
    zoomMove.classList.remove('active');

    miCanva.classList.remove('zoom-in');
    miCanva.classList.remove('zoom-out');
    miCanva.classList.remove('move');
    miCanva.classList.remove('crosshair');

    if (drawingInProcess) return;
    startDraw();

    setZoomLevel(1);
    myWorker.postMessage({
        action: 'zoom-default',
        center: { x: 0, y: 0 },
    });
});

miCanva.addEventListener('click', function () {
    zoomInAction = false;
    zoomOutAction = false;
    moveAction = false;

    zoomIn.classList.remove('active');
    zoomOut.classList.remove('active');
    zoomMove.classList.remove('active');

    miCanva.classList.remove('zoom-in');
    miCanva.classList.remove('zoom-out');
    miCanva.classList.remove('move');
    miCanva.classList.remove('crosshair');
});

/* ----------------------------------- */
/*              Utilities              */
/* ----------------------------------- */
function startDraw() {
    drawingInProcess = true;

    // Use SetTimeOut to wait the worker response message
    setTimeout(() => {
        if (drawingInProcess) {
            spinner.style.display = '';
        }
    }, 0);
}
