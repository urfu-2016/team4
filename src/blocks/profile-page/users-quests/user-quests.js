/**
 * created by trefilovandrey on 25.03.17.
 */

/* eslint no-unused-vars: 'off' */
function getUsersQuests() {
    document.querySelector('.in-process-quests').classList.add('hidden');
    document.querySelector('.users-quests').classList.remove('hidden');
}

/* eslint no-unused-vars: 'off' */
function getInProcessQuests() {
    document.querySelector('.users-quests').classList.add('hidden');
    document.querySelector('.in-process-quests').classList.remove('hidden');
}
