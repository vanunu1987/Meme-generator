'use strict'
////// GALLERY VARS ///////
var gNextId = 0;
var gKeyWords = [['think'], ['surprised'], ['scared'], ['sucsses'], ['happy'], ['happy'], ['serious'], ['surprised'], ['think'], ['scared']];
var gImgs;

///// MEMES VARS //////////
var gMeme;
var gCurrImg;
var gLineIdx = 0;
var gCurrText;

////// MEMES FUNCTIONS //////////

function createMeme() {
    let meme = {
        selectedImgId: gCurrImg.id,
        txts: [
            createTextLine()
        ]
    }
    gMeme = meme;
    gCurrText = gMeme.txts[0];
}

function createTextLine() {
    return {

        id: getRandomId(),
        line: '',
        size: 30,
        align: 'center',
        color: '#ffffff',
        font: 'Impact',
        x: null,
        y: 50
    }
}

function getMemeImgUrl() {
    gCurrImg = loadFromStorage('CurrImg');
    return gCurrImg.url;
}

function getMeme() {
    return gMeme;
}

function getCurrText() {
    return gCurrText;
}
function setCurrText(currText) {
    gCurrText = gMeme.txts.find((txt) => {
        return txt.id === currText.id
    })
}



function removeText() {
    let textIdx = gMeme.txts.findIndex((txt) => {
        return txt.id === gCurrText.id
    })
    gLineIdx--;
    gMeme.txts.splice(textIdx, 1);
    gCurrText = gMeme.txts[gLineIdx];
}

function addTextBox() {
    var canvasWidth  = getCanvasWidth();
    var checkEmpty = gMeme.txts.find((txt) => {
        return txt.line === '';
    })
    if (checkEmpty) {
        gCurrText = checkEmpty;
        return;
    }
    gLineIdx++;
    gMeme.txts[gLineIdx] = createTextLine();
    gCurrText = gMeme.txts[gLineIdx];
    gCurrText.x = canvasWidth / 2;
    var prevIdx = (!gLineIdx) ? gLineIdx : gLineIdx - 1;
    gCurrText.y = gMeme.txts[prevIdx].y + canvasWidth  * 0.2;
}


function addText(txt) {
    gCurrText.line = txt;
}

function changeFontSize(size) {
    gCurrText.size = size;
};

function changeTextColor(color) {
    gCurrText.color = color;
}

function changFontStyle(font) {
    gCurrText.font = font;
}

function changeAlignment(align,width) {
    switch (align){
        case 'left':
        gCurrText.x = width * 0.05
        gCurrText.align = align;
        break;
        case 'center':
        gCurrText.x = width / 2
        gCurrText.align = align;
        break;
        case 'right':
        gCurrText.x = width - width * 0.05
        gCurrText.align = align;
        break;
    }
    // gCurrText.align = align;
}

/////////// GALLERY FUNCTIONS ///////////

function createImgs() {
    var imgs = [];
    for (var i = 0; i < 10; i++) {
        var url = `./img/img-${i}.jpg`
        var img = createImg(url, gKeyWords[i]);
        imgs[i] = img;
    }
    gImgs = imgs;
}

function createImg(url, keywords) {
    var img = {
        id: gNextId++,
        url: url,
        keywords: keywords
    }
    return img;

}

function getKeyWord() {
    return gKeyWords
}

function getGalleryImgs() {
    return gImgs
}

