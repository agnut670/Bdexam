/**
 * Navigation Management System
 * Handles homepage navigation, animations, and user interactions
 */

class NavigationManager {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.initializeAnimations();
    }

    initializeElements() {
        this.subjectCards = document.querySelectorAll('.subject-card');
        this.header = document.querySelector('.header');
        this.mainContent = document.querySelector('.main-content');
    }

    bindEvents() {
        // Add event listeners for subject cards
        this.subjectCards.forEach(card => {
            this.setupCardEvents(card);
        });

        // Handle window events
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.handleResize());
        
        // Handle page load
        document.addEventListener('DOMContentLoaded', () => this.handlePageLoad());
    }

    setupCardEvents(card) {
        const button = card.querySelector('.btn');
        
        // Mouse enter event
        card.addEventListener('mouseenter', () => {
            this.animateCardHover(card, true);
        });

        // Mouse leave event
        card.addEventListener('mouseleave', () => {
            this.animateCardHover(card, false);
        });

        // Click event for accessibility
        card.addEventListener('click', (e) => {
            if (e.target === card || card.contains(e.target) && !button.contains(e.target)) {
                button.click();
            }
        });

        // Button focus events
        if (button) {
            button.addEventListener('focus', () => {
                card.classList.add('focused');
            });

            button.addEventListener('blur', () => {
                card.classList.remove('focused');
            });

            // Add click tracking
            button.addEventListener('click', (e) => {
                this.trackSubjectClick(card.dataset.subject);
                this.animateButtonClick(button);
            });
        }

        // Add keyboard navigation
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (button) {
                    button.click();
                }
            }
        });
    }

    animateCardHover(card, isHovering) {
        const icon = card.querySelector('.card-icon');
        const title = card.querySelector('h3');
        
        if (isHovering) {
            // Add hover effects
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
            
            if (title) {
                title.style.transform = 'translateY(-2px)';
                title.style.transition = 'transform 0.3s ease';
            }

            // Add glow effect
            card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15), 0 0 20px rgba(102, 126, 234, 0.2)';
            
        } else {
            // Remove hover effects
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
            
            if (title) {
                title.style.transform = 'translateY(0)';
            }

            // Remove glow effect
            card.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        }
    }

    animateButtonClick(button) {
        // Add click animation
        button.style.transform = 'scale(0.95)';
        button.style.transition = 'transform 0.1s ease';
        
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 100);

        // Add ripple effect
        this.createRippleEffect(button);
    }

    createRippleEffect(element) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            top: 50%;
            left: 50%;
            margin-left: ${-size/2}px;
            margin-top: ${-size/2}px;
            pointer-events: none;
        `;

        // Add ripple animation styles
        if (!document.getElementById('ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Make sure button has relative position
        const originalPosition = getComputedStyle(element).position;
        if (originalPosition === 'static') {
            element.style.position = 'relative';
        }
        element.style.overflow = 'hidden';

        element.appendChild(ripple);

        // Remove ripple after animation
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    initializeAnimations() {
        // Animate cards on page load
        this.animateCardsOnLoad();
        
        // Initialize intersection observer for scroll animations
        this.initializeScrollAnimations();
    }

    animateCardsOnLoad() {
        this.subjectCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            // Stagger the animations
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100 + 200);
        });
    }

    initializeScrollAnimations() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate');
                        this.animateElementIn(entry.target);
                    }
                });
            }, {
                threshold: 0.15,
                rootMargin: '0px 0px -100px 0px'
            });

            // Enhanced scroll animations for different elements
            const scrollElements = document.querySelectorAll('.footer, .scroll-animate, .scroll-animate-left, .scroll-animate-right, .scroll-animate-scale');
            scrollElements.forEach(el => observer.observe(el));
            
            // Additional observer for subject cards with staggered animation
            const cardObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('scroll-visible');
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0) rotateX(0deg)';
                        }, index * 150);
                    }
                });
            }, {
                threshold: 0.2
            });

            const cards = document.querySelectorAll('.subject-card');
            cards.forEach(card => cardObserver.observe(card));
        }
    }

    animateElementIn(element) {
        if (element.classList.contains('intro-section')) {
            element.style.animation = 'fadeInUp 0.8s ease-out forwards';
        } else if (element.classList.contains('subject-card')) {
            element.style.animation = 'fadeInUp 0.6s ease-out forwards';
        }

        // Add animation styles if not already present
        if (!document.getElementById('scroll-animations')) {
            const style = document.createElement('style');
            style.id = 'scroll-animations';
            style.textContent = `
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    handleScroll() {
        const scrollY = window.scrollY;
        
        // Parallax effect for header
        if (this.header) {
            const parallaxValue = scrollY * 0.5;
            this.header.style.transform = `translateY(${parallaxValue}px)`;
        }

        // Update navigation state based on scroll position
        this.updateNavigationState(scrollY);
    }

    updateNavigationState(scrollY) {
        // Add/remove classes based on scroll position
        if (scrollY > 100) {
            document.body.classList.add('scrolled');
        } else {
            document.body.classList.remove('scrolled');
        }
    }

    handleResize() {
        // Handle responsive adjustments
        this.adjustLayoutForViewport();
    }

    adjustLayoutForViewport() {
        const viewport = window.innerWidth;
        
        // Add viewport-specific classes
        document.body.classList.remove('mobile', 'tablet', 'desktop');
        
        if (viewport < 768) {
            document.body.classList.add('mobile');
        } else if (viewport < 1024) {
            document.body.classList.add('tablet');
        } else {
            document.body.classList.add('desktop');
        }
    }

    handlePageLoad() {
        // Initialize page
        this.adjustLayoutForViewport();
        
        // Add loaded class to body
        document.body.classList.add('page-loaded');
        
        // Initialize accessibility features
        this.initializeAccessibility();
        
        // Log page load for analytics
        console.log('Bangladesh MCQ Checker - Homepage loaded');
    }

    initializeAccessibility() {
        // Add ARIA labels and roles
        this.subjectCards.forEach((card, index) => {
            const subject = card.dataset.subject;
            const button = card.querySelector('.btn');
            
            if (button) {
                button.setAttribute('aria-label', `Start ${subject} quiz`);
                button.setAttribute('role', 'button');
            }
            
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'article');
            card.setAttribute('aria-label', `${subject} subject card`);
        });

        // Add keyboard navigation hints
        this.addKeyboardNavigationHints();
    }

    addKeyboardNavigationHints() {
        // Add keyboard navigation instructions
        const keyboardHint = document.createElement('div');
        keyboardHint.className = 'keyboard-hint';
        keyboardHint.innerHTML = `
            <p><kbd>Tab</kbd> to navigate, <kbd>Enter</kbd> or <kbd>Space</kbd> to select</p>
        `;
        keyboardHint.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.8rem;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1000;
            pointer-events: none;
        `;

        document.body.appendChild(keyboardHint);

        // Show hint when user starts using keyboard navigation
        let keyboardUser = false;
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab' && !keyboardUser) {
                keyboardUser = true;
                keyboardHint.style.opacity = '1';
                
                // Hide after 5 seconds
                setTimeout(() => {
                    keyboardHint.style.opacity = '0';
                }, 5000);
            }
        });

        // Hide hint when mouse is used
        document.addEventListener('mousedown', () => {
            if (keyboardUser) {
                keyboardHint.style.opacity = '0';
            }
        });
    }

    trackSubjectClick(subject) {
        // Track subject selection for analytics
        const timestamp = new Date().toISOString();
        console.log(`Subject selected: ${subject} at ${timestamp}`);
        
        // Store in localStorage for potential analytics
        try {
            const analytics = JSON.parse(localStorage.getItem('mcq_analytics') || '[]');
            analytics.push({
                event: 'subject_selected',
                subject: subject,
                timestamp: timestamp,
                userAgent: navigator.userAgent,
                viewport: {
                    width: window.innerWidth,
                    height: window.innerHeight
                }
            });
            
            // Keep only last 100 events
            if (analytics.length > 100) {
                analytics.splice(0, analytics.length - 100);
            }
            
            localStorage.setItem('mcq_analytics', JSON.stringify(analytics));
        } catch (error) {
            console.log('Analytics storage failed:', error);
        }
    }

    // Public methods for external use
    highlightSubject(subjectName) {
        const card = document.querySelector(`[data-subject="${subjectName}"]`);
        if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            card.classList.add('highlighted');
            
            setTimeout(() => {
                card.classList.remove('highlighted');
            }, 2000);
        }
    }

    getSubjectStats() {
        try {
            const analytics = JSON.parse(localStorage.getItem('mcq_analytics') || '[]');
            const subjectClicks = {};
            
            analytics.forEach(event => {
                if (event.event === 'subject_selected') {
                    subjectClicks[event.subject] = (subjectClicks[event.subject] || 0) + 1;
                }
            });
            
            return subjectClicks;
        } catch (error) {
            console.log('Failed to get subject stats:', error);
            return {};
        }
    }
}

// Initialize navigation manager when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.navigationManager = new NavigationManager();
    
    // Add custom styles for enhanced interactions
    const style = document.createElement('style');
    style.textContent = `
        .subject-card.focused {
            outline: 3px solid #667eea;
            outline-offset: 2px;
        }
        
        .subject-card.highlighted {
            animation: highlight 2s ease-in-out;
        }
        
        @keyframes highlight {
            0%, 100% { 
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); 
            }
            50% { 
                box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3); 
                transform: translateY(-5px);
            }
        }
        
        .keyboard-hint kbd {
            background: #f1f1f1;
            color: #333;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 0.75rem;
            margin: 0 2px;
        }
        
        body.scrolled .header {
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }
        
        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;
    document.head.appendChild(style);
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NavigationManager };
}
