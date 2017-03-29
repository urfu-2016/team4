/* eslint no-unused-vars: 'off' */
function showLogin() {
    document.querySelectorAll('.general-shade').forEach(shade => {
        shade.style.display = 'block';
    });
    let loginForm = document.querySelector('.general-login-form');
    loginForm.style.display = 'block';
}

function hideLogin() {
    let loginForm = document.querySelector('.general-login-form');
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
            });
    });
}
function addListeners() {
    document.querySelectorAll('.general-login-form').forEach(block => {
        shadeClickHandle(block);
        loginSubmitHandle(block.querySelector('form'));
    });
}
addListeners();
