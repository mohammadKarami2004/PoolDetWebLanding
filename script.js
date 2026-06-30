// ===== Wave canvas animation (signature element) =====
const canvas = document.getElementById('waveCanvas');
const ctx = canvas.getContext('2d');
let waveWidth, waveHeight;

function resizeCanvas() {
  waveWidth = canvas.offsetWidth;
  waveHeight = canvas.offsetHeight;
  canvas.width = waveWidth * window.devicePixelRatio;
  canvas.height = waveHeight * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let t = 0;
function drawWaves() {
  ctx.clearRect(0, 0, waveWidth, waveHeight);

  const layers = [
    { amp: 14, freq: 0.012, speed: 0.012, yOffset: 0.55, color: 'rgba(60,229,216,0.10)' },
    { amp: 20, freq: 0.009, speed: 0.018, yOffset: 0.68, color: 'rgba(60,229,216,0.16)' },
    { amp: 12, freq: 0.016, speed: 0.024, yOffset: 0.82, color: 'rgba(60,229,216,0.22)' },
  ];

  layers.forEach(layer => {
    ctx.beginPath();
    ctx.moveTo(0, waveHeight);
    for (let x = 0; x <= waveWidth; x += 4) {
      const y = waveHeight * layer.yOffset + Math.sin(x * layer.freq + t * layer.speed) * layer.amp;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(waveWidth, waveHeight);
    ctx.closePath();
    ctx.fillStyle = layer.color;
    ctx.fill();
  });

  t += 1;
  requestAnimationFrame(drawWaves);
}
drawWaves();

// ===== Live uptime counter (signature element) =====
let uptimeSeconds = 14 * 3600 + 22 * 60 + 7;
function formatUptime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map(n => String(n).padStart(2, '0')).join(':');
}
const uptimeEl = document.getElementById('uptimeVal');
setInterval(() => {
  uptimeSeconds += 1;
  uptimeEl.textContent = formatUptime(uptimeSeconds);
}, 1000);

// ===== Scroll reveal =====
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// ===== Animated counters =====
const counters = document.querySelectorAll('.stat-value');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(el => counterObserver.observe(el));

function animateCounter(el) {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const isDecimal = target % 1 !== 0;
  const duration = 1400;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    el.textContent = (isDecimal ? value.toFixed(1) : Math.round(value)) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// ===== Nav background on scroll =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.background = window.scrollY > 20
    ? 'rgba(2, 28, 31, 0.92)'
    : 'rgba(2, 28, 31, 0.75)';
});

// ===== Mobile menu =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ===== Language toggle =====
const langBtn = document.getElementById('langBtn');
const htmlRoot = document.getElementById('htmlRoot');
let currentLang = 'en';

function applyLang(lang) {
  currentLang = lang;
  htmlRoot.setAttribute('lang', lang);
  htmlRoot.setAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');
  langBtn.textContent = lang === 'fa' ? 'English' : 'فارسی';

  document.querySelectorAll('[data-en]').forEach(el => {
    const text = lang === 'fa' ? el.dataset.fa : el.dataset.en;
    if (text !== undefined) el.innerHTML = text;
  });
  document.querySelectorAll('[data-en-placeholder]').forEach(el => {
    const text = lang === 'fa' ? el.dataset.faPlaceholder : el.dataset.enPlaceholder;
    if (text !== undefined) el.setAttribute('placeholder', text);
  });
}
langBtn.addEventListener('click', () => applyLang(currentLang === 'en' ? 'fa' : 'en'));

// ===== Contact form =====
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('.cta-btn span');
  const original = btn.textContent;
  btn.textContent = currentLang === 'fa' ? 'ارسال شد ✓' : 'Sent ✓';
  contactForm.reset();
  setTimeout(() => { btn.textContent = original; }, 2200);
});
