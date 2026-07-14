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
        <form action="./connect.php" id="contact" name="emailContact" method="post">
          <input name="firstName" required type="text" placeholder="Enter your name" />
          <input name="email" required type="email" placeholder="Enter your email" />
          <textarea name="message" required placeholder="Enter your message"></textarea>
          <button name="send" value="1" className="btn-primary">
            Send
          </button>
        </form>
        <div className="cta-contact-info">
          <p>
            <strong>Email:</strong> info@putitdigital.co.za
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