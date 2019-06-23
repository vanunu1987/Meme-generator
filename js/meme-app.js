'use strict'

var gCanvas;
var gCtx;
var gLastX;
var gLastY;
var gIsDragging;
var gIsSessionOn;
var gIsDone;


function initMeme() {
    gIsDragging = false;
    gIsSessionOn = false;
    gIsDone = false;
    gCurrImg = loadFromStorage('CurrImg');
    gCanvas = document.querySelector('#meme-canvas');
    createMeme();
    addEventListeners()
    drawImg();
}


function addEventListeners() {
    gCtx = gCanvas.getContext('2d');
    gCanvas.addEventListener('mousemove', draggImage);
    gCanvas.addEventListener('mouseup', handleMouseUp);
    gCanvas.addEventListener('mouseout', () => { gIsDragging = false });
    gCanvas.addEventListener('touchstart', onMobileCanvasDragg, false);
    gCanvas.addEventListener('touchmove', mobileDraggImage, false);
    gCanvas.addEventListener('touchend', handleTouchEnd, false);
}

function process_touchstart(ev) {
    ev.preventDefault();
    onMobileCanvasDragg(ev);

}
function process_touchmove(ev) {
    ev.preventDefault();
    mobileDraggImage(ev);
}


function drawImg(finalMeme) {
    var currText = getCurrText();
    var img = new Image();
    img.src = getMemeImgUrl();
    img.onload = function () {
        var size = getCanvasSize(this.width, this.height)
        gCanvas.width = size.width;
        gCanvas.height = size.height;
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        if (!gIsSessionOn) {
            currText.x = gCanvas.width / 2;
            gLastX = currText.x;
            gLastY = currText.y;
        }
        document.querySelector('#text-box').value = currText.line;
        document.querySelector('#text-box').focus();
        renderTxt()
        if (gIsDone) {
            finalMeme.href = gCanvas.toDataURL()
            finalMeme.download = 'my-meme.jpg'
        } else drawUnderLine();
    }
}

function renderTxt() {
    var currMeme = getMeme();
    currMeme.txts.forEach((txt) => {
        drawText(txt, txt.line, txt.x, txt.y);
    })
}

function drawText(text, textContent, txtX, txtY) {
    gCtx.font = `${text.size}px ${text.font}`;
    gCtx.fillStyle = text.color;
    gCtx.textAlign = text.align;
    gCtx.save();
    gCtx.strokeStyle = 'black';
    gCtx.lineWidth = 2;
    gCtx.strokeText(textContent, txtX, txtY);
    gCtx.beginPath();
    gCtx.fillText(textContent, txtX, txtY);
    gCtx.restore();
    gCtx.stroke()

}

function drawUnderLine() {
    var currText = getCurrText();
    gCtx.strokeStyle = '#ffffff';
    gCtx.setLineDash([10, 10]);
    gCtx.moveTo(0, currText.y);
    gCtx.lineTo(gCanvas.width, currText.y);
    gCtx.stroke();
}


function onCanvasDragg(ev) {
    gIsSessionOn = true;
    var currMeme = getMeme();
    var currText = currMeme.txts.find((txt) => {
        let textAreaX = txt.x - gCanvas.width / 2 + gCanvas.width * 0.05;
        let textAreaY = txt.y - gCanvas.height * 0.2;
        return (
            ev.offsetX >= textAreaX &&
            ev.offsetX <= textAreaX + gCanvas.width - gCanvas.width * 0.1 &&
            ev.offsetY >= textAreaY &&
            ev.offsetY <= textAreaY + gCanvas.height * 0.4
        )
    })
    if (!currText) return;
    setCurrText(currText);
    gIsDragging = true;
    [gLastX, gLastY] = [ev.offsetX, ev.offsetY];
    drawImg();
}

function draggImage(ev) {
    onChangeCursor(ev);
    if (!gIsDragging) return
    [gLastX, gLastY] = [ev.offsetX, ev.offsetY];
    var currText = getCurrText();
    currText.x = gLastX;
    currText.y = gLastY;
    drawImg();
}

function mobileDraggImage(ev) {
    ev.preventDefault();
    onChangeCursor(ev);
    if (!gIsDragging) return
    var canvasY = document.querySelector('.meme-header').offsetHeight;
    var canvasX = window.innerWidth * 0.05;
    [gLastX, gLastY] = [ev.touches[0].pageX - canvasX, ev.touches[0].pageY - canvasY];
    var currText = getCurrText();
    currText.x = gLastX;
    currText.y = gLastY;
    drawImg();
}


function handleMouseUp() {
    var currText = getCurrText();
    if (!currText) return
    gIsDragging = false;

}

function handleTouchEnd(ev) {
    ev.preventDefault();
    var currText = getCurrText();
    if (!currText) return
    gIsDragging = false;
}

function onAddTextBox() {
    let txtInput = document.querySelector('#text-box').value;
    document.querySelector('#text-box').focus();

    if (!txtInput) return;
    document.querySelector('#text-box').value = '';
    addTextBox()
    drawImg();

}

function onRemoveTextBox() {
    var currText = getCurrText();
    var currMeme = getMeme();
    if (currMeme.txts.length > 1) {
        removeText();
    } else {
        document.querySelector('#text-box').value = '';
        document.querySelector('#text-box').focus();
        currText.line = '';
    }
    drawImg();
}

function onAddText(elText) {
    addText(elText);
    drawImg();

}

function onChangFontSize(elSize) {
    document.querySelector('#font-range').innerHTML = elSize;
    changeFontSize(+elSize);
    drawImg();
}

function onChangTextColor(elColor) {
    changeTextColor(elColor);
    drawImg();
}

function onChangFontStyle(elFont) {
    changFontStyle(elFont);
    drawImg();
}

function onChangeAlignment(elAlign) {
    changeAlignment(elAlign, gCanvas.width);
    drawImg();
}

function onOpenGallery() {
    window.location = 'index.html'
}

function onDownloadMeme(elLink) {
    gIsDone = true;
    drawImg(elLink);

}

function getCanvasWidth() {
    return gCanvas.width;
}

function onChangeCursor(ev) {
    var currMeme = getMeme();
    var isOnText = currMeme.txts.some((txt) => {
        let textAreaX = txt.x - gCanvas.width / 2 + gCanvas.width * 0.05;
        let textAreaY = txt.y - gCanvas.height * 0.2;
        return (
            ev.offsetX >= textAreaX &&
            ev.offsetX <= textAreaX + gCanvas.width - gCanvas.width * 0.1 &&
            ev.offsetY >= textAreaY &&
            ev.offsetY <= textAreaY + gCanvas.height * 0.4
        )
    })
    if (isOnText) {
        document.body.style.cursor = 'all-scroll';
    } else {
        document.body.style.cursor = 'context-menu';
    }
}


function getCanvasSize(width, height) {
    var w = window.outerWidth
    var h = window.outerHeight
    var picWidth;
    var picHeight;
    var screenSize = (w > 740) ? 0.6 : 0.9;
    if (width > height) {
        var ratio = height / width;
        picWidth = w * screenSize
        picHeight = w * ratio * screenSize
    } else {
        var ratio = width / height;
        picWidth = h * ratio * screenSize
        picHeight = h * screenSize6
    }
    return { width: picWidth, height: picHeight }
}


function onMobileCanvasDragg(ev) {
    ev.preventDefault();
    gIsSessionOn = true;
    var currMeme = getMeme();
    var canvasY = document.querySelector('.meme-header').offsetHeight;
    var canvasX = window.innerWidth * 0.05;
    var currText = currMeme.txts.find((txt) => {
        let textAreaX = txt.x - gCanvas.width / 2 + gCanvas.width * 0.05;
        let textAreaY = txt.y - gCanvas.height * 0.2;
        return (
            ev.touches[0].pageX - canvasX >= textAreaX &&
            ev.touches[0].pageX - canvasX <= textAreaX + gCanvas.width - gCanvas.width * 0.1 &&
            ev.touches[0].pageY - canvasY >= textAreaY &&
            ev.touches[0].pageY - canvasY <= textAreaY + gCanvas.height * 0.4

        )
    })
    if (!currText) return;
    setCurrText(currText);
    gIsDragging = true;
    [gLastX, gLastY] = [ev.touches[0].pageX - canvasX, ev.touches[0].pageY - canvasY];
    drawImg();
}



