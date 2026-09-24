"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { submitApplication } from "@/lib/api";

const fields = [
  ["full_legal_name", "Full legal name", "text"],
  ["ltd_name", "LTD name", "text"],
  ["email", "Email address", "email"],
  ["contact_no", "Contact number", "tel"],
  ["companies_house_login_email", "Companies House login email", "email"],
  ["companies_house_login_password", "Companies House login password", "password"],
  ["director_personal_code", "Director personal code", "text"],
] as const;

export default function UKConfirmationStatementApplication() {
  const [data, setData] = useState<Record<string, string>>({});
  const [ltdAddress, setLtdAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const update = (key: string, value: string) =>
    setData((current) => ({ ...current, [key]: value }));

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitted(false);

    if (fields.some(([key]) => !data[key]?.trim()) || !ltdAddress.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        service: "uk-confirmation-statement",
        data: {
          ...data,
          ltd_address: ltdAddress,
        },
        documents: {},
      };
      const formData = new FormData();
      formData.append("application", JSON.stringify(payload));
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
          <p className="fm-application-header-badge-text">UK LTD compliance</p>
          <h1 className="mt-4 font-display text-fm-hero font-bold tracking-[-.06em] text-[var(--fm-text-primary)]">
            Confirmation Statement
          </h1>
          <p className="fm-application-description">
            Provide the company and Companies House details required for your confirmation statement
            filing.
          </p>
        </header>

        <form onSubmit={onSubmit} className="fm-application-form">
          <section className="fm-application-section">
            <h2 className="fm-application-section-title">Confirmation statement details</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {fields.map(([key, label, type]) => (
                <label
                  key={key}
                  className={key === "companies_house_login_password" ? "sm:col-span-2" : ""}
                >
                  <span className="fm-application-label">{label}</span>
                  <input
                    type={type}
                    value={data[key] ?? ""}
                    onChange={(event: ChangeEvent<HTMLInputElement>) =>
                      update(key, event.target.value)
                    }
                    required
                    className="fm-application-input"
                    autoComplete={type === "password" ? "off" : undefined}
                  />
                </label>
              ))}
              <label className="sm:col-span-2">
                <span className="fm-application-label">LTD address</span>
                <textarea
                  value={ltdAddress}
                  onChange={(event) => setLtdAddress(event.target.value)}
                  required
                  rows={4}
                  className="fm-application-input fm-application-textarea"
                />
              </label>
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
