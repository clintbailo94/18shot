// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Waitlist form handling
const waitlistForm = document.querySelector('.waitlist-form');
if (waitlistForm) {
    waitlistForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        
        // Simple validation
        if (email && email.includes('@')) {
            alert('Thank you for joining the waitlist! We\'ll notify you when The 18Shot is available.');
            this.reset();
        } else {
            alert('Please enter a valid email address.');
        }
    });
}

// Add film grain effect to hero section
function addFilmGrain() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.opacity = '0.05';
    canvas.style.pointerEvents = 'none';
    hero.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;

    function generateGrain() {
        const imageData = ctx.createImageData(canvas.width, canvas.height);
        const pixels = imageData.data;
        
        for (let i = 0; i < pixels.length; i += 4) {
            const value = Math.random() * 255;
            pixels[i] = pixels[i + 1] = pixels[i + 2] = value;
            pixels[i + 3] = 255;
        }
        
        ctx.putImageData(imageData, 0, 0);
    }

    generateGrain();
    window.addEventListener('resize', () => {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
        generateGrain();
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addFilmGrain();

    // Intersection Observer for animations
    const observerOptions = {
        root: null, // relative to document viewport
        rootMargin: '0px',
        threshold: 0.1 // trigger when 10% of the element is visible
    };

    const observerCallback = (entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a delay for staggered effect, especially for lists/grids
                const delay = entry.target.dataset.staggerDelay ? parseInt(entry.target.dataset.staggerDelay) * 100 : 0;
                
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Select elements to animate
    const animatedElements = document.querySelectorAll('.feature, .step, .design-features li, section > h2, .design-content p, .closing-line');

    animatedElements.forEach((el, index) => {
        el.classList.add('hidden'); // Add hidden class initially

        // Add stagger delay data attribute for list items and steps
        if (el.matches('.step') || el.matches('.design-features li')) {
             // Calculate delay based on index within its parent group if possible, otherwise simple index
             let parent = el.closest('.steps') || el.closest('.design-features');
             let itemIndex = Array.from(parent.children).indexOf(el);
             el.dataset.staggerDelay = itemIndex; 
        }

        observer.observe(el);
    });

    // Lightbox Functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const galleryImages = document.querySelectorAll('.gallery-item img');

    if (lightbox && lightboxImg && lightboxCaption && closeBtn && galleryImages.length > 0) {
        galleryImages.forEach(img => {
            img.addEventListener('click', function() {
                lightbox.style.display = 'block';
                lightboxImg.src = this.src;
                lightboxCaption.innerHTML = this.alt;
            });
        });

        // Close lightbox when clicking the close button
        closeBtn.addEventListener('click', function() {
            lightbox.style.display = 'none';
        });

        // Close lightbox when clicking outside the image
        lightbox.addEventListener('click', function(event) {
            if (event.target === lightbox) { // Check if the click is on the background itself
                lightbox.style.display = 'none';
            }
        });
    }
});
