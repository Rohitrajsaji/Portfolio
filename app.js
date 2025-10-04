        // Mobile menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const navLinks = document.getElementById('navLinks');

        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close mobile menu when link clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });

        // Hide/show navbar on scroll
        let lastScroll = 0;
        const navbar = document.getElementById('navbar');

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll <= 0) {
                navbar.classList.remove('hidden');
                return;
            }

            if (currentScroll > lastScroll && currentScroll > 80) {
                navbar.classList.add('hidden');
            } else {
                navbar.classList.remove('hidden');
            }

            lastScroll = currentScroll;
        });

        // Enhanced Scroll Animations
        const animateElements = document.querySelectorAll('.animate-element');

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                } else if (entry.boundingClientRect.top > 0) {
                    // Reset animation when scrolling back up
                    entry.target.classList.remove('animate-in');
                }
            });
        }, observerOptions);

        // Observe all animate elements
        animateElements.forEach(element => {
            observer.observe(element);
        });

        // Trigger animations on page load for hero section
        window.addEventListener('load', () => {
            const heroElements = document.querySelectorAll('#home .animate-element');
            heroElements.forEach(element => {
                element.classList.add('animate-in');
            });

            // Also trigger nav animations
            const navElements = document.querySelectorAll('nav .animate-element');
            navElements.forEach(element => {
                element.classList.add('animate-in');
            });
        });