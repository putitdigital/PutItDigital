import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";

export default function ChatHeader({ setOpen }) {
  const headerRef = useRef();

  useLayoutEffect(() => {
    gsap.to(headerRef.current, {
        display:"none",
        duration: 1.3,
        delay: 1.5,
        ease: "power2.inOut",
    });
  }, []);

  return (
    <div ref={headerRef} className="chat-header">
      <h3> Ask About Me</h3>
    </div>
  );
}