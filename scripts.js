/**
 * Portfolio Website JavaScript
 * Author: Brice Ashburn
 * Features: Throttled scroll handling, intersection observer animations, mobile navigation
 */

/**
 * Throttle function: Limits the rate at which a function can fire
 * Prevents performance issues by ensuring the function only executes once per specified time period
 * @param {Function} func - The function to throttle
 * @param {number} wait - Time in milliseconds to wait between function calls
 * @returns {Function} - Throttled version of the input function
 */
function throttle(func, wait) {
  let timeout;
  let lastRan;
  return function executedFunction(...args) {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if ((Date.now() - lastRan) >= wait) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, wait - (Date.now() - lastRan));
    }
  };
}

/**
 * Mobile Navigation Toggle Functionality
 * Handles hamburger menu open/close with enhanced animations and accessibility
 */
function initMobileNavigation() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navBackdrop = document.getElementById('nav-backdrop');

  if (!navToggle || !navMenu || !navBackdrop) return;

  // Add ARIA attributes for accessibility
  navToggle.setAttribute('aria-label', 'Toggle navigation menu');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-controls', 'nav-menu');

  function closeMenu() {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    navBackdrop.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation menu');
    document.body.style.overflow = '';
  }

  function openMenu() {
    navMenu.classList.add('active');
    navToggle.classList.add('active');
    navBackdrop.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Close navigation menu');
    document.body.style.overflow = 'hidden';
  }

  // Toggle mobile menu on hamburger click
  navToggle.addEventListener('click', () => {
    const isActive = navMenu.classList.contains('active');
    
    if (isActive) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Auto-close mobile menu when user clicks on navigation links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu when clicking on backdrop
  navBackdrop.addEventListener('click', closeMenu);

  // Close menu on escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      closeMenu();
      navToggle.focus(); // Return focus to toggle button
    }
  });

  // Handle window resize - close menu if switching to desktop view
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });
}

/**
 * Smooth Scrolling for Internal Navigation Links
 * Enhances UX by providing smooth transitions to page sections
 */
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
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
}

/**
 * Dynamic Navbar Background on Scroll
 * Changes navbar appearance when user scrolls down for better readability
 * Uses throttling to optimize performance during scroll events
 */
function initNavbarScrollEffect() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const handleScroll = throttle(() => {
    if (window.scrollY > 100) {
      // Apply solid background and shadow when scrolled down
      navbar.style.background = 'rgba(15, 23, 42, 0.98)';
      navbar.style.boxShadow = '0 2px 20px var(--shadow)';
    } else {
      // Reset to transparent when at top of page
      navbar.style.background = 'var(--bg-navbar)';
      navbar.style.boxShadow = 'none';
    }
  }, 16); // 16ms ≈ 60fps for smooth animation

  // Attach scroll event listener
  window.addEventListener('scroll', handleScroll);
}

/**
 * Intersection Observer for Scroll-triggered Animations
 * Provides smooth fade-in and slide-up animations when elements enter viewport
 */
function initScrollAnimations() {
  // Early exit if Intersection Observer is not supported
  if (!('IntersectionObserver' in window)) return;

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
        // Stop observing this element once animated
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Select all elements that should animate on scroll
  const animateElements = document.querySelectorAll('.skill-card, .project-card, .stat');
  
  // Early exit if no elements found
  if (animateElements.length === 0) return;
  
  animateElements.forEach(el => {
    // Set initial state: hidden and slightly below viewport
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    // Start observing element for intersection
    observer.observe(el);
  });
}

/**
 * Initialize all functionality when DOM is ready
 */
function init() {
  initMobileNavigation();
  initSmoothScrolling();
  initNavbarScrollEffect();
  initScrollAnimations();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

