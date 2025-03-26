document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.menu');
    const header = document.querySelector('header');
    
    // Initialize page transition system
    initPageTransitions();
    
    // Initialize animations
    initAnimations();
    
    // Initialize header scroll behavior
    initHeaderScroll();

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
    
    // Make global for onclick handlers in HTML
    window.toggleMenu = toggleMenu;
});

// Header scroll interaction
function initHeaderScroll() {
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    const scrollThreshold = 50;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        // If scrolled down more than threshold
        if (currentScroll > scrollThreshold) {
            // Scrolling down
            if (currentScroll > lastScrollTop) {
                header.classList.add('scrolled');
                header.classList.remove('scrolled-up');
            } 
            // Scrolling up
            else {
                header.classList.remove('scrolled');
                header.classList.add('scrolled-up');
            }
        } else {
            // At the top
            header.classList.remove('scrolled', 'scrolled-up');
        }
        
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }, { passive: true });
}

// Smooth page transitions using Barba.js approach
function initPageTransitions() {
    // Add event listeners to all links for smooth transitions
    document.querySelectorAll('a').forEach(link => {
        // Skip external links or javascript links
        if (link.href && 
            link.href.indexOf(window.location.origin) === 0 && 
            !link.href.includes('#') &&
            !link.target) {
            
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = this.getAttribute('href');
                
                // Start page exit animation
                document.body.classList.add('page-transition-out');
                
                // After exit animation completes, navigate to new page
                setTimeout(() => {
                    window.location.href = target;
                }, 500); // Match the CSS transition duration
            });
        }
    });
    
    // Add class to body for entrance animation
    if (!document.body.classList.contains('page-transition-in')) {
        document.body.classList.add('page-transition-in');
    }
}

// Initialize element animations
function initAnimations() {
    // Apply animations to elements with animate-on-scroll class
    const animateOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    // Target elements to animate
    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        animateOnScroll.observe(element);
    });
    
    // Animate paragraphs by default
    document.querySelectorAll('.main-content p').forEach(element => {
        if (!element.classList.contains('animate-on-scroll')) {
            element.classList.add('animate-on-scroll');
            animateOnScroll.observe(element);
        }
    });
    
    // Add parallax effect to header images
    document.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const parallaxElements = document.querySelectorAll('.parallax');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.2;
            element.style.transform = `translateY(${scrollPosition * speed}px)`;
        });
    }, { passive: true });
    
    // Add subtle hover effects to interactive elements
    document.querySelectorAll('.logo a, .menu a, .contact-info a').forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.classList.add('hover-active');
        });
        
        element.addEventListener('mouseleave', function() {
            this.classList.remove('hover-active');
        });
    });
    
    // Add cursor effects (only on non-mobile)
    if (window.innerWidth > 768) {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);
        
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });
        
        document.querySelectorAll('a, button, .hamburger').forEach(item => {
            item.addEventListener('mouseenter', () => {
                cursor.classList.add('cursor-active');
            });
            
            item.addEventListener('mouseleave', () => {
                cursor.classList.remove('cursor-active');
            });
        });
    }
}