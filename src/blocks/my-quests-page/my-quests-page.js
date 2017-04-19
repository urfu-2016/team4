/* eslint no-unused-vars: 'off' */
let listElement = block.querySelector('.quests');
let loader = block.querySelector('.general-loader');
function getQuestsForTab(value) {
    let url = '/quests/my';
    let params = '?' + value + '&render';
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
}

function tabChanged(tab) {
    getQuestsForTab(tab.value);
}

block.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', tabChanged.bind(this, input));
});

getQuestsForTab('active');

