/* ═══════════════════════════════════════════════════════════
   THALAIMAI 360 — CORPORATE CORE ENGINE
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ────── MOBILE DRAWER NAVIGATION ────── */
  const menuBtn = document.getElementById('menu-btn');
  const mobMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = mobMenu.classList.toggle('is-open');
      menuBtn.classList.toggle('is-open', isOpen);
      menuBtn.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close mobile menu when links are clicked
    mobMenu.querySelectorAll('[data-close]').forEach(link => {
      link.addEventListener('click', () => {
        mobMenu.classList.remove('is-open');
        menuBtn.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ────── STATISTICS COUNTER ────── */
  const repCounter = document.getElementById('rep-counter');
  let counterRan = false;
  const indianFmt = new Intl.NumberFormat('en-IN');

  function runCounter(el, targetVal, durationMs) {
    const startTime = performance.now();
    
    function update(currentTime) {
      const elapsed = Math.min((currentTime - startTime) / durationMs, 1);
      // Ease out quartic
      const easeVal = 1 - Math.pow(1 - elapsed, 4);
      el.textContent = indianFmt.format(Math.floor(easeVal * targetVal));
      
      if (elapsed < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = indianFmt.format(targetVal);
      }
    }
    
    requestAnimationFrame(update);
  }

  if (repCounter) {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !counterRan) {
        counterRan = true;
        const targetValue = parseInt(repCounter.dataset.to, 10) || 110000;
        runCounter(repCounter, targetValue, 2500);
      }
    }, { threshold: 0.3 });
    observer.observe(repCounter);
  }

  /* ────── SCROLL-SPY NAVIGATION ────── */
  const sections = document.querySelectorAll('.section');
  const sidebarItems = document.querySelectorAll('.sidebar__item');

  if (sections.length && sidebarItems.length) {
    function activeMenuLink() {
      let currentSectionId = '';
      const scrollPos = window.scrollY + window.innerHeight * 0.4;

      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentSectionId = section.getAttribute('id');
        }
      });

      // Fallback if scrolled to very top
      if (window.scrollY < 100) {
        currentSectionId = 'about';
      }
      // Fallback if at the very bottom
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
        currentSectionId = 'contact';
      }

      if (currentSectionId) {
        sidebarItems.forEach(item => {
          item.classList.remove('active');
          const link = item.querySelector('a');
          if (link && link.getAttribute('href') === `#${currentSectionId}`) {
            item.classList.add('active');
          }
        });
      }
    }

    window.addEventListener('scroll', activeMenuLink, { passive: true });
    // Run once initially
    activeMenuLink();
  }

  /* ────── SCROLL REVEAL EFFECT ────── */
  const revealElements = document.querySelectorAll('[data-r]');

  if (revealElements.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const siblingElements = entry.target.parentElement.querySelectorAll('[data-r]');
          const index = Array.from(siblingElements).indexOf(entry.target);
          // Introduce staggered delays
          entry.target.style.transitionDelay = `${index * 0.05}s`;
          entry.target.classList.add('is-in');
          // Once animated, don't observe again to keep page smooth
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.05,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  }

})();
