import { useEffect,useRef, useLayoutEffect } from "react";
import api from "../api/api";
import gsap from "gsap";
function Hero() {
  const heroRef = useRef();

  useLayoutEffect(() => {

    gsap.fromTo(
      heroRef.current,
      {
        opacity: 0,
        y:80,
        transformOrigin: "bottom right"
      },
      {
        opacity: 1,
        y:0,
        ease: " back.out(1.7)"
      }
    )
  }, []);
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
    <section ref={heroRef} id="hero" className="hero">

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