/* globals createFlashMessage */

let typeTimer;
let loader = block.querySelector('.general-loader');
function filtersChanged() {
    if (typeTimer) {
        clearTimeout(typeTimer);
    }
    handleBlocks();
    typeTimer = setTimeout(filterQuests, 500);
}

function filterQuests() {
    let url = '/quests';
    let questBlockElements = block.querySelectorAll('.quests-block');
    questBlockElements.forEach(el => {
        let queryElement = el.querySelector('.quest-query');
        let listElement = el.querySelector('.quests');
        let value = queryElement.querySelector('.general-combo-box select').value;
        let reverse = queryElement.querySelector('.general-check-box input').checked;
        let include = queryElement.querySelector('.general-search-bar input').value;
        let greaterThan = queryElement.querySelector('.general-numeric-input input').value;
        let params =
            '?render&Quest__opt__limit=50&' + value.replace('__', '__opt__sort__') + '=' +
            (reverse ? '-1' : '1');
        if (include) {
            params += '&' + value + '__include=' + include;
        }

        if (greaterThan) {
            params += '&' + value + '__gte=' + greaterThan;
        }
        listElement.innerHTML = loader.outerHTML;

        fetch(url + params, {
            credentials: 'include'
        })
        .then(res => {
            if (res.status !== 200) {
                throw res.status;
            }

            return res.text();
        })
        .then(body => {
            listElement.innerHTML = body;
        })
        .catch(error => {
            if (error.message && error.message === 'Failed to fetch') {
                createFlashMessage('Нет соединения с сервером', 'error');
                listElement.innerHTML = 'Ошибка: Данные по квестам не найдены';
            } else if (error === 404) {
                createFlashMessage('Ошибка: Данные по квестам не найдены', 'error');
                listElement.innerHTML = 'Ошибка: Данные по квестам не найдены';
            } else {
                createFlashMessage('Неизвестная ошибка, не возможно загрузить данные', 'error');
                listElement.innerHTML = 'Неизвестная ошибка';
                console.log(error);
            }
        });
    });
}

function handleBlocks() {
    let questBlockElements = block.querySelectorAll('.quests-block');
    questBlockElements.forEach(el => {
        let numericInput = el.querySelector('.general-numeric-input');
        let searchBar = el.querySelector('.general-search-bar');
        let comboBoxSelect = el.querySelector('.general-combo-box select');

        if (['Quest__title', 'Author__name'].indexOf(comboBoxSelect.value) === -1) {
            numericInput.classList.remove('hidden');
            searchBar.querySelector('input').value = '';
            searchBar.classList.add('hidden');
        } else {
            numericInput.classList.add('hidden');
            numericInput.querySelector('input').value = '';
            searchBar.classList.remove('hidden');
        }
    });
}

block.querySelectorAll('input:not([type="number"]), input:not([type="text"]), select')
    .forEach(input => {
        input.addEventListener('change', filtersChanged);
    });

block.querySelectorAll('input[type="number"], input[type="text"]')
    .forEach(input => {
        input.addEventListener('keyup', filtersChanged);
    });

filtersChanged();

