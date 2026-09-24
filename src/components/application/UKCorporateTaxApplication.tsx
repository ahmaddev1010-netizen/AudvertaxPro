"use client";

import { useState, type FormEvent } from "react";
import { submitApplication } from "@/lib/api";

export default function UKCorporateTaxApplication() {
  const [data, setData] = useState({
    full_legal_name: "",
    ltd_name: "",
    email: "",
    contact_no: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const update = (key: keyof typeof data, value: string) =>
    setData((current) => ({ ...current, [key]: value }));

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitted(false);

    if (Object.values(data).some((value) => !value.trim())) {
      setError("Please complete all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append(
        "application",
        JSON.stringify({
          service: "uk-corporate-tax",
          data,
          documents: {},
        }),
      );
      await submitApplication(formData);
      setSubmitted(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Unable to submit application.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="fm-application-page">
      <div className="fm-application-container">
        <header className="fm-application-page-header">
          <p className="fm-application-header-badge-text">UK taxation</p>
          <h1 className="mt-4 font-display text-fm-hero font-bold tracking-[-.06em] text-[var(--fm-text-primary)]">
            UK Corporate Tax Filing (CT600)
          </h1>
          <p className="fm-application-description">
            Provide your company and contact details for your UK Corporate Tax filing.
          </p>
        </header>

        <form onSubmit={onSubmit} className="fm-application-form">
          <section className="fm-application-section">
            <h2 className="fm-application-section-title">Corporate tax details</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {(
                [
                  ["full_legal_name", "Full legal name", "text"],
                  ["ltd_name", "LTD name", "text"],
                  ["email", "Email address", "email"],
                  ["contact_no", "Contact number", "tel"],
                ] as const
              ).map(([key, label, type]) => (
                <label key={key}>
                  <span className="fm-application-label">{label}</span>
                  <input
                    type={type}
                    value={data[key]}
                    onChange={(event) => update(key, event.target.value)}
                    required
                    className="fm-application-input"
                  />
                </label>
              ))}
            </div>
          </section>

          {error && <p className="fm-application-error">{error}</p>}
          {submitted && (
            <p className="fm-application-success">Your application has been submitted.</p>
          )}
          <button type="submit" disabled={isSubmitting} className="fm-application-submit">
            {isSubmitting ? "Submitting…" : "Submit application →"}
          </button>
        </form>
      </div>
    </main>
  );
}
