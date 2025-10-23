// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.project-card, .about-text, .skills');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Typing effect for hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect on page load
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        // Uncomment the line below to enable typing effect
        // typeWriter(heroTitle, originalText, 50);
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Handle external links
document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
});

// Add click tracking for analytics (placeholder)
function trackClick(element, action) {
    // Placeholder for analytics tracking
    console.log(`Tracked: ${action} on ${element}`);
}

// Track project link clicks
document.querySelectorAll('.project-link').forEach(link => {
    link.addEventListener('click', (e) => {
        const projectName = e.target.closest('.project-card').querySelector('h3').textContent;
        trackClick(e.target, `Project link clicked: ${projectName}`);
    });
});

// Track contact link clicks
document.querySelectorAll('.contact-item').forEach(link => {
    link.addEventListener('click', (e) => {
        const contactType = e.target.textContent.trim();
        trackClick(e.target, `Contact link clicked: ${contactType}`);
    });
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Add error handling for missing elements
function safeQuerySelector(selector) {
    try {
        return document.querySelector(selector);
    } catch (error) {
        console.warn(`Element not found: ${selector}`);
        return null;
    }
}

// Initialize all functionality safely
document.addEventListener('DOMContentLoaded', () => {
    // Check if required elements exist before adding event listeners
    const requiredElements = [
        { selector: '#hamburger', name: 'hamburger menu' },
        { selector: '#nav-menu', name: 'navigation menu' },
        { selector: '#navbar', name: 'navbar' }
    ];
    
    requiredElements.forEach(({ selector, name }) => {
        if (!safeQuerySelector(selector)) {
            console.warn(`${name} element not found`);
        }
    });
});

// Add service worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment when service worker is ready
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

// Contact form submission: tries Formspree when data-endpoint is set on the form,
// otherwise falls back to opening the user's email client via mailto:.
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const statusEl = form.querySelector('.form-status');
    if (submitBtn) submitBtn.disabled = true;
    if (statusEl) statusEl.textContent = 'Sending...';

        const formData = new FormData(form);
        const payload = {
            name: formData.get('name') || '',
            email: formData.get('email') || '',
            message: formData.get('message') || ''
        };

        const endpoint = form.getAttribute('data-endpoint') || '';
        try {
            if (endpoint) {
                // POST to Formspree or any endpoint that accepts JSON
                const res = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    if (statusEl) statusEl.textContent = 'Message sent — thank you!';
                    form.reset();
                } else {
                    const text = await res.text();
                    if (statusEl) statusEl.textContent = 'Sending failed. Please try again or email directly.';
                    console.error('Form submission error:', text);
                }
            } else {
                // Fallback: open mail client using mailto:
                const subject = encodeURIComponent('Portfolio contact from ' + payload.name);
                const body = encodeURIComponent(payload.message + '\n\nFrom: ' + payload.name + ' <' + payload.email + '>');
                window.location.href = `mailto:mazen.shams6999@gmail.com?subject=${subject}&body=${body}`;
                if (statusEl) statusEl.textContent = 'Opening mail client...';
            }
        } catch (err) {
            console.error('Contact form error', err);
            if (statusEl) statusEl.textContent = 'An unexpected error occurred. Try emailing directly.';
        } finally {
            if (submitBtn) submitBtn.disabled = false;
            if (statusEl) setTimeout(() => { statusEl.textContent = ''; }, 5000);
        }
    });
});

// Copy email button handler (small feedback)
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.copy-email');
    if (!btn) return;
    const email = btn.getAttribute('data-email');
    if (!email) return;
    navigator.clipboard?.writeText(email).then(() => {
        const orig = btn.innerHTML;
        btn.innerHTML = 'Copied';
        setTimeout(() => btn.innerHTML = orig, 1800);
    }).catch(() => {
        // fallback: select text
        const el = document.getElementById('primary-email');
        if (el) {
            const range = document.createRange();
            range.selectNodeContents(el);
            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        }
    });
});
