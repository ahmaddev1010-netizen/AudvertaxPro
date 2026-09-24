"use client";

import { useState, type FormEvent } from "react";
import { submitApplication } from "@/lib/api";

type Doc = { id: string; file: File };

export default function UKAddressApplication() {
  const [data, setData] = useState({
    full_legal_name: "",
    ltd_name: "",
    email: "",
    contact_no: "",
    residential_address: "",
  });
  const [passport, setPassport] = useState<Doc | null>(null);
  const [bank, setBank] = useState<Doc | null>(null);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const update = (k: keyof typeof data, v: string) => setData((x) => ({ ...x, [k]: v }));
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitted(false);
    if (Object.values(data).some((v) => !v.trim()) || !passport || !bank) {
      setError("Please complete all required fields and upload all required documents.");
      return;
    }
    setBusy(true);
    try {
      const documents = {
        applicant: {
          identity_document: {
            id: passport.id,
            name: passport.file.name,
            type: passport.file.type,
            size: passport.file.size,
          },
          address_document: {
            id: bank.id,
            name: bank.file.name,
            type: bank.file.type,
            size: bank.file.size,
          },
        },
      };
      const fd = new FormData();
      fd.append("application", JSON.stringify({ service: "uk-address", data, documents }));
      fd.append("application_passport", passport.file, passport.id);
      fd.append("application_bank_statement", bank.file, bank.id);
      await submitApplication(fd);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to submit application.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="fm-application-page">
      <div className="fm-application-container">
        <header className="fm-application-page-header">
          <p className="fm-application-header-badge-text">UK business services</p>
          <h1 className="mt-4 font-display text-fm-hero font-bold tracking-[-.06em] text-[var(--fm-text-primary)]">
            UK Address
          </h1>
          <p className="fm-application-description">
            Provide the legal and LTD details required for your one-year UK address service.
          </p>
        </header>
        <form onSubmit={onSubmit} className="fm-application-form">
          <section className="fm-application-section">
            <h2 className="fm-application-section-title">Address service details</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {(
                [
                  ["full_legal_name", "Full legal name", "text"],
                  ["ltd_name", "LTD name", "text"],
                  ["email", "Email address", "email"],
                  ["contact_no", "Contact number", "tel"],
                ] as const
              ).map(([k, l, t]) => (
                <label key={k}>
                  <span className="fm-application-label">{l}</span>
                  <input
                    type={t}
                    value={data[k]}
                    onChange={(e) => update(k, e.target.value)}
                    required
                    className="fm-application-input"
                  />
                </label>
              ))}
              <label className="sm:col-span-2">
                <span className="fm-application-label">Residential address</span>
                <textarea
                  value={data.residential_address}
                  onChange={(e) => update("residential_address", e.target.value)}
                  required
                  rows={4}
                  className="fm-application-input fm-application-textarea"
                />
              </label>
            </div>
          </section>
          <section className="fm-application-section">
            <h2 className="fm-application-section-title">Required documents</h2>
            <div className="mt-6 grid gap-5">
              {(
                [
                  ["Passport", passport, setPassport],
                  ["Bank statement", bank, setBank],
                ] as const
              ).map(([label, value, setter]) => (
                <label key={label}>
                  <span className="fm-application-label">{label}</span>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    required
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      setter(f ? { id: crypto.randomUUID(), file: f } : null);
                    }}
                    className="fm-application-file"
                  />
                  {value && <span className="fm-application-file-hint">{value.file.name}</span>}
                </label>
              ))}
            </div>
          </section>
          {error && <p className="fm-application-error"></p>}
          {submitted && (
            <p className="fm-application-success">Your application has been submitted.</p>
          )}
          <button type="submit" disabled={busy} className="fm-application-submit">
            {busy ? "Submitting…" : "Submit application →"}
          </button>
        </form>
      </div>
    </main>
  );
}
