function showLogin() {
    document.querySelectorAll('.general-shade').forEach(shade => {
        shade.style.display = 'block';
    });
    let loginForm = document.querySelector('.general-popup-form-login').parentNode;
    loginForm.style.display = 'block';
}

function showRegister() {
    document.querySelectorAll('.general-shade').forEach(shade => {
        shade.style.display = 'block';
    });
    let loginForm = document.querySelector('.general-popup-form-register').parentNode;
    loginForm.style.display = 'block';
}

block.querySelectorAll('.login').forEach(loginBlock => {
    loginBlock.addEventListener('click', showLogin);
});

block.querySelectorAll('.register').forEach(loginBlock => {
    loginBlock.addEventListener('click', showRegister);
});

