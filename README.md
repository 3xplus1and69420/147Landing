# unocuatrosiete (@unocuatrosietee) - Landing Page Oficial ⚡

Landing page de alto rendimiento y conversión para **unocuatrosiete** (147), taller especializado en productos personalizados: franelas sublimadas full print dry-fit, chaquetas cortaviento corporativas, vasos térmicos de acero inoxidable y merchandising en **Cabudare y Barquisimeto (Estado Lara, Venezuela)** con envíos a nivel nacional.

Desarrollada bajo los estándares de diseño de **`ui-ux-pro-max`** y las directrices de código limpio de **`aislop`**.

---

## 🎨 Identidad de Marca y Sistema de Diseño

- **Fondo Base**: `#06050a` (Dark aesthetic urbano de alto impacto)
- **Superficies & Cards**: `#0f0d1a` / `#17142b` con bordes sutiles `rgba(255,255,255,0.08)`
- **Color Primario (147)**: `#380075` (Degradados púrpuras dinámicos)
- **Color de Acento**: `#3BA7FF` (Azul cielo eléctrico para badges y puntos focales)
- **Conversión WhatsApp**: `#25D366` (Verde oficial WhatsApp de alta visibilidad)
- **Tipografía**: `Syne` (Headings display de corte atlético) y `Plus Jakarta Sans` (Cuerpo geométrico legible)

---

## 🚀 Características Clave

1. **Cotizador Express WhatsApp Interactivo**:
   - Los clientes seleccionan producto, cantidad (desde 1 hasta +25 piezas), detalles de personalización y ubicación (Cabudare, Barquisimeto o nacional).
   - Genera automáticamente un mensaje codificado listo para enviar a WhatsApp en un solo clic, acelerando drásticamente el cierre de ventas.
2. **Prueba Social y Proyectos Reales Verificados**:
   - Caso `@superbikebqto`: Franelas sublimadas dry-fit full print.
   - Caso `@somosviluz`: Dotación de chaquetas cortaviento para pastelería.
   - Galería de capturas de WhatsApp reales con **Lightbox modal interactivo y accesible**.
3. **Arquitectura Zero Layout Shift (CLS = 0.00)**:
   - Todas las imágenes cuentan con dimensiones fijas (`width`, `height`) y `aspect-ratio` en CSS.
   - `fetchpriority="high"` en el Hero y `loading="lazy"` + `decoding="async"` para elementos bajo el fold.
4. **Animaciones Suaves y Seguras**:
   - Micro-interacciones aceleradas por GPU (`transform`, `opacity`) con `IntersectionObserver`.
   - Compatibilidad total con `prefers-reduced-motion` para accesibilidad.
5. **Auditoría Lighthouse & SEO**:
   - Marcado estructurado Schema.org (`ClothingStore`, `LocalBusiness`, `OfferCatalog`).
   - Meta tags OpenGraph y Twitter Cards completos para compartir en redes sociales.
   - Contraste WCAG 2.1 AA/AAA verificado (> 7:1 en elementos de lectura principal).

---

## 📁 Estructura del Proyecto

```text
Landing Page 147/
├── .agents/
│   └── skills/
│       ├── ui-ux-pro-max/      # Inteligencia de diseño UI/UX
│       └── aislop/             # Guardarraíl de calidad y código limpio
├── assets/
│   ├── optimized/              # Assets optimizados para carga ultra rápida
│   │   ├── logo-147.png
│   │   ├── producto-franela-sublimada.jpg
│   │   ├── producto-vaso-termico.jpg
│   │   ├── vaso-vinero-147.jpg
│   │   ├── mockup-franela-showcase.jpg
│   │   ├── mockup-gorra-accesorios.jpg
│   │   ├── taller-confeccion-calidad.jpg
│   │   ├── testimonio-whatsapp-superbike.jpg
│   │   └── testimonio-whatsapp-somosviluz.jpg
│   └── raw/                    # Archivos originales de alta resolución
├── index.html                  # Estructura semántica HTML5 accesible
├── styles.css                  # Sistema de diseño con CSS variables y responsive
├── main.js                     # Cotizador WhatsApp, lightbox y animaciones
└── README.md
```

---

## 🛠️ Despliegue y Uso

Simplemente abre `index.html` en cualquier navegador o súbelo a cualquier servicio de hosting estático (GitHub Pages, Vercel, Netlify, Cloudflare Pages) para disfrutar de una carga casi instantánea sin requerir Node.js en producción.

---

© 2026 **unocuatrosiete** (@unocuatrosietee). Todos los derechos reservados.
