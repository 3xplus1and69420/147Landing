/**
 * unocuatrosiete - Minimalist Modern JavaScript
 * Clean, lightweight, zero-slop & zero-popup
 */

'use strict';

(function () {
  const WHATSAPP_PHONE = '584120000000';

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
