(function () {
    const App = window.App = window.App || {};

    /**
     * Initialize Testimonials Carousel (4 items, auto-play, loop)
     */
    App.initTestimonialsCarousel = function () {
        const container = document.querySelector('[data-testimonial-container]');
        const dotsContainer = document.querySelector('[data-testimonial-dots]');
        if (!container || !dotsContainer) return;

        const testimonials = [
            {
                name: 'Tony Byrne',
                title: 'General Manager',
                company: 'International Towers',
                quote: '“42 Interactive is a great tech partner for International Towers. Their innovative ideas help us build our digital experience for the whole precinct. They are reliable, trustworthy and put our best interest first.”'
            },
            {
                name: 'Liam Timms',
                title: 'Fund Manager',
                company: 'International Towers',
                quote: '“We had an amazing experience working with 42 Interactive and fostered a good relationship with the team. They always listened to our business challenges, present when needed and motivated to help. They\'re good at explaining complicated tech in a way that\'s easy to understand. What sets them apart is their honesty and helpful feedback on our ideas and tech choices.”'
            },
            {
                name: 'Lily Coleman',
                title: 'Digital Product Manager',
                company: 'Craveable Brands Pty Ltd',
                quote: '“Amazing - I would highly recommend them and I have been very vocal within our business that I have thoroughly enjoyed digital project management alongside them. They are very easy to work with.”'
            },
            {
                name: 'Julie Anders',
                title: '',
                company: '',
                quote: '“The team at 42 Interactive are highly creative and skilled and they beautifully encapsulated the essence of my work. The ongoing support from the team has been outstanding. Their technical expertise and knowledge is exceptional. I highly recommend working with 42 Interactive for not only a professional but a highly enjoyable experience.”'
            }
        ];

        let currentIndex = 0;
        let autoplayTimer = null;
        const AUTOPLAY_INTERVAL = 6000;

        function renderSlides() {
            container.innerHTML = testimonials.map((item, index) => `
                <div class="testimonial-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
                    <div class="testimonial-author">
                        <h4 class="author-name">${item.name}</h4>
                        ${item.title ? `<p class="author-title">${item.title}</p>` : ''}
                        ${item.company ? `<p class="author-company">${item.company}</p>` : ''}
                    </div>
                    <div class="testimonial-quote">
                        <div class="quote-text">${item.quote}</div>
                    </div>
                </div>
            `).join('');
        }

        function renderDots() {
            dotsContainer.innerHTML = testimonials.map((_, index) => `
                <span class="slider-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
            `).join('');
        }

        function setActive(index) {
            currentIndex = index;
            const slides = container.querySelectorAll('.testimonial-slide');
            const dots = dotsContainer.querySelectorAll('.slider-dot');
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === currentIndex);
            });
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        function nextSlide() {
            const nextIndex = (currentIndex + 1) % testimonials.length;
            setActive(nextIndex);
        }

        function startAutoplay() {
            stopAutoplay();
            autoplayTimer = setInterval(nextSlide, AUTOPLAY_INTERVAL);
        }

        function stopAutoplay() {
            if (autoplayTimer) {
                clearInterval(autoplayTimer);
                autoplayTimer = null;
            }
        }

        function bindEvents() {
            dotsContainer.addEventListener('click', (e) => {
                const target = e.target;
                if (target && target.classList.contains('slider-dot')) {
                    const index = Number(target.getAttribute('data-index'));
                    if (!Number.isNaN(index)) {
                        setActive(index);
                        startAutoplay();
                    }
                }
            });

            // Pause on hover
            container.addEventListener('mouseenter', stopAutoplay);
            container.addEventListener('mouseleave', startAutoplay);
        }

        // Render and start
        renderSlides();
        renderDots();

        // Animate the newly added testimonial elements
        if (App.animateNewElements && container) {
            App.animateNewElements(container);
        }

        bindEvents();
        startAutoplay();
    };
})();

