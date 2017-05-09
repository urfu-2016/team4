/* globals createFlashMessage */
let listElement = block.querySelector('.quests');
let loader = block.querySelector('.general-loader');
let intel = require('intel');
function getQuestsForTab(value) {
    let url = '/quests/my';
    let params = '?' + value + '&render';
    listElement.innerHTML = loader.outerHTML;
    fetch(url + params, {
        credentials: 'include'
    })
        .then(res => {
            if (res.status !== 200) {
                intel.warn(res.status);
                throw res.status;
            }

            return res.text();
        })
        .then(body => {
            listElement.innerHTML = body;
        })
        .catch(error => {
            if (error.message && error.message === 'Failed to fetch') {
                intel.warn(error.message + ' Нет соединения с сервером');
                createFlashMessage('Нет соединения с сервером', 'error');
                listElement.innerHTML = 'Ошибка: Данные по квестам не найдены';
            } else if (error === 404) {
                intel.warn('Ошибка: Данные по квестам не найдены');
                createFlashMessage('Ошибка: Данные по квестам не найдены', 'error');
                listElement.innerHTML = 'Ошибка: Данные по квестам не найдены';
            } else {
                intel.warn('Неизвестная ошибка' + error);
                createFlashMessage('Неизвестная ошибка, не возможно загрузить данные', 'error');
                listElement.innerHTML = 'Неизвестная ошибка';
                console.log(error);
            }
        });
}

function tabChanged(tab) {
    getQuestsForTab(tab.value);
}

block.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', tabChanged.bind(this, input));
});

getQuestsForTab('active');

