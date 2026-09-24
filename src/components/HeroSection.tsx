"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react";
import { gsap } from "gsap";

const NETWORK_LINES = [
  [23, 32, 68, 27],
  [69, 27, 78, 58],
  [78, 58, 57, 67],
  [57, 67, 31, 73],
  [31, 73, 22, 32],
  [43, 45, 69, 27],
  [43, 45, 57, 67],
] as const;

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = heroRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      const eyebrow = q("[data-hero-eyebrow]"),
        lines = q("[data-hero-line]"),
        copy = q("[data-hero-copy]"),
        actions = q("[data-hero-actions]"),
        visual = q("[data-hero-visual]");
      if (eyebrow.length)
        tl.fromTo(eyebrow, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.65 });
      if (lines.length)
        tl.fromTo(
          lines,
          { opacity: 0, yPercent: 105 },
          { opacity: 1, yPercent: 0, duration: 0.9, stagger: 0.1 },
          "-=.35",
        );
      if (copy.length)
        tl.fromTo(copy, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.7 }, "-=.45");
      if (actions.length)
        tl.fromTo(actions, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.65 }, "-=.4");
      if (visual.length)
        tl.fromTo(
          visual,
          { opacity: 0, x: 28, scale: 0.98 },
          { opacity: 1, x: 0, scale: 1, duration: 0.9 },
          "-=.7",
        );
      const globe = q("[data-network-globe]"),
        rings = q("[data-network-ring]"),
        nodes = q("[data-network-node]"),
        linesNet = q("[data-network-line]"),
        ticker = q("[data-network-ticker]");
      if (globe.length) gsap.to(globe, { rotate: 360, duration: 28, repeat: -1, ease: "none" });
      if (rings.length) gsap.to(rings, { rotate: -360, duration: 18, repeat: -1, ease: "none" });
      if (nodes.length)
        gsap.to(nodes, {
          opacity: 0.35,
          scale: 0.72,
          duration: 1.7,
          stagger: 0.22,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      if (linesNet.length)
        gsap.to(linesNet, {
          opacity: 0.22,
          duration: 1.4,
          stagger: 0.15,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      if (ticker.length) gsap.to(ticker, { xPercent: -18, duration: 9, repeat: -1, ease: "none" });
      const orbital = q("[data-network-orbital]");
      if (orbital.length)
        gsap.to(orbital, {
          rotation: 360,
          duration: 24,
          repeat: -1,
          ease: "none",
          transformOrigin: "50% 50%",
        });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="hero-section">
      <div className="hero-section__background" />
      <div className="hero-section__grid" />
      <div className="hero-section__inner">
        <div className="hero-section__copy">
          <div data-hero-eyebrow className="hero-section__eyebrow">
            <span className="hero-section__eyebrow-dot" />
            Pakistan → Global Business Infrastructure
          </div>
          <h1 className="hero-section__title">
            <span className="hero-section__title-line">
              <span data-hero-line>Build Globally.</span>
            </span>
            <span className="hero-section__title-line">
              <span data-hero-line>Comply seamlessly.</span>
            </span>
            <span className="hero-section__title-line">
              <span data-hero-line className="hero-section__title-accent">
                Scales without borders.
              </span>
            </span>
          </h1>
          <p data-hero-copy className="hero-section__description">
            We handle your <b>Company formation</b>, <b>Taxation</b> & <b>Compliances</b> in USA,
            UK, UAE and Pakistan.
            <br />
            Global business setup & tax compliance, solve end to end
          </p>
          {/* <div data-hero-actions className="hero-section__actions"><Link href="/get-started" className="hero-section__primary-action">Get Started<ArrowUpRight weight="bold" className="hero-section__primary-icon" /></Link><a href="#vsl" className="hero-section__secondary-action">See how it works<span>02:18</span></a></div> */}
        </div>

        <div data-hero-visual className="hero-section__visual">
          <div className="hero-section__visual-glow" />
          <div data-network-orbital className="hero-section__orbital">
            <div className="hero-section__outer-ring" />
            <div data-network-ring className="hero-section__ring hero-section__ring--dashed" />
            <div data-network-ring className="hero-section__ring hero-section__ring--vertical" />
            <div data-network-globe className="hero-section__globe">
              <div className="hero-section__globe-inner" />
              <div className="hero-section__globe-line hero-section__globe-line--h1" />
              <div className="hero-section__globe-line hero-section__globe-line--h2" />
              <div className="hero-section__globe-line hero-section__globe-line--h3" />
              <div className="hero-section__globe-line hero-section__globe-line--v1" />
              <div className="hero-section__globe-line hero-section__globe-line--v2" />
              <div className="hero-section__globe-line hero-section__globe-line--v3" />
              {[
                [22, 32],
                [69, 27],
                [78, 58],
                [31, 73],
                [57, 67],
                [43, 45],
              ].map(([x, y], i) => (
                <span
                  key={i}
                  data-network-node
                  className="hero-section__node"
                  style={{ left: `${x}%`, top: `${y}%` }}
                />
              ))}
              {NETWORK_LINES.map(([x1, y1, x2, y2], i) => {
                const width = Math.hypot(x2 - x1, y2 - y1);
                const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
                return (
                  <span
                    key={i}
                    data-network-line
                    className="hero-section__network-line"
                    style={{
                      left: `${x1}%`,
                      top: `${y1}%`,
                      width: `${width}%`,
                      transform: `rotate(${angle.toFixed(6)}deg)`,
                    }}
                  />
                );
              })}
            </div>
            <div className="hero-section__network-status">
              <div className="hero-section__network-status-copy">
                <div>Network</div>
                <strong>LIVE</strong>
                <span />
              </div>
            </div>
          </div>
          <div className="hero-section__ticker">
            <div data-network-ticker>
              FORMATION / TAX / BANKING / PAYMENTS / COLLECTION / GLOBAL RAILS / FORMATION / TAX /
              BANKING / PAYMENTS / COLLECTION / GLOBAL RAILS
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
