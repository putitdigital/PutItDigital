import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function useScrollAnimations(enabled = true) {
  useLayoutEffect(() => {
    if (!enabled) return;

    const slider = document.querySelector(".slider");
    if (!slider || !slider.isConnected) return;

    const sections = gsap.utils.toArray("section", slider);
    if (!sections.length) return;

    const getSectionIndex = (id) => {
      const index = sections.findIndex((section) => section.id === id);
      return index >= 0 ? index : -1;
    };

    const scrollToSection = (index) => {
      if (index < 0) return;

      const target = sections[index];
      if (!target) return;

      const top = target.getBoundingClientRect().top + window.scrollY - 80;

      gsap.to(window, {
        duration: 1.1,
        ease: "power2.inOut",
        overwrite: true,
        scrollTo: { y: top, autoKill: false },
      });
    };

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

    const navLinks = Array.from(document.querySelectorAll("nav a[href^='#']"));
    navLinks.forEach((link) => link.addEventListener("click", handleNavClick));

    gsap.set(sections, { clearProps: "all" });

    return () => {
      navLinks.forEach((link) => link.removeEventListener("click", handleNavClick));
      gsap.killTweensOf(window);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [enabled]);
}