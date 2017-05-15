/* globals createFlashMessage */
let addButton = block.querySelector('.add').parentNode;
let deleteButtons = block.querySelectorAll('.delete');

addButton.addEventListener('click', () => {
    let sample = block.querySelector('.sample');
    let newLine = sample.cloneNode(true);
    newLine.classList.remove('hidden');
    newLine.classList.remove('sample');

    let lines = [].slice.call(block.querySelectorAll('.profile-page-information-line'))
        .filter(item => {
            return !item.classList.contains('hidden');
        });

    let lastLine = lines.pop();

    let lastIndex = -1;

    if (lastLine) {
        lastIndex = lastLine
            .childNodes[0]
            .innerText;
    }

    let index_ = (parseInt(lastIndex, 10) + 1);

    newLine.childNodes[0].innerText = index_.toString();

    block.insertBefore(newLine, sample);
    sample.initFunction(newLine);
    addDeleteListener(newLine.querySelector('.delete'));

    addInfo({name: '', value: '', index: index_, edit: false})
        .catch(error => {
            if (error.message && error.message === 'Failed to fetch') {
                createFlashMessage('Нет соединения с сервером', 'error');
            } else if (error === 404) {
                createFlashMessage('Ошибка: не удалось обновить информацию', 'error');
            } else {
                createFlashMessage('Неизвестная ошибка', 'error');
                console.error(error);
            }
        });

    if (lines.length >= 13) {
        addButton.childNodes[1].disabled = true;
    }
});

function addDeleteListener(button) {
    button.addEventListener('click', () => {
        let lines = [].slice.call(block.querySelectorAll('.profile-page-information-line'))
            .filter(item => {
                return !item.classList.contains('hidden');
            });

        if (lines.length <= 15) {
            addButton.childNodes[1].disabled = false;
        }
    });
}

deleteButtons.forEach(button => {
    addDeleteListener(button);
});

function addInfo(info) {
    let url = '/profile/addInfo';

    return fetch(url, {
        method: 'post',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(info)
    }).then(res => {
        if (res.status !== 200) {
            throw res.status;
        }

        return res.text();
    });
}
