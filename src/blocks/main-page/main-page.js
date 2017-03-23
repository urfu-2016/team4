/* eslint no-unused-vars: 'off' */
let typeTimer;
function filtersChanged() {
    if (typeTimer) {
        clearTimeout(typeTimer);
    }

    typeTimer = setTimeout(filterQuests, 500);
}

function filterQuests() {
    let url = '/questlist';
    let questBlockElements = document.querySelectorAll('.quests-block');
    questBlockElements.forEach(el => {
        let queryElement = el.querySelector('.quest-query');
        let listElement = el.querySelector('.quests');
        let value = queryElement.querySelector('select').value;
        let reverse = queryElement.querySelector('input[type=checkbox]').checked;
        let include = queryElement.querySelector('input[type=text]').value;
        let params =
            '?value=' + value +
            '&reverse=' + reverse +
            '&include=' + include + '&render=true';
        fetch(url + params)
            .then(res => {
                listElement.innerHTML = '';

                return res.text();
            })
            .then(body => {
                listElement.innerHTML = body;
            })
            .catch(console.error);
    });
}

filterQuests();
