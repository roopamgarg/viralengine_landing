/**
 * viralEngine Interactive Client Logic
 * Handles interactive navigation, mobile menu, viewport scroll-reveals,
 * and high-fidelity case study metric chart animations.
 */

const init = () => {
  // --- 1. MOBILE NAVIGATION TOGGLE ---
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      mobileMenuToggle.classList.toggle('active');
      
      // Accessibility attributes
      const expanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true' || false;
      mobileMenuToggle.setAttribute('aria-expanded', !expanded);
    });

    // Close mobile menu on clicking any navigation link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- 2. STICKY SHRINIKING NAVBAR FALLBACK ---
  const header = document.getElementById('main-header');
  
  const handleScroll = () => {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  if (header) {
    // Run immediately and attach event listener
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // --- 3. VIEWPORT SCROLL-REVEAL SYSTEM ---
  const revealElements = document.querySelectorAll('.reveal');
  
  // Interactive Chart Elements
  const tabSupport = document.getElementById('tab-support');
  const tabPipeline = document.getElementById('tab-pipeline');
  const barBefore = document.getElementById('bar-before');
  const barAfter = document.getElementById('bar-after');
  const metricLabel = document.getElementById('metric-label');
  const metricSaving = document.getElementById('metric-saving');

  // Chart datasets
  const chartData = {
    support: {
      beforeHeight: '90%',
      beforeValue: '8.5 hours',
      afterHeight: '6%',
      afterValue: '54 secs',
      label: 'Avg. Support Turnaround',
      saving: '-99.8% reduction'
    },
    pipeline: {
      beforeHeight: '85%',
      beforeValue: '4.2 hours',
      afterHeight: '8%',
      afterValue: '42 secs',
      label: 'Batch Data Processing',
      saving: '-99.7% acceleration'
    }
  };

  let activeWorkflow = 'support';

  const updateChartData = (workflow) => {
    if (activeWorkflow === workflow) return;
    activeWorkflow = workflow;
    
    // Toggle active classes on tab buttons
    if (workflow === 'support') {
      if (tabSupport) tabSupport.classList.add('active');
      if (tabPipeline) tabPipeline.classList.remove('active');
    } else {
      if (tabSupport) tabSupport.classList.remove('active');
      if (tabPipeline) tabPipeline.classList.add('active');
    }

    animateChart();
  };

  const animateChart = () => {
    const data = chartData[activeWorkflow];
    if (!data) return;
    
    // Update workflow attribute on the container to trigger static CSS-driven height transition
    const widget = document.getElementById('case-study-widget');
    if (widget) {
      widget.setAttribute('data-workflow', activeWorkflow);
    }
    
    // Update text labels
    if (metricLabel) {
      metricLabel.textContent = data.label;
    }
    if (metricSaving) {
      metricSaving.textContent = data.saving;
    }
  };

  if (revealElements.length > 0) {
    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            
            // If this is the case-study dashboard widget, trigger the chart animation
            if (entry.target.id === 'case-study-widget') {
              animateChart();
            }
            
            // Unobserve after showing to avoid repeat transitions
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      });

      revealElements.forEach(element => {
        revealObserver.observe(element);
      });
    } else {
      // Fallback for older browsers: show all instantly
      revealElements.forEach(element => {
        element.classList.add('reveal-visible');
      });
      animateChart();
    }
  } else {
    // If no reveal elements are defined, still animate the chart
    animateChart();
  }

  if (tabSupport && tabPipeline) {
    tabSupport.addEventListener('click', () => updateChartData('support'));
    tabPipeline.addEventListener('click', () => updateChartData('pipeline'));
  }

  // Pre-initialize chart values immediately on load so the visual is never blank
  animateChart();

  // --- 5. SMOOTH INNER LINK NAVIGATION WITH OFFSET ---
  const menuLinks = document.querySelectorAll('a[href^="#"]');
  
  menuLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // Calculate offset for sticky header height
        const headerOffset = 100;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
};

// Robust entry point executing initialization regardless of race conditions on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
