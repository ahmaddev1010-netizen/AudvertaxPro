"use client";

import { useEffect, useRef } from "react";

export default function GlobalCursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          if (el) {
            el.style.transform = `translate3d(${targetX - 300}px, ${targetY - 300}px, 0)`;
            el.style.opacity = "1";
          }
          raf = 0;
        });
      }
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      className="cursor-glow pointer-events-none fixed left-0 top-0 z-[9998] opacity-0"
      style={{
        width: 600,
        height: 600,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, color-mix(in srgb, var(--fm-lime) 10%, transparent) 0%, color-mix(in srgb, var(--fm-lime) 5%, transparent) 38%, transparent 65%)",
        transition: "opacity 0.4s",
        willChange: "transform, opacity",
      }}
    />
  );
}
