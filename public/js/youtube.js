(function() {
    const App = window.App = window.App || {};

    /**
     * YouTube Lightbox Functionality
     */
    App.initYouTubeLightbox = function() {
        const lightbox = document.getElementById('youtube-lightbox');
        const player = document.getElementById('youtube-player');
        const closeBtn = document.querySelector('.lightbox-close');
        const backdrop = document.querySelector('.lightbox-backdrop');
        const videoCards = document.querySelectorAll('.youtube-video-card');
        
        if (!lightbox || !player) return;
        
        // Open lightbox when video card is clicked
        videoCards.forEach(card => {
            card.addEventListener('click', function() {
                const videoId = this.getAttribute('data-video-id');
                openLightbox(videoId);
            });
        });
        
        // Close lightbox functions
        function closeLightbox() {
            lightbox.classList.remove('active');
            player.src = ''; // Stop the video
            document.body.style.overflow = ''; // Re-enable scroll
        }
        
        // Open lightbox function
        function openLightbox(videoId) {
            const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
            player.src = embedUrl;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Disable scroll
        }
        
        // Close button click
        if (closeBtn) {
            closeBtn.addEventListener('click', closeLightbox);
        }
        
        // Backdrop click
        if (backdrop) {
            backdrop.addEventListener('click', closeLightbox);
        }
        
        // ESC key to close
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });
    };

    /**
     * Load YouTube Video Metadata
     * Fetches video titles using YouTube oEmbed API
     */
    App.loadYouTubeMetadata = async function() {
        const videoCards = document.querySelectorAll('.youtube-video-card');
        
        videoCards.forEach(async (card) => {
            const videoId = card.getAttribute('data-video-id');
            if (!videoId) return;
            
            const titleElement = card.querySelector('.podcast-title');
            const dateElement = card.querySelector('.podcast-date');
            const thumbnailImg = card.querySelector('.podcast-image');
            
            // Setup thumbnail fallback
            if (thumbnailImg) {
                App.setupThumbnailFallback(thumbnailImg, videoId);
            }
            
            try {
                // Use YouTube oEmbed API to get video title
                const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
                
                if (response.ok) {
                    const data = await response.json();
                    
                    // Update title
                    if (titleElement && data.title) {
                        titleElement.textContent = data.title;
                    }
                    
                    // Date is set from config.json, not from YouTube API
                } else {
                    console.warn(`Failed to load metadata for video: ${videoId}`);
                }
            } catch (error) {
                console.error(`Error fetching video metadata for ${videoId}:`, error);
            }
        });
    };

    /**
     * Setup thumbnail fallback for YouTube images
     * Tries different quality levels if maxresdefault fails
     */
    App.setupThumbnailFallback = function(imgElement, videoId) {
        const thumbnailQualities = [
            'maxresdefault.jpg',  // 1920x1080 (best quality)
            'sddefault.jpg',      // 640x480
            'hqdefault.jpg',      // 480x360
            'mqdefault.jpg',      // 320x180
            'default.jpg'         // 120x90 (fallback)
        ];
        
        let currentQualityIndex = 0;
        
        imgElement.addEventListener('error', function() {
            currentQualityIndex++;
            
            if (currentQualityIndex < thumbnailQualities.length) {
                const newQuality = thumbnailQualities[currentQualityIndex];
                console.log(`Thumbnail failed for ${videoId}, trying: ${newQuality}`);
                this.src = `https://img.youtube.com/vi/${videoId}/${newQuality}`;
            } else {
                console.error(`All thumbnail qualities failed for video: ${videoId}`);
            }
        });
    };
})();

