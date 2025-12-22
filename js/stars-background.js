/**
 * Stars Background Effect - Vanilla JavaScript
 * Converted from React components to work with vanilla HTML/CSS/JS
 */

class ShootingStars {
    constructor(container, options = {}) {
        this.container = container;
        this.minSpeed = options.minSpeed || 10;
        this.maxSpeed = options.maxSpeed || 30;
        this.minDelay = options.minDelay || 3000;
        this.maxDelay = options.maxDelay || 5000;
        this.starColor = options.starColor || '#9E00FF';
        this.trailColor = options.trailColor || '#2EB9DF';
        this.starWidth = options.starWidth || 10;
        this.starHeight = options.starHeight || 1;
        
        this.star = null;
        this.animationFrame = null;
        
        this.init();
    }
    
    init() {
        // Create SVG element
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.style.cssText = 'position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 1;';
        
        // Create unique gradient ID for this instance
        this.gradientId = `star-gradient-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Create gradient definition
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', this.gradientId);
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');
        
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('style', `stop-color: ${this.trailColor}; stop-opacity: 0;`);
        
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('style', `stop-color: ${this.starColor}; stop-opacity: 1;`);
        
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        this.svg.appendChild(defs);
        
        this.container.appendChild(this.svg);
        
        // Start creating stars
        this.createStar();
    }
    
    getRandomStartPoint() {
        const rect = this.container.getBoundingClientRect();
        const containerWidth = rect.width;
        const containerHeight = rect.height;
        const side = Math.floor(Math.random() * 4);
        
        switch (side) {
            case 0: // Top edge
                return { x: Math.random() * containerWidth, y: 0, angle: 45 };
            case 1: // Right edge
                return { x: containerWidth, y: Math.random() * containerHeight, angle: 135 };
            case 2: // Bottom edge
                return { x: Math.random() * containerWidth, y: containerHeight, angle: 225 };
            case 3: // Left edge
                return { x: 0, y: Math.random() * containerHeight, angle: 315 };
            default: 
                return { x: 0, y: 0, angle: 45 };
        }
    }
    
    createStar() {
        const { x, y, angle } = this.getRandomStartPoint();
        this.star = {
            id: Date.now(),
            x,
            y,
            angle,
            scale: 1,
            speed: Math.random() * (this.maxSpeed - this.minSpeed) + this.minSpeed,
            distance: 0,
            element: null
        };
        
        // Create star element
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('fill', `url(#${this.gradientId})`);
        this.star.element = rect;
        this.svg.appendChild(rect);
        
        // Start animation
        this.animateStar();
        
        // Schedule next star
        const randomDelay = Math.random() * (this.maxDelay - this.minDelay) + this.minDelay;
        setTimeout(() => this.createStar(), randomDelay);
    }
    
    animateStar() {
        if (!this.star) return;
        
        const rect = this.container.getBoundingClientRect();
        const containerWidth = rect.width;
        const containerHeight = rect.height;
        
        const star = this.star;
        const newX = star.x + star.speed * Math.cos((star.angle * Math.PI) / 180);
        const newY = star.y + star.speed * Math.sin((star.angle * Math.PI) / 180);
        const newDistance = star.distance + star.speed;
        const newScale = 1 + newDistance / 100;
        
        // Check bounds using container dimensions
        if (newX < -20 || newX > containerWidth + 20 || newY < -20 || newY > containerHeight + 20) {
            if (star.element) {
                this.svg.removeChild(star.element);
            }
            this.star = null;
            return;
        }
        
        // Update star
        star.x = newX;
        star.y = newY;
        star.distance = newDistance;
        star.scale = newScale;
        
        // Update element
        if (star.element) {
            star.element.setAttribute('x', star.x);
            star.element.setAttribute('y', star.y);
            star.element.setAttribute('width', this.starWidth * star.scale);
            star.element.setAttribute('height', this.starHeight);
            star.element.setAttribute('transform', 
                `rotate(${star.angle}, ${star.x + (this.starWidth * star.scale) / 2}, ${star.y + this.starHeight / 2})`
            );
        }
        
        // Continue animation
        this.animationFrame = requestAnimationFrame(() => this.animateStar());
    }
    
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        if (this.svg && this.container.contains(this.svg)) {
            this.container.removeChild(this.svg);
        }
    }
}

class StarsBackground {
    constructor(container, options = {}) {
        this.container = container;
        this.starDensity = options.starDensity || 0.00015;
        this.allStarsTwinkle = options.allStarsTwinkle !== undefined ? options.allStarsTwinkle : true;
        this.twinkleProbability = options.twinkleProbability || 0.7;
        this.minTwinkleSpeed = options.minTwinkleSpeed || 0.5;
        this.maxTwinkleSpeed = options.maxTwinkleSpeed || 1;
        
        this.stars = [];
        this.animationFrame = null;
        
        this.init();
    }
    
    init() {
        // Create canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = 'position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0;';
        this.ctx = this.canvas.getContext('2d');
        
        this.container.appendChild(this.canvas);
        
        // Initialize canvas size and stars
        this.updateSize();
        
        // Handle resize
        this.resizeObserver = new ResizeObserver(() => this.updateSize());
        this.resizeObserver.observe(this.container);
        
        // Start animation
        this.render();
    }
    
    updateSize() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.generateStars();
    }
    
    generateStars() {
        const area = this.canvas.width * this.canvas.height;
        const numStars = Math.floor(area * this.starDensity);
        
        this.stars = Array.from({ length: numStars }, () => {
            const shouldTwinkle = this.allStarsTwinkle || Math.random() < this.twinkleProbability;
            return {
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 0.05 + 0.5,
                opacity: Math.random() * 0.5 + 0.5,
                twinkleSpeed: shouldTwinkle 
                    ? this.minTwinkleSpeed + Math.random() * (this.maxTwinkleSpeed - this.minTwinkleSpeed)
                    : null
            };
        });
    }
    
    render() {
        if (!this.ctx || !this.canvas) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.stars.forEach(star => {
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            this.ctx.fill();
            
            // Update twinkle
            if (star.twinkleSpeed !== null) {
                star.opacity = 0.5 + Math.abs(Math.sin((Date.now() * 0.001) / star.twinkleSpeed) * 0.5);
            }
        });
        
        this.animationFrame = requestAnimationFrame(() => this.render());
    }
    
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        if (this.canvas && this.container.contains(this.canvas)) {
            this.container.removeChild(this.canvas);
        }
    }
}

// Initialize stars background on sections with class 'stars-bg'
function initStarsBackground() {
    const sections = document.querySelectorAll('.stars-bg');
    
    sections.forEach(section => {
        // Add position relative if not set
        const position = window.getComputedStyle(section).position;
        if (position === 'static') {
            section.style.position = 'relative';
        }
        
        // Create stars background
        new StarsBackground(section, {
            starDensity: 0.00015,
            allStarsTwinkle: true,
            twinkleProbability: 0.7,
            minTwinkleSpeed: 0.5,
            maxTwinkleSpeed: 1
        });
        
        // Create shooting stars
        new ShootingStars(section, {
            minSpeed: 10,
            maxSpeed: 30,
            minDelay: 3000,
            maxDelay: 5000,
            starColor: '#9E00FF',
            trailColor: '#2EB9DF',
            starWidth: 10,
            starHeight: 1
        });
    });
}

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStarsBackground);
} else {
    initStarsBackground();
}

