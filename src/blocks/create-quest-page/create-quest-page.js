/* globals createFlashMessage */
/* eslint no-alert:0 */
let form = block.querySelector('form');
let photoListBlock = block.querySelector('.photo-list');
let publishBtn = block.querySelector('.publish-btn');
let removeBtn = block.querySelector('.remove-btn');
let publishInput = block.querySelector('.publish');
let nameInput = block.querySelector('.create-quest-page-quest-title input');
let counter = block.querySelector('.counter');

publishBtn.addEventListener('click', () => {
    publishInput.checked = 'true';
});
removeBtn.addEventListener('click', () => {
    let removeURL = window.location.pathname
        .slice(0, window.location.pathname.indexOf('edit'));
    form.setAttribute('action', removeURL + 'remove');
    form.submit();
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
