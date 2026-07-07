import { useEffect, useState } from "react";

function Navbar({ isLoggedIn, isLoggingIn, onLogin, onLogout }) {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll("main.slider section[id]"));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        threshold: 0.6,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <header className="navbar">
      <div className="logo">
        {/* Put<span>It</span>Digital */}
      </div>

      <nav>
        <a href="#hero" className={activeSection === "hero" ? "active" : ""}>Home</a>
        <a href="#services" className={activeSection === "services" ? "active" : ""}>Services</a>
        <a href="#process" className={activeSection === "process" ? "active" : ""}>How We Work</a>
        <a href="#projects" className={activeSection === "projects" ? "active" : ""}>Trusted By</a>
        <a href="#contact" className={activeSection === "contact" ? "active" : ""}>Contact</a>
      </nav>

      <button
        className="btn-primary"
        onClick={isLoggedIn ? onLogout : onLogin}
        disabled={isLoggingIn}
      >
        {isLoggingIn ? "Checking..." : isLoggedIn ? "Logout" : "Login"}
      </button>
    </header>
  );
}

export default Navbar;
