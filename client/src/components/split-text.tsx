import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface SplitTextProps {
  text: string;
  delay?: number;
  duration?: number;
  className?: string;
}

export const SplitText = ({ text, delay = 100, duration = 0.6, className }: SplitTextProps) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chars = text.split("").map((char, index) => {
      const span = document.createElement("span");
      span.textContent = char === " " ? "\u00A0" : char;
      span.style.display = "inline-block";
      span.style.opacity = "0";
      return span;
    });

    containerRef.current.innerHTML = "";
    chars.forEach((char) => containerRef.current?.appendChild(char));

    const timeline = gsap.timeline({ delay: delay / 1000 });
    
    chars.forEach((char, index) => {
      timeline.to(
        char,
        {
          opacity: 1,
          duration: duration,
          ease: "power2.out",
        },
        index * 0.05
      );
    });

    return () => {
      timeline.kill();
    };
  }, [text, delay, duration]);

  return <span ref={containerRef} className={className} />;
};

