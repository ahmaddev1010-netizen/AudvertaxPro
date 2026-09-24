"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { USA_MAP_HEIGHT, USA_MAP_WIDTH, usaMapGeometry } from "@/lib/maps/usa";
import { formationStates } from "@/lib/services";

type UsaGlowMapProps = {
  color?: string;
  selectedStateSlug?: string;
  onStateSelect?: (stateSlug: string) => void;
};

const DEFAULT_MAP_COLOR = "var(--fm-lime)";
const FOCUS_RADIUS_RATIO = 0.072;

export function UsaGlowMap({
  color = DEFAULT_MAP_COLOR,
  selectedStateSlug,
  onStateSelect,
}: UsaGlowMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const mapFrameRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef({ x: USA_MAP_WIDTH / 2, y: USA_MAP_HEIGHT / 2 });
  const targetRef = useRef({ x: USA_MAP_WIDTH / 2, y: USA_MAP_HEIGHT / 2, active: false });
  const frameRef = useRef<number | null>(null);
  const maskRef = useRef<SVGCircleElement>(null);
  const glowPathsRef = useRef<SVGGElement>(null);
  const stateRefs = useRef<Record<string, SVGPathElement | null>>({});
  const [hoveredStateSlug, setHoveredStateSlug] = useState<string | null>(null);
  const geometry = usaMapGeometry;
  const instanceId = useId().replace(/:/g, "");

  const normalizedSelectedStateSlug = selectedStateSlug?.trim().toLowerCase() ?? "";
  const selectedState = useMemo(
    () => geometry.states.find((state) => state.slug === normalizedSelectedStateSlug) ?? null,
    [normalizedSelectedStateSlug],
  );
  const hoveredState = useMemo(
    () => geometry.states.find((state) => state.slug === hoveredStateSlug) ?? null,
    [hoveredStateSlug],
  );
  const hoveredPrice = hoveredState
    ? formationStates.find((state) => state.slug === hoveredState.slug)?.filingFee
    : undefined;
  const tooltipId = `${instanceId}-tooltip`;

  const updateFocusRadius = useCallback(() => {
    const svg = svgRef.current;
    const circle = maskRef.current;
    if (!svg || !circle) return;

    const renderedWidth = svg.getBoundingClientRect().width;
    const renderedHeight = svg.getBoundingClientRect().height;
    if (!renderedWidth || !renderedHeight) return;

    const userUnitScale = Math.min(renderedWidth / USA_MAP_WIDTH, renderedHeight / USA_MAP_HEIGHT);
    const renderedRadius = Math.min(renderedWidth, renderedHeight) * FOCUS_RADIUS_RATIO;
    const radiusInUserUnits = renderedRadius / userUnitScale;

    circle.setAttribute("r", String(radiusInUserUnits));
  }, []);

  const updateTooltipPosition = useCallback((clientX: number, clientY: number) => {
    const frame = mapFrameRef.current;
    const tooltip = tooltipRef.current;
    if (!frame || !tooltip) return;

    const rect = frame.getBoundingClientRect();
    const tooltipWidth = tooltip.offsetWidth || 150;
    const tooltipHeight = tooltip.offsetHeight || 58;
    const offset = 16;
    const localX = clientX - rect.left;
    const localY = clientY - rect.top;
    const placeLeft = localX + offset + tooltipWidth > rect.width;
    const placeAbove = localY + offset + tooltipHeight > rect.height;
    const x = placeLeft ? localX - tooltipWidth - offset : localX + offset;
    const y = placeAbove ? localY - tooltipHeight - offset : localY + offset;

    tooltip.style.transform = `translate3d(${Math.max(8, x)}px, ${Math.max(8, y)}px, 0)`;
  }, []);

  const updateTooltipFromState = useCallback(
    (stateSlug: string) => {
      const state = geometry.states.find((item) => item.slug === stateSlug);
      if (!state) return;

      const [x, y] = geometry.centroid(state.feature);
      const svg = svgRef.current;
      if (!svg || !Number.isFinite(x) || !Number.isFinite(y)) return;

      const point = svg.createSVGPoint();
      point.x = x;
      point.y = y;
      const screenPoint = point.matrixTransform(svg.getScreenCTM() ?? new DOMMatrix());
      updateTooltipPosition(screenPoint.x, screenPoint.y);
    },
    [geometry, updateTooltipPosition],
  );

  const startAnimation = useCallback(() => {
    if (frameRef.current !== null || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;

    frameRef.current = requestAnimationFrame(function animateFrame() {
      frameRef.current = null;
      const cursor = cursorRef.current;
      const target = targetRef.current;
      cursor.x += (target.x - cursor.x) * 0.14;
      cursor.y += (target.y - cursor.y) * 0.14;
      const distance = Math.hypot(cursor.x - target.x, cursor.y - target.y);

      maskRef.current?.setAttribute("cx", String(cursor.x));
      maskRef.current?.setAttribute("cy", String(cursor.y));
      glowPathsRef.current?.setAttribute(
        "opacity",
        String(target.active ? 1 : Math.min(1, distance / 120)),
      );

      if (distance > 0.1) frameRef.current = requestAnimationFrame(animateFrame);
    });
  }, []);

  const setGlowTarget = useCallback(
    (x: number, y: number, active: boolean) => {
      targetRef.current = { x, y, active };
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        cursorRef.current = { x, y };
        maskRef.current?.setAttribute("cx", String(x));
        maskRef.current?.setAttribute("cy", String(y));
        glowPathsRef.current?.setAttribute("opacity", active ? "1" : "0");
        return;
      }
      startAnimation();
    },
    [startAnimation],
  );

  const setSelectedStateTarget = useCallback(() => {
    if (!selectedState) {
      targetRef.current = { ...cursorRef.current, active: false };
      glowPathsRef.current?.setAttribute("opacity", "0");
      return;
    }

    const [x, y] = geometry.centroid(selectedState.feature);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;

    setGlowTarget(x, y, true);
  }, [geometry, selectedState, setGlowTarget]);

  const updatePointerPosition = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg) return;

      const ctm = svg.getScreenCTM();
      if (!ctm) return;

      const point = svg.createSVGPoint();
      point.x = event.clientX;
      point.y = event.clientY;
      const localPoint = point.matrixTransform(ctm.inverse());

      const x = Math.max(0, Math.min(USA_MAP_WIDTH, localPoint.x));
      const y = Math.max(0, Math.min(USA_MAP_HEIGHT, localPoint.y));
      setGlowTarget(x, y, true);

      if (hoveredStateSlug) updateTooltipPosition(event.clientX, event.clientY);
    },
    [hoveredStateSlug, setGlowTarget, updateTooltipPosition],
  );

  useEffect(() => {
    updateFocusRadius();
    const svg = svgRef.current;
    if (!svg) return;

    const observer = new ResizeObserver(updateFocusRadius);
    observer.observe(svg);
    return () => observer.disconnect();
  }, [updateFocusRadius]);

  useEffect(() => {
    setSelectedStateTarget();
  }, [setSelectedStateTarget]);

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const handlePointerLeave = useCallback(() => {
    setHoveredStateSlug(null);
    setSelectedStateTarget();
  }, [setSelectedStateTarget]);

  const handleStateSelect = useCallback(
    (stateSlug: string) => {
      onStateSelect?.(stateSlug);
    },
    [onStateSelect],
  );

  const handleStateFocus = useCallback(
    (stateSlug: string) => {
      setHoveredStateSlug(stateSlug);
      updateTooltipFromState(stateSlug);
    },
    [updateTooltipFromState],
  );

  const handleStateKeyDown = useCallback(
    (event: React.KeyboardEvent<SVGPathElement>, index: number) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setHoveredStateSlug(null);
        return;
      }

      if (event.key !== "Enter" && event.key !== " " && !event.key.startsWith("Arrow")) return;

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleStateSelect(geometry.states[index].slug);
        return;
      }

      event.preventDefault();
      const nextIndex =
        event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? (index - 1 + geometry.states.length) % geometry.states.length
          : (index + 1) % geometry.states.length;
      const nextState = geometry.states[nextIndex];
      handleStateFocus(nextState.slug);
      handleStateSelect(nextState.slug);
      stateRefs.current[nextState.slug]?.focus();
    },
    [geometry.states, handleStateFocus, handleStateSelect],
  );

  const spotlightId = `${instanceId}-spotlight`;
  const maskId = `${instanceId}-glow-mask`;
  const blurId = `${instanceId}-blur-mask`;
  const hoverGlowId = `${instanceId}-hover-glow`;

  return (
    <div ref={mapFrameRef} className="map-frame relative h-full w-full">
      <svg
        ref={svgRef}
        className="usa-map pointer-events-auto block h-full w-full"
        viewBox={`0 0 ${USA_MAP_WIDTH} ${USA_MAP_HEIGHT}`}
        preserveAspectRatio="xMidYMid meet"
        role="group"
        aria-label="Select a state on the United States map"
        onPointerMove={updatePointerPosition}
        onPointerLeave={handlePointerLeave}
      >
        <defs>
          <radialGradient id={spotlightId} r="100%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="22%" stopColor="white" stopOpacity="0.96" />
            <stop offset="48%" stopColor="white" stopOpacity="0.72" />
            <stop offset="72%" stopColor="white" stopOpacity="0.28" />
            <stop offset="90%" stopColor="white" stopOpacity="0.06" />
            <stop offset="100%" stopColor="black" stopOpacity="0" />
          </radialGradient>
          <mask id={maskId}>
            <rect width={USA_MAP_WIDTH} height={USA_MAP_HEIGHT} fill="black" />
            <circle
              ref={maskRef}
              cx={USA_MAP_WIDTH / 2}
              cy={USA_MAP_HEIGHT / 2}
              r={USA_MAP_HEIGHT * FOCUS_RADIUS_RATIO}
              fill={`url(#${spotlightId})`}
              filter={`url(#${blurId})`}
            />
          </mask>
          <filter id={blurId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="28" />
          </filter>
          <filter id={hoverGlowId} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>

        <g aria-hidden="true" pointerEvents="none">
          {geometry.states.map((state) => (
            <path
              key={`base-${state.slug}`}
              d={state.path}
              fill={color}
              fillOpacity="0.12"
              stroke="none"
            />
          ))}
          <path
            d={geometry.boundaries}
            fill="none"
            stroke={color}
            strokeOpacity="0.18"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={geometry.nation}
            fill="none"
            stroke={color}
            strokeOpacity="0.42"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        {geometry.states.map((state, index) => {
          const name = state.feature.properties?.name ?? state.slug;
          const isSelected = state.slug === normalizedSelectedStateSlug;
          const isHovered = state.slug === hoveredStateSlug;
          const isTabStop = isSelected || (!normalizedSelectedStateSlug && index === 0);

          return (
            <path
              key={`interactive-${state.slug}`}
              ref={(element) => {
                stateRefs.current[state.slug] = element;
              }}
              d={state.path}
              fill={isSelected ? color : "transparent"}
              fillOpacity={isSelected ? 0.28 : 0}
              stroke={isSelected ? color : isHovered ? color : "transparent"}
              strokeOpacity={isSelected ? 0.95 : isHovered ? 0.8 : 0}
              strokeWidth={isSelected ? 2.5 : isHovered ? 1.25 : 0}
              vectorEffect="non-scaling-stroke"
              role="button"
              tabIndex={isTabStop ? 0 : -1}
              aria-label={`Select ${name}`}
              aria-pressed={isSelected}
              aria-describedby={isHovered ? tooltipId : undefined}
              className="outline-none focus:outline-none"
              onPointerEnter={(event) => {
                setHoveredStateSlug(state.slug);
                updateTooltipPosition(event.clientX, event.clientY);
              }}
              onPointerLeave={() => setHoveredStateSlug(null)}
              onFocus={() => handleStateFocus(state.slug)}
              onBlur={() => setHoveredStateSlug(null)}
              onClick={() => handleStateSelect(state.slug)}
              onKeyDown={(event) => handleStateKeyDown(event, index)}
            />
          );
        })}

        <g aria-hidden="true" pointerEvents="none">
          {geometry.states.map((state) => {
            if (state.slug !== hoveredStateSlug) return null;
            return (
              <path
                key={`hover-glow-${state.slug}`}
                d={state.path}
                fill="none"
                stroke={color}
                strokeOpacity="0.45"
                strokeWidth="3"
                filter={`url(#${hoverGlowId})`}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </g>

        <g
          ref={glowPathsRef}
          mask={`url(#${maskId})`}
          opacity="0"
          aria-hidden="true"
          pointerEvents="none"
        >
          {geometry.states.map((state) => (
            <path
              key={`glow-fill-${state.slug}`}
              d={state.path}
              fill={color}
              fillOpacity="0.38"
              stroke="none"
            />
          ))}
          {geometry.states.map((state) => (
            <path
              key={`glow-stroke-${state.slug}`}
              d={state.path}
              fill="none"
              stroke={color}
              strokeOpacity="0.9"
              strokeWidth="1.5"
            />
          ))}
        </g>
      </svg>

      <div
        ref={tooltipRef}
        id={tooltipId}
        role="tooltip"
        aria-hidden={!hoveredState}
        className={`pointer-events-none absolute left-0 top-0 z-20 min-w-[140px] rounded-[var(--fm-radius-sm)] border border-[color-mix(in_srgb,var(--fm-lime)_42%,transparent)] bg-[color-mix(in_srgb,var(--fm-graphite-deep)_94%,transparent)] px-3.5 py-2.5 text-left shadow-[0_10px_30px_color-mix(in_srgb,black_28%,transparent)] backdrop-blur-sm transition-[opacity,transform] duration-150 ease-out motion-reduce:transition-none ${hoveredState ? "opacity-100" : "opacity-0"}`}
      >
        {hoveredState && (
          <>
            <p className="font-mono text-[9px] font-bold uppercase tracking-[.14em] text-[var(--fm-text-secondary)]">
              {hoveredState.feature.properties?.name ?? hoveredState.slug}
            </p>
            <p className="mt-0.5 font-display text-lg font-extrabold leading-none text-[var(--fm-lime-bright)]">
              ${hoveredPrice ?? "—"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
