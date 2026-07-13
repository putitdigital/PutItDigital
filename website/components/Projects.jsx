import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

function Projects() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [visible, setVisible] = useState([]);
  const [animating, setAnimating] = useState(false);
  const [paused, setPaused] = useState(false);

  const animatingRef = useRef(animating);
  const pausedRef = useRef(paused);
  const nextIndexRef = useRef(5 % 6);
  const cardWidthRef = useRef(0);
  const timelineRef = useRef(null);

  const projects = [
    { name: "Centia's Cleaning Services", image: "assets/projects/centia'sCleaningServices.png" },
    { name: "switch", image: "assets/projects/switch.png" },
    { name: "ryderm", image: "assets/projects/ryderm.png" },
    { name: "FlowIT", image: "assets/projects/flowit.png" },
    { name: "OKTik", image: "assets/projects/oktik.png" },
    { name: "Mehlokhozi", image: "assets/projects/mehlokhozi.png" },
  ];

  // initialize visible projects (first 5)
  useEffect(() => {
    setVisible(projects.slice(0, 5));
  }, []);

  useEffect(() => {
    animatingRef.current = animating;
  }, [animating]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  // measure card width and layout
  const layoutCards = () => {
    const track = trackRef.current;
    if (!track) return;

    const cards = Array.from(track.querySelectorAll(".project-card"));
    if (cards.length === 0) return;

    const cardWidth = cards[0].offsetWidth;
    const gap = 20;
    cardWidthRef.current = cardWidth + gap;

    const container = containerRef.current;
    if (container) {
        if (cards[0].offsetHeight < 238) {
            container.style.height = `${238}px`;
        }else{
            container.style.height = `${cards[0].offsetHeight}px`;
        }
    }
  };

  useEffect(() => {
    requestAnimationFrame(layoutCards);
    window.addEventListener("resize", layoutCards);
    return () => window.removeEventListener("resize", layoutCards);
  }, [visible]);

  // autoplay
  useEffect(() => {
    const AUTOPLAY_MS = 5000; // 5 seconds
    const id = setInterval(() => {
      if (!animatingRef.current && !pausedRef.current) {
        shiftNext();
      }
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, []);

  const shiftNext = () => {
    if (animating) return;
    const track = trackRef.current;
    if (!track) return;

    setAnimating(true);

    // Kill any existing timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    const cards = Array.from(track.querySelectorAll(".project-card"));
    if (cards.length === 0) {
      setAnimating(false);
      return;
    }

    const shift = cardWidthRef.current;
    const firstCard = cards[0];

    // Create timeline that will handle everything
    const tl = gsap.timeline();
    timelineRef.current = tl;

    // 1. Slide track left and fade out first card
    tl.to(
      track,
      {
        x: -shift,
        duration: 0.8,
        ease: "power3.inOut",
      },
      0
    );

    tl.to(
      firstCard,
      {
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
      },
      0
    );

    // 2. After animation, update state to remove first and add new
    tl.add(() => {
      const nextIdx = nextIndexRef.current;
      nextIndexRef.current = (nextIdx + 1) % projects.length;

      // Update state: remove first, add next
      setVisible((prev) => {
        const updated = [...prev.slice(1), projects[nextIdx]];
        return updated;
      });

      // Immediately reset track position for next cycle
      gsap.set(track, { x: 0, clearProps: "all" });
    });

    // 3. After state updates and DOM re-renders, animate new card in
    tl.add(() => {
      // Get fresh card references after React re-render
      requestAnimationFrame(() => {
        const newCards = Array.from(track.querySelectorAll(".project-card"));
        const lastCard = newCards[newCards.length - 1];

        if (lastCard) {
          gsap.fromTo(
            lastCard,
            { opacity: 0, scale: 0.95 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.6,
              ease: "back.out",
              onComplete: () => {
                setAnimating(false);
              },
            }
          );
        } else {
          setAnimating(false);
        }
      });
    });
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
              <h3><strong>{project.name}</strong></h3>
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
