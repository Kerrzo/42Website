(function() {
    const App = window.App = window.App || {};

    /**
     * Initialize Client Logos Carousel
     * Displays 5 logos that rotate randomly
     */
    App.initClientLogosCarousel = function() {
        const carousel = document.getElementById('clients-carousel');
        if (!carousel) return;
        
        // All client logos data
        const logos = [
            { src: 'images/logos/logo-internationaltowers.png', alt: 'International Towers' },
            { src: 'images/logos/logo-catholichealthcare.png', alt: 'Catholic Healthcare' },
            { src: 'images/logos/Loanoptions.ai.png', alt: 'LoanOptions.ai' },
            { src: 'images/logos/cushmanwakefield.png', alt: 'Cushman & Wakefield' },
            { src: 'images/logos/craveablebrands.png', alt: 'Craveable Brands' },
            { src: 'images/logos/jnprojects.png', alt: 'JN Projects' },
            { src: 'images/logos/gordonpodiatry.png', alt: 'Gordon Podiatry' },
            { src: 'images/logos/startswitha.png', alt: 'Starts With A' },
            { src: 'images/logos/logo-commbank.png', alt: 'CommBank' },
            { src: 'images/logos/pompompaddock.png', alt: 'Pom Pom Paddock' },
            { src: 'images/logos/neon8.png', alt: 'Neon8' },
            { src: 'images/logos/innovationsaccelerated.png', alt: 'Innovations Accelerated' },
            { src: 'images/logos/julieanders.png', alt: 'Julie Anders' },
            { src: 'images/logos/1fire.png', alt: '1Fire' },
            { src: 'images/logos/ignition-advice.png', alt: 'Ignition Advice' }
        ];
        
        // Track which logo is in each column
        const columnLogos = [0, 1, 2, 3, 4]; // Initial logo indices for each column
        const columns = carousel.querySelectorAll('.client-column');
        
        // Initialize - display first 5 logos
        columns.forEach((column, index) => {
            const logoData = logos[columnLogos[index]];
            const logoDiv = createLogoElement(logoData);
            column.appendChild(logoDiv);
            
            // Animate the newly added logo
            if (App.animateNewElements) {
                App.animateNewElements(logoDiv);
            }
        });
        
        // Start the rotation animation
        startLogoRotation();
        
        function createLogoElement(logoData) {
            const logoDiv = document.createElement('div');
            logoDiv.className = 'client-logo';
            logoDiv.innerHTML = `<img src="${logoData.src}" alt="${logoData.alt}">`;
            return logoDiv;
        }
        
        function getRandomLogo(excludeIndices) {
            // Get a logo that's not currently visible in any column
            const availableLogos = [];
            for (let i = 0; i < logos.length; i++) {
                if (!excludeIndices.includes(i)) {
                    availableLogos.push(i);
                }
            }
            
            if (availableLogos.length === 0) {
                // Fallback: return a random logo if no available ones
                return Math.floor(Math.random() * logos.length);
            }
            
            return availableLogos[Math.floor(Math.random() * availableLogos.length)];
        }
        
        function rotateLogoInColumn(columnIndex, newLogoIndex) {
            const column = columns[columnIndex];
            const currentLogo = column.querySelector('.client-logo');
            
            // Update the column's logo index
            columnLogos[columnIndex] = newLogoIndex;
            
            // Create new logo element
            const newLogo = createLogoElement(logos[newLogoIndex]);
            newLogo.classList.add('slide-in');
            
            // Add slide-out animation to current logo
            currentLogo.classList.add('slide-out');
            
            // Add new logo to column
            column.appendChild(newLogo);
            
            // Animate the newly added logo
            if (App.animateNewElements) {
                App.animateNewElements(newLogo);
            }
            
            // Remove old logo after animation completes
            setTimeout(() => {
                currentLogo.remove();
                newLogo.classList.remove('slide-in');
            }, 300);
        }
        
        function startLogoRotation() {
            function scheduleNextRotation() {
                // Random delay between 1.5-2.5 seconds
                const delay = 1500 + Math.random() * 1000;
                
                setTimeout(() => {
                    // Randomly rotate 2-3 columns at the same time
                    const numColumnsToRotate = Math.random() < 0.5 ? 2 : 3;
                    
                    // Pick random columns (no duplicates)
                    const columnsToRotate = [];
                    const availableColumns = [0, 1, 2, 3, 4];
                    
                    for (let i = 0; i < numColumnsToRotate; i++) {
                        const randomIndex = Math.floor(Math.random() * availableColumns.length);
                        columnsToRotate.push(availableColumns[randomIndex]);
                        availableColumns.splice(randomIndex, 1);
                    }
                    
                    // For each column to rotate, find a new logo that's not currently visible
                    columnsToRotate.forEach(columnIndex => {
                        // Get all currently visible logos (excluding this column)
                        const currentlyVisible = columnLogos.filter((_, index) => index !== columnIndex);
                        
                        // Get a new logo that's not visible anywhere
                        const newLogoIndex = getRandomLogo(currentlyVisible);
                        
                        // Rotate the logo in this column
                        rotateLogoInColumn(columnIndex, newLogoIndex);
                    });
                    
                    // Schedule next rotation
                    scheduleNextRotation();
                }, delay);
            }
            
            // Start the rotation cycle
            scheduleNextRotation();
        }
        
        console.log('Client logos carousel initialized');
    };
})();

