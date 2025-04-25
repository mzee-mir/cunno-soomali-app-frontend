// Updated useIsMobile with debouncing
import { useEffect, useState } from "react";

export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let timeoutId: number;

    const checkIfMobile = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setIsMobile(window.innerWidth < breakpoint);
      }, 100);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
      clearTimeout(timeoutId);
    };
  }, [breakpoint]);

  return isMobile;
}