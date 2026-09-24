import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { articles } from "@/content/articles";
import { Card, SectionLabel } from "@/components/ui/design-system";
import { Button } from "@/components/ui/button";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    return null;
  }

  return (
    <main className="fm-page overflow-hidden">
      <section className="relative isolate border-b border-[var(--fm-border)] bg-[radial-gradient(circle_at_78%_18%,var(--fm-hero-glow),transparent_28%),linear-gradient(135deg,var(--fm-graphite-deep)_0%,var(--fm-surface)_100%)] px-5 pb-20 pt-24 sm:px-8 sm:pb-24 sm:pt-28 lg:pb-28 lg:pt-32">
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(var(--fm-hero-grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--fm-hero-grid-line)_1px,transparent_1px)] [background-size:var(--fm-hero-grid-size)_var(--fm-hero-grid-size)] [mask-image:var(--fm-hero-grid-mask)]" />
        <div className="relative mx-auto max-w-[1000px]">
          <Link
            href="/blog"
            className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-[var(--fm-text-secondary)] transition-colors hover:text-[var(--fm-lime)]"
          >
            <ArrowLeft weight="bold" className="h-4 w-4" />
            Back to Guides &amp; Blog
          </Link>
          <SectionLabel>Guide / Founder resources</SectionLabel>
          <h1 className="mt-5 font-display text-[clamp(2.8rem,6vw,5.6rem)] font-extrabold leading-[.96] tracking-[-.065em] text-[var(--fm-text-primary)]">
            {article.title}
          </h1>
          <p className="mt-7 max-w-[760px] text-[18px] leading-8 text-[var(--fm-text-secondary)] sm:text-[21px]">
            {article.excerpt}
          </p>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-[1000px] gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16">
          <article className="min-w-0">
            <div className="prose max-w-none text-[var(--fm-text-secondary)]">
              <p className="text-lg leading-8 sm:text-xl">
                Getting the right structure in place is only the beginning. The practical
                details—documents, ownership, provider requirements, and ongoing compliance—are what
                make the process easier to manage.
              </p>

              <h2 className="mt-12 font-display text-3xl font-extrabold tracking-[-.045em] text-[var(--fm-text-primary)] sm:text-4xl">
                Start with the right documents
              </h2>
              <p className="mt-4 leading-8">
                Prepare identity information, company details, ownership information and any
                provider-specific documents before starting an application. Having these details
                ready reduces unnecessary delays and makes it easier to review each requirement
                before submission.
              </p>

              <h2 className="mt-12 font-display text-3xl font-extrabold tracking-[-.045em] text-[var(--fm-text-primary)] sm:text-4xl">
                Choose the right account or structure
              </h2>
              <p className="mt-4 leading-8">
                Separate personal and business activity, understand who will own the entity, and
                confirm the requirements of the provider or jurisdiction involved. The right choice
                depends on your business model, ownership, location, and intended activity.
              </p>

              <h2 className="mt-12 font-display text-3xl font-extrabold tracking-[-.045em] text-[var(--fm-text-primary)] sm:text-4xl">
                Keep compliance visible
              </h2>
              <p className="mt-4 leading-8">
                Formation is only the beginning. Maintain records, monitor recurring obligations,
                and keep your business information current. A simple compliance calendar can help
                you stay aware of filing dates and other ongoing responsibilities.
              </p>
            </div>

            <Card
              variant="interactive"
              tone="default"
              className="mt-12 border-[var(--fm-lime)]/20 p-6 sm:p-8"
            >
              <div className="flex gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-[var(--fm-radius-md)] border border-[var(--fm-lime)]/25 bg-[var(--fm-lime)]/10 text-[var(--fm-lime)]">
                  <BookOpen className="h-5 w-5" weight="duotone" />
                </div>
                <div>
                  <div className="fm-label text-[10px]">Educational resource</div>
                  <p className="mt-2 text-sm leading-6 text-[var(--fm-card-muted)]">
                    This guide is provided for general educational purposes and is not legal, tax,
                    or financial advice. Requirements can vary by jurisdiction and individual
                    circumstances.
                  </p>
                </div>
              </div>
            </Card>
          </article>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <Card variant="elevated" tone="default" className="overflow-hidden p-0">
              <div className="bg-[var(--fm-lime)] p-6 text-[var(--fm-graphite-deep)]">
                <Sparkle className="h-6 w-6" weight="duotone" />
                <div className="mt-8 font-mono text-[10px] font-bold uppercase tracking-[.16em] opacity-60">
                  Ready to move?
                </div>
                <h2 className="mt-2 font-display text-2xl font-extrabold tracking-[-.04em]">
                  Explore the next step.
                </h2>
              </div>
              <div className="p-6">
                <p className="text-sm leading-6 text-[var(--fm-text-secondary)]">
                  If you already know what you need, explore the services available for your
                  business.
                </p>
                <Button render={<Link href="/services" />} className="mt-6 w-full">
                  Explore services
                  <ArrowRight weight="bold" className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          </aside>
        </div>
      </section>
    </main>
  );
}
