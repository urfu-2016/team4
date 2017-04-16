/* eslint no-unused-vars: 'off' */
function hideRegister() {
    let loginForm = document.querySelector('.general-popup-form-register').parentNode;
    loginForm.style.display = 'none';
}

function shadeClickHandle() {
    document.querySelectorAll('.general-shade').forEach(shade => {
        shade.addEventListener('click', () => {
            hideRegister();
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
                password: form.querySelector('input[name="password"]').value,
                passwordRepeat: form.querySelector('input[name="password-repeat"]').value,
                name: form.querySelector('input[name="username"]').value
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
            .catch(console.error);
    });
}
function addListeners() {
    document.querySelectorAll('.general-popup-form-register').forEach(block => {
        shadeClickHandle(block.parentNode);
        loginSubmitHandle(block.querySelector('form'));
    });
}
addListeners();
