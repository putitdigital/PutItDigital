function Navbar({ isLoggedIn, onLogin, onLogout }) {
  return (
    <header className="navbar">
      <div className="logo">
        {/* Put<span>It</span>Digital */}
      </div>

      <nav>
        <a href="#hero">Home</a>
        <a href="#services">Services</a>
        <a href="#projects">Projects</a>
        <a href="#technology">Technology</a>
        <a href="#contact">Contact</a>
      </nav>

      <button
        className="btn-primary"
        onClick={isLoggedIn ? onLogout : onLogin}
      >
        {isLoggedIn ? "Logout" : "Login"}
      </button>
    </header>
  );
}

export default Navbar;
