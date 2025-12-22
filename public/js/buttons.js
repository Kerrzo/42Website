(function() {
    const App = window.App = window.App || {};

    /**
     * Button interactions
     */
    App.initButtons = function() {
        // Get in touch buttons - open email app
        const ctaButtons = document.querySelectorAll('.btn-get-touch, .footer-button, .cta-button');
        
        ctaButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Open default email app with mailto link
                window.location.href = 'mailto:hello@42interactive.com';
            });
        });
        
        // Add hover effect for cards
        const cards = document.querySelectorAll('.podcast-card, .blog-card-large, .blog-card-small, .tech-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
                this.style.transition = 'transform 0.3s ease';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    };
})();

