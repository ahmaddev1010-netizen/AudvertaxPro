import { notFound } from "next/navigation";
const docs: any = {
  "privacy-policy": [
    "Privacy Policy",
    [
      "Information we collect",
      "How information is used",
      "Sharing and service providers",
      "Security",
      "Retention",
      "Your choices",
      "International transfers",
      "Contact",
    ],
  ],
  terms: [
    "Terms of Service",
    [
      "Eligibility and accounts",
      "Services",
      "Payments",
      "Third-party providers",
      "Acceptable use",
      "Disclaimers",
      "Limitation of liability",
      "Governing terms",
    ],
  ],
  "refund-policy": [
    "Refund Policy",
    ["Eligibility", "Request process", "Non-refundable work", "Processing timelines", "Exceptions"],
  ],
  "cancellation-policy": [
    "Cancellation Policy",
    [
      "When cancellation is available",
      "Work already performed",
      "How to request cancellation",
      "Effect on third-party fees",
    ],
  ],
  "cookie-policy": [
    "Cookie Policy",
    ["What cookies are", "Essential cookies", "Analytics", "Preferences", "Managing cookies"],
  ],
  "cookie-settings": [
    "Cookie Settings",
    ["Essential cookies", "Analytics preference", "Save preferences"],
  ],
};
export function generateStaticParams() {
  return Object.keys(docs).map((slug) => ({ slug }));
}
export default async function Legal({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = docs[slug];
  if (!d) return notFound();
  return (
    <main className="legal">
      <div className="container">
        <article>
          <div className="eyebrow">Audvertax legal</div>
          <h1>{d[0]}</h1>
          {d[1].map((h: string, i: number) => (
            <section key={h}>
              <h2>
                {String(i + 1).padStart(2, "0")} {h}
              </h2>
              <p>
                This replica provides a representative legal-information layout. Production legal
                text should be supplied by the site owner and reviewed by qualified counsel before
                publication.
              </p>
            </section>
          ))}
        </article>
      </div>
    </main>
  );
}
