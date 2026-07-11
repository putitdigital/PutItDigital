import { useState } from "react";
import "./App.css";
// import "./components/ChatBot/ChatBot.css";
import "./components/notification/Notification.css";

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
import LoginModal from "./components/LoginModal";
import api from "./api/api";
// import ChatBot from "./components/ChatBot/ChatBot";
import Notification from "./components/notification/Notification";


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const loading = usePreloader();
  useScrollAnimations(!loading && !isLoggedIn);

  const openLoginModal = () => {
    setLoginError("");
    setLoginOpen(true);
  };

  const closeLoginModal = () => {
    setLoginOpen(false);
    setLoginError("");
    setCredentials({ email: "", password: "" });
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    try {
      const response = await api.post("/login", {
        email: credentials.email,
        password: credentials.password,
      });
      if (response.status === 200) {
        setIsLoggedIn(true);
        closeLoginModal();
      } else {
        setLoginError("Invalid email or password");
      }
    } catch (error) {
      const message = error?.response?.data?.error || "Login failed";
      setLoginError(message);
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
        onLogin={openLoginModal}
        onLogout={handleLogout}
      />

      {loginOpen && (
        <LoginModal
          credentials={credentials}
          onChange={setCredentials}
          onSubmit={handleLoginSubmit}
          onClose={closeLoginModal}
          error={loginError}
          isSubmitting={isLoggingIn}
        />
      )}

      {isLoggedIn ? (
        <Dashboard />
      ) : (
        <>
          <main className="slider">
            <Notification />
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