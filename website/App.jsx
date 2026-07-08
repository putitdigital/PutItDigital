import { useState } from "react";
import "./App.css";
import "./components/ChatBot/ChatBot.css";

// Hooks
import usePreloader from "./hooks/usePreloader";
import useScrollAnimations from "./hooks/useScrollAnimations";

// Components
import Preloader from "./components/Preloader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Technologies from "./components/Technologies";
import Projects from "./components/Projects";
import Process from "./components/Process";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";
import api from "./api/api";
import ChatBot from "./components/ChatBot/ChatBot";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const loading = usePreloader();
  useScrollAnimations(!loading && !isLoggedIn);

  const handleLogin = async () => {
    const email = window.prompt("Email");
    if (!email) return;

    const password = window.prompt("Password");
    if (!password) return;

    setIsLoggingIn(true);

    try {
      const response = await api.post("/login", { email, password });
      if (response.status === 200) {
        setIsLoggedIn(true);
      } else {
        window.alert("Invalid email or password");
      }
    } catch (error) {
      const message = error?.response?.data?.error || "Login failed";
      window.alert(message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsLoggedIn(false);
    }
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        isLoggingIn={isLoggingIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {isLoggedIn ? (
        <Dashboard />
      ) : (
        <>
          <main className="slider">
            <ChatBot/>
            <Hero />
            <Services />
            <Process />
            <Projects />
            <CTA />
          </main>

          <Footer />
        </>
      )}
    </>
  );
}

export default App;