"use client";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { submitApplication } from "@/lib/api";

type Variant = "itin" | "resident" | "non-resident";
const details = {
  itin: {
    title: "ITIN",
    service: "itin-processing",
    variant: "itin",
    price: 150,
    description: "ITIN application support for eligible applicants.",
  },
  resident: {
    title: "International EIN — Resident",
    service: "ein-without-ssn",
    variant: "resident",
    price: 10,
    description: "International EIN support for the resident pathway.",
  },
  "non-resident": {
    title: "International EIN — Non-Resident",
    service: "ein-without-ssn",
    variant: "non-resident",
    price: 25,
    description: "International EIN support for the non-resident pathway.",
  },
} as const;

type FormState = {
  legal_full_name: string;
  email: string;
  phone: string;
  whatsapp: string;
  articles_available: string;
  ein_form_available: string;
  formation_document_type: string;
};
const initialForm: FormState = {
  legal_full_name: "",
  email: "",
  phone: "",
  whatsapp: "",
  articles_available: "",
  ein_form_available: "",
  formation_document_type: "",
};

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--fm-border)] bg-[var(--fm-surface)] p-6 sm:p-8">
      <div className="mb-7 border-l-4 border-[var(--fm-lime)] pl-4">
        <h2 className="text-2xl font-bold tracking-[-.03em] text-[var(--fm-text-primary)]">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--fm-text-secondary)]">{description}</p>
      </div>
      {children}
    </section>
  );
}
function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[var(--fm-text-primary)]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        required
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-14 w-full rounded-xl border border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] px-4 text-base text-[var(--fm-text-primary)] outline-none transition focus:border-[var(--fm-lime)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--fm-lime)_28%,transparent)]"
      />
    </label>
  );
}
function RadioCard({
  label,
  value,
  checked,
  onChange,
}: {
  label: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] p-4 text-sm text-[var(--fm-text-primary)] transition hover:border-[var(--fm-lime)]">
      <input
        type="radio"
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        required
      />
      <span>{label}</span>
    </label>
  );
}
function FileInput({
  label,
  required = false,
  onChange,
}: {
  label: string;
  required?: boolean;
  onChange: (file: File | null) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-[var(--fm-text-primary)]">
        {label}
      </span>
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        required={required}
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
        className="w-full rounded-xl border border-dashed border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] p-4 text-sm text-[var(--fm-text-secondary)] file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--fm-lime)] file:px-4 file:py-2 file:font-semibold file:text-[var(--fm-graphite-deep)]"
      />
    </label>
  );
}

export default function USATaxationApplication() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const service =
    searchParams.get("service") ??
    (pathname.startsWith("/ein-without-ssn/application") ? "ein-without-ssn" : "itin-processing");
  const requestedVariant = searchParams.get("variant");
  const variant: Variant =
    service === "itin-processing"
      ? "itin"
      : requestedVariant === "non-resident"
        ? "non-resident"
        : "resident";
  const selected = details[variant];
  const [data, setData] = useState(initialForm);
  const [passport, setPassport] = useState<File | null>(null);
  const [articles, setArticles] = useState<File | null>(null);
  const [einForm, setEinForm] = useState<File | null>(null);
  const [formationDocument, setFormationDocument] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const update = (key: keyof FormState, value: string) =>
    setData((current) => ({ ...current, [key]: value }));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (variant === "itin" && !passport) return setError("Please upload your scanned passport.");
    if (variant !== "itin" && !data.formation_document_type)
      return setError("Please choose Articles of Organization or SS-4.");
    if (variant !== "itin" && !formationDocument)
      return setError("Please upload the selected EIN document.");
    if (variant === "itin" && data.articles_available === "yes" && !articles)
      return setError("Please upload your Articles of Organization.");
    if (variant === "itin" && data.ein_form_available === "yes" && !einForm)
      return setError("Please upload your EIN form.");

    const formData = new FormData();
    const applicationDocuments: Record<string, unknown> = {};
    const addDocument = (key: string, file: File | null) => {
      if (!file) return;
      const id = crypto.randomUUID();
      applicationDocuments[key] = {
        id,
        name: file.name,
        type: file.type,
        size: file.size,
      };
      formData.append("application_" + key, file);
    };
    if (variant === "itin") {
      addDocument("passport", passport);
      addDocument("articles_of_organization", articles);
      addDocument("ein_form", einForm);
    } else {
      addDocument(
        data.formation_document_type === "articles" ? "articles_of_organization" : "ss4",
        formationDocument,
      );
    }
    formData.append(
      "application",
      JSON.stringify({
        service: selected.service,
        data: {
          ...data,
          variant: selected.variant,
          price: selected.price,
        },
        documents: { application: applicationDocuments },
      }),
    );

    try {
      await submitApplication(formData);
      setSubmitted(true);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Application submission failed.",
      );
    }
  }

  if (submitted)
    return (
      <main className="fm-application-page">
        <div className="fm-application-container">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[var(--fm-lime)] text-xl font-black text-[var(--fm-graphite-deep)]">
            ✓
          </div>
          <p className="mt-6 font-mono text-xs font-bold uppercase tracking-[.16em] text-[var(--fm-lime-bright)]">
            Application received
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-[-.04em]">
            Your {selected.title} application is submitted.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[var(--fm-text-secondary)]">
            We have received your information and supporting documents for review.
          </p>
          <Link
            href="/usa-taxation"
            className="fm-page-action fm-page-action--outline mt-8 inline-flex"
          >
            Back to USA taxation <ArrowRight className="size-4" />
          </Link>
        </div>
      </main>
    );

  return (
    <main className="min-h-screen bg-[var(--fm-graphite-deep)] px-5 py-12 text-[var(--fm-text-primary)] sm:px-8 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10">
          <Link
            href="/usa-taxation"
            className="font-mono text-[11px] font-bold uppercase tracking-[.08em] text-[var(--fm-lime)]"
          >
            ← USA / Taxation
          </Link>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[.16em] text-[var(--fm-lime-bright)]">
                Application
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-[-.045em] sm:text-5xl">
                {selected.title}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[var(--fm-text-secondary)]">
                {selected.description}
              </p>
            </div>
            <div className="rounded-xl border border-[var(--fm-border)] bg-[var(--fm-surface)] px-5 py-4 text-right">
              <span className="block text-xs uppercase tracking-wider text-[var(--fm-text-tertiary)]">
                Service fee
              </span>
              <strong className="mt-1 block text-3xl">$ {selected.price}</strong>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="fm-application-form">
          <Section
            title="Applicant Information"
            description="Provide the legal and contact details required for this U.S. tax service."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Legal full name"
                value={data.legal_full_name}
                onChange={(v) => update("legal_full_name", v)}
                placeholder="Your full legal name"
              />
              <Input
                label="Email address"
                type="email"
                value={data.email}
                onChange={(v) => update("email", v)}
                placeholder="you@example.com"
              />
              <Input
                label="Phone number"
                value={data.phone}
                onChange={(v) => update("phone", v)}
                placeholder="+1 555 000 0000"
              />
              <Input
                label="WhatsApp number"
                value={data.whatsapp}
                onChange={(v) => update("whatsapp", v)}
                placeholder="+1 555 000 0000"
              />
            </div>
          </Section>
          {variant === "itin" ? (
            <Section
              title="ITIN Supporting Documents"
              description="Tell us which optional supporting documents you have available, then upload them when applicable."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-3 text-sm font-semibold">Articles of Organization available?</p>
                  <div className="space-y-3">
                    <RadioCard
                      label="Yes"
                      value="yes"
                      checked={data.articles_available === "yes"}
                      onChange={(v) => update("articles_available", v)}
                    />
                    <RadioCard
                      label="No"
                      value="no"
                      checked={data.articles_available === "no"}
                      onChange={(v) => update("articles_available", v)}
                    />
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-sm font-semibold">EIN form available?</p>
                  <div className="space-y-3">
                    <RadioCard
                      label="Yes"
                      value="yes"
                      checked={data.ein_form_available === "yes"}
                      onChange={(v) => update("ein_form_available", v)}
                    />
                    <RadioCard
                      label="No"
                      value="no"
                      checked={data.ein_form_available === "no"}
                      onChange={(v) => update("ein_form_available", v)}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-5">
                <FileInput label="Scanned passport" required onChange={setPassport} />
                {data.articles_available === "yes" && (
                  <FileInput label="Articles of Organization" required onChange={setArticles} />
                )}
                {data.ein_form_available === "yes" && (
                  <FileInput label="EIN form" required onChange={setEinForm} />
                )}
              </div>
            </Section>
          ) : (
            <Section
              title="EIN Document"
              description="Choose the document you will provide and upload it below."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <RadioCard
                  label="Articles of Organization"
                  value="articles"
                  checked={data.formation_document_type === "articles"}
                  onChange={(v) => update("formation_document_type", v)}
                />
                <RadioCard
                  label="SS-4"
                  value="ss4"
                  checked={data.formation_document_type === "ss4"}
                  onChange={(v) => update("formation_document_type", v)}
                />
              </div>
              <div className="mt-6">
                <FileInput
                  label={
                    data.formation_document_type === "articles"
                      ? "Articles of Organization"
                      : "SS-4"
                  }
                  required
                  onChange={setFormationDocument}
                />
              </div>
            </Section>
          )}
          {error && (
            <p className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[var(--fm-lime)] px-6 text-base font-bold text-[var(--fm-graphite-deep)] transition hover:bg-[var(--fm-lime-bright)]"
          >
            Submit {selected.title} application <ArrowUpRight className="size-4" />
          </button>
        </form>
      </div>
    </main>
  );
}
