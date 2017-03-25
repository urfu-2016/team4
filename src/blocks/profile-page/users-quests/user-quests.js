/**
 * created by trefilovandrey on 25.03.17.
 */

/* eslint no-unused-vars: 'off' */
function getUsersQuests() {
    document.querySelector('.profile-page-users-quests').innerHTML = '{{>quest-list quests=usersQuests}}';
}

/* eslint no-unused-vars: 'off' */
function getInProcessQuests() {
    document.querySelector('.profile-page-users-quests').innerHTML = '{{>quest-list quests=inProcessQuests}}';
}
