document.addEventListener('DOMContentLoaded', function () {
    const navCheck = document.getElementById('nav-check');

    function disableScroll(event) {
        event.preventDefault();
    }

    navCheck.addEventListener('change', function () {
        if (navCheck.checked) {
            document.body.classList.add('no-scroll');
            document.addEventListener('touchmove', disableScroll, { passive: false });
        } else {
            document.body.classList.remove('no-scroll');
            document.removeEventListener('touchmove', disableScroll);
        }
    });
});