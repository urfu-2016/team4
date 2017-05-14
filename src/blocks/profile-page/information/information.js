let addButton = block.querySelector('.add').parentNode;

addButton.addEventListener('click', () => {
    let sample = block.querySelector('.sample');
    let newLine = sample.cloneNode(true);
    newLine.classList.remove('hidden');
    newLine.classList.remove('sample');

    let lastLine = [].slice.call(block.querySelectorAll('.profile-page-information-line'))
        .filter(item => {return !item.classList.contains('hidden');})
        .pop();

    let lastIndex = -1;
    if(lastLine) {
        lastIndex = lastLine
            .childNodes[0]
            .innerText;
    }

    let index_ = (parseInt(lastIndex, 10) + 1);

    newLine.childNodes[0].innerText = index_.toString();

    block.insertBefore(newLine, sample);
    sample.initFunction(newLine);

    addInfo({name: "", value: "", index: index_, edit: false})
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
        body: JSON.stringify({
            info: info
        })
    }).then(res => {
        if (res.status !== 200) {
            throw res.status;
        }
        return res.text();
    });
}
