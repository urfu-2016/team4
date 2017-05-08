let createdTab = block.querySelector('#tab-created');
let inProcessTab = block.querySelector('#tab-in-process');
let createdContent = block.querySelector('.content-tab-created');
let inProcessContent = block.querySelector('.content-tab-in-process');

createdTab.addEventListener('change', () => {
    createdContent.style.display = 'block';
    inProcessContent.style.display = 'none';
});

inProcessTab.addEventListener('change', () => {
    createdContent.style.display = 'none';
    inProcessContent.style.display = 'block';
});
