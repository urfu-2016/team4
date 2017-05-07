function initFunction(block) {
    block.querySelector('.delete-btn').addEventListener('click', () => {
        block.style.display = 'none';
        block.querySelector('.deleted').checked = 'true';
        block.querySelector('.edited').checked = 'true';
    });
}
block.initFunction = initFunction;
initFunction(block);
