import Link from "next/link";
import { ArrowRight, BookOpen, FileText, Question, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { Card, SectionLabel } from "@/components/ui/design-system";
import { Button } from "@/components/ui/button";

const resources = [
  {
    href: "/blog",
    icon: BookOpen,
    index: "01",
    label: "Knowledge",
    title: "Guides & Blog",
    description:
      "Practical guidance on formation, banking, payments, compliance, and running your business.",
    action: "Read the blog",
  },
  {
    href: "/faq",
    icon: Question,
    index: "02",
    label: "Answers",
    title: "FAQs",
    description:
      "Find concise answers to the questions founders ask before starting and operating a business.",
    action: "Browse FAQs",
  },
  {
    href: "/legal",
    icon: FileText,
    index: "03",
    label: "Reference",
    title: "Documents & Legal",
    description:
      "Review important legal, policy, and business information before you make a decision.",
    action: "View information",
  },
];

export default function ResourcesPage() {
  return (
    <main className="fm-page overflow-hidden">
      <section className="fm-page-hero relative isolate border-b border-[var(--fm-border)] bg-[radial-gradient(circle_at_78%_18%,var(--fm-hero-glow),transparent_28%),linear-gradient(135deg,var(--fm-graphite-deep)_0%,var(--fm-surface)_100%)] px-5 text-[var(--fm-text-primary)] sm:px-8">
        <div className="fm-page-hero-grid" />
        <div className="fm-page-container relative">
          <div className="max-w-[900px]">
            <SectionLabel>Resources</SectionLabel>
            <h1 className="fm-page-hero-title">
              Useful answers before next{" "}
              <span className="text-[var(--fm-lime)]">business move.</span>
            </h1>
            <p className="fm-page-hero-description max-w-[680px]">
              Explore practical guides, frequently asked questions, and business information
              designed to help you make informed decisions.
            </p>
          </div>
        </div>
      </section>
      <section className="fm-page-section px-5 sm:px-8">
        <div className="fm-page-container">
          <div className="mb-12 max-w-[650px]">
            <SectionLabel>Explore the library</SectionLabel>
            <h2 className="fm-page-section-heading text-[var(--fm-text-primary)]">
              Information that helps you move with confidence.
            </h2>
            <p className="mt-4 text-fm-body text-[var(--fm-text-secondary)]">
              Start with the resource that answers the question in front of you.
            </p>
          </div>
          <div className="grid gap-fm-5 lg:grid-cols-3">
            {resources.map(({ href, icon: Icon, index, label, title, description, action }) => (
              <Card
                key={href}
                variant="interactive"
                tone="default"
                className="group relative overflow-hidden p-7 sm:p-8"
              >
                <Link
                  href={href}
                  aria-label={title}
                  className="absolute inset-0 z-10 rounded-[inherit]"
                />
                <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-[70px] bg-[var(--fm-lime)]/[.035] transition duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] group-hover:bg-[var(--fm-lime)]/[.08]" />
                <div className="relative flex items-center justify-between">
                  <div className="fm-page-icon-tile">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-mono text-[10px] font-bold tracking-[.14em] text-[var(--fm-card-muted)]">
                    {index}
                  </span>
                </div>
                <div className="relative mt-8 fm-label text-[10px]">{label}</div>
                <h2 className="relative mt-2 font-display text-2xl font-extrabold tracking-[-.035em] text-[var(--fm-card-text)]">
                  {title}
                </h2>
                <p className="relative mt-3 min-h-[72px] text-sm leading-6 text-[var(--fm-card-muted)]">
                  {description}
                </p>
                <span className="relative mt-7 inline-flex items-center gap-2 text-sm font-bold text-[var(--fm-lime-bright)]">
                  {action}
                  <ArrowRight
                    weight="bold"
                    className="h-4 w-4 transition-transform duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] group-hover:translate-x-1"
                  />
                </span>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="fm-page-cta">
        <div className="fm-page-container fm-page-cta-inner px-6 md:px-8">
          <div>
            <SectionLabel>03 / Next move</SectionLabel>
            <h2 className="fm-page-section-heading max-w-[720px] text-[var(--fm-graphite-deep)]">
              Not sure which service comes first?
            </h2>
            <p className="fm-page-cta-description">
              Start with the process and see how Foremint connects the right service to the next
              step.
            </p>
          </div>
          <Link
            href="/how-it-works"
            className="fm-page-action fm-page-action--lime-outline group w-fit"
          >
            See how it works
            <ArrowRight className="h-5 w-5 transition-transform duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)] group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>
      </section>
    </main>
  );
}
