'use strict'


function saveToStorage(key, value) {
    var str = JSON.stringify(value);
    localStorage.setItem(key, str);
}
function loadFromStorage(key) {
    var str = localStorage.getItem(key)
    return JSON.parse(str)
}

function getRandomId() {
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (var i = 1; i <= 8; i++) {
        id += chars.charAt(Math.floor(Math.random() * 36));
    }
    return id;
}


