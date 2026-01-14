document.addEventListener('DOMContentLoaded', () => {

    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    // Parallax Elements (Images)
    const parallaxImages = document.querySelectorAll('.hero-image-container img, .intro-section, .lifestyle-showcase img');

    function raf(time) {
        lenis.raf(time);

        // Simple Parallax Effect
        parallaxImages.forEach(img => {
            const speed = 0.1;
            const rect = img.getBoundingClientRect();
            // Only animate if in view
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const yPos = (window.innerHeight - rect.top) * speed;
                img.style.transform = `translateY(${yPos}px)`;
                // Note: This conflicts with the CSS transition for 'visible' class if not careful.
                // Better approach for pure parallax: use a wrapper or separate transform property if possible, 
                // OR just use Lenis for smooth scroll and let CSS handle entry animations.
                // For "Natural" feel, let's stick to the smooth scroll + CSS entry first. 
                // We will skip manual parallax transform for now to avoid conflict with the scale entry animation.
            }
        });

        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Scroll Animation Observer (Enhanced)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Slightly higher threshold for "deliberate" reveal
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add a small delay for staggered feel if multiple items appear at once
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    // Find child images to animate if any
                    const childImg = entry.target.querySelector('img');
                    if (childImg) childImg.classList.add('visible');
                }, 100);

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Target elements to animate
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .masonry-item, .grid-item');
    animatedElements.forEach(el => observer.observe(el));

    // Mobile Menu Logic
    const hamburger = document.querySelector('.hamburger-menu');
    const drawer = document.querySelector('.mobile-menu-drawer');
    const overlay = document.querySelector('.mobile-menu-overlay');
    const closeBtn = document.querySelector('.close-menu');

    function toggleMenu() {
        drawer.classList.toggle('active');
        overlay.classList.toggle('active');
        // If drawer is active, stop Lenis scrolling
        if (drawer.classList.contains('active')) {
            lenis.stop();
        } else {
            lenis.start();
        }
    }

    if (hamburger) hamburger.addEventListener('click', toggleMenu);
    if (closeBtn) closeBtn.addEventListener('click', toggleMenu);
    if (overlay) overlay.addEventListener('click', toggleMenu);
});
