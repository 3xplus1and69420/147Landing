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

  // =========================================================================
  // Google Sheets Live Price Table & Interactive Real-Time Cotizador
  // Sheet: https://docs.google.com/spreadsheets/d/1l7qamRQd2mbAK2D75Z0sDngCirBs-16Y0Ph3WtEbkY8/edit?gid=0#gid=0
  // =========================================================================
  const SHEET_ID = '1l7qamRQd2mbAK2D75Z0sDngCirBs-16Y0Ph3WtEbkY8';
  const SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=0`;

  // Workshop fallback catalog & pricing (used when Google Sheet is private/offline)
  const FALLBACK_PRICES = [
    {
      name: 'Franelas Dry-Fit Sublimadas Full Print',
      spec: 'Dry Fit UV50+ Full Print',
      price1: 14.00,
      price6: 12.00,
      price12: 10.00
    },
    {
      name: 'Chaquetas Cortaviento Impermeables',
      spec: 'Taffeta Memory Sublimada',
      price1: 28.00,
      price6: 24.00,
      price12: 20.00
    },
    {
      name: 'Vaso Térmico 20 oz Acero Inoxidable',
      spec: 'Doble pared al vacío / Láser o DTF UV',
      price1: 16.00,
      price6: 14.00,
      price12: 12.00
    },
    {
      name: 'Vaso Vinero Térmico 12 oz',
      spec: 'Acero inoxidable mate / Personalizado',
      price1: 12.00,
      price6: 10.00,
      price12: 8.50
    },
    {
      name: 'Gorras & Accesorios Personalizados',
      spec: 'Gabardina / Bordado o DTF',
      price1: 9.00,
      price6: 7.50,
      price12: 6.00
    },
    {
      name: 'Dotación Corporativa Completa',
      spec: 'Combo Franela + Chaqueta + Vaso',
      price1: 50.00,
      price6: 44.00,
      price12: 38.00
    }
  ];

  let currentPricingData = FALLBACK_PRICES;

  const pricingTableBody = document.getElementById('pricingTableBody');
  const sheetStatusLabel = document.getElementById('sheetStatusLabel');
  const refreshPricesBtn = document.getElementById('refreshPricesBtn');
  const prodInput = document.getElementById('prodInput');
  const qtyInput = document.getElementById('qtyInput');
  const calcUnitPrice = document.getElementById('calcUnitPrice');
  const calcTotalPrice = document.getElementById('calcTotalPrice');
  const calcDiscountTag = document.getElementById('calcDiscountTag');
  const calcSavingsBox = document.getElementById('calcSavingsBox');
  const calcSavingsAmount = document.getElementById('calcSavingsAmount');
  const quoteForm = document.getElementById('quoteForm');

  // Synchronize product select options with Google Sheets live data
  function syncProductOptions(data) {
    if (!prodInput || !data || data.length === 0) return;
    const currentVal = prodInput.value;
    prodInput.innerHTML = '';
    data.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.name;
      opt.textContent = item.name;
      if (item.name === currentVal) {
        opt.selected = true;
      }
      prodInput.appendChild(opt);
    });
    if (!prodInput.value && data.length > 0) {
      prodInput.value = data[0].name;
    }
  }

  // Render pricing table rows (if table element is present)
  function renderPricingTable(data) {
    if (!pricingTableBody) return;
    pricingTableBody.innerHTML = '';

    data.forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.setAttribute('data-product', item.name);
      if (prodInput && prodInput.value === item.name) {
        tr.classList.add('selected-row');
      }

      tr.innerHTML = `
        <td><strong>${item.name}</strong></td>
        <td><span style="color: var(--color-gray-600);">${item.spec}</span></td>
        <td>$${Number(item.price1).toFixed(2)}</td>
        <td>$${Number(item.price6).toFixed(2)}</td>
        <td><strong style="color: var(--color-blue);">$${Number(item.price12).toFixed(2)}</strong></td>
      `;

      tr.addEventListener('click', () => {
        if (prodInput) {
          prodInput.value = item.name;
          updateSelectedRow();
          recalculateQuote();
        }
      });

      pricingTableBody.appendChild(tr);
    });
  }

  function updateSelectedRow() {
    if (!pricingTableBody || !prodInput) return;
    const selectedProd = prodInput.value;
    const rows = pricingTableBody.querySelectorAll('tr');
    rows.forEach(row => {
      row.classList.toggle('selected-row', row.getAttribute('data-product') === selectedProd);
    });
  }

  // Calculate unit price, order total, and wholesale savings based on quantity tier
  function recalculateQuote() {
    if (!prodInput || !qtyInput) return;

    const prodName = prodInput.value;
    const qty = parseInt(qtyInput.value, 10) || 1;

    const product = currentPricingData.find(p => p.name === prodName) || currentPricingData[0];
    if (!product) return;

    let unitPrice = product.price1;
    let discountMsg = 'Precio unitario estándar (1 a 5 piezas)';
    let isDiscounted = false;

    if (qty >= 12) {
      unitPrice = product.price12;
      discountMsg = '🔥 Precio mayorista aplicado por docena (+12)';
      isDiscounted = true;
    } else if (qty >= 6) {
      unitPrice = product.price6;
      discountMsg = '✨ Descuento especial aplicado por media docena (6+)';
      isDiscounted = true;
    }

    const total = unitPrice * qty;
    const standardTotal = product.price1 * qty;
    const savings = standardTotal - total;
    const savingsPct = product.price1 > 0 ? Math.round(((product.price1 - unitPrice) / product.price1) * 100) : 0;

    if (calcUnitPrice) {
      calcUnitPrice.textContent = `$${unitPrice.toFixed(2)}`;
    }
    if (calcTotalPrice) {
      calcTotalPrice.textContent = `$${total.toFixed(2)}`;
    }
    if (calcDiscountTag) {
      calcDiscountTag.textContent = discountMsg;
      if (isDiscounted) {
        calcDiscountTag.classList.remove('standard');
        calcDiscountTag.classList.add('active');
      } else {
        calcDiscountTag.classList.remove('active');
        calcDiscountTag.classList.add('standard');
      }
    }

    if (calcSavingsAmount && calcSavingsBox) {
      if (savings > 0) {
        calcSavingsAmount.textContent = `¡Ahorras $${savings.toFixed(2)} (-${savingsPct}%)!`;
        calcSavingsBox.classList.remove('no-savings');
      } else {
        calcSavingsAmount.textContent = 'Disponible desde 6 uds';
        calcSavingsBox.classList.add('no-savings');
      }
    }
  }

  // Fetch real-time data from Google Sheets
  async function fetchGoogleSheetData() {
    if (sheetStatusLabel) {
      sheetStatusLabel.textContent = 'Consultando Google Sheets en tiempo real...';
    }
    if (refreshPricesBtn) {
      refreshPricesBtn.classList.add('spinning');
    }

    try {
      // Add cache buster to always get fresh data
      const cacheBustUrl = `${SHEET_URL}&_=${Date.now()}`;
      const response = await fetch(cacheBustUrl);

      if (!response.ok) {
        throw new Error(`HTTP status ${response.status}`);
      }

      const text = await response.text();

      // Google returns: /*O_o*/ google.visualization.Query.setResponse({...});
      const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\);/);
      if (!match || !match[1]) {
        throw new Error('Formato Google Visualization inválido');
      }

      const json = JSON.parse(match[1]);
      const rows = json.table && json.table.rows;

      if (!rows || rows.length === 0) {
        throw new Error('La hoja de cálculo no contiene filas con datos');
      }

      const parsedItems = [];

      rows.forEach(r => {
        const c = r.c || [];
        // Product name is in col 0
        const name = c[0] && c[0].v ? String(c[0].v).trim() : '';
        if (!name || name.toLowerCase().includes('producto') || name.toLowerCase().includes('prenda')) {
          return; // Skip header row if present
        }

        const spec = c[1] && c[1].v ? String(c[1].v).trim() : 'Personalizado';
        const price1 = c[2] && !isNaN(parseFloat(c[2].v)) ? parseFloat(c[2].v) : 14.00;
        const price6 = c[3] && !isNaN(parseFloat(c[3].v)) ? parseFloat(c[3].v) : 12.00;
        const price12 = c[4] && !isNaN(parseFloat(c[4].v)) ? parseFloat(c[4].v) : 10.00;

        parsedItems.push({ name, spec, price1, price6, price12 });
      });

      if (parsedItems.length > 0) {
        currentPricingData = parsedItems;
        syncProductOptions(currentPricingData);
        if (sheetStatusLabel) {
          sheetStatusLabel.textContent = 'Precios sincronizados en vivo con Google Sheets';
          sheetStatusLabel.style.color = '#059669';
        }
      } else {
        throw new Error('No se encontraron columnas de precios válidas');
      }

    } catch (err) {
      console.warn('Google Sheets live sync:', err.message, '- Usando lista oficial vigente del taller.');
      currentPricingData = FALLBACK_PRICES;
      syncProductOptions(currentPricingData);
      if (sheetStatusLabel) {
        sheetStatusLabel.textContent = 'Precios oficiales vigentes del taller (Google Sheets en modo lectura)';
        sheetStatusLabel.style.color = '#1f2937';
      }
    } finally {
      if (refreshPricesBtn) {
        refreshPricesBtn.classList.remove('spinning');
      }
      renderPricingTable(currentPricingData);
      recalculateQuote();
    }
  }

  // Listeners for inputs
  if (prodInput) {
    prodInput.addEventListener('change', () => {
      updateSelectedRow();
      recalculateQuote();
    });
  }

  if (qtyInput) {
    qtyInput.addEventListener('change', recalculateQuote);
  }

  if (refreshPricesBtn) {
    refreshPricesBtn.addEventListener('click', fetchGoogleSheetData);
  }

  // Quote form submission with exact calculated itemized breakdown and wholesale savings
  if (quoteForm) {
    quoteForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const prod = prodInput ? prodInput.value : 'Prenda personalizada';
      const qty = qtyInput ? qtyInput.value : '1';
      const city = document.getElementById('cityInput') ? document.getElementById('cityInput').value : 'Cabudare / Barquisimeto';
      const notes = document.getElementById('notesInput') ? document.getElementById('notesInput').value.trim() : 'Sin notas adicionales';
      const unit = calcUnitPrice ? calcUnitPrice.textContent : '$10.00';
      const total = calcTotalPrice ? calcTotalPrice.textContent : '$60.00';
      const savingsTxt = (calcSavingsAmount && calcSavingsBox && !calcSavingsBox.classList.contains('no-savings'))
        ? calcSavingsAmount.textContent
        : '';

      let message = `¡Hola unocuatrosiete! Quisiera cotizar un pedido a partir del cotizador web:%0A%0A` +
        `• *Prenda/Producto:* ${encodeURIComponent(prod)}%0A` +
        `• *Cantidad:* ${encodeURIComponent(qty)} unidad(es)%0A` +
        `• *Precio Unitario Estimado:* ${encodeURIComponent(unit)}%0A` +
        `• *Total Estimado del Pedido:* ${encodeURIComponent(total)}%0A`;

      if (savingsTxt) {
        message += `• *Ahorro Mayorista:* ${encodeURIComponent(savingsTxt)}%0A`;
      }

      message += `• *Ubicación de Entrega:* ${encodeURIComponent(city)}%0A` +
        `• *Detalle del diseño:* ${encodeURIComponent(notes)}%0A%0A` +
        `¿Me podrían confirmar disponibilidad y tiempos de entrega? ¡Gracias!`;

      const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${message}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // Initial load
  fetchGoogleSheetData();
})();
