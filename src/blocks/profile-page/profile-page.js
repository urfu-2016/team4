/**
 * created by trefilovandrey on 24.03.17.
 */

function filterQuests() {
    let url = '/questlist';
    let questBlockElements = document.querySelector('.quests-block');
    let params =
        '?value=name' +
        '&reverse=false' +
        '&include=&render=true';
    fetch(url + params)
        .then(res => {
            questBlockElements.innerHTML = '';

            return res.text();
        })
        .then(body => {
            questBlockElements.innerHTML = body;
        })
        .catch(console.error);
}

filterQuests();
