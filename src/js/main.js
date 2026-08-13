/**
 * MARIE-LAURE BERGIER - PSYCHOPRATICIENNE IFS & IR
 * Interaction & UX Features
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initFaqAccordion();
  initSmoothScroll();
  initScrollStemAnimation();
  initFormationsZoom();
});

/* Header Scroll Glassmorphism */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* Mobile Navigation Toggle */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !mainNav) return;

  toggleBtn.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    const isOpen = mainNav.classList.contains('active');
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });
}

/* FAQ Accordion Toggle */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other items for clean accordion effect
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('open');
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* Toast Notification Utility */
function showToast(message) {
  let toast = document.getElementById('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.className = 'toast-notification';
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span class="toast-message"></span>
    `;
    document.body.appendChild(toast);
  }

  const toastText = toast.querySelector('.toast-message');
  if (toastText) toastText.textContent = message;

  toast.classList.add('active');
  setTimeout(() => {
    toast.classList.remove('active');
  }, 4500);
}

/* Smooth Scroll Anchor Highlighting with Fixed Header Clearance */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const header = document.querySelector('.site-header');

  // Intercepte tous les clics sur les liens ancres # pour ajouter la décalage du header fixe
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 80;
        const extraPadding = 20; // Marge d'aération supplémentaire pour une visibilité parfaite
        const targetPosition = targetElem.getBoundingClientRect().top + window.pageYOffset - (headerHeight + extraPadding);

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Ferme le menu mobile si ouvert
        const mainNav = document.querySelector('.main-nav');
        const toggleBtn = document.querySelector('.mobile-nav-toggle');
        if (mainNav && mainNav.classList.contains('active')) {
          mainNav.classList.remove('active');
          if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPosition = window.scrollY + 220;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* Ultra Fast Scroll-Driven Stem & Flower Growth Animation */
function initScrollStemAnimation() {
  const stemPath = document.getElementById('growingStemPath');
  const container = document.querySelector('.cheminement-growth-container');
  if (!stemPath || !container) return;

  const pathLength = stemPath.getTotalLength();
  stemPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
  stemPath.style.strokeDashoffset = pathLength;

  const elements = [
    { id: 'leaf1Group', progressThreshold: 0.08 },
    { id: 'leaf2Group', progressThreshold: 0.16 },
    { id: 'leaf3Group', progressThreshold: 0.25 },
    { id: 'budGroup', progressThreshold: 0.35 },
    { id: 'flowerGroup', progressThreshold: 0.45 } // Éclosion 100% complète très tôt !
  ];

  const handleScroll = () => {
    const rect = container.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Début de pousse dès que le conteneur approche à 90% de l'écran
    const startY = windowHeight * 0.90;
    // Progression ultra-rapide : la fleur s'épanouit entièrement sur 32% de la hauteur
    const totalDistance = (container.offsetHeight * 0.32) + 40;
    const currentDistance = startY - rect.top;

    let progress = currentDistance / totalDistance;
    progress = Math.max(0, Math.min(1, progress));

    const drawLength = pathLength * progress;
    stemPath.style.strokeDashoffset = pathLength - drawLength;

    elements.forEach(item => {
      const elem = document.getElementById(item.id);
      if (!elem) return;

      if (progress >= item.progressThreshold) {
        elem.classList.add('visible');
      } else {
        elem.classList.remove('visible');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* Intersection Observer for Formations Card Zoom Entry */
function initFormationsZoom() {
  const card = document.querySelector('.formations-standalone-card');
  if (!card) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        card.classList.add('zoom-in');
      }
    });
  }, { threshold: 0.15 });

  observer.observe(card);
}
