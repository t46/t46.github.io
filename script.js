document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger-menu');
    const menu = document.getElementById('menu');

    function toggleMenu() {
        hamburger.classList.toggle('active');
        menu.classList.toggle('active');
    }

    hamburger.addEventListener('click', toggleMenu);
});