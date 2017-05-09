/* globals createFlashMessage */

function hideLogin() {
    let loginForm = block.parentNode;
    loginForm.style.display = 'none';
}

function shadeClickHandle() {
    document.querySelectorAll('.general-shade').forEach(shade => {
        shade.addEventListener('click', () => {
            hideLogin();
        });
    });
}

function loginSubmitHandle(form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        fetch(form.action, {
            method: 'post',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: form.querySelector('input[name="email"]').value,
                password: form.querySelector('input[name="password"]').value
            })
        })
            .then(data => {
                return data;
            })
            .then(data => {
                if (data.status === 200) {
                    location.reload();
                } else {
                    return data.json();
                }
            })
            .then(data => {
                if (!data) {
                    return;
                }
                form.querySelector('.error').innerHTML = data.message;
            })
            .catch(error => {
                if (error.message && error.message === 'Failed to fetch') {
                    createFlashMessage('Нет соединения с сервером', 'error');
                } else {
                    createFlashMessage('Неизвестная ошибка. Попробуйте снова', 'error');
                    console.error(error.message);
                }
            });
    });
}
shadeClickHandle(block.parentNode);
loginSubmitHandle(block.querySelector('form'));
