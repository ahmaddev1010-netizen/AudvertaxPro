import StateExplorerSection from "@/components/StateExplorerSection";
import { Card, IconContainer, SectionLabel } from "@/components/ui/design-system";

export const metadata = {
  title: "USA LLC Formation | Audvertax",
  description:
    "Form a U.S. LLC remotely with guided formation support, state selection and business setup services.",
};

export default function USALLCPage() {
  return (
    <main className="bg-[var(--fm-graphite-deep)] text-[var(--fm-text-primary)]">
      <section className="fm-page-hero border-b border-[var(--fm-border)]">
        <div className="fm-page-container grid gap-12 px-6 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <SectionLabel>USA LLC Formation</SectionLabel>
            <h1 className="fm-page-hero-title max-w-3xl">
              Start your U.S. business from anywhere.
            </h1>
            <p className="fm-page-hero-description max-w-2xl">
              Form your U.S. LLC through a guided application and get the essential business
              services you need to move from formation to operation.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--fm-text-tertiary)]">
              <span>✓ Guided application</span>
              <span>✓ Remote-friendly process</span>
              <span>✓ Formation support</span>
            </div>
          </div>
          <Card variant="feature" className="p-5 md:p-7">
            <div className="rounded-[var(--fm-radius-lg)] border border-[var(--fm-border)] bg-[var(--fm-surface-raised)] p-6">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--fm-lime)]">
                Formation journey
              </p>
              <div className="mt-6 space-y-1">
                {[
                  "Choose your package",
                  "Select your state",
                  "Complete your application",
                  "Review and checkout",
                  "Track your order",
                ].map((title, index) => (
                  <div
                    key={title}
                    className="flex items-center gap-4 border-l border-[var(--fm-border)] py-3 pl-4 first:border-[var(--fm-lime)]"
                  >
                    <span className="font-mono text-[11px] font-bold text-[var(--fm-lime)]">
                      0{index + 1}
                    </span>
                    <span className="text-sm font-medium text-[var(--fm-text-primary)]">
                      {title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      <StateExplorerSection />

      <section className="fm-page-section">
        <div className="fm-page-container px-6 md:px-8">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <SectionLabel>Beyond formation</SectionLabel>
              <h2 className="fm-page-section-heading">
                Build your business stack after formation.
              </h2>
              <p className="mt-5 text-fm-body text-[var(--fm-text-secondary)]">
                Your LLC is the foundation. Add the services you actually need as your business
                grows.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "EIN assistance",
                "Registered agent",
                "Business address",
                "Operating agreement",
                "Business banking",
                "Payment gateway",
              ].map((item) => (
                <Card key={item} className="p-4">
                  <div className="flex items-center gap-3">
                    <IconContainer className="size-8 rounded-[var(--fm-radius-pill)] text-xs">
                      ✓
                    </IconContainer>
                    <span className="text-sm font-medium text-[var(--fm-text-primary)]">
                      {item}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--fm-border)] bg-[var(--fm-surface)]">
        <div className="fm-page-container px-6 py-20 text-center md:px-8">
          <SectionLabel>Ready to begin?</SectionLabel>
          <h2 className="fm-page-section-heading mt-3 md:text-5xl">
            Ready to start your U.S. business?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[var(--fm-text-secondary)] md:text-base">
            Complete the guided application and move from business idea to company formation.
          </p>
          <a
            href="/application?service=usa-llc"
            className="mt-8 inline-flex rounded-[var(--fm-radius-pill)] bg-[var(--fm-lime)] px-6 py-3 text-sm font-semibold text-[var(--fm-graphite-deep)]"
          >
            Start your USA LLC →
          </a>
        </div>
      </section>
    </main>
  );
}
