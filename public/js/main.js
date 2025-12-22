/**
 * Entry Point - orchestrates all feature initializers
 */
(function () {
    const App = window.App || {};

    document.addEventListener('DOMContentLoaded', function() {
        console.log('42 Interactive Website loaded');

        App.initSmoothScroll && App.initSmoothScroll();
        App.initHeaderScroll && App.initHeaderScroll();
        App.initMobileMenu && App.initMobileMenu();
        App.initButtons && App.initButtons();
        App.initYouTubeLightbox && App.initYouTubeLightbox();
        App.loadPodcasts && App.loadPodcasts();
        App.loadYouTubeMetadata && App.loadYouTubeMetadata();
        App.initClientLogosCarousel && App.initClientLogosCarousel();
        App.initTestimonialsCarousel && App.initTestimonialsCarousel();
        App.initGradientInteractivity && App.initGradientInteractivity();
    });
})();
