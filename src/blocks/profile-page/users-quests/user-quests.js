/* eslint no-unused-vars: 'off' */
function getUsersQuests() {
    document.querySelector('.in-process-quests').classList.add('hidden');
    document.querySelector('.users-quests').classList.remove('hidden');
}

function getInProcessQuests() {
    document.querySelector('.users-quests').classList.add('hidden');
    document.querySelector('.in-process-quests').classList.remove('hidden');
}
