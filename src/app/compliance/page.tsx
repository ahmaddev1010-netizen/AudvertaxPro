import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck2,
  FileCheck2,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import { Card } from "@/components/ui/design-system";

const obligations = [
  {
    number: "01",
    title: "Track",
    text: "Capture filing dates, state requirements and document status before they become urgent.",
  },
  {
    number: "02",
    title: "Prepare",
    text: "Collect the information and documents needed before recurring deadlines arrive.",
  },
  {
    number: "03",
    title: "Stay ready",
    text: "Keep obligations visible across entities with a clear, repeatable compliance workflow.",
  },
];

export default function Page() {
  return (
    <main className="min-h-screen overflow-hidden bg-[var(--fm-graphite-deep)] text-[var(--fm-text-primary)]">
      <section className="relative isolate overflow-hidden border-b border-[var(--fm-border)] px-6 pb-24 pt-28 sm:px-10 lg:px-14 lg:pt-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_76%_34%,color-mix(in_srgb,var(--fm-lime)_15%,transparent),transparent_30%),linear-gradient(120deg,var(--fm-graphite-deep),var(--fm-graphite))]" />
        <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(color-mix(in_srgb,var(--fm-lime)_8%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,var(--fm-lime)_8%,transparent)_1px,transparent_1px)] [background-size:64px_64px]" />
        <div className="relative z-10 mx-auto grid min-h-[600px] max-w-[1400px] items-center gap-16 lg:grid-cols-[1fr_.8fr]">
          <div>
            <div className="mb-7 flex items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[.18em] text-[var(--fm-lime)]">
              <span className="h-px w-9 bg-[var(--fm-lime)]" />
              Compliance / recurring obligations
            </div>
            <h1 className="max-w-[850px] font-display text-[clamp(3.4rem,7vw,6.7rem)] font-bold leading-[.91] tracking-[-.07em]">
              Keep your business <span className="text-[var(--fm-lime)]">ready.</span>
            </h1>
            <p className="mt-8 max-w-[650px] text-[17px] leading-[1.75] text-[var(--fm-text-secondary)] sm:text-[19px]">
              Make annual reports, renewals and entity obligations visible with a clear compliance
              workflow built for businesses operating across borders.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#workflow"
                className="group inline-flex items-center gap-3 rounded-[var(--fm-radius-pill)] bg-[var(--fm-lime)] px-6 py-4 text-sm font-bold text-[var(--fm-graphite-deep)] transition-[transform,background-color] duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)] hover:-translate-y-1 hover:bg-[var(--fm-lime-bright)]"
              >
                Explore workflow{" "}
                <ArrowUpRight className="h-5 w-5 transition-transform duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
              <Link
                href="/services"
                className="inline-flex items-center gap-3 rounded-[var(--fm-radius-pill)] border border-[var(--fm-border)] bg-[var(--fm-surface)] px-6 py-4 text-sm font-semibold text-[var(--fm-text-primary)] transition-[transform,border-color] duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)] hover:-translate-y-1 hover:border-[var(--fm-border-accent)]"
              >
                View services <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="relative mx-auto hidden h-[430px] w-[430px] lg:block">
            <div className="absolute inset-0 rounded-full border border-[var(--fm-lime)]/15" />
            <div className="absolute inset-[12%] rounded-full border border-dashed border-[var(--fm-lime)]/25" />
            <div className="absolute inset-[25%] rounded-full border border-[var(--fm-lime)]/20" />
            <div className="absolute left-1/2 top-[2%] h-[96%] w-px bg-[var(--fm-lime)]/10" />
            <div className="absolute left-[2%] top-1/2 h-px w-[96%] bg-[var(--fm-lime)]/10" />
            <div className="absolute left-1/2 top-1/2 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-[var(--fm-lime)]/35 bg-[var(--fm-graphite)]/90 text-center shadow-[var(--fm-shadow-elevated)] backdrop-blur">
              <ShieldCheck className="h-8 w-8 text-[var(--fm-lime)]" />
              <span className="mt-3 font-mono text-[9px] uppercase tracking-[.18em] text-[var(--fm-text-tertiary)]">
                Status
              </span>
              <strong className="mt-1 text-xl text-[var(--fm-lime-bright)]">COMPLIANT</strong>
            </div>
            {["12% 50%", "88% 50%", "50% 12%", "50% 88%"].map((position, i) => {
              const [left, top] = position.split(" ");
              return (
                <span
                  key={i}
                  className="absolute h-3 w-3 rounded-full bg-[var(--fm-lime)] shadow-[0_0_0_7px_color-mix(in_srgb,var(--fm-lime)_8%,transparent)]"
                  style={{ left, top }}
                />
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="workflow"
        className="bg-[var(--fm-graphite-deep)] px-6 py-24 sm:px-10 lg:px-14 lg:py-28"
      >
        <div className="mx-auto max-w-[1400px]">
          <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-[var(--fm-lime)]">
                01 / Compliance workflow
              </div>
              <h2 className="mt-3 max-w-[720px] font-display text-4xl font-bold tracking-[-.055em] sm:text-5xl lg:text-6xl">
                Visibility before the deadline.
              </h2>
            </div>
            <p className="max-w-[390px] text-sm leading-7 text-[var(--fm-text-secondary)]">
              A simple operating rhythm for keeping recurring obligations visible, prepared and
              actionable.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {obligations.map((item, i) => {
              const Icon = i === 0 ? CalendarCheck2 : i === 1 ? FileCheck2 : ShieldCheck;
              return (
                <Card
                  key={item.number}
                  variant="interactive"
                  tone="dark"
                  className="group relative min-h-[310px] overflow-hidden p-8"
                >
                  <div className="absolute -right-14 -top-14 h-36 w-36 rounded-full border border-[var(--fm-lime)]/15 transition-transform duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)] group-hover:scale-110" />
                  <div className="relative flex h-full flex-col">
                    <div className="flex items-center justify-between">
                      <span className="grid h-12 w-12 place-items-center rounded-[var(--fm-radius-md)] border border-[var(--fm-lime)]/25 bg-[var(--fm-lime)]/10 text-[var(--fm-lime)]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="font-mono text-[10px] tracking-[.16em] text-[var(--fm-text-tertiary)]">
                        {item.number}
                      </span>
                    </div>
                    <h3 className="mt-9 font-display text-3xl font-bold tracking-[-.045em]">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-[370px] text-sm leading-7 text-[var(--fm-card-muted)]">
                      {item.text}
                    </p>
                    <span className="mt-auto pt-7 font-mono text-[9px] uppercase tracking-[.15em] text-[var(--fm-lime)]">
                      Compliance rail / active
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--fm-border)] bg-[var(--fm-surface)] px-6 py-20 sm:px-10 lg:px-14">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div>
            <div className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-[var(--fm-lime)]">
              02 / Built for continuity
            </div>
            <h2 className="mt-4 max-w-[620px] font-display text-4xl font-bold tracking-[-.055em] sm:text-5xl">
              Compliance should be a system, not a scramble.
            </h2>
          </div>
          <div className="border-t border-[var(--fm-border)]">
            {[
              "Know what is due",
              "Prepare before it is urgent",
              "Keep entity records organized",
            ].map((item, i) => (
              <div
                key={item}
                className="flex items-center justify-between border-b border-[var(--fm-border)] py-5"
              >
                <div className="flex items-center gap-fm-5">
                  <span className="font-mono text-[10px] text-[var(--fm-text-tertiary)]">
                    0{i + 1}
                  </span>
                  <span className="font-semibold">{item}</span>
                </div>
                <CheckCircle className="h-5 w-5 text-[var(--fm-lime)]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--fm-lime-soft)] px-6 py-16 text-[var(--fm-graphite-deep)] sm:px-10 lg:px-14">
        <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <div className="font-mono text-[10px] font-bold uppercase tracking-[.18em] text-[var(--fm-graphite)]">
              03 / Next move
            </div>
            <h2 className="mt-3 max-w-[720px] font-display text-4xl font-bold tracking-[-.055em] sm:text-5xl">
              Build a cleaner compliance rhythm.
            </h2>
          </div>
          <Link
            href="/services"
            className="group inline-flex w-fit items-center gap-3 rounded-[var(--fm-radius-pill)] bg-[var(--fm-graphite-deep)] px-6 py-4 text-sm font-bold text-[var(--fm-text-primary)] transition-transform duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)] hover:-translate-y-1"
          >
            Explore services{" "}
            <ArrowUpRight className="h-5 w-5 transition-transform duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
      </section>
    </main>
  );
}
