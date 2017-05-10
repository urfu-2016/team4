/* globals createFlashMessage */
let changeAvatarBtn = block.querySelector('.change-avatar-btn');
let dragNdrop = block.querySelector('.drag-n-drop');
let cancelAvatarBtn = block.querySelector('.cancel-avatar-btn');
let dragNdropClone;
let dragNdropInitFunction;
let avatarImg = block.querySelector('.avatar');
let prevSrc = avatarImg.src;

if (dragNdrop) {
    dragNdropClone = dragNdrop.cloneNode(true);
    dragNdropInitFunction = dragNdrop.initFunction;
    changeAvatarBtn.addEventListener('click', () => {
        cancelAvatarBtn.style.display = 'block';
        changeAvatarBtn.style.display = 'none';
        avatarImg.style.display = 'none';
        dragNdrop.style.display = 'block';
    });

    cancelAvatarBtn.addEventListener('click', () => {
        cancelAvatarBtn.style.display = 'none';
        changeAvatarBtn.style.display = 'block';
        avatarImg.style.display = 'block';
        dragNdrop.style.display = 'none';
    });

    dragNdrop.addEventListener('imgLoaded', imgLoadedSlot);
}

function imgLoadedSlot() {
    let newAvatarImg = block.querySelector('.new-avatar');
    avatarImg.src = newAvatarImg.src;
    avatarImg.style.display = 'block';
    dragNdrop.removeEventListener('imgLoaded', this);
    dragNdrop = dragNdropClone;
    dragNdropInitFunction(dragNdrop);
    dragNdrop.addEventListener('imgLoaded', imgLoadedSlot);
    block.insertBefore(dragNdrop, changeAvatarBtn);
    newAvatarImg.remove();
    dragNdropClone = dragNdrop.cloneNode(true);
    cancelAvatarBtn.style.display = 'none';
    changeAvatarBtn.style.display = 'block';
    linkImage(avatarImg.src)
        .then(() => {
            prevSrc = avatarImg.src;
        })
        .catch(error => {
            avatarImg.src = prevSrc;
            if (error.message && error.message === 'Failed to fetch') {
                createFlashMessage('Нет соединения с сервером', 'error');
            } else if (error === 404) {
                createFlashMessage('Ошибка: невозможно установить изображение', 'error');
            } else {
                createFlashMessage('Неизвестная ошибка', 'error');
                console.error(error);
            }
        });
}

function linkImage(src) {
    let url = '/profile';

    return fetch(url, {
        method: 'post',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            url: src
        })
    }).then(res => {
        if (res.status !== 200) {
            throw res.status;
        }

        return res.text();
    });
}
