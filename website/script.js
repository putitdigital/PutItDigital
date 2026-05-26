// Setup canvas and context
const canvas = document.getElementById("space");
const ctx = canvas.getContext("2d");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
// Starfield settings
const numStars = 1900;
const focalLength = canvas.width * 2;
let centerX = canvas.width / 2;
let centerY = canvas.height / 2;
const baseTrailLength = 2;
const maxTrailLength = 30;
// Stars array
let stars = [];
// Animation control
let warpSpeed = 0;
let animationActive = true;
// Initialize stars
function initializeStars() {
  stars = [];
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * canvas.width,
      o: 0.5 + Math.random() * 0.5,
      trail: []
    });
  }
}
// Update star positions
function moveStars() {
  for (let i = 0; i < stars.length; i++) {
    const star = stars[i];
    // Move star based on warp speed - always forward
    const speed = 1 + warpSpeed * 50;
    star.z -= speed;
    // Reset star position when it passes the viewer
    if (star.z < 1) {
      star.z = canvas.width;
      star.x = Math.random() * canvas.width;
      star.y = Math.random() * canvas.height;
      star.trail = [];
    }
  }
}
// Draw stars and their trails
function drawStars() {
  // Resize canvas if needed
  if (
    canvas.width !== canvas.offsetWidth ||
    canvas.height !== canvas.offsetHeight
  ) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
  }
  // Calculate trail length based on warp speed
  const trailLength = Math.floor(
    baseTrailLength + warpSpeed * (maxTrailLength - baseTrailLength)
  );
  // Clear canvas with fade effect based on warp speed
  const clearAlpha = 1 - warpSpeed * 0.8;
  ctx.fillStyle = `rgba(17,17,17,${clearAlpha})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // Draw stars and trails
  for (let i = 0; i < stars.length; i++) {
    const star = stars[i];
    // Calculate screen position with perspective
    const px = (star.x - centerX) * (focalLength / star.z) + centerX;
    const py = (star.y - centerY) * (focalLength / star.z) + centerY;
    // Add position to trail
    star.trail.push({
      x: px,
      y: py
    });
    if (star.trail.length > trailLength) {
      star.trail.shift();
    }
    // Draw trail
    if (star.trail.length > 1) {
      ctx.beginPath();
      ctx.moveTo(star.trail[0].x, star.trail[0].y);
      for (let j = 1; j < star.trail.length; j++) {
        ctx.lineTo(star.trail[j].x, star.trail[j].y);
      }
      ctx.strokeStyle = `rgba(209,255,255,${star.o})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    // Draw star
    ctx.fillStyle = `rgba(209,255,255,${star.o})`;
    ctx.font = "30px Arial";
    ctx.fillRect(px, py, 1, 1);
  }
}
// Animation loop
function animate() {
  if (animationActive) {
    requestAnimationFrame(animate);
    moveStars();
    drawStars();
  }
}
// Initialize and start animation
initializeStars();
animate();
// GSAP ScrollTrigger setup
gsap.registerPlugin(ScrollTrigger);
// Create a timeline for the warp effect
const warpTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: "#stickyContainer",
    start: "top top",
    end: "bottom top",
    scrub: true,
    onUpdate: (self) => {
      const progress = self.progress;
      // 0-300vh (0-60%): Ramp up warp effect
      if (progress <= 0.6) {
        warpSpeed = progress / 0.6; // 0 to 1
      }
      // 300-400vh (60-80%): Maintain full warp
      else if (progress <= 0.8) {
        warpSpeed = 1; // Full warp
      }
      // 400-500vh (80-100%): Decrease warp effect
      else {
        warpSpeed = 1 - (progress - 0.8) / 0.2; // 1 to 0
      }
    }
  }
});
// Enhanced text animation with blur and better easing
const textTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: "#stickyContainer",
    start: "12% top", // Start slightly earlier for a longer animation
    end: "20% top", // End a bit later for a smoother animation
    scrub: 0.8 // Add slight smoothing to the scrub for more natural movement
  }
});
// Add enhanced text animation with multi-step sequence
textTimeline.to("#animatedText", {
  opacity: 1, // Full opacity
  y: 0, // Final position
  filter: "blur(0px)", // No blur
  duration: 0.4,
  ease: "power3.out" // Ease out for a soft landing
});
// Create a timeline for the exit effect
const exitTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: "#stickyContainer",
    start: "bottom 20%", // Start when the bottom of the container is 20% from the top
    end: "bottom -10%", // End when it's 10% past the top
    scrub: true
  }
});
// Add heroCopy exit animation with blur and better easing
exitTimeline.to(
  "#heroCopy",
  {
    opacity: 0,
    y: -20,
    duration: 0.4,
    scale: 0.95,
    ease: "power2.in"
  },
  0
);
// Add enhanced exit animations with blur
exitTimeline.to(
  "#animatedText",
  {
    opacity: 0,
    y: -20,
    filter: "blur(8px)",
    duration: 0.4,
    ease: "power2.in"
  },
  0
);
exitTimeline.to(
  "#webglSection",
  {
    opacity: 0,
    scale: 0.95,
    ease: "power2.inOut"
  },
  0.1
); // Slight delay after text starts fading

// Handle visibility - stop animation when out of view
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      // Only run animation when section is visible
      if (entry.isIntersecting) {
        if (!animationActive) {
          animationActive = true;
          animate();
        }
      } else {
        animationActive = false;
      }
    });
  },
  {
    threshold: 0
  }
);
observer.observe(document.getElementById("stickyContainer"));
// Handle window resize
window.addEventListener("resize", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  centerX = canvas.width / 2;
  centerY = canvas.height / 2;
});

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