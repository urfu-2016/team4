/* globals createFlashMessage */
/* eslint no-alert:0 */
let form = block.querySelector('form');
let photoListBlock = block.querySelector('.photo-list');
let publishBtn = block.querySelector('.publish-btn');
let publishInput = block.querySelector('.publish');
let nameInput = block.querySelector('.create-quest-page-quest-title input');
let counter = block.querySelector('.counter');

function getCountDeletedPhotos() {
    return [].slice.apply(photoListBlock.querySelectorAll('.quest-photo'),
        [0, counter.getAttribute('value')])
        .reduce((total, questPhoto) => {
            return total + Number(questPhoto.querySelector('.deleted').checked);
        }, 0);
}

publishBtn.addEventListener('click', e => {
    let checkMissingLocation = [].slice.apply(photoListBlock.querySelectorAll('.quest-photo'),
        [0, counter.getAttribute('value')]).some(questPhoto => {
            if (questPhoto.querySelector('.deleted').checked) {
                return false;
            }
            let location = questPhoto
                .querySelector('.photo-location')
                .getAttribute('value')
                .split(', ')
                .map(coord => Number(coord));

            return location[0] === 0 && location[1] === 0;
        });
    let countDeletedPhoto = getCountDeletedPhotos();
    if (checkMissingLocation) {
        createFlashMessage('Укажите местоположение для каждого фото!', 'error');
        e.preventDefault();
    } else if (Number(counter.value) - countDeletedPhoto === 0) {
        createFlashMessage('Не загружено ни одного изображения', 'error');
        e.preventDefault();
    } else {
        publishInput.checked = 'true';
    }
});
form.addEventListener('submit', e => {
    let countDeletedPhoto = getCountDeletedPhotos();
    if (photoListBlock.hasImageSet()) {
        if (!confirm('Незагруженные изображения не будут сохранены')) {
            e.preventDefault();
        }
    }
    if (!nameInput.value) {
        createFlashMessage('Название квеста не должно быть пустым', 'error');
        e.preventDefault();
    } else if (!(Number(counter.value) - countDeletedPhoto)) {
        createFlashMessage('Не загружено ни одного изображения', 'error');
        e.preventDefault();
    }
});
