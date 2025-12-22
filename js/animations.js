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
     * Check if element should be animated
     */
    function shouldAnimate(element) {
        const isInHero = element.closest('.home-hero-section');
        const isInMobileMenu = element.closest('.mobile-menu');
        const isInLightbox = element.closest('.youtube-lightbox');
        const isInHeader = element.closest('header');
        const isInFooter = element.closest('footer');
        
        return element.offsetParent !== null && 
               !isInHero &&
               !isInMobileMenu &&
               !isInLightbox &&
               !isInHeader &&
               !isInFooter &&
               !element.classList.contains('scroll-fade-in');
    }

    /**
     * Animate a single element or collection of elements
     */
    function animateElements(elements) {
        const observer = initObserver();
        const elementsArray = Array.isArray(elements) ? elements : Array.from(elements);
        
        elementsArray.forEach((element, index) => {
            if (shouldAnimate(element)) {
                element.classList.add('scroll-fade-in');
                
                // Add staggered delays for elements within the same container
                const parent = element.closest('section, .work-grid, .clients-grid, .podcasts-grid, .work-card, .youtube-video-card, .testimonial-slide');
                if (parent) {
                    const siblings = Array.from(parent.querySelectorAll('.scroll-fade-in'));
                    const elementIndex = siblings.indexOf(element);
                    if (elementIndex > 0 && elementIndex <= 4) {
                        element.classList.add(`animate-delay-${elementIndex}`);
                    }
                }
                
                observer.observe(element);
            }
        });
    }

    /**
     * Initialize animations on all elements on the page
     */
    App.initAnimations = function() {
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
        
        // Image elements
        const imageSelectors = [
            'img', '.work-image', '.work-image-wrapper',
            '.logo-42', '.logo-42i', '.client-logo', '.podcast-image'
        ];
        
        // Combine all selectors
        const allSelectors = [...textSelectors, ...imageSelectors].join(', ');
        
        // Get all elements that match our selectors
        const elementsToAnimate = document.querySelectorAll(allSelectors);
        animateElements(elementsToAnimate);
        
        // Also observe sections for any remaining elements (excluding hero)
        const sections = document.querySelectorAll('section:not(.home-hero-section)');
        sections.forEach(section => {
            // Find any child elements that weren't caught by the main selector
            const children = section.querySelectorAll('*:not(.scroll-fade-in)');
            const textImageElements = Array.from(children).filter(child => {
                return (child.tagName === 'IMG' || 
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
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', App.initAnimations);
    } else {
        // DOM is already loaded
        App.initAnimations();
    }
})();

