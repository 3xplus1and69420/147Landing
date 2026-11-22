/**
 * unocuatrosiete - Landing Page Interactive Architecture
 * Compliant with: ui-ux-pro-max & aislop
 */

'use strict';

(function () {
  // Configurable Business Details
  const CONFIG = {
    // Official WhatsApp contact number (format without + or symbols)
    whatsappPhone: '584120000000',
    brandName: 'unocuatrosiete'
  };

  /**
   * Safe DOM Query Helper
   */
  function $(selector, context = document) {
    return context.querySelector(selector);
  }

  function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
  }

  /* ==========================================================================
     1. Mobile Navigation Toggle
     ========================================================================== */
  function initMobileNav() {
    const navToggle = $('#navToggle');
    const navMenu = $('#navMenu');

    if (!navToggle || !navMenu) return;

    navToggle.addEventListener('click', function () {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isExpanded));
      navMenu.classList.toggle('mobile-open');
    });

    // Close when clicking nav links
    $$('.nav-link', navMenu).forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('mobile-open');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', function (event) {
      if (!navMenu.contains(event.target) && !navToggle.contains(event.target)) {
        navToggle.setAttribute('aria-expanded', 'false');
        navMenu.classList.remove('mobile-open');
      }
    });
  }

  /* ==========================================================================
     2. Interactive Cotizador Express WhatsApp Generator
     ========================================================================== */
  function initCustomizer() {
    const form = $('#customizerForm');
    const productSelect = $('#productSelect');
    const detailInput = $('#detailInput');
    const citySelect = $('#citySelect');
    const previewEl = $('#whatsappMessagePreview');

    if (!form || !productSelect || !detailInput || !citySelect || !previewEl) return;

    function getSelectedQuantity() {
      const checkedRadio = $('input[name="quantity"]:checked', form);
      return checkedRadio ? checkedRadio.value : '1 a 5 piezas';
    }

    function generateMessageText() {
      const product = productSelect.value.trim();
      const qty = getSelectedQuantity();
      const details = detailInput.value.trim() || 'Diseño estándar';
      const city = citySelect.value.trim();

      return `¡Hola ${CONFIG.brandName}! Quiero cotizar un pedido personalizado:%0A%0A` +
        `📦 *Producto:* ${encodeURIComponent(product)}%0A` +
        `🔢 *Cantidad:* ${encodeURIComponent(qty)}%0A` +
        `🎨 *Detalle del diseño:* ${encodeURIComponent(details)}%0A` +
        `📍 *Ubicación:* ${encodeURIComponent(city)}%0A%0A` +
        `¿Me podrían dar información de precios y tiempos de entrega? ¡Gracias!`;
    }

    function updatePreview() {
      const product = productSelect.value.trim();
      const qty = getSelectedQuantity();
      const details = detailInput.value.trim() || 'Sin detalles adicionales';
      const city = citySelect.value.trim();

      previewEl.textContent = `«¡Hola ${CONFIG.brandName}! Quiero cotizar: ${product} | Cantidad: ${qty} | Detalle: ${details} | Ubicación: ${city}. ¿Precios y tiempos de entrega?»`;
    }

    // Attach real-time update listeners
    productSelect.addEventListener('change', updatePreview);
    citySelect.addEventListener('change', updatePreview);
    detailInput.addEventListener('input', updatePreview);
    
    $$('input[name="quantity"]', form).forEach(function (radio) {
      radio.addEventListener('change', updatePreview);
    });

    // Form submit -> Open WhatsApp directly
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const message = generateMessageText();
      const waUrl = `https://wa.me/${CONFIG.whatsappPhone}?text=${message}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });

    // Catalog buttons trigger selection into the form
    $$('.select-for-quote').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const productName = btn.getAttribute('data-product');
        if (productName && productSelect) {
          // Find matching option or closest
          for (let i = 0; i < productSelect.options.length; i++) {
            if (productSelect.options[i].value.includes(productName) || productName.includes(productSelect.options[i].value)) {
              productSelect.selectedIndex = i;
              break;
            }
          }
          updatePreview();

          // Smooth scroll to form
          const quoteSection = $('#cotizador');
          if (quoteSection) {
            quoteSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            detailInput.focus({ preventScroll: true });
          }
        }
      });
    });

    // Initial preview setup
    updatePreview();
  }

  /* ==========================================================================
     3. Lightbox Modal for Testimonial Screenshots
     ========================================================================== */
  function initLightbox() {
    const modal = $('#lightboxModal');
    const backdrop = $('#lightboxBackdrop');
    const closeBtn = $('#lightboxClose');
    const imgEl = $('#lightboxImg');

    if (!modal || !backdrop || !closeBtn || !imgEl) return;

    function openLightbox(src, alt) {
      imgEl.src = src;
      imgEl.alt = alt || 'Testimonio ampliado de WhatsApp';
      modal.removeAttribute('hidden');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    function closeLightbox() {
      modal.setAttribute('hidden', '');
      imgEl.src = '';
      document.body.style.overflow = '';
    }

    $$('.testimonial-screenshot-card').forEach(function (card) {
      card.addEventListener('click', function () {
        const modalSrc = card.getAttribute('data-modal');
        const img = $('img', card);
        const altText = img ? img.alt : '';
        if (modalSrc) {
          openLightbox(modalSrc, altText);
        }
      });

      // Keyboard accessibility (Enter/Space)
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', 'Ampliar captura de testimonio');
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
        closeLightbox();
      }
    });
  }

  /* ==========================================================================
     4. IntersectionObserver Micro-Animations on Scroll
     ========================================================================== */
  function initScrollAnimations() {
    const animatedElements = $$('.animate-on-scroll');

    // If reduced motion is preferred or IntersectionObserver is unavailable
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      animatedElements.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ==========================================================================
     5. Header Scroll State (Refined Backdrop on Scroll)
     ========================================================================== */
  function initHeaderScroll() {
    const header = $('#header');
    if (!header) return;

    let ticking = false;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (window.scrollY > 40) {
            header.style.borderBottomColor = 'rgba(59, 167, 255, 0.25)';
            header.style.backgroundColor = 'rgba(6, 5, 10, 0.95)';
          } else {
            header.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
            header.style.backgroundColor = 'rgba(6, 5, 10, 0.85)';
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* ==========================================================================
     Initialize Everything on DOMContentLoaded
     ========================================================================== */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initMobileNav();
      initCustomizer();
      initLightbox();
      initScrollAnimations();
      initHeaderScroll();
    });
  } else {
    initMobileNav();
    initCustomizer();
    initLightbox();
    initScrollAnimations();
    initHeaderScroll();
  }
})();
