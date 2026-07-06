import { useEffect } from "react";

export default function useSectionSnap(enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const sections = document.querySelectorAll("section");

    let current = 0;
    let isScrolling = false;

    const scrollToSection = (index) => {
      isScrolling = true;

      sections[index].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      setTimeout(() => {
        isScrolling = false;
      }, 900);
    };

    const wheelHandler = (e) => {
      if (isScrolling) return;

      if (e.deltaY > 0 && current < sections.length - 1) {
        current++;
        scrollToSection(current);
      }

      if (e.deltaY < 0 && current > 0) {
        current--;
        scrollToSection(current);
      }
    };

    window.addEventListener("wheel", wheelHandler, { passive: true });

    return () => {
      window.removeEventListener("wheel", wheelHandler);
    };
  }, [enabled]);
}