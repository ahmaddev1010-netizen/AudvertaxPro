"use client";

import { useLayoutEffect, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HomeMotion({ children }: { children: ReactNode }) {
  useLayoutEffect(() => {
    const root = document.querySelector<HTMLElement>(".modern-home");
    if (!root) return;

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>("main > section");

      sections.forEach((section, index) => {
        if (index === 0) return;

        const headings = section.querySelectorAll<HTMLElement>("h1, h2, h3");
        const paragraphs = section.querySelectorAll<HTMLElement>("p");
        const interactive = section.querySelectorAll<HTMLElement>("a, button");
        const grouped = section.querySelectorAll<HTMLElement>("[data-gsap-item]");

        headings.forEach((heading) => {
          gsap.fromTo(
            heading,
            { opacity: 0, yPercent: 80, clipPath: "inset(0 0 100% 0)" },
            {
              opacity: 1,
              yPercent: 0,
              clipPath: "inset(0 0 0% 0)",
              duration: 0.85,
              ease: "power4.out",
              scrollTrigger: { trigger: heading, start: "top 86%", once: true },
            },
          );
        });

        paragraphs.forEach((paragraph) => {
          gsap.fromTo(
            paragraph,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              ease: "power3.out",
              scrollTrigger: { trigger: paragraph, start: "top 90%", once: true },
            },
          );
        });

        if (grouped.length) {
          gsap.fromTo(
            grouped,
            { opacity: 0, y: 28, scale: 0.985 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.75,
              stagger: 0.07,
              ease: "power3.out",
              scrollTrigger: { trigger: section, start: "top 78%", once: true },
            },
          );
        }

        gsap.fromTo(
          interactive,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger: 0.06,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 72%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-gsap-parallax]").forEach((element) => {
        const amount = Number(element.dataset.gsapParallax || 30);
        gsap.to(element, {
          y: -amount,
          ease: "none",
          scrollTrigger: {
            trigger: element,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      });

      gsap.utils.toArray<HTMLElement>("[data-gsap-line]").forEach((line) => {
        gsap.fromTo(
          line,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 1,
            ease: "power3.inOut",
            scrollTrigger: { trigger: line, start: "top 88%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>("[data-gsap-float]").forEach((element) => {
        gsap.to(element, {
          y: -8,
          duration: 2.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return <>{children}</>;
}
