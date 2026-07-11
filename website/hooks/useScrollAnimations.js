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

    const sections = gsap.utils.toArray("section", slider);
    if (!sections.length) return;

    const sectionCount = sections.length;
    const sliderStartY = slider.getBoundingClientRect().top + window.scrollY;
    const totalScroll = sectionCount * window.innerWidth;
    let navLinks = [];

    const handleNavClick = (event) => {
      const link = event.currentTarget;
      const hash = link.getAttribute("href");
      if (!hash || hash === "#") return;

      const index = sections.findIndex((section) => section.id === hash.slice(1));
      if (index < 0) return;

      event.preventDefault();
      gsap.to(window, {
        duration: 0.7,
        ease: "power2.inOut",
        scrollTo: {
          y: sliderStartY + index * window.innerWidth,
          autoKill: false,
        },
        overwrite: true,
      });
      window.history.replaceState(null, "", hash);
    };

    const ctx = gsap.context(() => {
      gsap.set(sections, {
        xPercent: (i) => (i === 0 ? 0 : 100),
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: slider,
          start: "top top",
          end: `+=${totalScroll}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: sectionCount > 1
            ? {
                snapTo: 1 / (sectionCount - 1),
                duration: { min: 0.2, max: 0.7 },
                ease: "power2.out",
              }
            : false,
        },
      });

      sections.forEach((section, i) => {
        if (i === 0) return;

        tl.to(sections[i - 1], {
          xPercent: -100,
          ease: "none",
        });

        tl.to(
          section,
          {
            xPercent: 0,
            ease: "none",
          },
          "<"
        );
      });

      navLinks = Array.from(document.querySelectorAll("nav a[href^='#']"));
      navLinks.forEach((link) => link.addEventListener("click", handleNavClick));

      ScrollTrigger.refresh();
    }, slider);

    return () => {
      navLinks.forEach((link) => link.removeEventListener("click", handleNavClick));
      ctx.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [enabled]);
}
