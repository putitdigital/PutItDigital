import { useEffect, useRef, useState } from "react";

import centiaImg from "../assets/projects/centia'sCleaningServices.png";
import switchImg from "../assets/projects/switch.png";
import rydermImg from "../assets/projects/ryderm.png";
import flowitImg from "../assets/projects/flowit.png";
import oktikImg from "../assets/projects/OKTik.png";
import mehlokhozImg from "../assets/projects/Mehlokhozi.png";

function Projects() {
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const mountedRef = useRef(false);
  const transitionTargetRef = useRef(null);
  const [visible, setVisible] = useState([]);
  const [animating, setAnimating] = useState(false);
  const [paused, setPaused] = useState(false);
  const nextIndexRef = useRef(5);

  const projects = [
    { name: "Centia's Cleaning Services", image: centiaImg },
    { name: "switch", image: switchImg },
    { name: "ryderm", image: rydermImg },
    { name: "FlowIT", image: flowitImg },
    { name: "OKTik", image: oktikImg },
    { name: "Mehlokhozi", image: mehlokhozImg },
  ];

  useEffect(() => {
    mountedRef.current = true;
    setVisible(projects.slice(0, 5));

    return () => {
      mountedRef.current = false;
      if (transitionTargetRef.current && transitionTargetRef.current._handler) {
        transitionTargetRef.current.removeEventListener("transitionend", transitionTargetRef.current._handler);
      }
      transitionTargetRef.current = null;
    };
  }, []);

  const layoutCards = () => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    const cards = Array.from(track.querySelectorAll(".project-card"));
    if (cards.length === 0) return;

    const cardHeight = cards[0].offsetHeight;
    container.style.height = `${Math.max(cardHeight, 240)}px`;
  };

  useEffect(() => {
    requestAnimationFrame(layoutCards);
    window.addEventListener("resize", layoutCards);
    return () => window.removeEventListener("resize", layoutCards);
  }, [visible]);

  useEffect(() => {
    const AUTOPLAY_MS = 5000;
    const id = setInterval(() => {
      if (!animating && !paused) {
        shiftNext();
      }
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [animating, paused]);

  const cleanupTransition = (track) => {
    if (transitionTargetRef.current && transitionTargetRef.current._handler) {
      transitionTargetRef.current.removeEventListener("transitionend", transitionTargetRef.current._handler);
    }
    transitionTargetRef.current = null;
    if (track) {
      track.style.transition = "none";
      track.style.transform = "none";
    }
  };

  const shiftNext = () => {
    if (!mountedRef.current || animating) return;
    const track = trackRef.current;
    if (!track) return;

    const cards = Array.from(track.querySelectorAll(".project-card"));
    if (cards.length === 0) return;

    const gap = 20;
    const shift = cards[0].offsetWidth + gap;
    const nextIdx = nextIndexRef.current;
    nextIndexRef.current = (nextIdx + 1) % projects.length;

    cleanupTransition(track);
    setAnimating(true);
    setVisible((prev) => [...prev, projects[nextIdx]]);

    requestAnimationFrame(() => {
      track.style.transition = "transform 0.8s ease";
      track.style.transform = `translateX(-${shift}px)`;
    });

    const handleTransitionEnd = (event) => {
      if (event.target !== track || event.propertyName !== "transform") return;
      if (!mountedRef.current) return;

      cleanupTransition(track);
      setVisible((prev) => prev.slice(1));
      setAnimating(false);
    };

    track._handler = handleTransitionEnd;
    transitionTargetRef.current = track;
    track.addEventListener("transitionend", handleTransitionEnd);

    setTimeout(() => {
      if (mountedRef.current && animating) {
        handleTransitionEnd({ target: track, propertyName: "transform" });
      }
    }, 900);
  };

  return (
    <section id="projects" className="projects">
      <h2>Trusted By</h2>

      <div
        className="project-carousel"
        ref={containerRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="track" ref={trackRef}>
          {visible.map((project) => (
            <article key={project.name} className="project-card">
              <img src={project.image} alt={project.name} />
              <h3>{project.name}</h3>
            </article>
          ))}
        </div>

        <div className="project-controls">
          <button className="btn-secondary" onClick={shiftNext} disabled={animating}>
            Next
          </button>
        </div>
      </div>
    </section>
  );
}

export default Projects;
