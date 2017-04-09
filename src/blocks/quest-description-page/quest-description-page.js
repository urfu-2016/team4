/* eslint no-unused-vars: 'off' */
const photoBlock = document.querySelector('.quest-description-page-photo-block');
const draggables = document.querySelectorAll('.draggable');
const mainBlock = document.querySelector('.description-and-photos');
const scroll = mainBlock.querySelector('.scroll');
const constSpeed = 0.5;
let imgMargin;
let draggablePaddingRight;
let direction = 1;
let scrollLeft = 0;
let scrollWidth = 0;
let divRight = 0;
let speed = constSpeed;
let prevX = 0;
let lastX = 0;
let lastDate = 0;
let prevScrollX = 0;

draggables.forEach(draggable => {
    /* eslint no-undef: 0 */
    draggablePaddingRight = parseInt(window.getComputedStyle(draggable).paddingRight);
    let draggableWidth = draggable.clientWidth;
    imgMargin = parseInt(window.getComputedStyle(draggable
                .querySelector('.quest-description-page-photo-block img')).margin);
    let div = draggable.querySelector('.quest-description-page-photo-block');
    let divWidth = div.scrollWidth;
    scrollWidth = draggableWidth / (divWidth + (2 * draggablePaddingRight)) * draggableWidth;
    if (scrollWidth === draggableWidth) {
        scroll.style.display = 'None';
        draggable.style.cursor = 'default';

        return;
    }
    scroll.style.width = scrollWidth + 'px';
    draggable.addEventListener('mousedown', e => {
        speed = 0;
        draggable.clicked = true;
        prevX = lastX = e.pageX;
        lastDate = new Date();
        e.preventDefault();
    });
    scroll.addEventListener('mousedown', e => {
        speed = 0;
        scroll.clicked = true;
        prevScrollX = lastX = e.pageX;
        lastDate = new Date();
        e.preventDefault();
    });
    const ratio = draggableWidth / divWidth;
    const value = draggableWidth - scrollWidth;
    setInterval(() => {
        if (speed * ratio * direction + scrollLeft > 0 && speed * ratio * direction + scrollLeft < value) {
            scrollLeft += speed * ratio * direction;
            scroll.style.left = scrollLeft + 'px';
            divRight += speed * direction;
            div.style.right = divRight + 'px';
        } else {
            direction *= -1;
            speed = constSpeed;
        }
    }, 15);
});

setInterval(() => {
    if (speed < constSpeed) {
        speed = Number((speed + 0.1).toFixed(1));
    } else if (speed > constSpeed) {
        speed = Number((speed - 0.1).toFixed(1));
    }

    //  console.info(speed);
}, 15);

document.addEventListener('mouseup', e => {
    draggables.forEach(draggable => {
        draggable.clicked = false;
    });
    scroll.clicked = false;
    speed = constSpeed;
    if (lastDate) {
        let time = new Date() - lastDate;
        if (time) {
            speed += Math.abs((e.pageX - lastX) / time);
            time = 0;
        }
    }
});

document.addEventListener('mousemove', e => {
    draggables.forEach(draggable => {
        let draggableWidth = draggable.clientWidth;
        if (draggable.clicked || scroll.clicked) {
            draggable.querySelectorAll('.quest-description-page-photo-block').forEach(div => {
                let divWidth = div.scrollWidth;
                let shift = draggable.clicked ? divRight + prevX - e.pageX : scrollLeft - prevScrollX + e.pageX;
                if (shift < 0) {
                    shift = 0;
                }
                if (draggable.clicked) {
                    if (shift > divWidth - draggableWidth + imgMargin) {
                        shift = divWidth - draggableWidth + imgMargin;
                    }
                    scrollLeft = shift * draggableWidth / divWidth;
                    scroll.style.left = scrollLeft + 'px';
                    divRight = shift;
                    div.style.right = divRight + 'px';
                    direction = e.pageX - prevX < 0 ? 1 : -1;
                    lastX = prevX;
                    prevX = e.pageX;
                } else {
                    if (shift > draggableWidth - scrollWidth) {
                        shift = draggableWidth - scrollWidth;
                    }
                    scrollLeft = shift;
                    scroll.style.left = scrollLeft + 'px';
                    divRight = shift * divWidth / draggableWidth;
                    div.style.right = divRight + 'px';
                    direction = e.pageX - prevScrollX < 0 ? -1 : 1;
                    lastX = prevScrollX;
                    prevScrollX = e.pageX;
                }
                lastDate = new Date();
            });
        }
    });
});
