import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";

export default function ChatWindow({ setOpen }) {

    const chatRef = useRef();

    useLayoutEffect(() => {

        const tl = gsap.timeline();

        // Pop in animation
        tl.fromTo(
            chatRef.current,
            {
                opacity: 0,
                y: 80,
                scale: 0.85,
                rotate: 3,
                transformOrigin: "bottom right"
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                rotate: 0,
                duration: 0.7,
                ease: "back.out(1.7)"
            }
        )

        // Wait 1.5 seconds
        .to({}, { 
            duration: 1.9,
        })

        // Animate the box shadow
        .to(chatRef.current, {
            boxShadow: "rgba(255, 0, 0, 0.45) 11px -8px 8px -6px",
            duration: 6,
            ease: "power2.out"
        });

    }, []);

    return (

        <div ref={chatRef} className="chat-window">

            <ChatHeader setOpen={setOpen} />

            <div className="messages">

                <div className="bot">
                    👋 Hi! Website still under development!!
                </div>

            </div>

            <ChatInput />

        </div>

    );
}