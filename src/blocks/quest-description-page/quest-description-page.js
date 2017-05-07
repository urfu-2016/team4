/* globals addListenerMulti */
/* globals getCursorInfo */

function initDraggable() {
    const draggable = block.querySelector('.draggable');
    const mainBlock = block.querySelector('.description-and-photos');
    const scroll = mainBlock.querySelector('.scroll');
    const constSpeed = 0.5;
    let imgMargin;
    let draggablePaddingRight;
    let direction = 1;
    let scrollLeft = 0;
    let divRight = 0;
    let speed = constSpeed;
    let speedDecreaseFactor = 0.9;
    let prevX;
    let lastX;
    let prevScrollX = 0;
    let scrollClicked = false;
    let draggableClicked = false;
    let wasMouseDown = false;
    let wasMove = false;
    imgMargin = parseInt(window.getComputedStyle(draggable
        .querySelector('.quest-description-page-photo-block img')).margin);
    draggablePaddingRight = parseInt(window.getComputedStyle(draggable).paddingRight);
    let draggableWidth = draggable.clientWidth;
    let div = draggable.querySelector('.quest-description-page-photo-block');
    let divWidth = div.scrollWidth;
    let scrollWidth = draggableWidth / (divWidth + (2 * draggablePaddingRight)) * draggableWidth;
    let ratio = draggableWidth / divWidth;
    let value = draggableWidth - scrollWidth;
    scroll.style.width = scrollWidth + 'px';
    window.onresize = () => {
        draggableWidth = draggable.clientWidth;
        div = draggable.querySelector('.quest-description-page-photo-block');
        divWidth = div.scrollWidth;
        scrollWidth = draggableWidth / (divWidth + (2 * draggablePaddingRight)) * draggableWidth;
        ratio = draggableWidth / divWidth;
        value = draggableWidth - scrollWidth;
        scroll.style.width = scrollWidth + 'px';
    };
    draggable.childNodes.forEach(div => {
        addListenerMulti(div, 'mousedown touchstart', () => {
            wasMove = false;
        });
        addListenerMulti(div, 'mouseup touchend', e => {
            if (!wasMove && !isNaN(parseInt(e.target.parentNode.id))) {
                if (window.location.href === '/') {
                    window.location.href = window.location + 'details#' + parseInt(e.target.parentNode.id);
                } else {
                    window.location.href = window.location + '/details#' + parseInt(e.target.parentNode.id);
                }
                console.info(window.location);
            }
        });
    });
    if (scrollWidth === draggableWidth) {
        scroll.style.display = 'None';
        draggable.style.cursor = 'default';

        return;
    }
    addListenerMulti(draggable, 'mousedown touchstart', e => {
        wasMouseDown = true;
        draggableClicked = true;
        prevX = lastX = getCursorInfo(e).pageX;
        e.preventDefault();
    });
    addListenerMulti(scroll, 'mousedown touchstart', e => {
        wasMouseDown = true;
        scrollClicked = true;
        prevScrollX = lastX = getCursorInfo(e).pageX;
        e.preventDefault();
    });
    setInterval(() => {
        if (wasMouseDown) {
            return;
        }
        if (speed * ratio * direction + scrollLeft > 0 && speed * ratio * direction + scrollLeft < value) {
            scrollLeft += speed * ratio * direction;
            scroll.style.left = scrollLeft + 'px';
            divRight += speed * direction;
            div.style.right = divRight + 'px';
        } else {
            direction *= -1;
        }
        if (!draggableClicked && !scrollClicked) {
            speed *= speedDecreaseFactor;
            if (speed < constSpeed) {
                speed = constSpeed;
            }
        }
    }, 15);

    addListenerMulti(block, 'mouseup touchend', () => {
        wasMouseDown = false;
        draggableClicked = false;
        scrollClicked = false;
    });

    addListenerMulti(block, 'mousemove touchmove', e => {
        let draggableWidth = draggable.clientWidth;
        if (draggableClicked || scrollClicked) {
            draggable.querySelectorAll('.quest-description-page-photo-block').forEach(div => {
                let divWidth = div.scrollWidth;
                let shift = draggableClicked ? divRight + prevX - getCursorInfo(e).pageX :
                    scrollLeft - prevScrollX + getCursorInfo(e).pageX;
                if (shift < 0) {
                    shift = 0;
                }
                if (draggableClicked) {
                    if (shift > divWidth - draggableWidth + imgMargin) {
                        shift = divWidth - draggableWidth + imgMargin;
                    }
                    scrollLeft = shift * draggableWidth / divWidth;
                    scroll.style.left = scrollLeft + 'px';
                    divRight = shift;
                    div.style.right = divRight + 'px';
                    if (getCursorInfo(e).pageX - prevX) {
                        wasMove = true;
                        direction = getCursorInfo(e).pageX - prevX < 0 ? 1 : -1;
                    }
                    lastX = prevX;
                    prevX = getCursorInfo(e).pageX;
                } else {
                    if (shift > draggableWidth - scrollWidth) {
                        shift = draggableWidth - scrollWidth;
                    }
                    scrollLeft = shift;
                    scroll.style.left = scrollLeft + 'px';
                    divRight = shift * divWidth / draggableWidth;
                    div.style.right = divRight + 'px';
                    if (getCursorInfo(e).pageX - prevX) {
                        wasMove = true;
                        direction = getCursorInfo(e).pageX - prevX < 0 ? 1 : -1;
                    }
                    lastX = prevScrollX;
                    prevScrollX = getCursorInfo(e).pageX;
                }
            });
            speed = Math.abs((getCursorInfo(e).pageX - lastX));
        }
    });
}

initDraggable();
