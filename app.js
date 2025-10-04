// Performance optimized portfolio JavaScript

// Debounce utility for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        // Prevent body scroll when menu is open
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close mobile menu when link clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// OPTIMIZED Hide/show navbar on scroll
let lastScroll = 0;
let ticking = false;
const navbar = document.getElementById('navbar');

function updateNavbar() {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        navbar?.classList.remove('hidden');
    } else if (currentScroll > lastScroll && currentScroll > 80) {
        navbar?.classList.add('hidden');
    } else if (currentScroll < lastScroll) {
        navbar?.classList.remove('hidden');
    }

    lastScroll = currentScroll;
    ticking = false;
}

// Throttled scroll listener
const throttledNavUpdate = () => {
    if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
    }
};

window.addEventListener('scroll', throttledNavUpdate, { passive: true });

// OPTIMIZED Scroll Animations
const animateElements = document.querySelectorAll('.animate-element');
const animatedElements = new Set(); // Track animated elements

// Enhanced observer options for better mobile performance
const observerOptions = {
    threshold: 0.15, // Slightly higher threshold
    rootMargin: '0px 0px -5% 0px' // Less aggressive triggering
};

// Create intersection observer only if motion is allowed
let observer = null;

if (!prefersReducedMotion && animateElements.length > 0) {
    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animatedElements.has(entry.target)) {
                // Add animation class
                entry.target.classList.add('animate-in');

                // Mark as animated and stop observing
                animatedElements.add(entry.target);
                observer.unobserve(entry.target);

                // Clean up will-change after animation
                setTimeout(() => {
                    entry.target.style.willChange = 'auto';
                }, 800); // Match animation duration
            }
        });
    }, observerOptions);

    // Observe all animate elements
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Handle page load animations
function initializeAnimations() {
    if (prefersReducedMotion) {
        // If reduced motion, show all elements immediately
        animateElements.forEach(element => {
            element.classList.add('animate-in');
            element.style.willChange = 'auto';
        });
        return;
    }

    // Hero section and nav animations on load
    const heroElements = document.querySelectorAll('#home .animate-element');
    const navElements = document.querySelectorAll('nav .animate-element');

    [...heroElements, ...navElements].forEach(element => {
        element.classList.add('animate-in');
        animatedElements.add(element);

        // Don't observe hero/nav elements
        if (observer) {
            observer.unobserve(element);
        }

        // Clean up will-change
        setTimeout(() => {
            element.style.willChange = 'auto';
        }, 800);
    });
}

// Initialize on DOM content loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnimations);
} else {
    initializeAnimations();
}

// Handle visibility change (tab switching) for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when tab is hidden
        animateElements.forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations when tab is visible
        animateElements.forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});

// Cleanup observer on page unload
window.addEventListener('beforeunload', () => {
    if (observer) {
        observer.disconnect();
    }
});

// Additional mobile optimizations
if ('ontouchstart' in window) {
    // Add touch-specific optimizations
    document.body.addEventListener('touchstart', () => {}, { passive: true });

    // Prevent bounce scrolling on iOS
    document.body.addEventListener('touchmove', (e) => {
        if (e.target === document.body) {
            e.preventDefault();
        }
    }, { passive: false });
}

// Performance monitoring (development only)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Monitor animation performance
    const animationStart = performance.now();
    let animationCount = 0;

    animateElements.forEach(el => {
        el.addEventListener('transitionstart', () => {
            animationCount++;
        });

        el.addEventListener('transitionend', () => {
            animationCount--;
            if (animationCount === 0) {
                const duration = performance.now() - animationStart;
                console.log(`All animations completed in ${duration.toFixed(2)}ms`);
            }
        });
    });
}