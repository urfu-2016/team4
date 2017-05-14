/* globals createFlashMessage */

block.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', formSubmited.bind(null, form));
});

function formSubmited(form, e) {
    e.preventDefault();
    let block = form.parentNode;
    let submitBtn = block.querySelector('input');
    let checkingBlock = block.querySelector('.checking');
    let passedBlock = block.querySelector('.passed');
    let statusWrapper = block.querySelector('.status-wrapper');
    if (!navigator.geolocation) {
        createFlashMessage('Определение геолокации не поддерживается данным браузером', 'error');

        return;
    }
    submitBtn.disabled = 'true';
    passedBlock.style.display = 'none';
    checkingBlock.style.display = 'flex';
    statusWrapper.classList.remove('hidden');
    navigator.geolocation.getCurrentPosition(position => {
        checkGeolocation(position.coords, form.action)
            .then(() => {
                checkingBlock.style.display = 'none';
                passedBlock.style.display = 'flex';
                submitBtn.style.display = 'none';
            })
            .catch(error => {
                statusWrapper.classList.add('hidden');
                submitBtn.disabled = false;
                if (error.message && error.message === 'Failed to fetch') {
                    createFlashMessage('Нет соединения с сервером', 'error');
                } else if (error === 400) {
                    createFlashMessage('Данное изображение находится в другом месте', 'error');
                } else {
                    createFlashMessage('Неизвестная ошибка', 'error');
                    console.error(error);
                }
            });
    }, error => {
        createFlashMessage('Невозможно определить геолокацию', 'error');
        statusWrapper.classList.add('hidden');
        submitBtn.disabled = false;
        console.error(error);
    }, {
        enableHighAccuracy: true,
        maximumAge: 50000,
        timeout: 10000
    });
}

function checkGeolocation(position, url) {
    return fetch(url, {
        method: 'post',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            lat: position.latitude,
            lng: position.longitude
        })
    }).then(res => {
        if (res.status !== 200) {
            throw res.status;
        }

        return res.text();
    });
}

if (!navigator.geolocation) {
    createFlashMessage('Определение геолокации не поддерживается данным браузером', 'error');
    block.querySelectorAll('.checkin-btn').forEach(btn => {
        btn.remove();
    });
}
