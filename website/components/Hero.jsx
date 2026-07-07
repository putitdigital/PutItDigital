import { useEffect } from "react";
import api from "../api/api";
function Hero() {
  useEffect(() => {

        async function load() {

            try {

                const response = await api.get("/users");

                console.log(response.data);

            } catch (err) {

                console.log(err);

            }

        }

        load();

    }, []);
  return (
    <section id="hero" className="hero">

      <div className="hero-left">

        <h1>
          Build Smarter.
          <br />
          Automate Faster.
          <br />
          Scale Without Limits.
        </h1>
        <p>
          Put It Digital
        </p>
      </div>

    </section>
  );
}

export default Hero;