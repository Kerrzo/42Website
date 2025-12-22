(function() {
    const App = window.App = window.App || {};

    /**
     * Intersection Observer for fade-in animations
     */
    App.initAnimations = function() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe sections
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            observer.observe(section);
        });
    };

    // Trigger animations after full load to avoid layout shift
    window.addEventListener('load', App.initAnimations);
})();

