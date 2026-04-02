"use client";
import { useEffect, useRef, useState } from "react";

export function useScrollReveal({
  threshold = 0.15,
  rootMargin = "0px 0px -60px 0px",
} = {}) {
  const ref = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsRevealed(true);
      return;
    }

    const isMobile = window.matchMedia("(max-width: 860px)").matches;
    const opts = isMobile
      ? { threshold: 0.22, rootMargin: "0px 0px -22% 0px" }
      : { threshold, rootMargin };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(el);
        }
      },
      opts
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, isRevealed];
}
