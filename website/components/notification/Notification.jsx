import { useState, useEffect } from "react";
import NotificationButton from "./NotificationButton";
import NotificationWindow from "./NotificationWindow";

export default function Notification() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
    }, 1500); // Opens after 1.5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <NotificationButton open={open} setOpen={setOpen} />

      {open && (
        <NotificationWindow setOpen={setOpen} />
      )}
    </>
  );
}