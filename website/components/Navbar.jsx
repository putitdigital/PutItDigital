function Navbar() {
  return (
    <header className="navbar">
      <div className="logo">
        Put<span>It</span>Digital
      </div>

      <nav>
        <a href="#services">Services</a>
        <a href="#projects">Projects</a>
        <a href="#technology">Technology</a>
        <a href="#contact">Contact</a>
      </nav>

      <button className="btn-primary">
        Login
      </button>
    </header>
  );
}

export default Navbar;