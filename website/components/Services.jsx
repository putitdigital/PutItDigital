const services = [
  {
    title: "Custom Software",
    description:
      "Business systems designed around your company."
  },
  {
    title: "AI Automation",
    description:
      "Automate repetitive tasks using AI."
  },
  {
    title: "Mobile Apps",
    description:
      "Android & iOS applications."
  },
  {
    title: "Web Applications",
    description:
      "We turn outdated websites into modern websites."
  },
  {
    title: "Cloud Deployment",
    description:
      "Docker, Azure and scalable hosting."
  }
];

function Services() {
  return (
    <section
      id="services"
      className="services"
    >

      <h2>Our Services</h2>

      <div className="grid">

        {services.map((service) => (

          <div
            key={service.title}
            className="card"
          >
            <h3>{service.title}</h3>

            <p>{service.description}</p>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Services;