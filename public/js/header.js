(function() {
    const App = window.App = window.App || {};

    /**
     * Smooth scrolling for anchor links
     */
    App.initSmoothScroll = function() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Only apply smooth scroll to hash links
                if (href !== '#') {
                    e.preventDefault();
                    const target = document.querySelector(href);
                    
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                }
            });
        });
    };

    /**
     * Header scroll effect with theme detection
     */
    App.initHeaderScroll = function() {
        const header = document.querySelector('.main-menu');
        const themedSections = Array.from(document.querySelectorAll('section[data-theme]'));
        
        if (!header || !themedSections.length) return;
        
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            const headerHeight = header.offsetHeight || 0;
            
            // Show/hide background based on scroll position
            // Show background when scrolled down, hide when at top
            if (currentScroll > 0) {
                header.classList.add('header-show-background');
            } else {
                header.classList.remove('header-show-background');
            }
            
            // Determine which themed section is under the header
            const activeSection = themedSections.find(section => {
                const rect = section.getBoundingClientRect();
                return rect.top <= headerHeight + 10 && rect.bottom >= headerHeight + 10;
            }) || themedSections[0];
            
            const isLight = activeSection?.dataset.theme === 'light';
            
            header.classList.toggle('header-theme-light', isLight);
            header.classList.toggle('header-theme-dark', !isLight);
            header.classList.toggle('header-scrolled', currentScroll > 50);
        });
        
        // Initial state - no background at top
        header.classList.remove('header-show-background');
        
        // Trigger scroll event to set initial theme
        const event = new Event('scroll');
        window.dispatchEvent(event);
    };

    /**
     * Mobile menu toggle functionality
     */
    App.initMobileMenu = function() {
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileOverlay = document.querySelector('.mobile-menu-overlay');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        const body = document.body;

        if (!menuToggle || !mobileMenu || !mobileOverlay) return;

        function openMenu() {
            menuToggle.classList.add('active');
            mobileMenu.classList.add('active');
            mobileOverlay.classList.add('active');
            body.style.overflow = 'hidden';
        }

        function closeMenu() {
            menuToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
            body.style.overflow = '';
        }

        function toggleMenu() {
            if (mobileMenu.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        }

        // Toggle menu on button click
        menuToggle.addEventListener('click', toggleMenu);

        // Close menu on overlay click
        mobileOverlay.addEventListener('click', closeMenu);

        // Close menu when clicking a nav link
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Update active state
                mobileNavLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                // Close menu after a short delay for better UX
                setTimeout(closeMenu, 300);
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMenu();
            }
        });

        // Update active state based on current page
        const currentPath = window.location.pathname;
        const currentHref = window.location.href;
        
        mobileNavLinks.forEach(link => {
            const linkHref = link.href;
            // Check if current page matches the link
            if (currentHref === linkHref || 
                (currentPath.endsWith('/') && linkHref.includes('index.html')) ||
                (currentPath.includes('index.html') && linkHref.includes('index.html'))) {
                link.classList.add('active');
            }
        });
        
        // Also sync with desktop nav active state
        const desktopNavLinks = document.querySelectorAll('.nav-link');
        desktopNavLinks.forEach(desktopLink => {
            if (desktopLink.classList.contains('active')) {
                const desktopHref = desktopLink.href;
                mobileNavLinks.forEach(mobileLink => {
                    if (mobileLink.href === desktopHref) {
                        mobileLink.classList.add('active');
                    }
                });
            }
        });
    };
})();

