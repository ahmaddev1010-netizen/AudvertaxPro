import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section
      id="cta"
      aria-labelledby="cta-heading"
      className="relative isolate overflow-hidden bg-[var(--fm-lime)]"
      style={{ padding: "clamp(96px,14vh,140px) 24px", scrollMarginTop: 90 }}
    >
      <div className="pointer-events-none absolute -top-[40%] left-[20%] z-0 h-[120%] w-[60%] bg-[radial-gradient(rgba(255,255,255,0.16),transparent_65%)]" />
      <div className="pointer-events-none absolute inset-0 z-0 opacity-60 [background-image:linear-gradient(rgba(16,19,16,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(16,19,16,0.055)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="relative z-[1] mx-auto max-w-[880px] text-center">
        <h2
          id="cta-heading"
          className="font-display font-extrabold text-[var(--fm-graphite-deep)]"
          style={{ fontSize: "clamp(38px,5vw,68px)", lineHeight: 1.04, letterSpacing: "-0.03em" }}
        >
          Your U.S. business starts this week.
        </h2>
        <p className="mx-auto mt-[22px] max-w-[540px] text-lg leading-relaxed text-[var(--fm-graphite)]/75">
          Tell us your business name and your state. We&apos;ll handle everything between you and
          your first International payment.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4 sm:flex-row">
          <Button
            render={<Link href="/contact" />}
            size="lg"
            className="inline-flex h-12 items-center justify-center rounded-[var(--fm-radius-pill)] border border-[var(--fm-graphite-deep)]/30 bg-[var(--fm-graphite-deep)]/10 px-9 text-center font-display text-base font-bold text-[var(--fm-graphite-deep)] backdrop-blur transition-[transform,background-color,border-color] duration-[var(--fm-motion-component)] hover:-translate-y-0.5 hover:bg-[var(--fm-graphite-deep)]/15"
          >
            Talk to us
          </Button>
        </div>
        <p className="mt-9 font-mono text-xs uppercase tracking-[0.12em] text-[var(--fm-graphite)]/60">
          From $125 + state fee · No travel · No SSN required
        </p>
      </div>
    </section>
  );
}
