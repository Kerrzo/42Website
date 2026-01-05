/**
 * Entry Point - orchestrates all feature initializers
 */
(function () {
    const App = window.App || {};

    document.addEventListener('DOMContentLoaded', function() {
        console.log(`  ___   ___    _______          ___  ________   _________  _______   ________  ________  ________ _________  ___  ___      ___ _______      
|\\  \\ |\\  \\  /  ___  \\        |\\  \\|\\   ___  \\|\\___   ___\\\\  ___ \\ |\\   __  \\|\\   __  \\|\\   ____\\\\___   ___\\\\  \\|\\  \\    /  /|\\  ___ \\     
\\ \\  \\\\_\\  \\/__/|_/  /|       \\ \\  \\ \\  \\\\ \\  \\|___ \\  \\_\\ \\   __/|\\ \\  \\|\\  \\ \\  \\|\\  \\ \\  \\___\\|___ \\  \\_\\ \\  \\ \\  \\  /  / | \\   __/|    
 \\ \\______  \\__|//  / /        \\ \\  \\ \\  \\\\ \\  \\   \\ \\  \\ \\ \\  \\_|/_\\ \\   _  _\\ \\   __  \\ \\  \\       \\ \\  \\ \\ \\  \\ \\  \\/  / / \\ \\  \\_|/__  
  \\|_____|\\  \\  /  /_/__        \\ \\  \\ \\  \\\\ \\  \\   \\ \\  \\ \\ \\  \\_|\\ \\ \\  \\\\  \\\\ \\  \\ \\  \\ \\  \\____   \\ \\  \\ \\ \\  \\ \\    / /   \\ \\  \\_|\\ \\ 
         \\ \\__\\|\\________\\       \\ \\__\\ \\__\\\\ \\__\\   \\ \\__\\ \\ \\_______\\ \\__\\\\ _\\\\ \\__\\ \\__\\ \\_______\\  \\ \\__\\ \\ \\__\\ \\__/ /     \\ \\_______\\
          \\|__| \\|_______|        \\|__|\\|__| \\|__|    \\|__|  \\|_______|\\|__|\\|__|\\|__|\\|__|\\|_______|   \\|__|  \\|__|\\|__|/       \\|_______|`);

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
