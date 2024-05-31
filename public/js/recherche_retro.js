document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    const elemsContainer = document.getElementById('elems');
    const noResults = document.getElementById('noResults');

    searchInput.addEventListener('input', function () {
        const query = this.value.toLowerCase();
        const items = elemsContainer.querySelectorAll('div[id]');
        let visibleCount = 0;

        items.forEach(item => {
            const itemId = item.id.toLowerCase();
            if (itemId.includes(query)) {
                item.closest('.transform').style.display = 'block';
                visibleCount++;
            } else {
                item.closest('.transform').style.display = 'none';
            }
        });

        if (visibleCount === 0) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }
    });
});
