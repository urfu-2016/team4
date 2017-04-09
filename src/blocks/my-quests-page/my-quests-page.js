/* eslint no-unused-vars: 'off' */
let listElement = document.querySelector('.quests');
let loader = document.querySelector('.general-loader');
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

getQuestsForTab('active');
