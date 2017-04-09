/* eslint no-unused-vars: 'off' */
let typeTimer;
let loader = document.querySelector('.general-loader');
function filtersChanged() {
    if (typeTimer) {
        clearTimeout(typeTimer);
    }
    handleBlocks();
    typeTimer = setTimeout(filterQuests, 500);
}

function filterQuests() {
    let url = '/quests';
    let questBlockElements = document.querySelectorAll('.quests-block');
    questBlockElements.forEach(el => {
        let queryElement = el.querySelector('.quest-query');
        let listElement = el.querySelector('.quests');
        let value = queryElement.querySelector('.general-combo-box select').value;
        let reverse = queryElement.querySelector('.general-check-box input').checked;
        let include = queryElement.querySelector('.general-search-bar input').value;
        let greaterThan = queryElement.querySelector('.general-numeric-input input').value;
        let params =
            '?render&Quest__opt__limit=50&' + value.replace('__', '__opt__sort__') + '=' + (reverse ? '-1' : '1');
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
                return res.text();
            })
            .then(body => {
                listElement.innerHTML = body;
            })
            .catch(console.error);
    });
}

function handleBlocks() {
    let questBlockElements = document.querySelectorAll('.quests-block');
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

filtersChanged();
