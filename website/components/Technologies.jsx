const tech = [
  "React",
  "Next.js",
  "React Native",
  "Node.js",
  "Express",
  "ASP.NET",
  "MySQL",
  "MongoDB",
  "Docker",
  "Azure",
  "OpenAI",
  "Firebase"
];

function Technologies() {
  return (
    <section
      id="technology"
      className="technology"
    >

      <h2>Technologies</h2>

      <div className="tech-grid">

        {tech.map(item => (

          <div
            key={item}
            className="tech-card"
          >
            {item}
          </div>

        ))}

      </div>

    </section>
  );
}

export default Technologies;