import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Technologies from "./components/Technologies";
import Projects from "./components/Projects";
import Process from "./components/Process";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <Technologies />
      <Projects />
      <Process />
      <CTA />
      <Footer />
    </>
  );
}

export default App;