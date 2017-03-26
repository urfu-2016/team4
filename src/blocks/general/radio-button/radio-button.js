function handleLabels() {
    document.querySelectorAll('input[type="radio"]').forEach(btn => {
        btn.addEventListener('change', () => {
            btn.parentNode.classList.add('checked');
            document.querySelectorAll('input[name="' + btn.name + '"').forEach(otherBtn => {
                if (otherBtn === btn) {
                    return;
                }
                otherBtn.parentNode.classList.remove('checked');
            });
        });
        if (btn.getAttribute('checked')) {
            let event = new Event('change');
            btn.dispatchEvent(event);
        }
    });
}

handleLabels();
