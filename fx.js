/**
 * Ambient FX — parallax layers + reduced-motion safe
 */
(function () {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const layers = () => document.querySelectorAll('[data-parallax]');

  function onMove(e) {
    if (reduce) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    root.style.setProperty('--mx', x.toFixed(3));
    root.style.setProperty('--my', y.toFixed(3));
    layers().forEach((el) => {
      const d = Number(el.getAttribute('data-parallax')) || 8;
      el.style.transform = `translate3d(${x * d}px, ${y * d}px, 0)`;
    });
  }

  function boot() {
    root.style.setProperty('--mx', '0');
    root.style.setProperty('--my', '0');
    if (!reduce) {
      window.addEventListener('pointermove', onMove, { passive: true });
    }
    // Stagger in catalog cards after render cycles
    const obs = new MutationObserver(() => {
      document.querySelectorAll('.service-card:not(.fx-in)').forEach((card, i) => {
        card.classList.add('fx-in');
        card.style.setProperty('--i', String(i % 12));
      });
    });
    const grid = document.getElementById('catalog-grid');
    if (grid) obs.observe(grid, { childList: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
