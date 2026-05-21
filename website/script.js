const navToggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-navigation');
const dropdownButton = document.querySelector('.dropdown-button');
const dropdown = document.querySelector('.dropdown');
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
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle('active', slideIndex === index);
  });
  dots.forEach((dot, dotIndex) => {
    dot.classList.toggle('active', dotIndex === index);
  });
  currentSlide = index;
}

function advanceSlide() {
  const nextSlide = (currentSlide + 1) % slides.length;
  setSlide(nextSlide);
}

function startSlideTimer() {
  clearInterval(slideTimer);
  slideTimer = setInterval(advanceSlide, 8000);
}

if (dots.length) {
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      setSlide(index);
      startSlideTimer();
    });
  });
  startSlideTimer();
}

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
