(function() {
    const App = window.App = window.App || {};

    // Create a shared observer instance
    let animationObserver = null;

    /**
     * Initialize the Intersection Observer for animations
     */
    function initObserver() {
        if (animationObserver) return animationObserver;
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        animationObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    animationObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        return animationObserver;
    }

    /**
     * Check if element is currently in the viewport
     */
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        return (
            rect.top >= -50 && // 50px margin (matching rootMargin)
            rect.left >= 0 &&
            rect.bottom <= windowHeight + 50 &&
            rect.right <= windowWidth
        );
    }

    /**
     * Check if element should be animated
     */
    function shouldAnimate(element) {
        const isInHero = element.closest('.home-hero-section');
        const isInMobileMenu = element.closest('.mobile-menu');
        const isInLightbox = element.closest('.youtube-lightbox');
        const isInHeader = element.closest('header');
        const isInFooter = element.closest('footer');
        const isCarouselImage = element.classList.contains('carousel-image');
        const crewCarouselSection = element.closest('.crew-carousel-section');
        const isInCrewCarousel = crewCarouselSection !== null && element !== crewCarouselSection;
        
        return element.offsetParent !== null && 
               !isInHero &&
               !isInMobileMenu &&
               !isInLightbox &&
               !isInHeader &&
               !isInFooter &&
               !isCarouselImage &&
               !isInCrewCarousel &&
               !element.classList.contains('scroll-fade-in');
    }

    /**
     * Check if element is in a grid container where items should animate together
     */
    function shouldAnimateTogether(element) {
        // Check if element is inside a grid container
        const grid = element.closest('.podcasts-grid, .work-grid, .clients-grid, .gallery-grid');
        if (!grid) return false;
        
        // Check if this is a grid item (card) or content within a grid item
        const gridItem = element.closest('.youtube-video-card, .work-card, .client-logo, .gallery-item, .blog-card-link');
        
        // If it's a grid item or any content within a grid item, animate together (no stagger)
        return gridItem !== null;
    }

    /**
     * Animate a single element or collection of elements
     */
    function animateElements(elements) {
        const observer = initObserver();
        const elementsArray = Array.isArray(elements) ? elements : Array.from(elements);
        
        // All elements should animate in, even if already in viewport
        // They start hidden via CSS, so we animate them in when JS runs
        elementsArray.forEach((element, index) => {
            if (shouldAnimate(element)) {
                element.classList.add('scroll-fade-in');
                
                // Check if element is already in viewport - if so, animate immediately
                const alreadyVisible = isInViewport(element);
                if (alreadyVisible) {
                    // Use requestAnimationFrame to ensure smooth animation
                    requestAnimationFrame(() => {
                        element.classList.add('animate');
                    });
                } else {
                    // Don't apply stagger delays to grid items - they should all animate together
                    // Only apply stagger to nested sequential content (like lists, testimonials)
                    if (!shouldAnimateTogether(element)) {
                        // For non-grid content, apply stagger only to specific containers
                        const parent = element.closest('.testimonial-slide');
                        if (parent) {
                            const siblings = Array.from(parent.querySelectorAll('.scroll-fade-in'));
                            const elementIndex = siblings.indexOf(element);
                            if (elementIndex > 0 && elementIndex <= 4) {
                                element.classList.add(`animate-delay-${elementIndex}`);
                            }
                        }
                    }
                    // Grid items animate together without stagger
                    
                    observer.observe(element);
                }
            }
        });
    }

    /**
     * Initialize animations on all elements on the page
     */
    App.initAnimations = function() {
        // Animate crew carousel section as a whole component
        const crewCarouselSection = document.querySelector('.crew-carousel-section');
        if (crewCarouselSection) {
            crewCarouselSection.classList.add('scroll-fade-in');
            const alreadyVisible = isInViewport(crewCarouselSection);
            if (alreadyVisible) {
                requestAnimationFrame(() => {
                    crewCarouselSection.classList.add('animate');
                });
            } else {
                const observer = initObserver();
                observer.observe(crewCarouselSection);
            }
        }
        
        // Select all elements that should animate
        // Text elements
        const textSelectors = [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'p', 'span', 'a', 'li',
            '.section-title', '.preview-title', '.work-title',
            '.section-description', '.preview-description',
            '.testimonial-quote', '.testimonial-author',
            '.quote-text', '.testimonial-label', '.section-label',
            '.podcast-title', '.podcast-date', '.author-name', '.author-title', '.author-company'
        ];
        
        // Image elements (excluding carousel images which are handled by the section)
        const imageSelectors = [
            'img:not(.carousel-image)', '.work-image', '.work-image-wrapper',
            '.logo-42', '.logo-42i', '.client-logo', '.podcast-image'
        ];
        
        // Combine all selectors
        const allSelectors = [...textSelectors, ...imageSelectors].join(', ');
        
        // Get all elements that match our selectors
        const elementsToAnimate = document.querySelectorAll(allSelectors);
        animateElements(elementsToAnimate);
        
        // Also observe sections for any remaining elements (excluding hero and crew carousel)
        const sections = document.querySelectorAll('section:not(.home-hero-section)');
        sections.forEach(section => {
            // Find any child elements that weren't caught by the main selector
            const children = section.querySelectorAll('*:not(.scroll-fade-in):not(.crew-carousel-section *)');
            const textImageElements = Array.from(children).filter(child => {
                return (child.tagName === 'IMG' && !child.classList.contains('carousel-image') || 
                       ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'SPAN', 'A', 'LI'].includes(child.tagName));
            });
            animateElements(textImageElements);
        });
    };

    /**
     * Animate dynamically added elements (for podcasts, clients, testimonials, etc.)
     */
    App.animateNewElements = function(container) {
        if (!container) return;
        
        const textSelectors = [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'p', 'span', 'a', 'li',
            '.section-title', '.preview-title', '.work-title',
            '.section-description', '.preview-description',
            '.testimonial-quote', '.testimonial-author',
            '.quote-text', '.testimonial-label', '.section-label',
            '.podcast-title', '.podcast-date', '.author-name', '.author-title', '.author-company'
        ];
        
        const imageSelectors = [
            'img', '.work-image', '.work-image-wrapper',
            '.logo-42', '.logo-42i', '.client-logo', '.podcast-image'
        ];
        
        const allSelectors = [...textSelectors, ...imageSelectors].join(', ');
        const elementsToAnimate = container.querySelectorAll(allSelectors);
        animateElements(elementsToAnimate);
    };

    // Trigger animations after DOM is ready
    function init() {
        // Add class to body to indicate animations are ready
        // This allows CSS to show elements that should be visible
        document.body.classList.add('animations-ready');
        
        // Initialize animations
        App.initAnimations();
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM is already loaded
        init();
    }
})();
