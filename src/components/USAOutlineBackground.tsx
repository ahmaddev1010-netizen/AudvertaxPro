"use client";

import { useEffect, useRef } from "react";

const USA_PATH =
  "M89 132L126 126L158 112L193 116L228 105L263 113L294 105L324 116L356 108L389 119L421 113L451 126L479 121L511 137L541 144L568 160L603 167L630 185L660 191L680 210L712 218L730 240L751 250L767 274L790 286L805 309L827 319L845 344L865 355L880 380L899 392L893 413L872 414L860 430L838 428L822 442L798 438L778 451L750 446L728 458L699 450L673 460L644 452L619 462L592 451L567 456L542 444L516 449L492 437L467 439L442 427L415 430L391 416L365 419L342 403L319 406L297 389L275 391L255 373L233 373L215 355L198 350L184 330L166 319L153 297L137 286L129 263L112 251L106 228L91 211L99 190L88 169L97 150Z";

export default function USAOutlineBackground() {
  const svgRef = useRef<SVGSVGElement>(null);
  const cursorRef = useRef<SVGCircleElement>(null);
  const glowRef = useRef<SVGGElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const positionRef = useRef({ x: 500, y: 280 });
  const targetRef = useRef({ x: 500, y: 280, active: false });

  useEffect(() => {
    const svg = svgRef.current;
    const cursor = cursorRef.current;
    const glow = glowRef.current;
    if (!svg || !cursor || !glow) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let bounds: DOMRect | null = null;

    const animate = () => {
      animationFrameRef.current = null;
      const position = positionRef.current;
      const target = targetRef.current;
      position.x += (target.x - position.x) * 0.14;
      position.y += (target.y - position.y) * 0.14;
      const distance = Math.hypot(position.x - target.x, position.y - target.y);

      cursor.setAttribute("cx", String(position.x));
      cursor.setAttribute("cy", String(position.y));
      glow.setAttribute("opacity", target.active ? "1" : String(Math.min(1, distance / 120)));

      if (distance > 0.1) {
        animationFrameRef.current = window.requestAnimationFrame(animate);
      }
    };

    const move = (event: PointerEvent) => {
      bounds = bounds ?? svg.getBoundingClientRect();
      targetRef.current.x = ((event.clientX - bounds.left) / bounds.width) * 1000;
      targetRef.current.y = ((event.clientY - bounds.top) / bounds.height) * 560;
      targetRef.current.active = true;

      if (!reducedMotion.matches && animationFrameRef.current === null) {
        animationFrameRef.current = window.requestAnimationFrame(animate);
      }
    };

    const leave = () => {
      targetRef.current.active = false;
      if (!reducedMotion.matches && animationFrameRef.current === null) {
        animationFrameRef.current = window.requestAnimationFrame(animate);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      bounds = svg.getBoundingClientRect();
    });

    svg.addEventListener("pointermove", move, { passive: true });
    svg.addEventListener("pointerleave", leave, { passive: true });
    resizeObserver.observe(svg);

    return () => {
      svg.removeEventListener("pointermove", move);
      svg.removeEventListener("pointerleave", leave);
      resizeObserver.disconnect();
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-[8%] z-0 flex justify-center opacity-[0.22] sm:top-[10%] sm:opacity-[0.28]"
      aria-hidden="true"
    >
      <svg
        ref={svgRef}
        className="pointer-events-auto h-auto w-[min(1100px,115vw)] overflow-visible"
        viewBox="0 0 1000 560"
        role="presentation"
      >
        <defs>
          <radialGradient id="usa-spotlight" r="100%">
            <stop offset="0" stopColor="white" />
            <stop offset="22%" stopColor="white" stopOpacity=".96" />
            <stop offset="48%" stopColor="white" stopOpacity=".72" />
            <stop offset="72%" stopColor="white" stopOpacity=".28" />
            <stop offset="90%" stopColor="white" stopOpacity=".06" />
            <stop offset="100%" stopColor="black" stopOpacity="0" />
          </radialGradient>
          <mask id="usa-glow-mask">
            <rect width="1000" height="560" fill="black" />
            <circle
              ref={cursorRef}
              cx="500"
              cy="280"
              r="116"
              fill="url(#usa-spotlight)"
              filter="url(#usa-blur-mask)"
            />
          </mask>
          <filter id="usa-blur-mask" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id="usa-blur-wide" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
          <filter id="usa-blur-tight" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
        <path
          d={USA_PATH}
          fill="none"
          stroke="var(--fm-border-accent)"
          strokeWidth="1.05"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <g ref={glowRef} mask="url(#usa-glow-mask)">
          <path
            d={USA_PATH}
            fill="none"
            stroke="var(--fm-lime)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            filter="url(#usa-blur-wide)"
          />
          <path
            d={USA_PATH}
            fill="none"
            stroke="var(--fm-lime-bright)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
            filter="url(#usa-blur-tight)"
          />
        </g>
      </svg>
    </div>
  );
}
