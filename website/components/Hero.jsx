function Hero() {
  return (
    <section className="hero">

      <div className="hero-left">

        <p className="tag">
          🚀 AI Powered Software Solutions
        </p>

        <h1>
          Build Smarter.
          <br />
          Automate Faster.
          <br />
          Scale Without Limits.
        </h1>

        <p className="subtitle">
          We build websites, mobile applications,
          AI solutions and business systems that help
          companies grow through automation and modern
          technology.
        </p>

        <div className="hero-buttons">
          <button className="btn-primary">
            Start Your Project
          </button>

          <button className="btn-secondary">
            View Portfolio
          </button>
        </div>

      </div>

      <div className="hero-right">

        <div className="dashboard-card">

          <h3>Project Analytics</h3>

          <div className="stat">
            <span>Projects</span>
            <strong>128</strong>
          </div>

          <div className="stat">
            <span>Automation</span>
            <strong>92%</strong>
          </div>

          <div className="stat">
            <span>Clients</span>
            <strong>54</strong>
          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;