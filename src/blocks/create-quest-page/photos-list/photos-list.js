/* globals createFlashMessage */
/* eslint no-undef:0 */
let photoBlock = block.querySelector('.new-photo');
let counter = block.querySelector('.counter');
counter.value = block.querySelectorAll('.quest-photo').length - 1;
let cloned = photoBlock.cloneNode(true);
let dragndropInitFunction = block.querySelector('.drag-n-drop').initFunction;
let popUpShadow = block.querySelector('.general-shade');
let popUp = block.querySelector('.pop-up');
let photoBlockInitFunction = photoBlock.initFunction;
let imageSet = false;
let currentInputForSetLocation;
let currentCheckboxEdited;
let myPlacemark;
let myMap;

function imgLoadedSlot(photoBlock) {
    let index = block.querySelectorAll('.quest-photo').length - 1;
    counter.value = Number(counter.value) + 1;
    photoBlock.querySelector('.delete-btn').style.display = 'block';
    block.removeEventListener('imgLoaded', this);
    block.removeEventListener('imgSet', imgSetSlot);
    let inputs = makeInputs(photoBlock, index);
    inputs.editedInput.checked = 'true';
    inputs.photoLinkInput.value = photoBlock.querySelector('img').src;
    addPhotoBlock();
    imageSet = false;
}

function imgSetSlot() {
    imageSet = true;
}

function addPhotoBlock() {
    let newPhotoBlock = cloned.cloneNode(true);
    addBtnBorderListener(newPhotoBlock);

    let dragNdrop = newPhotoBlock.querySelector('.drag-n-drop');
    block.appendChild(newPhotoBlock);
    dragndropInitFunction(dragNdrop);
    photoBlockInitFunction(newPhotoBlock);
    dragNdrop.addEventListener('imgLoaded', imgLoadedSlot.bind(imgLoadedSlot, newPhotoBlock));
    dragNdrop.addEventListener('imgSet', imgSetSlot);
}

let dragNdrop = block.querySelector('.drag-n-drop');
dragNdrop.addEventListener('imgLoaded', imgLoadedSlot.bind(imgLoadedSlot, photoBlock));
dragNdrop.addEventListener('imgSet', imgSetSlot);

function makeInputs(photoBlock, index) {
    let editedInput = photoBlock.querySelector('.edited');
    let deletedInput = photoBlock.querySelector('.deleted');
    let photoLinkInput = photoBlock.querySelector('.photo-link');
    let photoLocInput = photoBlock.querySelector('.photo-location');
    editedInput.name = 'photo-block-' + index + '-edited';
    deletedInput.name = 'photo-block-' + index + '-deleted';
    photoLinkInput.name = 'photo-block-' + index + '-photo';
    photoLocInput.name = 'photo-block-' + index + '-location';

    return {
        editedInput: editedInput,
        deletedInput: deletedInput,
        photoLocInput: photoLocInput,
        photoLinkInput: photoLinkInput
    };
}

block.hasImageSet = function () {
    return imageSet;
};

function addBtnBorderListener(photoBlock) {
    let btnBorder = photoBlock.querySelector('.btn-border');
    let photoLocation = photoBlock.querySelector('.photo-location');
    let checkboxEdited = photoBlock.querySelector('.edited');
    btnBorder.addEventListener('click', () => {
        popUpShadow.style.display = 'block';
        popUp.style.display = 'block';
        oldGeolocation = photoLocation.getAttribute('value');
        if (!(oldGeolocation === '0, 0' || oldGeolocation === ', ')) {
            oldGeolocation = oldGeolocation
                .split(', ')
                .map(coord => Number(coord));
            myPlacemark.geometry.setCoordinates(oldGeolocation);
            getAddress(oldGeolocation);
            myMap.setCenter(oldGeolocation);
        }
        currentInputForSetLocation = photoLocation;
        currentCheckboxEdited = checkboxEdited;
    });
}

popUpShadow.addEventListener('click', () => {
    popUp.style.display = 'none';
});

let btnSetGeolocation = block.querySelector('.set-geolocation');
let photoBlocks = block.querySelectorAll('.quest-photo');
photoBlocks.forEach(photoBlock => {
    addBtnBorderListener(photoBlock);
});

ymaps.ready(init);

function init() {
    if (!navigator.geolocation) {
        createFlashMessage('Определение геолокации не поддерживается данным браузером', 'error');

        return;
    }
    btnSetGeolocation.addEventListener('click', () => {
        currentInputForSetLocation.setAttribute('value',
            myPlacemark.geometry.getCoordinates().join(', '));
        currentCheckboxEdited.checked = 'true';
        popUpShadow.style.display = 'none';
        popUp.style.display = 'none';

        createFlashMessage('Координаты установлены!');
    });
    let geoOptions = {
        enableHighAccuracy: true,
        maximumAge: 10,
        timeout: 5000
    };
    navigator.geolocation.getCurrentPosition(position => {
        let coords = [position.coords.latitude, position.coords.longitude];
        initMap(coords);
    }, () => {
        createFlashMessage('Не удалось определить местоположение', 'error');
        initMap([56.8, 60.6]);
    },
    geoOptions);

    function initMap(coords) {
        myMap = new ymaps.Map('map', {
            center: coords,
            zoom: 15
        }, {
            searchControlProvider: 'yandex#search'
        });
        myPlacemark = createPlacemark(coords);
        myMap.geoObjects.add(myPlacemark);
        getAddress(coords);
        myPlacemark.events.add('dragend', function () {
            getAddress(myPlacemark.geometry.getCoordinates());
        });
        myMap.events.add('click', function (e) {
            let coords = e.get('coords');
            myPlacemark.geometry.setCoordinates(coords);
            getAddress(coords);
        });
    }

    function createPlacemark(coords) {
        return new ymaps.Placemark(coords, {
            iconCaption: 'поиск...'
        }, {
            preset: 'islands#violetDotIconWithCaption',
            draggable: true
        });
    }
}

//  определяем адрес по координатам (обратное геокодирование).
function getAddress(coords) {
    myPlacemark.properties.set('iconCaption', 'поиск...');
    ymaps.geocode(coords).then(function (res) {
        var firstGeoObject = res.geoObjects.get(0);

        myPlacemark.properties
            .set({
                // формируем строку с данными об объекте.
                iconCaption: [
                    // название населенного пункта или вышестоящее административно-территориальное образование.
                    firstGeoObject.getLocalities().length ?
                    firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
                    // получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
                    firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
                ].filter(Boolean).join(', '),
                // в качестве контента балуна задаем строку с адресом объекта.
                balloonContent: firstGeoObject.getAddressLine()
            });
    });
}
