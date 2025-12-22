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
        
        // Card hover effects are now handled via CSS (image zoom instead of card lift)
    };
})();

