(function() {
    const App = window.App = window.App || {};

    /**
     * Load Podcasts from JSON
     * Dynamically generates podcast cards from data/config.json
     */
    App.loadPodcasts = async function(filterFeatured = false) {
        try {
            // Fetch the config data
            const response = await fetch('/data/config.json');
            if (!response.ok) {
                console.error('Failed to load config data');
                return;
            }
            
            const data = await response.json();
            let podcasts = data.podcasts;
            
            // Filter for featured podcasts if requested (for homepage)
            if (filterFeatured) {
                podcasts = podcasts
                    .filter(podcast => podcast.featured)
                    .sort((a, b) => a.featured - b.featured);
            }
            
            // Find podcast containers on the page
            const podcastContainers = document.querySelectorAll('[data-podcast-container]');
            
            if (podcastContainers.length === 0) {
                return; // No podcast containers on this page
            }
            
            // Play button SVG
            const playButtonSVG = `
                <svg width="68" height="48" viewBox="0 0 68 48" fill="none">
                    <path d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"></path>
                    <path d="M 45,24 27,14 27,34" fill="#fff"></path>
                </svg>
            `;
            
            // Generate HTML for each podcast
            const podcastsHTML = podcasts.map(podcast => `
                <div class="youtube-video-card" data-video-id="${podcast.id}">
                    <div class="youtube-thumbnail">
                        <img src="https://img.youtube.com/vi/${podcast.id}/maxresdefault.jpg" 
                             alt="${podcast.title}" 
                             class="podcast-image">
                        <div class="play-button">
                            ${playButtonSVG}
                        </div>
                    </div>
                    <h3 class="podcast-title">${podcast.title}</h3>
                    <p class="podcast-date">${podcast.date}</p>
                </div>
            `).join('');
            
            // Insert podcasts into all containers
            podcastContainers.forEach(container => {
                container.innerHTML = podcastsHTML;
            });
            
            // Attach thumbnail fallbacks immediately
            const allThumbnails = document.querySelectorAll('.youtube-video-card .podcast-image');
            allThumbnails.forEach(img => {
                const vid = img.closest('.youtube-video-card')?.getAttribute('data-video-id');
                if (vid && App.setupThumbnailFallback) {
                    App.setupThumbnailFallback(img, vid);
                }
            });
            
            // After loading podcasts, reinitialize YouTube lightbox for new elements
            setTimeout(() => {
                App.initYouTubeLightbox && App.initYouTubeLightbox();
                App.loadYouTubeMetadata && App.loadYouTubeMetadata();
            }, 100);
            
            console.log(`Loaded ${podcasts.length} podcasts into ${podcastContainers.length} container(s)`);
            
        } catch (error) {
            console.error('Error loading podcasts:', error);
        }
    };
})();

