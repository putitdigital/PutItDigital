import { MessageCircle, X } from "lucide-react";
import {useRef, useLayoutEffect } from "react";
import gsap from "gsap";

export default function NotificationButton({ open, setOpen }) {
    const buttonRef = useRef();
    useLayoutEffect(() => {
    gsap.to(buttonRef.current, {
      backgroundColor: "#005eff00",
      duration: 0.2,
      delay: 1.5,
      ease: "power2.inOut",
      boxShadow: "3px 1px 0px rgba(255, 0, 0, 0)"
    });
  }, []);

    return (

        <button
            ref={buttonRef}
            className="Notification-button"
            onClick={() => setOpen(!open)}
        >

            {open ? <X /> : <MessageCircle />}

        </button>

    );

}