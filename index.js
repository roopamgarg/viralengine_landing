/**
 * viralEngine Interactive Client Logic
 * Handles interactive navigation, mobile menu, viewport scroll-reveals,
 * and high-fidelity case study metric chart animations.
 */

document.addEventListener('DOMContentLoaded', () => {

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
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  // Run immediately and attach event listener
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });

  // --- 3. VIEWPORT SCROLL-REVEAL SYSTEM ---
  const revealElements = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          
          // If this is the case-study dashboard widget, trigger the chart animation
          if (entry.target.id === 'results' || entry.target.contains(document.getElementById('case-study-widget'))) {
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

  // --- 4. INTERACTIVE CASE STUDY CHART SYSTEM ---
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
      tabSupport.classList.add('active');
      tabPipeline.classList.remove('active');
    } else {
      tabSupport.classList.remove('active');
      tabPipeline.classList.add('active');
    }

    animateChart();
  };

  const animateChart = () => {
    const data = chartData[activeWorkflow];
    
    // Reset heights first to trigger smooth transition effect
    barBefore.style.height = '0%';
    barAfter.style.height = '0%';
    barBefore.setAttribute('data-value', '');
    barAfter.setAttribute('data-value', '');
    
    // Animate to target values
    setTimeout(() => {
      barBefore.style.height = data.beforeHeight;
      barAfter.style.height = data.afterHeight;
      
      barBefore.setAttribute('data-value', data.beforeValue);
      barAfter.setAttribute('data-value', data.afterValue);
      
      metricLabel.textContent = data.label;
      metricSaving.textContent = data.saving;
    }, 150);
  };

  if (tabSupport && tabPipeline) {
    tabSupport.addEventListener('click', () => updateChartData('support'));
    tabPipeline.addEventListener('click', () => updateChartData('pipeline'));
  }

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

});
