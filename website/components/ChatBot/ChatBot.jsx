import { useState, useEffect } from "react";
import FloatingButton from "./FloatingButton";
import ChatWindow from "./ChatWindow";

export default function ChatBot() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
    }, 3000); // Opens after 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <FloatingButton open={open} setOpen={setOpen} />

      {open && (
        <ChatWindow setOpen={setOpen} />
      )}
    </>
  );
}