document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.menu');

    function toggleMenu() {
        hamburger.classList.toggle('active');
        menu.classList.toggle('active');
    }

    hamburger.addEventListener('click', toggleMenu);
});