/* ============================================================
   GLAMLAUNCH — Main JS
   ============================================================ */

// ---- Page Loader ----
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hide'), 600);
    setTimeout(() => loader.remove(), 1200);
  }
});

// ---- Mobile Menu ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  });

  const closeMenu = () => {
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  if (mobileClose) mobileClose.addEventListener('click', closeMenu);

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

// ---- Scroll Reveal ----
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealEls.forEach(el => revealObserver.observe(el));

// ---- Nav scroll styling ----
const nav = document.getElementById('nav');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const current = window.scrollY;
  if (nav) {
    nav.classList.toggle('scrolled', current > 50);
  }
  lastScroll = current;
}, { passive: true });

// ---- Search Overlay ----
document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('searchOverlay');
  const bg = document.getElementById('searchOverlayBg');
  const closeBtn = document.getElementById('searchClose');
  const input = document.getElementById('searchInput');
  const suggestions = document.querySelectorAll('.search-suggestion');

  if (!overlay) return;

  // Open search
  document.querySelectorAll('.nav-icon[aria-label="Search"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      setTimeout(() => input && input.focus(), 200);
    });
  });

  // Close search
  const closeSearch = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if (input) input.value = '';
    suggestions.forEach(s => s.classList.remove('hidden'));
  };

  if (closeBtn) closeBtn.addEventListener('click', closeSearch);
  if (bg) bg.addEventListener('click', closeSearch);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeSearch();
  });

  // Filter suggestions as user types
  if (input) {
    input.addEventListener('input', () => {
      const q = input.value.toLowerCase().trim();
      suggestions.forEach(s => {
        if (!q || s.textContent.toLowerCase().includes(q)) {
          s.classList.remove('hidden');
        } else {
          s.classList.add('hidden');
        }
      });
    });
  }
});

// ---- Rotating Word (GlamLaunch hero) ----
const ROTATING_WORDS = ['Beauty', 'Fashion', 'Lifestyle'];
let rotatingIdx = 0;
let rotatingInterval = null;

function startRotatingWords() {
  const el = document.querySelector('.rotating-word');
  if (!el) return;
  rotatingIdx = 0;
  el.textContent = ROTATING_WORDS[0];
  rotatingInterval = setInterval(() => {
    rotatingIdx = (rotatingIdx + 1) % ROTATING_WORDS.length;
    el.classList.remove('is-animating');
    void el.offsetWidth; // force reflow
    el.textContent = ROTATING_WORDS[rotatingIdx];
    el.classList.add('is-animating');
  }, 2000);
}

document.addEventListener('DOMContentLoaded', startRotatingWords);
