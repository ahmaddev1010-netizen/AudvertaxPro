"use client";

import type { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type TransitionPhase = "idle" | "covering" | "revealing";
type Navigate = () => void;

const PAGE_TRANSITION_CONFIG = {
  minDuration: 800,
  maxDuration: 10000,
  exitDuration: 300,
  revealDuration: 400,
} as const;

const TRANSITION_ROUTES = new Set(["/about", "/services", "/pricing", "/contact", "/dashboard"]);

type ActiveTransition = {
  id: number;
  destinationPathname: string;
  startedAt: number;
  destinationReady: Promise<void>;
  resolveDestination: () => void;
};

function isReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getInternalUrl(value: string | URL) {
  const url = new URL(String(value), window.location.href);
  if (
    url.origin !== window.location.origin ||
    (url.protocol !== "http:" && url.protocol !== "https:")
  )
    return null;
  return url;
}

function isTransitionRoute(pathname: string) {
  return TRANSITION_ROUTES.has(pathname);
}

function wait(duration: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, duration));
}

export default function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const [isWaitingForDestination, setIsWaitingForDestination] = useState(false);
  const pathnameRef = useRef(pathname);
  const phaseRef = useRef<TransitionPhase>("idle");
  const activeTransitionRef = useRef<ActiveTransition | null>(null);
  const transitionIdRef = useRef(0);
  const timerRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timerRefs.current.forEach((timer) => clearTimeout(timer));
    timerRefs.current = [];
  }, []);

  const finishTransition = useCallback(() => {
    clearTimers();
    activeTransitionRef.current = null;
    phaseRef.current = "idle";
    setIsWaitingForDestination(false);
    setPhase("idle");
  }, [clearTimers]);

  const revealWhenReady = useCallback(
    async (transition: ActiveTransition) => {
      const minimumDuration = wait(
        Math.max(0, PAGE_TRANSITION_CONFIG.minDuration - (Date.now() - transition.startedAt)),
      );
      await Promise.all([minimumDuration, transition.destinationReady]);
      if (activeTransitionRef.current?.id !== transition.id) return;

      phaseRef.current = "revealing";
      setIsWaitingForDestination(false);
      setPhase("revealing");
      timerRefs.current.push(setTimeout(finishTransition, PAGE_TRANSITION_CONFIG.revealDuration));
    },
    [finishTransition],
  );

  const startTransition = useCallback(
    (url: URL, navigate: Navigate) => {
      if (url.pathname === pathnameRef.current && url.search === window.location.search) {
        navigate();
        return;
      }
      if (!isTransitionRoute(url.pathname) || isReducedMotion() || phaseRef.current !== "idle") {
        navigate();
        return;
      }

      clearTimers();
      const transitionId = transitionIdRef.current + 1;
      transitionIdRef.current = transitionId;
      let resolveDestination = () => {};
      const destinationReady = new Promise<void>((resolve) => {
        resolveDestination = resolve;
      });
      const transition: ActiveTransition = {
        id: transitionId,
        destinationPathname: url.pathname,
        startedAt: Date.now(),
        destinationReady,
        resolveDestination,
      };

      activeTransitionRef.current = transition;
      phaseRef.current = "covering";
      setIsWaitingForDestination(false);
      setPhase("covering");

      timerRefs.current.push(
        setTimeout(() => {
          if (activeTransitionRef.current?.id !== transitionId) return;
          setIsWaitingForDestination(true);
          navigate();
          void revealWhenReady(transition);
        }, PAGE_TRANSITION_CONFIG.exitDuration),
      );

      timerRefs.current.push(
        setTimeout(() => {
          if (activeTransitionRef.current?.id === transitionId) finishTransition();
        }, PAGE_TRANSITION_CONFIG.maxDuration),
      );
    },
    [clearTimers, finishTransition, revealWhenReady],
  );

  useEffect(() => {
    const previousPathname = pathnameRef.current;
    pathnameRef.current = pathname;
    const transition = activeTransitionRef.current;
    if (
      transition &&
      phaseRef.current === "covering" &&
      previousPathname !== pathname &&
      pathname === transition.destinationPathname
    ) {
      transition.resolveDestination();
    }
  }, [pathname]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest("a");
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      const url = getInternalUrl(link.href);
      if (!url || url.hash || !isTransitionRoute(url.pathname)) return;

      event.preventDefault();
      startTransition(url, () => router.push(`${url.pathname}${url.search}`));
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [router, startTransition]);

  // Do not monkey-patch history.pushState here. Next.js 16 can call pushState
  // from an insertion effect while updating router state. Calling setState from
  // that intercepted call triggers React's "useInsertionEffect must not schedule
  // updates" error. User link clicks are handled above, while programmatic
  // router navigation is intentionally left to Next.js.
  useEffect(() => {
    const handlePopState = () => {
      const nextUrl = new URL(window.location.href);
      if (
        phaseRef.current !== "idle" ||
        nextUrl.pathname === pathnameRef.current ||
        !isTransitionRoute(nextUrl.pathname) ||
        isReducedMotion()
      )
        return;
      startTransition(nextUrl, () => {});
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [startTransition]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  return (
    <>
      <div key={pathname} className="page-transition-content">
        {children}
      </div>
      {phase !== "idle" && (
        <div
          aria-hidden="true"
          className={`page-transition-curtain page-transition-curtain--${phase}`}
        >
          <span className="page-transition-curtain__mark" />
          {isWaitingForDestination && phase === "covering" && (
            <span className="page-transition-curtain__status">Loading destination</span>
          )}
        </div>
      )}
    </>
  );
}
