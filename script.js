document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.menu');

    function toggleMenu() {
        const rect = hamburger.getBoundingClientRect();
        const windowWidth = window.innerWidth;

        if (rect.left > windowWidth / 2) {
            menu.classList.add('right');
            menu.classList.remove('left');
        } else {
            menu.classList.add('left');
            menu.classList.remove('right');
        }

        hamburger.classList.toggle('active');
        menu.classList.toggle('active');
    }

    hamburger.addEventListener('click', toggleMenu);
});