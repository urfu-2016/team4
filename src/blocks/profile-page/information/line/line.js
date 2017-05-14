function initBlock(block) {
    let editButton = block.querySelector('.edit').parentNode;
    let saveButton = block.querySelector('.save').parentNode;
    let deleteButton = block.querySelector('.delete').parentNode;
    let inputs = block.querySelectorAll('.input');
    let divs = block.querySelectorAll('.text');

    editButton.addEventListener('click', () => {
        editButton.classList.add('hidden');
        saveButton.classList.remove('hidden');
        inputs.forEach(el => el.setAttribute('type', 'text'));
        divs.forEach(el => el.style.display = "none");
    });

    saveButton.addEventListener('click', () => {
        saveButton.classList.add('hidden');
        editButton.classList.remove('hidden');

        var name = block.querySelector('input.param-name').value;
        var value = block.querySelector('input.param-value').value;
        var index_ = parseInt(block.querySelector('.index').innerText, 10);
        addInfo({name: name, value: value, index: index_, edit: true})
            .catch(error => {
                if (error.message && error.message === 'Failed to fetch') {
                    createFlashMessage('Нет соединения с сервером', 'error');
                } else if (error === 404) {
                    createFlashMessage('Ошибка: не удалось обновить строку', 'error');
                } else {
                    createFlashMessage('Неизвестная ошибка', 'error');
                    console.error(error);
                }
            });

        inputs.forEach(el => el.setAttribute('type', 'hidden'));
        divs.forEach(el => el.style.display = "block");
        block.querySelector('div.param-name').innerText = name;
        block.querySelector('div.param-value').innerText = value;
    });

    deleteButton.addEventListener('click', () => {
        var index_ = parseInt(block.querySelector('.index').innerText, 10);

        deleteInfo({index: index_})
            .catch(error => {
                if (error.message && error.message === 'Failed to fetch') {
                    createFlashMessage('Нет соединения с сервером', 'error');
                } else if (error === 404) {
                    createFlashMessage('Ошибка: не удалось удалить строку', 'error');
                } else {
                    createFlashMessage('Неизвестная ошибка', 'error');
                    console.error(error);
                }
            });
        block.parentNode.removeChild(block);
    });

    function deleteInfo(index) {
        let url = '/profile/deleteInfo';

        return fetch(url, {
            method: 'post',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                index: index
            })
        }).then(res => {
            if (res.status !== 200) {
                throw res.status;
            }
            return res.text();
        });
    }

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
}

block.initFunction = initBlock;
initBlock(block);

