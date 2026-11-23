/**
 * unocuatrosiete - Minimalist Modern JavaScript
 * Clean, lightweight, zero-slop & zero-popup
 */

'use strict';

(function () {
  const WHATSAPP_PHONE = '584129008333';

  // Mobile Navigation Toggle
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      nav.classList.toggle('mobile-active');
    });

    // Close mobile nav when clicking a link
    nav.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('mobile-active');
      });
    });
  }

  // Hero Synchronized Carousel (Rotates every 30 seconds)
  const heroSlideNav = document.querySelector('.hero-slide-nav');
  const heroTabs = document.querySelectorAll('.hero-tab-btn');
  const heroTexts = document.querySelectorAll('.hero-slide-text');
  const heroVisualItems = document.querySelectorAll('.hero-carousel-item');
  const heroSlideCurrent = document.getElementById('heroSlideCurrent');
  const heroPrevBtn = document.getElementById('heroPrevBtn');
  const heroNextBtn = document.getElementById('heroNextBtn');
  const heroCarousel = document.getElementById('heroCarousel');

  if (heroTabs.length > 0 && heroVisualItems.length > 0) {
    let currentSlide = 0;
    const totalSlides = heroTabs.length;
    const INTERVAL_MS = 30000; // 30 seconds
    let slideTimer = null;

    function goToSlide(index) {
      if (index < 0) {
        index = totalSlides - 1;
      } else if (index >= totalSlides) {
        index = 0;
      }
      currentSlide = index;

      // Update tabs
      heroTabs.forEach((tab, i) => {
        const isActive = i === currentSlide;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        
        // Reset progress bar animation
        const fill = tab.querySelector('.hero-tab-fill');
        if (fill) {
          fill.style.transition = 'none';
          fill.style.width = '0%';
          if (isActive) {
            // Force reflow to restart CSS transition
            void fill.offsetWidth;
            fill.style.transition = `width ${INTERVAL_MS / 1000}s linear`;
            fill.style.width = '100%';
          }
        }
      });

      // Update text
      heroTexts.forEach((textEl, i) => {
        textEl.classList.toggle('active', i === currentSlide);
      });

      // Update visual items
      heroVisualItems.forEach((itemEl, i) => {
        itemEl.classList.toggle('active', i === currentSlide);
      });

      // Update counter
      if (heroSlideCurrent) {
        heroSlideCurrent.textContent = String(currentSlide + 1).padStart(2, '0');
      }

      // Restart timer
      startAutoPlay();
    }

    function startAutoPlay() {
      stopAutoPlay();
      slideTimer = setTimeout(() => {
        goToSlide(currentSlide + 1);
      }, INTERVAL_MS);
    }

    function stopAutoPlay() {
      if (slideTimer) {
        clearTimeout(slideTimer);
        slideTimer = null;
      }
    }

    // Tab clicks
    heroTabs.forEach((tab) => {
      tab.addEventListener('click', function () {
        const slideIndex = parseInt(this.getAttribute('data-slide'), 10);
        goToSlide(slideIndex);
      });
    });

    // Arrow clicks
    if (heroPrevBtn) {
      heroPrevBtn.addEventListener('click', () => {
        goToSlide(currentSlide - 1);
      });
    }

    if (heroNextBtn) {
      heroNextBtn.addEventListener('click', () => {
        goToSlide(currentSlide + 1);
      });
    }

    // Initialize first slide progress
    goToSlide(0);
  }

  // Cotizador Express Form
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const prod = document.getElementById('prodInput') ? document.getElementById('prodInput').value : 'Prenda personalizada';
      const qty = document.getElementById('qtyInput') ? document.getElementById('qtyInput').value : '1 a 5 piezas';
      const city = document.getElementById('cityInput') ? document.getElementById('cityInput').value : 'Cabudare / Barquisimeto';
      const notes = document.getElementById('notesInput') ? document.getElementById('notesInput').value.trim() : 'Sin notas adicionales';

      const message = `¡Hola unocuatrosiete! Quisiera cotizar un pedido:%0A%0A` +
        `• *Prenda/Producto:* ${encodeURIComponent(prod)}%0A` +
        `• *Cantidad estimada:* ${encodeURIComponent(qty)}%0A` +
        `• *Ubicación:* ${encodeURIComponent(city)}%0A` +
        `• *Detalle del diseño:* ${encodeURIComponent(notes)}%0A%0A` +
        `¿Me podrían dar información de precios y tiempos de entrega? ¡Gracias!`;

      const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${message}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }
})();
