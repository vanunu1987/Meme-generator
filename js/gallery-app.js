var gKeyFontSize = 16
var gImgsClass=''

function initGallery() {
    createImgs();
    renderGallery(getGalleryImgs())
    renderContinerKeyWord()

}


function renderGallery(galleryImgs) {
    var str = ""
    galleryImgs.forEach((img) => {
        var viewRate = loadFromStorage(img.keywords)-16
        if (viewRate===-16) viewRate=0;
        str += ` <div class="div-footer ${gImgsClass}">
                    <div class="image ${gImgsClass}" data-img="img-${img.id}"
                    onclick="choosImg(${img.id})" 
                    style="background-image: url('./img/img-${img.id}.jpg')"> 
                    </div>
                    <div class="footer-content flex">
                         <span class="keyword-footer"> ${img.keywords}</span>
                         <span class="view-keyword">👁</span>
                         <span class="view-keyword">${viewRate}</span>
                    </div>      
                </div>`
    })
    document.querySelector(".image-container").innerHTML = str
}

function choosImg(id) {
    var imgs = getGalleryImgs();
    var img = imgs.find((img) => {
        return img.id === id;
    })
    saveToStorage('CurrImg', img);
    saveToStorage('allImgs', gImgs);
    window.location = 'generator.html';
}

function renderSearchKeyWord(keyWords) {
    var str = `<button>x</button>`
    keyWords.forEach((keyWord) => {
        str += `<option value="${keyWord}" ></option>`
    })
    console.log(str);
    
    document.querySelector("#key-word").innerHTML = str
}

function searchKeyWords(str) {
    strLow = str.toLowerCase()
    var keyWords = getKeyWord().slice()

    filterWords = keyWords.filter((word) => {
        word = word.join('')
        return word.search(strLow) !== -1
    })
    var uniqueItems = Array.from(new Set(filterWords.flat()))
    if (uniqueItems.join('') === strLow) choosKey(uniqueItems.join(''));

    renderSearchKeyWord(uniqueItems)
    sortImgArr(uniqueItems)

}

function sortImgArr(sortKeyWordArr) {
    var imgs = getGalleryImgs().slice()
    var filteredImgs = imgs.filter((img) => {
        return sortKeyWordArr.find((key) => {
            return (img.keywords).find((imgKey) => {
                return imgKey === key
            })
        })
    })
    renderGallery(filteredImgs)
}

function renderContinerKeyWord() {
    var keyWords = getKeyWord().slice()
    var uniqueWords = Array.from(new Set(keyWords.flat()))
    var str = ''
    uniqueWords.forEach((keyWord) => {
        var fontSaiz = loadFromStorage(keyWord)
        if (!fontSaiz) saveToStorage(keyWord, 16)
        str += `<span onclick="choosKey(this.innerText)" id="key-word-bar ${keyWord}"
        style="font-size:${fontSaiz}px">${keyWord}</span>`
    })
    document.querySelector("#key-word-continer").innerHTML = str
}

function choosKey(value) {
    var size = loadFromStorage(value)
    if (!size) saveToStorage(value, 16)
    else {
        size++
        saveToStorage(value, size)
    }
    renderContinerKeyWord()
    var imgs = getGalleryImgs()
    var filterImgg = imgs.filter((img) => {
        return img.keywords.join('') === value
    })
    renderGallery(filterImgg);
}

function toggleGallery() {
    document.querySelector('.image-container').classList.toggle('changeGallery')
    var imgs = document.querySelectorAll('.image')
    var divFooter = document.querySelectorAll('.div-footer')
    imgs.forEach((img)=>{
        img.classList.toggle('changeImg')
    })
    divFooter.forEach((div)=>{
        div.classList.toggle('changeImg')
    })
    if (!gImgsClass) gImgsClass='changeImg'
    else gImgsClass=''
}

function toggleKeyword(){

    document.querySelector('.key-word-continer').classList.toggle('hide')

}