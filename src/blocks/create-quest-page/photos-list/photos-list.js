let photoBlock = block.querySelector('.new-photo');
let counter = block.querySelector('.counter');
counter.value = block.querySelectorAll('.quest-photo').length - 1;
let cloned = photoBlock.cloneNode(true);
let dragndropInitFunction = block.querySelector('.drag-n-drop').initFunction;
let photoBlockInitFunction = photoBlock.initFunction;
let imageSet = false;

function imgLoadedSlot(photoBlock) {
    let index = block.querySelectorAll('.quest-photo').length - 1;
    counter.value = Number(counter.value) + 1;
    photoBlock.querySelector('.delete-btn').style.display = 'block';
    block.removeEventListener('imgLoaded', this);
    block.removeEventListener('imgSet', imgSetSlot);
    let inputs = makeInputs(photoBlock, index);
    inputs.editedInput.checked = 'true';
    inputs.photoLinkInput.value = photoBlock.querySelector('img').src;
    addPhotoBlock();
    imageSet = false;
}

function imgSetSlot() {
    imageSet = true;
}

function addPhotoBlock() {
    let newPhotoBlock = cloned.cloneNode(true);
    let dragNdrop = newPhotoBlock.querySelector('.drag-n-drop');
    block.appendChild(newPhotoBlock);
    dragndropInitFunction(dragNdrop);
    photoBlockInitFunction(newPhotoBlock);
    dragNdrop.addEventListener('imgLoaded', imgLoadedSlot.bind(imgLoadedSlot, newPhotoBlock));
    dragNdrop.addEventListener('imgSet', imgSetSlot);
}

let dragNdrop = block.querySelector('.drag-n-drop');
dragNdrop.addEventListener('imgLoaded', imgLoadedSlot.bind(imgLoadedSlot, photoBlock));
dragNdrop.addEventListener('imgSet', imgSetSlot);

function makeInputs(photoBlock, index) {
    let editedInput = photoBlock.querySelector('.edited');
    let deletedInput = photoBlock.querySelector('.deleted');
    let photoLinkInput = photoBlock.querySelector('.photo-link');
    let photoLocInput = photoBlock.querySelector('.photo-location');
    editedInput.name = 'photo-block-' + index + '-edited';
    deletedInput.name = 'photo-block-' + index + '-deleted';
    photoLinkInput.name = 'photo-block-' + index + '-photo';
    photoLocInput.name = 'photo-block-' + index + '-location';

    return {
        editedInput: editedInput,
        deletedInput: deletedInput,
        photoLocInput: photoLocInput,
        photoLinkInput: photoLinkInput
    };
}

block.hasImageSet = function () {
    return imageSet;
};
