 import { useState, useEffect } from "react";

 export default function usePreloader() {
    const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
            setIsLoading(false);
            }, 1500);

            
    return () => clearTimeout(timer);
  }, []);
  return loading;
}
