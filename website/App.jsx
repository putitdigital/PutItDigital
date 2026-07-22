import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
// import "./components/ChatBot/ChatBot.css";
import "./components/notification/Notification.css";

// Hooks
import usePreloader from "./hooks/usePreloader";
import useScrollAnimations from "./hooks/useScrollAnimations";

// Components
import Preloader from "./components/Preloader";
import Navbar from "./components/Navbar";
import Profilenav from "./components/Dashboard/Profilenav";
import Hero from "./components/Hero";
import Services from "./components/Services";
import Projects from "./components/Projects";
import Process from "./components/Process";
import CTA from "./components/CTA";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";
import LoginModal from "./components/LoginModal";
import ErrorBoundary from "./components/ErrorBoundary";
import Profile from "./components/Dashboard/Profile";
import api from "./api/api";
// import ChatBot from "./components/ChatBot/ChatBot";
import Notification from "./components/notification/Notification";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.sessionStorage.getItem("putit-dashboard-auth") === "true";
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return { email: "", displayName: "User" };

    const savedUser = window.sessionStorage.getItem("putit-dashboard-user");
    if (!savedUser) return { email: "", displayName: "User" };

    try {
      return JSON.parse(savedUser);
    } catch {
      return { email: "", displayName: "User" };
    }
  });

  const loading = usePreloader();
  const navigate = useNavigate();
  useScrollAnimations(!loading && !isLoggedIn);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("putit-dashboard-auth", String(isLoggedIn));
      window.sessionStorage.setItem("putit-dashboard-user", JSON.stringify(user));
    }
  }, [isLoggedIn, user]);

  const openLoginModal = () => {
    setLoginError("");
    setLoginOpen(true);
  };

  const closeLoginModal = () => {
    setLoginOpen(false);
    setLoginError("");
    setCredentials({ email: "", password: "" });
  };

  const loadUserProfile = async () => {
    try {
      const response = await api.get("/me");
      const profile = response?.data?.user || response?.data || {};
      const nextUser = {
        id: profile.id,
        email: profile.email || "",
        name: profile.name || profile.email?.split("@")[0] || "",
        number: profile.number || "",
        password: profile.password || "",
        website: profile.website || "",
        role: profile.role || "",
      };

      setUser(nextUser);
      return nextUser;
    } catch (error) {
      console.error("Failed to load profile", error);
      return null;
    }
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
        setLoginOpen(false);
        setLoginError("");
        setCredentials({ email: "", password: "" });
        setIsLoggedIn(true);

        const nextUser = await loadUserProfile();
        if (nextUser) {
          setUser(nextUser);
        }

        navigate("/dashboard");
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
      setUser({ email: "", displayName: "User" });
      setIsLoggedIn(false);
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("putit-dashboard-auth", "false");
        window.sessionStorage.setItem("putit-dashboard-user", JSON.stringify({ email: "", displayName: "User" }));
        window.location.assign("/");
      }
    }
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <ErrorBoundary>
      <Routes>
        <Route
          path="/"
          element={
            <LandingPage
              isLoggedIn={isLoggedIn}
              isLoggingIn={isLoggingIn}
              loginOpen={loginOpen}
              loginError={loginError}
              credentials={credentials}
              onLogin={openLoginModal}
              onLogout={handleLogout}
              onCloseLogin={closeLoginModal}
              onChangeCredentials={setCredentials}
              onSubmitLogin={handleLoginSubmit}
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <DashboardPage isLoggedIn={isLoggedIn} isLoggingIn={isLoggingIn} onLogout={handleLogout} user={user} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

function LandingPage({
  isLoggedIn,
  isLoggingIn,
  loginOpen,
  loginError,
  credentials,
  onLogin,
  onLogout,
  onCloseLogin,
  onChangeCredentials,
  onSubmitLogin,
}) {
  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        isLoggingIn={isLoggingIn}
        onLogin={onLogin}
        onLogout={onLogout}
      />

      <main className="slider">
        <Notification />
        <Hero />
        <Services />
        <Process />
        <Projects />
        <CTA />
      </main>

      <Footer />

      {loginOpen && (
        <LoginModal
          credentials={credentials}
          onChange={onChangeCredentials}
          onSubmit={onSubmitLogin}
          onClose={onCloseLogin}
          error={loginError}
          isSubmitting={isLoggingIn}
        />
      )}
    </>
  );
}

function DashboardPage({ isLoggedIn, isLoggingIn, onLogout, user }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileUser, setProfileUser] = useState(user);

  useEffect(() => {
    setProfileUser(user);
  }, [user]);

  const handleProfileSave = async (nextUser) => {
    setProfileUser(nextUser);
    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("putit-dashboard-user", JSON.stringify(nextUser));
    }

    if (!nextUser?.id) {
      console.warn("Profile save skipped because no user id was available.");
      return;
    }

    const { id, ...profileData } = nextUser;

    try {
      await api.put(`/users/${id}`, profileData);
    } catch (error) {
      console.error("Failed to save profile", error);
    }
  };

  return (
    <>
      <Profilenav
        user={profileUser}
        onOpenProfile={() => setIsProfileOpen(true)}
      />
      <Dashboard 
        isLoggedIn={isLoggedIn}
        isLoggingIn={isLoggingIn}
        onLogin={() => {}}
        onLogout={onLogout}
      />
      {isProfileOpen ? (
        <Profile user={profileUser} onClose={() => setIsProfileOpen(false)} onSave={handleProfileSave} />
      ) : null}
    </>
  );
}

export default App;