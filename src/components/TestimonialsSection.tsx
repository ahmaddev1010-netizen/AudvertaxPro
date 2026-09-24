import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Card, IconContainer, SectionLabel } from "@/components/ui/design-system";

type Testimonial = { quote: string; name: string; role: string; avatar?: string };
const ROW_ONE: Testimonial[] = [
  {
    quote:
      "The team was accommodating in answering all of my queries regarding LLC formation. I registered my company through them in Texas, and the process was smooth and fast. I would recommend Audvertax to anyone registering their company in the US.",
    name: "Abdullah Khan",
    role: "Founder, Pakistan",
  },
  {
    quote:
      "It was wonderful working with the team. Process was super smooth and team guided us briefly throughout the process. Would surely be recommending Audvertax to my friends and family.",
    name: "Kargoas",
    role: "Founder, Pakistan",
  },
  {
    quote:
      "My experience was really good regarding LLC Registration in Wyoming State. Their communication standard was really good and overall very satisfied with the operations.",
    name: "Waqas Ahmed",
    role: "Founder, Pakistan",
  },
];
const ROW_TWO: Testimonial[] = [
  {
    quote:
      "Great service, on time delivery, excellent customer service. Audvertax helped me get USA LLC Registration, EIN, Business Bank Accounts. Everything was delivered on time.",
    name: "Malik Kamal Akbar",
    role: "Founder, Pakistan",
  },
  {
    quote:
      "Amazing team and support, communication was top notch, I got my business complete US setup, plus got their Bank Account service as well. Good operations.",
    name: "Arslan Kamboh",
    role: "Founder, Pakistan",
  },
  {
    quote:
      "It was an excellent experience working with Audvertax team. They have completed my process very professionally and swiftly in Wyoming State. I am very satisfied.",
    name: "Rashid Khan",
    role: "Founder, Pakistan",
  },
  {
    quote:
      "Their customer service is great. If you're someone who is looking to get any of these services, I'd 100% recommend you to try Audvertax.",
    name: "Salman Ali",
    role: "Founder, Pakistan",
  },
  {
    quote:
      "Super fast LLC setup. They helped me get my Stripe account running within days. Totally transparent and very helpful throughout the journey.",
    name: "Fahad Mirza",
    role: "Founder, Pakistan",
  },
];
function TestimonialCard({ t }: { t: Testimonial }) {
  const initials = t.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <Card
      variant="interactive"
      className="flex w-[340px] flex-shrink-0 flex-col p-[26px] pb-6 sm:w-[380px]"
    >
      <span className="block h-[26px] font-display text-[56px] font-extrabold leading-[0.6] text-[var(--fm-lime)]/30">
        &ldquo;
      </span>
      <div className="mb-2.5 mt-3.5 flex gap-0.5 text-sm tracking-wide text-[var(--fm-lime)]">
        {"★★★★★"}
      </div>
      <blockquote className="mb-[22px] flex-1 font-display text-[15px] font-medium leading-relaxed text-[var(--fm-card-text)]">
        {t.quote}
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-3">
        {t.avatar ? (
          <Image
            src={t.avatar}
            alt={t.name}
            width={44}
            height={44}
            className="size-11 flex-shrink-0 rounded-full border-2 border-[var(--fm-lime)]/25 object-cover"
          />
        ) : (
          <IconContainer className="size-11 rounded-full bg-[var(--fm-lime)] text-[var(--fm-graphite-deep)]">
            {initials}
          </IconContainer>
        )}
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="font-display text-[15px] font-bold leading-tight text-[var(--fm-card-text)]">
            {t.name}
          </span>
          <span
            className="flex items-center gap-1.5 font-mono text-[10.5px] text-[var(--fm-card-muted)]"
            style={{ letterSpacing: "0.04em" }}
          >
            {t.role}
          </span>
        </div>
      </figcaption>
    </Card>
  );
}
function MarqueeRow({ items, reverse }: { items: Testimonial[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div
      className="group relative w-full overflow-hidden"
      style={{
        maskImage: "linear-gradient(90deg, transparent, #000 8% 92%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8% 92%, transparent)",
      }}
    >
      <div
        className="flex w-max gap-6 py-3.5 group-hover:[animation-play-state:paused]"
        style={{
          animation: `marqueeScroll ${reverse ? 64 : 56}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {doubled.map((t, i) => (
          <div key={`${t.name}-${i}`} className="flex flex-shrink-0">
            <TestimonialCard t={t} />
          </div>
        ))}
      </div>
    </div>
  );
}
export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="relative isolate overflow-hidden bg-[var(--fm-graphite)] py-24"
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(55%_45%_at_50%_0%,color-mix(in_srgb,var(--fm-lime)_5%,transparent),transparent_65%),radial-gradient(40%_40%_at_88%_60%,color-mix(in_srgb,var(--fm-lime)_4%,transparent),transparent_65%)]" />
      <div className="relative z-[1] mx-auto mb-14 max-w-[720px] px-6 text-center">
        <SectionLabel className="mb-[18px] inline-block">Testimonials</SectionLabel>
        <h2
          id="testimonials-heading"
          className="mb-[18px] font-display text-fm-section font-extrabold tracking-[-.025em] text-[var(--fm-text-primary)]"
        >
          Trusted by founders <span className="text-[var(--fm-lime)]">worldwide.</span>
        </h2>
        <p
          className="mx-auto max-w-[56ch] text-base font-medium text-[var(--fm-text-secondary)]"
          style={{ fontSize: "clamp(15px, 1.4vw, 18px)" }}
        >
          See how Audvertax is helping Pakistani entrepreneurs bank, get paid and scale globally.
        </p>
      </div>
      <div className="relative z-[1] flex flex-col gap-6">
        <MarqueeRow items={ROW_ONE} />
        <MarqueeRow items={ROW_TWO} reverse />
      </div>
      <div className="relative z-[1] mt-12 flex justify-center px-6">
        <a
          href="/testimonials"
          className="inline-flex items-center gap-2.5 rounded-[var(--fm-radius-pill)] border border-[var(--fm-border)] bg-[var(--fm-surface)] px-[26px] py-[13px] font-display text-[15.5px] font-semibold text-[var(--fm-text-primary)] backdrop-blur transition-[transform,background-color,border-color] duration-[var(--fm-motion-component)] hover:-translate-y-0.5 hover:border-[var(--fm-border-accent)] hover:bg-[var(--fm-surface-raised)]"
        >
          View all testimonials
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
