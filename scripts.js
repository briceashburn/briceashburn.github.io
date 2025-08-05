/**
 * Throttle function: Limits the rate at which a function can fire
 * Prevents performance issues by ensuring the function only executes once per specified time period
 * @param {Function} func - The function to throttle
 * @param {number} wait - Time in milliseconds to wait between function calls
 * @returns {Function} - Throttled version of the input function
 */
function throttle(func, wait) {
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

/**
 * Mobile Navigation Toggle Functionality
 * Handles hamburger menu open/close and accessibility attributes
 */
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle && navMenu) {
  // Toggle mobile menu on hamburger click
  navToggle.addEventListener('click', () => {
    const isExpanded = navMenu.classList.contains('active');
    navMenu.classList.toggle('active');
    // Update ARIA attribute for screen readers
    navToggle.setAttribute('aria-expanded', !isExpanded);
  });

  // Auto-close mobile menu when user clicks on navigation links
  // Improves UX by closing menu after selection
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/**
 * Smooth Scrolling for Internal Navigation Links
 * Enhances UX by providing smooth transitions to page sections
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const target = document.querySelector(targetId);
    
    // Scroll to target section with smooth animation
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

/**
 * Dynamic Navbar Background on Scroll
 * Changes navbar appearance when user scrolls down for better readability
 * Uses throttling to optimize performance during scroll events
 */
const handleScroll = throttle(() => {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    if (window.scrollY > 100) {
      // Apply solid background and shadow when scrolled down
      navbar.style.background = 'var(--bg-navbar-scroll)';
      navbar.style.boxShadow = '0 2px 20px var(--shadow)';
    } else {
      // Reset to transparent when at top of page
      navbar.style.background = 'var(--bg-navbar)';
      navbar.style.boxShadow = 'none';
    }
  }
}, 16); // 16ms ≈ 60fps for smooth animation

// Attach scroll event listener
window.addEventListener('scroll', handleScroll);

/**
 * Intersection Observer for Scroll-triggered Animations
 * Provides smooth fade-in and slide-up animations when elements enter viewport
 */

// Configuration for when animations should trigger
const observerOptions = {
  threshold: 0.1,        // Trigger when 10% of element is visible
  rootMargin: '0px 0px -50px 0px'  // Start animation 50px before element enters viewport
};

// Observer callback: handles the animation when elements become visible
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Animate element into view
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

/**
 * Initialize Scroll Animations on DOM Load
 * Sets up initial state and observes elements for animation
 */
document.addEventListener('DOMContentLoaded', () => {
  // Select all elements that should animate on scroll
  const animateElements = document.querySelectorAll('.skill-card, .project-card, .stat');
  
  animateElements.forEach(el => {
    // Set initial state: hidden and slightly below viewport
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    // Start observing element for intersection
    observer.observe(el);
  });
});

