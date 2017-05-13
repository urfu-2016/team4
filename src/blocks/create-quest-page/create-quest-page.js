/* globals createFlashMessage */
/* eslint no-alert:0 */
let form = block.querySelector('form');
let photoListBlock = block.querySelector('.photo-list');
let publishBtn = block.querySelector('.publish-btn');
let publishInput = block.querySelector('.publish');
let nameInput = block.querySelector('.create-quest-page-quest-title input');
let counter = block.querySelector('.counter');

publishBtn.addEventListener('click', () => {
    publishInput.checked = 'true';
});
form.addEventListener('submit', e => {
    if (photoListBlock.hasImageSet()) {
        if (!confirm('Незагруженные изображения не будут сохранены')) {
            e.preventDefault();
        }
    }
    if (!nameInput.value) {
        createFlashMessage('Название квеста не должно быть пустым', 'error');
        e.preventDefault();
    } else if (!Number(counter.value)) {
        createFlashMessage('Не загружено ни одного изображения', 'error');
        e.preventDefault();
    }
});
