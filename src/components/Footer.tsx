import Link from "next/link";
import { BadgeCheck } from "lucide-react";

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon fill="var(--fm-graphite-deep)" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
    </svg>
  );
}

const COLUMNS = [
  {
    title: "Formation",
    links: [
      { label: "LLC Formation", href: "/services/usa-llc" },
      { label: "EIN, without SSN", href: "/services/ein-without-ssn" },
      { label: "ITIN Processing", href: "/services/itin-processing" },
      { label: "All Services", href: "/services" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Registered Agent", href: "/services/registered-agent-us-address" },
      { label: "Annual Report", href: "/services/annual-report" },
      { label: "Bank Account Setup", href: "/services/us-business-banking" },
      { label: "Payment Gateways", href: "/services/payment-gateway-setup" },
      { label: "Wise Trading Address", href: "/services/wise-trading-address" },
      { label: "Trademark", href: "/services/trademark" },
      { label: "Website", href: "/services/website" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Why Audvertax", href: "/about" },
      { label: "How It Works", href: "/get-started" },
      { label: "Pricing", href: "/pricing" },
      { label: "State Explorer", href: "/state-explorer" },
      { label: "Resources & Blog", href: "/resources" },
      { label: "Testimonials", href: "/testimonials" },
    ],
  },
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/services" },
      { label: "About Us", href: "/about" },
      { label: "Compliance", href: "/services/compliance-renewals" },
      { label: "Contact", href: "/contact" },
    ],
  },
];
const SUPPORT_LINKS = [
  { label: "Contact Us", href: "/contact" },
  { label: "Cancellation Policy", href: "/cancellation-policy" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Cookie Policy", href: "/cookie-policy" },
  { label: "Cookie Settings", href: "/cookie-settings" },
];
const socialClass =
  "grid h-9 w-9 place-items-center rounded-full border border-[var(--fm-border)] text-[var(--fm-text-secondary)] transition-colors hover:bg-[var(--fm-surface-raised)] hover:text-[var(--fm-text-primary)]";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] font-display text-[var(--fm-text-secondary)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--fm-lime)]/50 to-transparent" />
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-x-8 gap-y-10 px-6 pb-12 pt-[72px] sm:grid-cols-3 lg:grid-cols-5 lg:px-12">
        {COLUMNS.map((col) => (
          <div key={col.title} className="flex flex-col">
            <p className="mb-[18px] text-sm font-bold text-[var(--fm-text-primary)]">{col.title}</p>
            <ul className="flex flex-col gap-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[13.5px] text-[var(--fm-text-secondary)] transition-colors hover:text-[var(--fm-text-primary)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="col-span-2 flex flex-col sm:col-span-3 lg:col-span-1">
          <p className="mb-[18px] text-sm font-bold text-[var(--fm-text-primary)]">Support</p>
          <div className="mb-4 flex flex-col gap-2.5">
            <p className="text-[13px] leading-relaxed text-[var(--fm-text-secondary)]">
              Support is available
              <br />
              Mon to Fri from 9 a.m. to 6 p.m. PKT
            </p>
            <a
              href="tel:+923164466335"
              className="text-[13.5px] font-semibold text-[var(--fm-text-primary)]/85 hover:text-[var(--fm-text-primary)]"
            >
              +92 316 4466335 <span>🇵🇰</span>
            </a>
            <a
              href="tel:+13074436354"
              className="text-[13.5px] font-semibold text-[var(--fm-text-primary)]/85 hover:text-[var(--fm-text-primary)]"
            >
              +1 307 4436354 <span>🇺🇸</span>
            </a>
            <a
              href="mailto:support@audvertax.pk"
              className="text-[13.5px] font-semibold text-[var(--fm-text-primary)]/85 hover:text-[var(--fm-text-primary)]"
            >
              support@audvertax.pk
            </a>
            <address className="text-[12.5px] not-italic leading-relaxed text-[var(--fm-text-tertiary)]">
              <span>Office No. 3, 2nd Floor, 29, HBL Plaza</span>
              <br />
              <span>Central Block, Central District</span>
              <br />
              <span>Bahria Orchard, Lahore, 55150</span>
            </address>
            <div className="my-1 h-px w-full bg-[var(--fm-border)]" />
          </div>
          <ul className="flex flex-col gap-3">
            {SUPPORT_LINKS.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="text-[13.5px] text-[var(--fm-text-secondary)] transition-colors hover:text-[var(--fm-text-primary)]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 border-t border-[var(--fm-border)] px-6 py-6 lg:px-12">
        <span className="text-sm font-bold text-[var(--fm-text-primary)]">
          Get the Audvertax app
        </span>
        <div className="flex flex-wrap gap-3">
          {["Google Play", "App Store"].map((name) => (
            <button
              key={name}
              type="button"
              disabled
              aria-disabled="true"
              className="flex cursor-not-allowed items-center gap-2.5 rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-surface)] px-4 py-2.5 opacity-80"
            >
              <span className="grid h-7 w-7 place-items-center rounded-[var(--fm-radius-sm)] bg-[var(--fm-surface-raised)] text-[11px] font-bold text-[var(--fm-text-primary)]">
                {name === "Google Play" ? "▶" : "🍎"}
              </span>
              <span className="flex flex-col text-left leading-tight">
                <span className="text-[12.5px] font-semibold text-[var(--fm-text-primary)]">
                  {name}
                </span>
                <span className="text-[10.5px] text-[var(--fm-text-tertiary)]">Coming Soon</span>
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 border-t border-[var(--fm-border)] px-6 py-8 lg:px-12">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <a
              href="https://www.instagram.com/audvertax.pk/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className={socialClass}
            >
              <InstagramIcon />
            </a>
            <a
              href="https://www.facebook.com/ForeMintsolutionsllc/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className={socialClass}
            >
              <FacebookIcon />
            </a>
            <a
              href="https://pk.linkedin.com/company/foremint-pk"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className={socialClass}
            >
              <LinkedinIcon />
            </a>
            <a
              href="https://www.youtube.com/@ForeMint_official"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className={socialClass}
            >
              <YoutubeIcon />
            </a>
          </div>
          <div className="flex items-center gap-2 rounded-[var(--fm-radius-pill)] border border-[var(--fm-border)] bg-[var(--fm-surface)] px-4 py-2 text-[13px] text-[var(--fm-text-secondary)]">
            <BadgeCheck className="h-4 w-4 flex-shrink-0" />
            <span>
              Official Pakistan partner of{" "}
              <strong className="text-[var(--fm-text-primary)]">Sunrate</strong> &amp;{" "}
              <strong className="text-[var(--fm-text-primary)]">Airwallex</strong>
            </span>
          </div>
        </div>
        <p className="max-w-[820px] text-[12.5px] leading-relaxed text-[var(--fm-text-tertiary)]">
          Audvertax is NOT a law firm and does NOT provide legal advice. Use of our products and
          services is governed by our{" "}
          <Link href="/terms-of-service" className="underline hover:text-[var(--fm-text-primary)]">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="underline hover:text-[var(--fm-text-primary)]">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--fm-border)] pt-6">
          <a
            href="https://www.trustpilot.com/review/audvertax.pk"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[var(--fm-text-primary)]/80"
            aria-label="Trustpilot: Excellent 4.8 out of 5"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--fm-lime)">
              <path d="M12 2l2.93 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 7.07-1.01z" />
            </svg>
            <span className="text-sm font-semibold">Trustpilot</span>
            <span className="tracking-[1px] text-[var(--fm-lime)]">★★★★★</span>
            <span className="text-sm">Excellent</span>
            <span className="text-[13px] text-[var(--fm-text-tertiary)]">4.8 out of 5</span>
          </a>
          <p className="text-[13px] text-[var(--fm-text-tertiary)]">
            © 2026 Audvertax Solutions LLC. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
