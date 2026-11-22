'use strict';

(function () {
  const WHATSAPP_PHONE = '584120000000';

  const elements = {
    header: document.getElementById('header'),
    mobileToggle: document.getElementById('mobile-toggle'),
    mobileClose: document.getElementById('mobile-close'),
    mobileNav: document.getElementById('mobile-nav'),
    customizerForm: document.getElementById('customizer-form'),
    sendWhatsAppBtn: document.getElementById('send-whatsapp-btn'),
    copySummaryBtn: document.getElementById('copy-summary-btn'),
    copyBtnText: document.getElementById('copy-btn-text'),
    previewProduct: document.getElementById('preview-product'),
    previewTechnique: document.getElementById('preview-technique'),
    previewQuantity: document.getElementById('preview-quantity'),
    previewDesign: document.getElementById('preview-design'),
    previewNotes: document.getElementById('preview-notes'),
    previewNotesRow: document.getElementById('preview-notes-row'),
    extraNotesInput: document.getElementById('extra-notes'),
    filterButtons: document.querySelectorAll('.filter-btn'),
    productCards: document.querySelectorAll('.product-card'),
    selectProductButtons: document.querySelectorAll('.select-product-btn'),
    lightboxModal: document.getElementById('lightbox-modal'),
    lightboxOverlay: document.getElementById('lightbox-overlay'),
    lightboxClose: document.getElementById('lightbox-close'),
    lightboxImg: document.getElementById('lightbox-img'),
    screenshotButtons: document.querySelectorAll('.view-screenshot-btn'),
    currentYear: document.getElementById('current-year')
  };

  let activeTriggerElement = null;

  function init() {
    setupCurrentYear();
    setupHeaderScroll();
    setupMobileMenu();
    setupCustomizer();
    setupCatalogFilters();
    setupProductCardSelectors();
    setupLightbox();
    setupScrollReveal();
  }

  function setupCurrentYear() {
    if (elements.currentYear) {
      elements.currentYear.textContent = new Date().getFullYear().toString();
    }
  }

  function setupHeaderScroll() {
    if (!elements.header) return;

    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (window.scrollY > 20) {
            elements.header.classList.add('scrolled');
          } else {
            elements.header.classList.remove('scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  function setupMobileMenu() {
    if (!elements.mobileToggle || !elements.mobileNav || !elements.mobileClose) return;

    function openMenu() {
      elements.mobileNav.hidden = false;
      requestAnimationFrame(function () {
        elements.mobileNav.classList.add('active');
        elements.mobileToggle.setAttribute('aria-expanded', 'true');
        elements.mobileClose.focus();
      });
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      elements.mobileNav.classList.remove('active');
      elements.mobileToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      setTimeout(function () {
        elements.mobileNav.hidden = true;
      }, 250);
      elements.mobileToggle.focus();
    }

    elements.mobileToggle.addEventListener('click', openMenu);
    elements.mobileClose.addEventListener('click', closeMenu);

    elements.mobileNav.addEventListener('click', function (e) {
      if (e.target === elements.mobileNav) {
        closeMenu();
      }
    });

    const mobileLinks = elements.mobileNav.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && elements.mobileNav.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  function setupCustomizer() {
    if (!elements.customizerForm) return;

    function getSelectedRadioValue(name) {
      const checked = elements.customizerForm.querySelector('input[name="' + name + '"]:checked');
      return checked ? checked.value : '';
    }

    function updateActiveOptionsUI() {
      const inputs = elements.customizerForm.querySelectorAll('input[type="radio"]');
      inputs.forEach(function (input) {
        const parent = input.closest('.option-card, .option-pill, .quantity-card');
        if (parent) {
          if (input.checked) {
            parent.classList.add('active');
          } else {
            parent.classList.remove('active');
          }
        }
      });
    }

    function updateSummary() {
      const product = getSelectedRadioValue('product');
      const technique = getSelectedRadioValue('technique');
      const quantity = getSelectedRadioValue('quantity');
      const designStatus = getSelectedRadioValue('design_status');
      const extraNotes = elements.extraNotesInput ? elements.extraNotesInput.value.trim() : '';

      if (elements.previewProduct) elements.previewProduct.textContent = product;
      if (elements.previewTechnique) elements.previewTechnique.textContent = technique;
      if (elements.previewQuantity) elements.previewQuantity.textContent = quantity;
      if (elements.previewDesign) elements.previewDesign.textContent = designStatus;

      if (elements.previewNotes && elements.previewNotesRow) {
        if (extraNotes) {
          elements.previewNotes.textContent = extraNotes;
          elements.previewNotesRow.hidden = false;
        } else {
          elements.previewNotesRow.hidden = true;
        }
      }

      let message = '¡Hola unocuatrosiete! 👋 Quisiera cotizar el siguiente pedido:\n\n';
      message += '👕 *Producto:* ' + product + '\n';
      message += '🎨 *Técnica:* ' + technique + '\n';
      message += '📦 *Cantidad:* ' + quantity + '\n';
      message += '📁 *Diseño:* ' + designStatus + '\n';

      if (extraNotes) {
        message += '📝 *Detalles extras:* ' + extraNotes + '\n';
      }

      message += '\n¿Podrían indicarme presupuesto y tiempo de entrega? ¡Gracias!';

      if (elements.sendWhatsAppBtn) {
        const encoded = encodeURIComponent(message);
        elements.sendWhatsAppBtn.href = 'https://wa.me/' + WHATSAPP_PHONE + '?text=' + encoded;
      }

      return message;
    }

    elements.customizerForm.addEventListener('change', function (e) {
      if (e.target.matches('input[type="radio"]')) {
        updateActiveOptionsUI();
        updateSummary();
      }
    });

    if (elements.extraNotesInput) {
      elements.extraNotesInput.addEventListener('input', updateSummary);
    }

    if (elements.copySummaryBtn && elements.copyBtnText) {
      elements.copySummaryBtn.addEventListener('click', function () {
        const message = updateSummary();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(message).then(function () {
            const originalText = elements.copyBtnText.textContent;
            elements.copyBtnText.textContent = '✓ ¡Copiado al portapapeles!';
            setTimeout(function () {
              elements.copyBtnText.textContent = originalText;
            }, 2500);
          }).catch(function () {
            elements.copyBtnText.textContent = 'Error al copiar';
          });
        }
      });
    }

    updateActiveOptionsUI();
    updateSummary();
  }

  function setupCatalogFilters() {
    if (!elements.filterButtons.length || !elements.productCards.length) return;

    elements.filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        const filter = this.getAttribute('data-filter');

        elements.filterButtons.forEach(function (btn) {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        elements.productCards.forEach(function (card) {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  function setupProductCardSelectors() {
    if (!elements.selectProductButtons.length || !elements.customizerForm) return;

    elements.selectProductButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        const targetProduct = this.getAttribute('data-product');
        const radioInputs = elements.customizerForm.querySelectorAll('input[name="product"]');

        let matched = false;
        radioInputs.forEach(function (radio) {
          if (radio.value.toLowerCase().includes(targetProduct.toLowerCase()) || targetProduct.toLowerCase().includes(radio.value.toLowerCase())) {
            radio.checked = true;
            matched = true;
          }
        });

        if (!matched && radioInputs.length > 0) {
          radioInputs[0].checked = true;
        }

        const changeEvent = new Event('change', { bubbles: true });
        elements.customizerForm.dispatchEvent(changeEvent);

        const customizerSection = document.getElementById('personalizador');
        if (customizerSection) {
          customizerSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  function setupLightbox() {
    if (!elements.lightboxModal || !elements.lightboxImg || !elements.lightboxClose) return;

    function openLightbox(imgSrc, altText) {
      activeTriggerElement = document.activeElement;
      elements.lightboxImg.src = imgSrc;
      elements.lightboxImg.alt = altText || 'Comprobante ampliado';
      elements.lightboxModal.setAttribute('aria-hidden', 'false');
      elements.lightboxModal.classList.add('active');
      elements.lightboxClose.focus();
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      elements.lightboxModal.classList.remove('active');
      elements.lightboxModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (activeTriggerElement && typeof activeTriggerElement.focus === 'function') {
        activeTriggerElement.focus();
      }
    }

    elements.screenshotButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        const imgSrc = this.getAttribute('data-img');
        const imgEl = this.querySelector('img');
        const alt = imgEl ? imgEl.alt : 'Testimonio de cliente';
        openLightbox(imgSrc, alt);
      });
    });

    elements.lightboxClose.addEventListener('click', closeLightbox);
    if (elements.lightboxOverlay) {
      elements.lightboxOverlay.addEventListener('click', closeLightbox);
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && elements.lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  function setupScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    if (!revealElements.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealElements.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
