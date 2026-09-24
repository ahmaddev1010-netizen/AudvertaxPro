import Image from "next/image";
import { Activity, CalendarClock, FolderLock, LineChart } from "lucide-react";
import { Card, IconContainer, SectionLabel } from "@/components/ui/design-system";

const FEATURES = [
  {
    icon: Activity,
    title: "Company status in real time",
    desc: "Active, pending, or under review, formation progress always visible.",
  },
  {
    icon: CalendarClock,
    title: "Zero missed deadlines",
    desc: "Annual reports, renewals, and state filings, filed on time, automatically.",
  },
  {
    icon: FolderLock,
    title: "Every document in one place",
    desc: "Sub-Material to company formation and filing.",
  },
  {
    icon: LineChart,
    title: "Full payment visibility ",
    desc: "Every payment of your process, tracked under one dashboard.",
  },
];

export default function DashboardSection() {
  return (
    <section
      id="dashboard"
      aria-labelledby="dashboard-heading"
      className="relative isolate overflow-hidden bg-[var(--fm-graphite)] px-6 py-24"
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_srgb,var(--fm-lime)_8%,transparent),transparent_65%),radial-gradient(40%_40%_at_90%_80%,color-mix(in_srgb,var(--fm-lime)_4%,transparent),transparent_65%)]" />
      <div className="relative z-[1] mx-auto mb-16 max-w-[680px] text-center">
        <SectionLabel className="mb-[18px] inline-block">Dashboard</SectionLabel>
        <h2
          id="dashboard-heading"
          className="mb-5 font-display font-extrabold text-[var(--fm-text-primary)]"
          style={{
            fontSize: "clamp(34px, 4.5vw, 62px)",
            lineHeight: 1.08,
            letterSpacing: "-0.03em",
          }}
        >
          Your business, <span className="text-[var(--fm-lime)]">one dashboard away.</span>
        </h2>
        <p className="mx-auto max-w-[56ch] text-[15.5px] font-medium leading-relaxed text-[var(--fm-text-secondary)] sm:text-[17.5px]">
          Track process status, documents, payments and renewals without chasing five different
          agents.
        </p>
      </div>

      <div className="relative z-[1] mx-auto max-w-[1100px]" style={{ perspective: 1200 }}>
        <Card variant="feature" tone="dark" className="overflow-hidden p-0">
          <div className="flex items-center gap-1.5 border-b border-[var(--fm-border)] bg-[var(--fm-surface)] px-4 py-2.5">
            <span className="inline-block size-[11px] rounded-full bg-[#ff5f57]" />
            <span className="inline-block size-[11px] rounded-full bg-[#febc2e]" />
            <span className="inline-block size-[11px] rounded-full bg-[#28c840]" />
            <span className="ml-3 rounded-[var(--fm-radius-sm)] border border-[var(--fm-border)] bg-[var(--fm-surface-raised)] px-3.5 py-[3px] font-mono text-[11.5px] font-medium text-[var(--fm-text-tertiary)]">
              app.audvertax.pk
            </span>
          </div>
          <div className="relative w-full" style={{ aspectRatio: "16 / 9.8" }}>
            <Image
              src="/audvertax_customer_dashboard.svg"
              alt="Audvertax customer dashboard"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1100px"
              className="object-cover object-left-top"
            />
          </div>
        </Card>
      </div>

      <div className="relative z-[1] mx-auto mt-12 grid max-w-[1100px] grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <Card key={title} variant="interactive" className="flex items-start gap-3.5 p-5">
            <IconContainer className="size-[38px] rounded-[var(--fm-radius-sm)]" aria-hidden="true">
              <Icon className="h-[18px] w-[18px]" />
            </IconContainer>
            <div>
              <p className="mb-1 font-display text-sm font-extrabold text-[var(--fm-card-text)]">
                {title}
              </p>
              <p className="text-[13px] font-medium leading-relaxed text-[var(--fm-card-muted)]">
                {desc}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
