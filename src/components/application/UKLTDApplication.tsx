"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { submitApplication } from "@/lib/api";

type DocumentReference = { id: string; file: File };

const businessActivities = [
  ["ecommerce", "E-commerce"],
  ["saas", "SaaS / Software"],
  ["agency", "Agency"],
  ["consulting", "Consulting"],
  ["trading", "Trading"],
  ["other", "Other"],
];

export default function UKLTDApplication() {
  const searchParams = useSearchParams();
  const [data, setData] = useState({
    business_activity: "",
    business_description: "",
    director_full_name: "",
    director_country: "",
    director_date_of_birth: "",
    preferred_company_name: "",
    email: "",
    phone: "",
    residential_address: "",
    residential_city: "",
    residential_state: "",
    residential_postal_code: "",
    residential_country: "",
  });
  const [directorIdentity, setDirectorIdentity] = useState<DocumentReference | null>(null);
  const [directorAddress, setDirectorAddress] = useState<DocumentReference | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const initialAnswers = (() => {
    try {
      const raw = searchParams.get("answers");
      return raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    } catch {
      return {};
    }
  })();

  const update = (key: string, value: string) =>
    setData((current) => ({ ...current, [key]: value }));

  const documentMetadata = (document: DocumentReference | null) =>
    document
      ? {
          id: document.id,
          name: document.file.name,
          type: document.file.type,
          size: document.file.size,
        }
      : null;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");
    setSubmitted(false);

    try {
      const formData = new FormData();
      formData.append(
        "application",
        JSON.stringify({
          service: "uk-ltd",
          data: {
            ...data,
            packageSlug: searchParams.get("package") ?? "",
            virtual_bank_provider:
              typeof initialAnswers.virtual_bank_provider === "string"
                ? initialAnswers.virtual_bank_provider
                : "",
          },
          documents: {
            director: {
              identity_document: documentMetadata(directorIdentity),
              address_document: documentMetadata(directorAddress),
            },
          },
        }),
      );

      if (directorIdentity) formData.append("director_identity_document", directorIdentity.file);
      if (directorAddress) formData.append("director_address_document", directorAddress.file);

      await submitApplication(formData);
      setSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to submit your application. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="fm-application-page">
      <div className="fm-application-container">
        <header className="fm-application-page-header">
          <div className="fm-application-header-badge">
            <span className="fm-application-header-badge-text">UK LTD / Application</span>
          </div>
          <h1 className="fm-application-title">Complete your application.</h1>
          <p className="fm-application-description">
            One page. Everything we need to prepare your UK LTD formation is collected below.
          </p>
        </header>

        <form onSubmit={submit} className="fm-application-form">
          <Section title="Business details">
            <div className="grid gap-5 md:grid-cols-2">
              <Select
                label="Business activity"
                value={data.business_activity}
                onChange={(v) => update("business_activity", v)}
                required
                options={businessActivities}
                className="fm-application-select"
              />
              <Textarea
                label="Business details"
                value={data.business_description}
                onChange={(v) => update("business_description", v)}
                required
              />
            </div>
          </Section>

          <Section title="Director information">
            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Full legal name"
                value={data.director_full_name}
                onChange={(v) => update("director_full_name", v)}
                required
              />
              <Input
                label="Country of residence"
                value={data.director_country}
                onChange={(v) => update("director_country", v)}
                required
              />
              <Input
                label="Date of birth"
                type="date"
                value={data.director_date_of_birth}
                onChange={(v) => update("director_date_of_birth", v)}
                required
              />
            </div>
          </Section>

          <Section title="Company details">
            <Input
              label="LTD name"
              value={data.preferred_company_name}
              onChange={(v) => update("preferred_company_name", v)}
              required
            />
          </Section>

          <Section title="Contact information">
            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Email address"
                type="email"
                value={data.email}
                onChange={(v) => update("email", v)}
                required
              />
              <Input
                label="Contact number"
                type="tel"
                value={data.phone}
                onChange={(v) => update("phone", v)}
                required
              />
            </div>
          </Section>

          <Section title="Residential address">
            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label="Residential address"
                value={data.residential_address}
                onChange={(v) => update("residential_address", v)}
                required
              />
              <Input
                label="City"
                value={data.residential_city}
                onChange={(v) => update("residential_city", v)}
                required
              />
              <Input
                label="State / Province"
                value={data.residential_state}
                onChange={(v) => update("residential_state", v)}
                required
              />
              <Input
                label="Postal code"
                value={data.residential_postal_code}
                onChange={(v) => update("residential_postal_code", v)}
                required
              />
              <Input
                label="Country"
                value={data.residential_country}
                onChange={(v) => update("residential_country", v)}
                required
              />
            </div>
          </Section>

          <Section title="Required documents">
            <div className="grid gap-5 md:grid-cols-2">
              <FileInput
                label="Director identity document"
                onChange={(file) =>
                  setDirectorIdentity(file ? { id: `doc_${crypto.randomUUID()}`, file } : null)
                }
              />
              <FileInput
                label="Proof of residential address"
                onChange={(file) =>
                  setDirectorAddress(file ? { id: `doc_${crypto.randomUUID()}`, file } : null)
                }
              />
            </div>
          </Section>

          {submitError && (
            <div role="alert" aria-live="assertive" className="fm-application-error">
              <strong>Application submission failed.</strong>
              <span className="ml-1">{submitError}</span>
            </div>
          )}
          {submitted && (
            <p className="fm-application-success">Application submitted successfully.</p>
          )}
          <button type="submit" disabled={isSubmitting} className="fm-application-submit">
            {isSubmitting ? "Submitting..." : "Submit application"}
          </button>
        </form>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="fm-application-section">
      <div className="fm-application-section-header">
        <span className="fm-application-section-accent" />
        <h2 className="fm-application-section-title">{title}</h2>
      </div>
      <div className="fm-application-section-content">{children}</div>
    </section>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="fm-application-label">{label}</span>
      <input
        required={required}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="fm-application-input"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="fm-application-label">{label}</span>
      <textarea
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="fm-application-input fm-application-textarea"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  required = false,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[][];
  required?: boolean;
  className?: string;
}) {
  return (
    <label className="block">
      <span className="fm-application-label">{label}</span>
      <select
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={className ? `fm-application-input ${className}` : "fm-application-input"}
      >
        <option value="">Select</option>
        {options.map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}

function FileInput({ label, onChange }: { label: string; onChange: (file: File | null) => void }) {
  return (
    <label className="block">
      <span className="fm-application-label">{label}</span>
      <input
        type="file"
        required
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        className="fm-application-file"
      />
    </label>
  );
}
