import {useRef, useLayoutEffect } from "react";
import gsap from "gsap";

function ChatInput() {
    const inputRef = useRef();
    useLayoutEffect(() => {
        gsap.to(
            inputRef.current,{
                display:"none",
                duration: 1.3,
                delay: 1.5,
                ease: "power2.inOut",
            }
        );  
    },[]);
    return(
        <div ref={inputRef} className="chat-input">
            <input id="chat-input" type="text" placeholder="Type your message..." />
            <button >Send</button>
        </div>
    )
}
export default ChatInput;