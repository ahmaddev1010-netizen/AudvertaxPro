"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { Card } from "@/components/ui/design-system";

export default function VSLSection() {
  const [playing, setPlaying] = useState(false);

  return (
    <section id="vsl" className="bg-[var(--fm-graphite)]">
      <div
        className="mx-auto w-full max-w-[1400px] px-[15px]"
        style={{ margin: "0 auto clamp(64px, 8vh, 96px)" }}
      >
        <Card variant="feature" className="p-3">
          <div
            className="relative grid place-items-center overflow-hidden rounded-[var(--fm-radius-lg)] border border-[var(--fm-border)] bg-[var(--fm-graphite-deep)]"
            style={{ aspectRatio: "16 / 9" }}
          >
            {playing ? (
              <iframe
                className="absolute inset-0 h-full w-full border-0"
                src="https://www.youtube.com/embed/2cXy_IRGQ2g?autoplay=1"
                title="Watch how Audvertax works"
                allow="accelerate-compute; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                <img
                  src="https://img.youtube.com/vi/2cXy_IRGQ2g/maxresdefault.jpg"
                  alt="Audvertax video thumbnail"
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-[var(--fm-graphite-deep)]/25" />
                <button
                  aria-label="Play video"
                  onClick={() => setPlaying(true)}
                  className="relative z-[2] grid size-[84px] place-items-center rounded-full bg-[var(--fm-lime)] text-[var(--fm-graphite-deep)] shadow-[var(--fm-shadow-elevated)] transition-transform duration-[var(--fm-motion-component)] hover:scale-[1.07]"
                >
                  <span
                    className="absolute -inset-px rounded-full border border-[var(--fm-lime)]/35"
                    style={{ animation: "ringPulse 2.6s ease-out infinite" }}
                  />
                  <Play className="ml-1 h-[30px] w-[30px] fill-current" />
                </button>
                <div
                  className="absolute bottom-4 left-[18px] z-[2] flex items-center gap-2.5 rounded-[var(--fm-radius-sm)] border border-[var(--fm-border)] bg-[var(--fm-surface)]/90 px-[11px] py-1.5 font-mono text-[11px] font-semibold uppercase text-[var(--fm-text-primary)] backdrop-blur-sm"
                  style={{ letterSpacing: "0.04em" }}
                >
                  <span
                    className="inline-block size-2 rounded-full bg-[var(--fm-lime)]"
                    style={{ animation: "recBlink 2s ease-in-out infinite" }}
                  />
                  Watch how it works
                </div>
              </>
            )}
          </div>
        </Card>
        <p className="mt-5 text-center font-display text-base font-medium text-[var(--fm-text-secondary)]">
          Watch how Audvertax takes you from{" "}
          <b className="font-bold text-[var(--fm-text-primary)]">zero to getting paid</b>, start to
          finish.
        </p>
      </div>
    </section>
  );
}
