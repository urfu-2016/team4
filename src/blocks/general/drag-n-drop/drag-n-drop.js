/* globals addListenerMulti */
/* globals createFlashMessage */
function initBlock(block) {
    let isAdvancedUpload = (function () {
        let div = document.createElement('div');

        return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) &&
            'FormData' in window && 'FileReader' in window &&
            !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    })();
    let droppedFile = false;
    let uploadingBlock = block.querySelector('.uploading');
    let inputBlock = block.querySelector('.input');
    let imgBlock = block.querySelector('img');
    let uploadBtn = block.querySelector('.upload-btn');
    let inputFile = block.querySelector('input[type="file"]');
    let loadedEvent = new Event('imgLoaded');

    inputFile.addEventListener('change', e => {
        let files = e.target.files;
        if (files.length) {
            makePreview(files[0]);
        }
    });

    uploadBtn.addEventListener('click', () => {
        uploadingBlock.style.display = 'block';
        inputBlock.style.display = 'none';
        uploadBtn.style.display = 'none';
        block.classList.add('is-uploading');
        uploadFile(imgBlock.src)
            .then(link => {
                uploadingBlock.style.display = 'none';
                block.replaceWith(imgBlock);
                let imgBlockClone = imgBlock.cloneNode();
                imgBlockClone.src = link;
                /*
                 чтобы пользователь не видел мигающую картинку, нужно не просто поменять src,
                 а подменить на уже загруженный склоннированный img с подставленной новой ссылкой
                  */
                imgBlockClone.addEventListener('load', () => {
                    imgBlock.replaceWith(imgBlockClone);
                });
                block.dispatchEvent(loadedEvent);
            })
            .catch(error => {
                uploadingBlock.style.display = 'none';
                inputBlock.style.display = 'block';
                if (error.message && error.message === 'Failed to fetch') {
                    createFlashMessage('Нет соединения с сервером', 'error');
                } else if (error === 404) {
                    createFlashMessage('Ошибка: невозможно загрузить изображение', 'error');
                } else if (error === 413) {
                    createFlashMessage('Данное изображение слишком большое. Максимальный размер: 5мб', 'error');
                } else {
                    createFlashMessage('Неизвестная ощибка', 'error');
                    console.error(error);
                }
            });
    });

    if (isAdvancedUpload) {
        block.classList.add('has-advanced-upload');
        addListenerMulti(block, 'drag dragstart dragend dragover dragenter dragleave drop', function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
        addListenerMulti(block, 'dragover dragenter', function () {
            block.classList.add('is-dragover');
        });
        addListenerMulti(block, 'dragleave dragend drop', function () {
            block.classList.remove('is-dragover');
        });
        addListenerMulti(block, 'drop', function (e) {
            droppedFile = e.dataTransfer.files[0];
            console.log(droppedFile);
            makePreview(droppedFile);
        });
    }

    function checkExt(file) {
        if (file.type.startsWith('image')) {
            return true;
        }
        createFlashMessage('Данный файл не является изображением', 'error');

        return false;
    }

    function makePreview(file) {
        if (!checkExt(file)) {
            return;
        }
        if (!('FileReader' in window)) {
            return;
        }
        let reader = new FileReader();
        reader.addEventListener('load', function () {
            imgBlock.style.display = 'block';
            imgBlock.src = reader.result;
            block.style.height = 'auto';
            uploadBtn.style.opacity = 1;
            uploadBtn.style.visibility = 'visible';
        }, false);
        reader.readAsDataURL(file);
    }

    function uploadFile(fileData) {
        let url = '/uploadPhoto';

        return fetch(url, {
            method: 'post',
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: fileData
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

