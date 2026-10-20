/**
 * Scroll Reveal & Interactive Observers
 * Handles entrance animations, number counters, scroll progress bar,
 * and active section navigation tracking.
 */

(function () {
  'use strict';

  class ScrollRevealController {
    constructor() {
      this.observer = null;
      this.counterObserver = null;
      this.reducedMotion = false;
      this.progressBar = null;
    }

    init() {
      this.progressBar = document.getElementById('scroll-progress-bar');
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.reducedMotion = mediaQuery.matches;

      if (this.reducedMotion) {
        // Immediately reveal all elements without motion
        document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale')
          .forEach(el => el.classList.add('is-revealed'));
        this.runCountersImmediate();
        return;
      }

      this.setupObserver();
      this.setupCounterObserver();
      this.setupScrollProgress();
      this.setupSectionObserver();
    }

    setupObserver() {
      const options = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.12
      };

      this.observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      }, options);

      const revealElements = document.querySelectorAll(
        '.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale, .timeline-item, .quality-card'
      );

      revealElements.forEach(el => this.observer.observe(el));
    }

    setupCounterObserver() {
      const options = {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.2
      };

      this.counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const counterEl = entry.target;
            this.animateCounter(counterEl);
            observer.unobserve(counterEl);
          }
        });
      }, options);

      document.querySelectorAll('.stat-counter').forEach(el => {
        this.counterObserver.observe(el);
      });
    }

    animateCounter(element) {
      const target = parseFloat(element.getAttribute('data-target') || 0);
      const suffix = element.getAttribute('data-suffix') || '';
      const duration = 1800; // ms
      const startTime = performance.now();

      const updateCount = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease-out cubic curve
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeProgress * target);

        element.textContent = currentVal + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        } else {
          element.textContent = target + suffix;
        }
      };

      requestAnimationFrame(updateCount);
    }

    runCountersImmediate() {
      document.querySelectorAll('.stat-counter').forEach(el => {
        const target = el.getAttribute('data-target') || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        el.textContent = target + suffix;
      });
    }

    setupScrollProgress() {
      if (!this.progressBar) return;

      const onScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        this.progressBar.style.width = scrolled + '%';
      };

      window.addEventListener('scroll', onScroll, { passive: true });
    }

    setupSectionObserver() {
      const sections = document.querySelectorAll('section[id]');
      const navLinks = document.querySelectorAll('.nav-link');

      if (!sections.length || !navLinks.length) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const currentId = entry.target.getAttribute('id');
              navLinks.forEach((link) => {
                const href = link.getAttribute('href');
                if (href === '#' + currentId) {
                  link.classList.add('active');
                } else {
                  link.classList.remove('active');
                }
              });
            }
          });
        },
        { rootMargin: '-30% 0px -60% 0px' }
      );

      sections.forEach((sec) => observer.observe(sec));
    }
  }

  window.RevealController = new ScrollRevealController();
})();
