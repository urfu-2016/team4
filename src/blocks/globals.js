/* eslint no-unused-vars:0 */
function createFlashMessage(text, type) {
    let wrapper = document.querySelector('.flash-wrapper');
    let flash = document.createElement('div');
    let flashInner = document.createElement('div');
    let innerText = document.createTextNode(text);
    flashInner.appendChild(innerText);
    flash.appendChild(flashInner);
    flash.classList.add('flash');
    if (type) {
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
