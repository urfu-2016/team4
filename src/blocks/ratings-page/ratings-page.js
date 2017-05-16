/* globals createFlashMessage */
let usersBlock = block.querySelector('.users');
let nameInput = block.querySelector('.search input');
let foundBlock = block.querySelector('.searched');
let loader = block.querySelector('.loader');
let typeTimer;
nameInput.addEventListener('keyup', searchChanged);

function searchChanged() {
    if (typeTimer) {
        clearTimeout(typeTimer);
    }
    typeTimer = setTimeout(refreshRatings, 500);
}

function refreshRatings() {
    foundBlock.innerHTML = '';
    if (!nameInput.value) {
        usersBlock.style.display = 'block';
        loader.style.display = 'none';

        return;
    }

    usersBlock.style.display = 'none';
    loader.style.display = 'block';
    let params = '?name=' + nameInput.value;
    let url = '/rating/find';
    fetch(url + params, {
        credentials: 'include'
    })
    .then(res => {
        loader.style.display = 'none';
        if (res.status !== 200) {
            throw res.status;
        }

        return res.text();
    })
    .then(body => {
        foundBlock.innerHTML = body;
    })
    .catch(error => {
        if (error.message && error.message === 'Failed to fetch') {
            createFlashMessage('Нет соединения с сервером', 'error');
            foundBlock.innerHTML = 'Ошибка: Данные по юзерам не найдены';
        } else if (error === 404) {
            createFlashMessage('Ошибка: Данные по юзерам не найдены', 'error');
            foundBlock.innerHTML = 'Ошибка: Данные по юзерам не найдены';
        } else {
            createFlashMessage('Неизвестная ошибка, невозможно загрузить данные', 'error');
            foundBlock.innerHTML = 'Неизвестная ошибка';
            console.log(error);
        }
    });
}
