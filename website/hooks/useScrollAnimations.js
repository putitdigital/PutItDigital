import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function useScrollAnimations(enabled = true) {
  useLayoutEffect(() => {
    if (!enabled) return;

    const slider = document.querySelector(".slider");

    if (!slider) return;

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray("section", slider);

      if (!sections.length) return;

      const sliderStartY = slider.getBoundingClientRect().top + window.scrollY;

      const getSectionIndex = (id) => {
        const index = sections.findIndex((section) => section.id === id);
        return index >= 0 ? index : -1;
      };

      const scrollToSection = (index) => {
        if (index < 0) return;

        const targetY = sliderStartY + index * window.innerWidth;

        gsap.to(window, {
          duration: 1.2,
          ease: "power2.inOut",
          overwrite: true,
          scrollTo: { y: targetY, autoKill: false },
        });
      };

      const navLinks = Array.from(document.querySelectorAll("nav a[href^='#']"));
      const handleNavClick = (event) => {
        const link = event.currentTarget;
        const hash = link.getAttribute("href");

        if (!hash || hash === "#") return;

        const index = getSectionIndex(hash.slice(1));
        if (index < 0) return;

        event.preventDefault();
        scrollToSection(index);
        window.history.replaceState(null, "", hash);
      };

      navLinks.forEach((link) => link.addEventListener("click", handleNavClick));

      // Initial positions
      gsap.set(sections, {
        xPercent: (i) => (i === 0 ? 0 : 100),
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: slider,
          start: "top top",
          end: `+=${sections.length * window.innerWidth}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      sections.forEach((section, i) => {
        if (i === 0) return;

        tl.to(sections[i - 1], {
          xPercent: -100,
          ease: "none",
        });

        tl.to(section, {
          xPercent: 0,
          ease: "none",
        }, "<");
      });

      ScrollTrigger.refresh();
    }, slider);

    return () => {
      const navLinks = Array.from(document.querySelectorAll("nav a[href^='#']"));
      navLinks.forEach((link) => link.removeEventListener("click", handleNavClick));
      ctx.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [enabled]);
}