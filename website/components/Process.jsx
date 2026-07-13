function Process() {
  const steps = [
    {
      title: "Discover",
      description: "We begin with research and a clear roadmap so every decision is aligned with your goals.",
    },
    {
      title: "Design",
      description: "We sculpt intuitive experiences and polished visuals that reflect your brand and users.",
    },
    {
      title: "Develop",
      description: "We build fast, accessible web experiences using modern tools and clean code.",
    },
    {
      title: "Deploy",
      description: "We launch your project with confident staging, testing, and production readiness.",
    },
    {
      title: "Support",
      description: "We stay available for updates, improvements, and long-term growth after launch.",
    },
  ];

  return (
    <section id="process" className="process">
      <div className="process-header">
        <h2>How We Work</h2>
        <p className="process-copy">
          A simple process built around collaboration, quality, and measurable results.
        </p>
      </div>

      <div className="steps">
        {steps.map((step, index) => (
          <article key={step.title} className="process-step">
            <div className="step-header">
              <span className="step-number">{index + 1} </span>
              <h3>{step.title}</h3>
            </div>
            
            <div className="step-content">
              <p>{step.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Process;