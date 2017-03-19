/* eslint no-unused-vars: 'off' */
function filterQuests() {
    let url = '/questlist';
    let questQueryElements = document.querySelectorAll('.quests-block');
    questQueryElements.forEach(el => {
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
