(function() {
    const App = window.App = window.App || {};

    /**
     * Adds mouse-reactive gradient highlights to elements with .gradient-animated-bg
     */
    App.initGradientInteractivity = function() {
        const sections = document.querySelectorAll('.gradient-animated-bg');
        if (!sections.length) return;

        sections.forEach(section => {
            let rafId = null;
            let targetX = 50;
            let targetY = 50;

            function updateVars(x, y) {
                if (rafId) return;
                rafId = requestAnimationFrame(() => {
                    section.style.setProperty('--mouse-x', x.toFixed(2));
                    section.style.setProperty('--mouse-y', y.toFixed(2));
                    rafId = null;
                });
            }

            section.addEventListener('mousemove', (e) => {
                const rect = section.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                targetX = Math.max(0, Math.min(100, x));
                targetY = Math.max(0, Math.min(100, y));
                updateVars(targetX, targetY);
            });

            section.addEventListener('mouseleave', () => {
                targetX = 50;
                targetY = 50;
                updateVars(targetX, targetY);
            });
        });
    };
})();

