import Image from "next/image";
import { Card, SectionLabel } from "@/components/ui/design-system";

type CardData = {
  title: string;
  quote: string;
  solution: string;
  tint: "peach" | "blue" | "violet";
  rotate: number;
};

const CARDS: CardData[] = [
  {
    title: "USA",
    quote: "MISSING DEADLINES FEARS, FEARING IRS PENALTIES",
    solution:
      "AudVertax providing complete US corporate and non-resident filing. We handle IRS returns and state annual reports.",
    tint: "blue",
    rotate: -3,
  },
  {
    title: "United Kingdom (HMRC)",
    quote: "Stuck on HMRC & Identity Verification",
    solution:
      "AudVertax providing end-to-end UK tax returns, Corporation Tax (CT600), VAT filings, and confirmation statements tailored for global directors and non-resident founders.",
    tint: "violet",
    rotate: 2,
  },
  {
    title: "United Arab Emirates (FTA)",
    quote: "Confused by UAE Corporate Tax & VAT Thresholds",
    solution:
      "FTA-compliant Corporate Tax filing, registration, and VAT management for Free Zone and Mainland entities, keeping your offshore or onshore operations fully shielded.",
    tint: "peach",
    rotate: -2,
  },
  {
    title: "Pakistan (FBR)",
    quote: "FBR Compliance & Cross-Border Remittances",
    solution:
      "Precision FBR income tax returns, ATL restoration, and foreign source income documentation, ensuring seamless profit repatriation and zero tax audit friction.",
    tint: "blue",
    rotate: 3,
  },
  {
    title: "MULTI JURISDICTION",
    quote: "Drowning in Double Taxation Risks",
    solution:
      "Strategic international tax structuring and treaty relief application. We align your US, UK, UAE, and Pakistan filings to legally minimize global tax liabilities.",
    tint: "violet",
    rotate: -3,
  },
  {
    title: "Fragmented Advisory",
    quote: "Too Many Local Tax Agents to Manage",
    solution:
      "One unified tax partner. Access direct WhatsApp communication, single-point account management, and standardized global tax filing across all your active jurisdictions.",
    tint: "peach",
    rotate: 2,
  },
];

const TINTS: Record<CardData["tint"], { strong: string; soft: string; marble: string }> = {
  peach: {
    strong: "var(--fm-card-tint-peach-strong)",
    soft: "var(--fm-card-tint-peach-soft)",
    marble: "var(--fm-card-tint-peach-marble)",
  },
  blue: {
    strong: "var(--fm-card-tint-blue-strong)",
    soft: "var(--fm-card-tint-blue-soft)",
    marble: "var(--fm-card-tint-blue-marble)",
  },
  violet: {
    strong: "var(--fm-card-tint-peach-strong)",
    soft: "var(--fm-card-tint-peach-soft)",
    marble: "var(--fm-card-tint-peach-marble)",
  },
};

export default function ProblemsSolutions() {
  return (
    <section
      aria-labelledby="ps-heading"
      className="relative flex w-full flex-col items-center overflow-hidden bg-[var(--fm-graphite)] px-4 py-24 text-[var(--fm-text-primary)]"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(60% 45% at 50% -6%, color-mix(in srgb, var(--fm-lime) 10%, transparent) 0%, transparent 60%), radial-gradient(40% 40% at 88% 6%, color-mix(in srgb, var(--fm-lime) 6%, transparent) 0%, transparent 65%), radial-gradient(45% 45% at 8% 18%, color-mix(in srgb, var(--fm-lime) 4%, transparent) 0%, transparent 65%), radial-gradient(50% 40% at 50% 104%, color-mix(in srgb, var(--fm-lime) 5%, transparent) 0%, transparent 62%)",
          maskImage: "linear-gradient(transparent 0%, #000 14% 84%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(transparent 0%, #000 14% 84%, transparent 100%)",
        }}
      />
      <div className="relative z-[2] flex w-full flex-col items-center text-center">
        <SectionLabel>Problems &amp; Solutions</SectionLabel>
        <h2
          id="ps-heading"
          className="mx-auto mt-4 max-w-3xl font-display text-fm-section font-extrabold tracking-[-.025em] text-[var(--fm-text-primary)]"
        >
          Real Problems.
          <br />
          Real Audvertax Solutions.
        </h2>
        <p
          className="mx-auto mt-4 max-w-xl text-base text-[var(--fm-text-secondary)]"
          style={{ fontSize: "clamp(15px, 2.4vw, 18px)" }}
        >
          What founders actually tell us, and exactly how we fix it, end to end.
        </p>
      </div>
      <div className="relative z-[2] mx-auto mt-16 grid w-full max-w-[1180px] grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card) => {
          const tint = TINTS[card.tint];
          return (
            <Card
              key={card.title}
              variant="interactive"
              tone="dark"
              className="group relative mt-5 min-h-[280px] p-[26px] pt-[30px]"
              style={
                {
                  "--fm-card-tint-strong": tint.strong,
                  "--fm-card-tint-soft": tint.soft,
                  "--fm-card-marker": tint.marble,
                  "--fm-card-rotate": `${card.rotate}deg`,
                } as React.CSSProperties
              }
            >
              <span className="absolute -top-[19px] left-1/2 h-10 w-10 -translate-x-1/2 rounded-full bg-[var(--fm-lime-bright)] shadow-[var(--fm-card-marker-shadow)] transition-transform duration-[var(--fm-motion-component)] group-hover:-translate-y-1 group-hover:scale-110" />
              <h3
                className="font-display text-[22px] font-bold leading-tight text-[var(--fm-card-interactive-title)]"
                style={{ letterSpacing: "-0.3px" }}
              >
                {card.title}
              </h3>
              <p className="mt-2 font-display text-[13.5px] font-semibold italic leading-snug text-[var(--fm-card-interactive-quote)]">
                {card.quote}
              </p>
              <p className="mt-2 font-display text-sm leading-relaxed text-[var(--fm-card-interactive-body)]">
                {card.solution}
              </p>
            </Card>
          );
        })}
      </div>
      <div className="relative z-[2] mt-16 flex items-center gap-3">
        <Image
          src="/avatar_abd.svg"
          alt="Audvertax founder"
          width={46}
          height={46}
          className="h-[46px] w-[46px] rounded-full border-2 border-[var(--fm-border)] object-cover shadow-[var(--fm-shadow-subtle)]"
        />
        <p className="text-left font-display text-[15px] leading-snug text-[var(--fm-text-secondary)]">
          <span className="font-display text-[21px] font-bold text-[var(--fm-lime)]">
            Your all in
          </span>
          <br />
          Global setup partner.
        </p>
      </div>
    </section>
  );
}
