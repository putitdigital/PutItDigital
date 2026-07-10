
import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";

export default function NotificationWindow({ setOpen }) {

    const NotificationWindowRef = useRef();

    useLayoutEffect(() => {

        const tl = gsap.timeline();

        // Pop in animation
        tl.fromTo(
            NotificationWindowRef.current,
            {
                opacity: 0,
                y: 80,
                transformOrigin: "bottom right"
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "back.out(1.7)"
            }
        )

        // Wait 1.5 seconds
        .to({}, { 
            duration: 1.0,
        })

        // Animate the box shadow
        .to(NotificationWindowRef.current, {
            boxShadow: "rgba(255, 255, 255, 0.45) 11px -8px 8px -6px",
            duration: 4,
            ease: "power2.out"
        });

    }, []);

    return (

        <div ref={NotificationWindowRef} className="Notification-window">

            <div className="messages">

                <div className="bot">
                    👋 Hi! Website still under development!!
                </div>

            </div>

        </div>

    );
}