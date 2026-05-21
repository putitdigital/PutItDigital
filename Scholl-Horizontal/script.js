(() => {
  let isNavScrollInProgress = false;

  const navigationEntry = performance.getEntriesByType("navigation")[0];
  const isReloadNavigation = navigationEntry && navigationEntry.type === "reload";

  if (isReloadNavigation) {
    // Prevent browser scroll restoration on refresh and always start at Home.
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const scrollToHome = () => {
      const homeSection = document.querySelector("#hero");
      if (homeSection) {
        homeSection.scrollIntoView({ block: "start" });
        return;
      }
      window.scrollTo(0, 0);
    };

    scrollToHome();
    document.addEventListener("DOMContentLoaded", scrollToHome, { once: true });
    window.addEventListener("load", scrollToHome, { once: true });
  }

  const heroVideo = document.querySelector(".hero-video");
  const heroSource = heroVideo ? heroVideo.querySelector("source") : null;
  const fallbackQueue = [
    "./images/213616.mp4",
    "./images/1236-144355017.mp4",
    heroVideo ? heroVideo.dataset.fallbackSrc : ""
  ].filter(Boolean);
  let fallbackIndex = 0;
  let startupCheckTimer = null;

  const setVideoSource = (src) => {
    if (!heroVideo || !src) {
      return;
    }
    if (heroSource) {
      heroSource.src = src;
      heroVideo.load();
      return;
    }
    heroVideo.src = src;
    heroVideo.load();
  };

  const tryNextFallback = () => {
    if (!heroVideo || fallbackIndex >= fallbackQueue.length) {
      return;
    }
    setVideoSource(fallbackQueue[fallbackIndex]);
    fallbackIndex += 1;
    tryPlayHeroVideo();
  };

  const tryPlayHeroVideo = () => {
    if (!heroVideo) {
      return;
    }
    heroVideo.muted = true;
    heroVideo.defaultMuted = true;
    const playPromise = heroVideo.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // If autoplay fails for technical reasons, step through backup sources.
        tryNextFallback();
      });
    }

    if (startupCheckTimer) {
      window.clearTimeout(startupCheckTimer);
    }
    startupCheckTimer = window.setTimeout(() => {
      if (heroVideo.readyState < 2 || heroVideo.paused) {
        tryNextFallback();
      }
    }, 1800);
  };

  document.addEventListener("DOMContentLoaded", tryPlayHeroVideo, { once: true });
  window.addEventListener("load", tryPlayHeroVideo, { once: true });
  window.addEventListener("pointerdown", tryPlayHeroVideo, { once: true });

  if (heroVideo) {
    heroVideo.addEventListener("error", () => {
      tryNextFallback();
    });

    heroVideo.addEventListener("stalled", tryNextFallback);
    heroVideo.addEventListener("canplay", () => {
      if (startupCheckTimer) {
        window.clearTimeout(startupCheckTimer);
        startupCheckTimer = null;
      }
    });
  }

  const initGlobalSpotlight = () => {
    const spotlight = document.querySelector(".hero-spotlight");
    if (!spotlight) {
      return;
    }
    const header = document.querySelector("header");

    const root = document.documentElement;
    const SIZE_ACTIVE   = 300;   // px — cursor on screen
    const SIZE_INACTIVE = 150;   // px — cursor off screen
    const LERP_SPEED    = 0.07;  // 0–1: lower = slower fade down

    let x = 100 ;
    let y = 150;
    let currentSize = 900;       // starts large on reload
    let targetSize  = SIZE_INACTIVE; // immediately begins dropping to 150
    let cursorOnPage = false;
    let loopId = null;
    let headerZ = "0";

    const updateHeaderZIndex = (cursorX, cursorY) => {
      if (!header) {
        return;
      }
      const nextZ = cursorX < 200 && cursorY < 200 ? "100" : "0";
      if (nextZ !== headerZ) {
        header.style.zIndex = nextZ;
        headerZ = nextZ;
      }
    };

    const animate = () => {
      const diff = targetSize - currentSize;
      if (Math.abs(diff) > 0.2) {
        currentSize += diff * LERP_SPEED;
      } else {
        currentSize = targetSize;
      }
      root.style.setProperty("--global-spotlight-x",    `${x}px`);
      root.style.setProperty("--global-spotlight-y",    `${y}px`);
      root.style.setProperty("--global-spotlight-size", `${Math.round(currentSize)}px`);
      // keep looping while animating; stop when stable
      if (Math.abs(targetSize - currentSize) > 0.2) {
        loopId = window.requestAnimationFrame(animate);
      } else {
        loopId = null;
      }
    };

    const startLoop = () => {
      if (loopId === null) {
        loopId = window.requestAnimationFrame(animate);
      }
    };

    const handleMove = (event) => {
      x = event.clientX;
      y = event.clientY;
      updateHeaderZIndex(x, y);
      if (!cursorOnPage) {
        cursorOnPage = true;
        targetSize = SIZE_ACTIVE;
      }
      startLoop();
    };

    const handleLeave = () => {
      cursorOnPage = false;
      targetSize = SIZE_INACTIVE;
      updateHeaderZIndex(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
      startLoop(); // keep animating the shrink
    };

    // seed initial position so spotlight isn't stuck at 0,0
    root.style.setProperty("--global-spotlight-x",    `${x}px`);
    root.style.setProperty("--global-spotlight-y",    `${y}px`);
    root.style.setProperty("--global-spotlight-size", `${currentSize}px`);

    // begin shrinking from 400 → 150 immediately on load
    startLoop();

    window.addEventListener("pointermove", handleMove);
    document.documentElement.addEventListener("mouseleave", handleLeave);
    window.addEventListener("resize", () => {
      if (!cursorOnPage) {
        x = window.innerWidth / 2;
        y = window.innerHeight / 2;
        startLoop();
      }
    });
  };

  initGlobalSpotlight();

  const initSmoothNavScroll = () => {
    const navLinks = Array.from(document.querySelectorAll('.site-nav__link[href^="#"]'));
    if (!navLinks.length) {
      return;
    }

    navLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        const targetSelector = link.getAttribute("href");
        const target = targetSelector ? document.querySelector(targetSelector) : null;
        if (!target) {
          return;
        }

        event.preventDefault();

        if (window.gsap && window.gsap.plugins && window.gsap.plugins.ScrollToPlugin) {
          gsap.registerPlugin(gsap.plugins.ScrollToPlugin);
          isNavScrollInProgress = true;
          gsap.to(window, {
            scrollTo: {
              y: target,
              autoKill: true
            },
            duration: 1.05,
            ease: "power2.inOut",
            onInterrupt: () => {
              isNavScrollInProgress = false;
            },
            onComplete: () => {
              isNavScrollInProgress = false;
            }
          });
        } else {
          isNavScrollInProgress = true;
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          window.setTimeout(() => {
            isNavScrollInProgress = false;
          }, 900);
        }

        if (targetSelector) {
          history.pushState(null, "", targetSelector);
        }
      });
    });
  };

  initSmoothNavScroll();

  const initSectionNavState = () => {
    const navLinks = Array.from(document.querySelectorAll('.site-nav__link[href^="#"]'));
    if (!navLinks.length) {
      return;
    }

    const display = document.querySelector(".nav-active-display");

    const navMap = navLinks
      .map((link) => {
        const targetSelector = link.getAttribute("href");
        const target = targetSelector ? document.querySelector(targetSelector) : null;
        const item = link.closest(".site-nav");
        return { link, target, item };
      })
      .filter((entry) => entry.target && entry.item);

    if (!navMap.length) {
      return;
    }

    // Pre-build one anchor per nav entry in the display layer
    const displayAnchors = navMap.map(({ link }) => {
      const a = document.createElement("a");
      a.href = link.getAttribute("href");
      a.textContent = link.textContent.trim();
      if (display) {
        display.appendChild(a);
      }
      return a;
    });

    let rafId = null;

    const updateActiveState = () => {
      rafId = null;
      const probeY = window.innerHeight * 0.34;
      let activeEntry = navMap.find(({ target }) => {
        const rect = target.getBoundingClientRect();
        return rect.top <= probeY && rect.bottom > probeY;
      });

      if (!activeEntry) {
        activeEntry = navMap.find(({ target }) => target.getBoundingClientRect().top > 0) || navMap[navMap.length - 1];
      }

      navMap.forEach(({ link, item }, i) => {
        const isActive = activeEntry && activeEntry.link === link;
        item.classList.toggle("is-active", isActive);
        if (isActive) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
        // Mirror into the above-spotlight display layer
        if (displayAnchors[i]) {
          displayAnchors[i].classList.toggle("is-visible", isActive);
          displayAnchors[i].setAttribute("aria-current", isActive ? "page" : "");
        }
      });
    };

    const queueUpdate = () => {
      if (rafId !== null) {
        return;
      }
      rafId = window.requestAnimationFrame(updateActiveState);
    };

    updateActiveState();
    window.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", queueUpdate);
  };

  initSectionNavState();

  const hideLoader = () => {
    const pageLoader = document.querySelector(".page-loader");
    if (pageLoader) {
      pageLoader.classList.add("is-hidden");
      window.setTimeout(() => {
        pageLoader.remove();
      }, 500);
    }
    document.body.classList.remove("is-loading");
  };

  // Hide quickly when DOM is ready, and also on full load as backup.
  document.addEventListener("DOMContentLoaded", hideLoader, { once: true });
  window.addEventListener("load", hideLoader, { once: true });
  window.setTimeout(hideLoader, 2500);

  window.addEventListener("load", () => {
    if (!window.gsap || !window.ScrollTrigger) {
      console.error("Missing GSAP/ScrollTrigger script.");
      return;
    }

    const pinWrap = document.querySelector(".pin-wrap");
    const sectionPin = document.querySelector("#sectionPin");

    if (!pinWrap || !sectionPin) {
      console.error("Missing required DOM elements for scrolling setup.");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    if (window.gsap.plugins && window.gsap.plugins.ScrollToPlugin) {
      gsap.registerPlugin(gsap.plugins.ScrollToPlugin);
    }

    const horizontalTween = gsap.to(pinWrap, {
      x: () => -Math.max(0, pinWrap.scrollWidth - window.innerWidth),
      ease: "none",
      scrollTrigger: {
        trigger: sectionPin,
        pin: true,
        scrub: true,
        start: "top top",
        end: () => `+=${Math.max(1, pinWrap.scrollWidth - window.innerWidth)}`,
        invalidateOnRefresh: true,
        anticipatePin: 1
      }
    });

    window.addEventListener("resize", () => {
      horizontalTween.scrollTrigger.refresh();
    });
  });

  // Auto-snap scroll from hero to sectionPin
  window.addEventListener("load", () => {
    const heroSection = document.querySelector("#hero");
    const sectionPin = document.querySelector("#sectionPin");
    const container = document.querySelector("[data-scroll-container]");
    
    if (!heroSection || !sectionPin || !container) {
      return;
    }

    let hasSnapped = false;
    let scrollCheckTimer = null;
    let lastScrollPos = 0;
    let idleTimer = null;
    const IDLE_DELAY = 4500; // 4.5 seconds before auto-scroll

    const triggerIdleScroll = () => {
      if (isNavScrollInProgress) {
        return;
      }
      // Only trigger if still at hero and haven't snapped yet
      if (window.scrollY < heroSection.offsetHeight * 0.15 && !hasSnapped) {
        const pinRect = sectionPin.getBoundingClientRect();
        const targetPos = window.scrollY + pinRect.top;
        
        gsap.to(window, {
          scrollTo: {
            y: targetPos,
            autoKill: false
          },
          duration: 1.2,
          ease: "power2.inOut"
        });
        hasSnapped = true;
      }
    };

    const resetIdleTimer = () => {
      if (isNavScrollInProgress) {
        return;
      }
      if (idleTimer) {
        window.clearTimeout(idleTimer);
      }
      // Restart idle timer only if still on hero
      if (window.scrollY < heroSection.offsetHeight * 0.15 && !hasSnapped) {
        idleTimer = window.setTimeout(triggerIdleScroll, IDLE_DELAY);
      }
    };

    // Start idle timer on load
    resetIdleTimer();

    const checkSnapScroll = () => {
      if (isNavScrollInProgress) {
        return;
      }
      const currentScroll = window.scrollY;
      const heroEnd = heroSection.offsetHeight;
      const isScrollingDown = currentScroll > lastScrollPos;
      const heroPassedThreshold = currentScroll > heroEnd * 0.1;

      // Trigger snap when scrolling down past hero
      if (isScrollingDown && heroPassedThreshold && !hasSnapped) {
        hasSnapped = true;
        
        // Calculate target position
        const pinRect = sectionPin.getBoundingClientRect();
        const targetPos = window.scrollY + pinRect.top - 0;
        // Smooth scroll with ease-in-ease-out
        gsap.to(window, {
          scrollTo: {
            y: targetPos,
            autoKill: false
          },
          duration: 1.2,
          ease: "power2.inOut"
        });
      }

      // Reset snap when scrolling back up to hero
      if (currentScroll < heroEnd * 0.1) {
        hasSnapped = false;
      }

      lastScrollPos = currentScroll;
    };

    // Listen for scroll with RAF throttle
    window.addEventListener("scroll", () => {
      // Reset idle timer when user scrolls
      resetIdleTimer();
      
      if (scrollCheckTimer) {
        window.cancelAnimationFrame(scrollCheckTimer);
      }
      scrollCheckTimer = window.requestAnimationFrame(checkSnapScroll);
    });
  });
})();
