"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function Reveal({
  children,
  className = "",
  y = 28,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      return;
    }

    const element = ref.current;
    const tween = gsap.fromTo(
      element,
      { autoAlpha: 0, y },
      {
        autoAlpha: 1,
        y: 0,
        delay,
        duration: 0.7,
        ease: "power3.out",
      },
    );

    return () => {
      tween.kill();
    };
  }, [delay, y]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
