/**
 * viralEngine — Redesigned Interactive Logic
 * Handles: time display, mobile nav, scroll-reveal, sticky nav state
 */

const init = () => {

  // --- 1. LIVE TIME DISPLAY IN NAV ---
  const navTime = document.getElementById('nav-time');

  const updateTime = () => {
    if (!navTime) return;
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    const h12 = (now.getHours() % 12 || 12).toString().padStart(2, '0');
    navTime.textContent = `${h12}:${m} ${ampm}`;
  };

  if (navTime) {
    updateTime();
    setInterval(updateTime, 1000);
  }


  // --- 2. MOBILE NAVIGATION TOGGLE ---
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileMenuToggle && navMenu) {
    const toggleMenu = () => {
      navMenu.classList.toggle('active');
      mobileMenuToggle.classList.toggle('active');
      const expanded = mobileMenuToggle.classList.contains('active');
      mobileMenuToggle.setAttribute('aria-expanded', String(expanded));
    };

    mobileMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    // Close menu when clicking links
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close drawer when clicking outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Mobile toggle hamburger X animation & styling inside dark drawer
  const style = document.createElement('style');
  style.textContent = `
    .mobile-toggle.active span { background-color: var(--c-white); }
    .mobile-toggle.active span:nth-child(1) { transform: translateY(4px) rotate(45deg); }
    .mobile-toggle.active span:nth-child(2) { transform: translateY(-4px) rotate(-45deg); }
  `;
  document.head.appendChild(style);


  // --- 3. STICKY NAVBAR SCROLL STATE ---
  const header = document.getElementById('main-header');

  const handleScroll = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 60);
  };

  if (header) {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
  }


  // --- 4. INTERSECTION OBSERVER SCROLL REVEALS ---
  const revealEls = document.querySelectorAll(
    '.process-step, .work-card, .asc-item, .about-text-col, .work-header, .cta-inner'
  );

  if ('IntersectionObserver' in window && revealEls.length > 0) {
    // Add reveal class dynamically
    revealEls.forEach((el, i) => {
      el.classList.add('reveal');
      if (i % 4 === 1) el.classList.add('reveal-delay-1');
      if (i % 4 === 2) el.classList.add('reveal-delay-2');
      if (i % 4 === 3) el.classList.add('reveal-delay-3');
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all
    revealEls.forEach(el => el.classList.add('visible'));
  }


  // --- 5. SMOOTH INTERNAL ANCHOR NAVIGATION WITH OFFSET ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  // --- 6. PAUSE MARQUEE ON HOVER (A11Y) ---
  const tickers = document.querySelectorAll('.ticker-inner, .cta-ticker-inner');
  tickers.forEach(ticker => {
    ticker.addEventListener('mouseenter', () => {
      ticker.style.animationPlayState = 'paused';
    });
    ticker.addEventListener('mouseleave', () => {
      ticker.style.animationPlayState = 'running';
    });
  });


  // --- 7. WORK CARDS: MAGNETIC HOVER EFFECT ---
  document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
      card.style.transform = `translateY(-8px) rotateX(${-y * 0.3}deg) rotateY(${x * 0.3}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

};


// Entry point — handles both synchronous and async DOM readiness
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
