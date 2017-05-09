/* eslint no-unused-vars:0 */
let intel = require('intel');

function createFlashMessage(text, type) {
    let wrapper = document.querySelector('.flash-wrapper');
    let flash = document.createElement('div');
    let flashInner = document.createElement('div');
    let innerText = document.createTextNode(text);
    flashInner.appendChild(innerText);
    flash.appendChild(flashInner);
    flash.classList.add('flash');
    if (type) {
        intel.info(type + 'сгенерировано');
        flash.classList.add(type);
    }
    wrapper.appendChild(flash);
    setTimeout(() => {
        if (wrapper.contains(flash)) {
            wrapper.removeChild(flash);
        }
    }, 10000);

    flash.addEventListener('click', () => {
        wrapper.removeChild(flash);
    });
}

/* добавлякем несколько listeners на элемент
 ** @param {DOMElement} element - DOM element
 ** @param {string} eventNames - имена событий через пробел
 ** @param {Function} listener - функция обработки события
 */
function addListenerMulti(element, eventNames, listener) {
    let events = eventNames.split(' ');
    for (let i = 0, iLen = events.length; i < iLen; i++) {
        element.addEventListener(events[i], listener, false);
    }
}

/* узнаем свойства курсора или touch'а
 ** @param {Event} e - Событие тача или курсора
 ** @param {string} eventNames - имена событий через пробел
 ** @returns {Object} - исвойства курсора или тача(только нажатие первого пальца)
 */
function getCursorInfo(e) {
    if ('touches' in e) {
        return e.touches[0];
    }

    return e;
}
