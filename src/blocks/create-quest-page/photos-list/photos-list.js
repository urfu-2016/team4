
let cloned = block.querySelector('.new-photo').cloneNode(true);
let dragndropInitFunction = block.querySelector('.drag-n-drop').initFunction;
function reasignListeners() {
    console.log('LOADED');
    block.removeEventListener('imgLoaded', this);
    addPhotoBlock();
}
function addPhotoBlock() {
    let newPhotoBlock = cloned.cloneNode(true);
    let dragNdrop = newPhotoBlock.querySelector('.drag-n-drop');
    block.appendChild(newPhotoBlock);
    dragndropInitFunction(dragNdrop);
    dragNdrop.addEventListener('imgLoaded', reasignListeners);
}

block.querySelector('.drag-n-drop').addEventListener('imgLoaded', reasignListeners);
