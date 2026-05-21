const navToggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-navigation');
const dropdownButton = document.querySelector('.dropdown-button');
const dropdown = document.querySelector('.dropdown');

// Slider elements
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.slider-dot');
let currentSlide = 0;
let slideTimer;

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

if (dropdownButton && dropdown) {
  dropdownButton.addEventListener('click', () => {
    const isOpen = dropdown.classList.toggle('open');
    dropdownButton.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', (event) => {
    if (!dropdown.contains(event.target) && !dropdownButton.contains(event.target)) {
      dropdown.classList.remove('open');
      dropdownButton.setAttribute('aria-expanded', 'false');
    }
  });
}

function setSlide(index) {
  if (!slides.length) return;
  slides.forEach((s, i) => s.classList.toggle('active', i === index));
  dots.forEach((d, i) => d.classList.toggle('active', i === index));
  currentSlide = index;
}

function advanceSlide() {
  const next = (currentSlide + 1) % slides.length;
  setSlide(next);
}

function startSlideTimer() {
  clearInterval(slideTimer);
  slideTimer = setInterval(advanceSlide, 7000);
}

if (dots.length && slides.length) {
  dots.forEach((dot, idx) => dot.addEventListener('click', () => {
    setSlide(idx);
    startSlideTimer();
  }));

  const sliderEl = document.querySelector('.hero-slider');
  if (sliderEl) {
    sliderEl.addEventListener('mouseenter', () => clearInterval(slideTimer));
    sliderEl.addEventListener('mouseleave', startSlideTimer);
  }

  setSlide(0);
  startSlideTimer();
}

// AI popup
const aiBadge = document.querySelector('.ai-badge');
const aiPopup = document.querySelector('.ai-popup');
const aiBackdrop = document.querySelector('.ai-backdrop');
const aiPopupClose = document.querySelector('.ai-popup-close');

function toggleAIPopup(open) {
  if (!aiPopup || !aiBackdrop) return;
  aiPopup.classList.toggle('open', open);
  aiBackdrop.classList.toggle('open', open);
  aiPopup.setAttribute('aria-hidden', String(!open));
}

if (aiBadge && aiPopup && aiBackdrop && aiPopupClose) {
  const openPopup = () => toggleAIPopup(true);
  const closePopup = () => toggleAIPopup(false);

  aiBadge.addEventListener('click', openPopup);
  aiBadge.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openPopup();
    }
  });

  aiPopupClose.addEventListener('click', closePopup);
  aiBackdrop.addEventListener('click', closePopup);

  const aiPopupForm = document.querySelector('.ai-popup-form');
  const aiInput = document.getElementById('ai-input');
  const aiMessages = document.querySelector('.ai-popup-messages');

  if (aiPopupForm && aiInput && aiMessages) {
    aiPopupForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const value = aiInput.value.trim();
      if (!value) return;

      const userMessage = document.createElement('div');
      userMessage.className = 'ai-message ai-message--user';
      userMessage.textContent = value;
      aiMessages.appendChild(userMessage);
      aiMessages.scrollTop = aiMessages.scrollHeight;

      aiInput.value = '';
      aiInput.focus();

      window.setTimeout(() => {
        const reply = document.createElement('div');
        reply.className = 'ai-message ai-message--assistant';
        reply.textContent = 'Thanks for your question! We’ll follow up with a tailored recommendation soon.';
        aiMessages.appendChild(reply);
        aiMessages.scrollTop = aiMessages.scrollHeight;
      }, 600);
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closePopup();
    }
  });
}

const cursorEl = document.createElement('div');
cursorEl.className = 'water-cursor';
document.body.appendChild(cursorEl);
let lastTrailTime = 0;

document.addEventListener('mousemove', (event) => {
  cursorEl.style.left = `${event.clientX}px`;
  cursorEl.style.top = `${event.clientY}px`;
  const now = performance.now();
  if (now - lastTrailTime > 10) {
    lastTrailTime = now;
    const trail = document.createElement('div');
    trail.className = 'water-trail';
    trail.style.left = `${event.clientX}px`;
    trail.style.top = `${event.clientY}px`;
    document.body.appendChild(trail);
    trail.addEventListener('animationend', () => trail.remove());
  }
});

document.addEventListener('mousedown', (event) => {
  cursorEl.classList.add('water-click');

  const drop = document.createElement('div');
  drop.className = 'water-drop';
  drop.style.left = `${event.clientX}px`;
  drop.style.top = `${event.clientY}px`;
  document.body.appendChild(drop);

  drop.addEventListener('animationend', () => drop.remove());
});

document.addEventListener('mouseup', () => {
  cursorEl.classList.remove('water-click');
});
