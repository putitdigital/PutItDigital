function CTA() {
  return (
    <section
      id="contact"
      className="cta"
    >

      <h2>
       Contact Us
      </h2>

      <p>
         Ready to build your next software solution?.
        Let's turn your idea into a scalable digital product.
      </p>
      <div className="cta-contact">
        <form action="https://formspree.io/f/mnqvydqv" method="POST">
          <input type="text" placeholder="Enter your name" />
          <input type="email" placeholder="Enter your email" />
          <textarea placeholder="Enter your message"></textarea>
          <button className="btn-primary">
            Send
          </button>
        </form>
        <div className="cta-contact-info">
          <p>
            <strong>Email:</strong> info@putitdigital.com
          </p>
          <p>
            <strong>Phone:</strong> +27 84 538 8953
          </p>
          <p>
            <strong>Address:</strong> Online, South Africa
          </p>
        </div>
      </div>
    </section>
  );
}

export default CTA;