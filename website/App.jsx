import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Technologies from "./components/Technologies";
import Projects from "./components/Projects";
import Process from "./components/Process";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";
import "./App.css";

import useScrollAnimations from "./hooks/useScrollAnimations";
import useSectionSnap from "./hooks/useSectionSnap";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Only enable GSAP when showing the landing page
  useScrollAnimations(!isLoggedIn);
//   useSectionSnap(!isLoggedIn);

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogin={() => setIsLoggedIn(true)}
        onLogout={() => setIsLoggedIn(false)}
      />

      {isLoggedIn ? (
        <Dashboard />
      ) : (
        // <div id="h-scroll" className="h-scroll">
        //   <Hero />
        //   <Services />
        //   <Technologies />
        //   <Projects />
        //   <Process />
        //   <CTA />
        // </div>
        <div className="slider">
            <Hero />
            <Services />
            <Technologies />
            <Projects />
            <Process />
            <CTA />
        </div>
      )}

      <Footer />
    </>
  );
}

export default App;