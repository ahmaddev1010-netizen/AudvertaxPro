"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import { register } from "@/lib/api";
import GuestGuard from "@/components/auth/GuestGuard";
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, SectionLabel } from "@/components/ui/design-system";
import { createApplicationSelection, validateApplicationSelection } from "@/lib/services";

const pendingKey = "audvertax.pendingApplicationSelection";

type PendingSelection = {
  serviceSlug: string;
  packageSlug?: string;
  jurisdictionSlug?: string;
  variantSlug?: string;
  addOnSlugs?: string[];
  initialAnswers?: Record<string, unknown>;
};

function SignupForm() {
  const router = useRouter();
  const { setAuthenticatedUser } = useAuth();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function continueAfterAuth() {
    const raw = window.sessionStorage.getItem(pendingKey);
    if (!raw) {
      router.replace("/dashboard");
      return;
    }

    try {
      const stored = JSON.parse(raw) as PendingSelection;
      const selection = createApplicationSelection({
        serviceSlug: stored.serviceSlug,
        packageSlug: stored.packageSlug,
        jurisdictionSlug: stored.jurisdictionSlug,
        variantSlug: stored.variantSlug,
        addOnSlugs: stored.addOnSlugs,
        initialAnswers: stored.initialAnswers,
      });
      if (!validateApplicationSelection(selection).valid) {
        window.sessionStorage.removeItem(pendingKey);
        router.replace("/dashboard");
        return;
      }
      window.sessionStorage.removeItem(pendingKey);
      const params = new URLSearchParams({ service: selection.serviceSlug });
      if (selection.packageSlug) params.set("package", selection.packageSlug);
      if (selection.jurisdictionSlug) params.set("state", selection.jurisdictionSlug);
      if (selection.variantSlug) params.set("variant", selection.variantSlug);
      if (selection.addOnSlugs.length) params.set("addons", selection.addOnSlugs.join(","));
      if (stored.initialAnswers && Object.keys(stored.initialAnswers).length)
        params.set("answers", JSON.stringify(stored.initialAnswers));
      router.replace(`/application?${params.toString()}`);
    } catch {
      window.sessionStorage.removeItem(pendingKey);
      router.replace("/dashboard");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await register(form);
      setAuthenticatedUser(response.data.user);
      await continueAfterAuth();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-[var(--fm-graphite-deep)] px-5 py-16 text-[var(--fm-text-primary)] sm:px-8 lg:py-24">
      <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(color-mix(in_srgb,var(--fm-lime)_7%,transparent)_1px,transparent_1px),linear-gradient(90deg,color-mix(in_srgb,var(--fm-lime)_7%,transparent)_1px,transparent_1px)] [background-size:64px_64px]" />
      <Card
        variant="feature"
        tone="dark"
        className="relative mx-auto grid w-full max-w-5xl overflow-hidden lg:grid-cols-[.88fr_1.12fr]"
      >
        <div className="relative hidden overflow-hidden border-r border-[var(--fm-card-border)] bg-[var(--fm-graphite-deep)] p-10 lg:flex lg:flex-col lg:justify-between lg:p-12">
          <div className="relative">
            <div className="mb-8 inline-flex items-center gap-2 rounded-[var(--fm-radius-pill)] border border-[var(--fm-lime)]/25 bg-[var(--fm-lime-soft)] px-3 py-1.5 font-mono text-[9px] font-bold tracking-[.16em] text-[var(--fm-lime)]">
              <span className="size-1.5 rounded-full bg-[var(--fm-lime)]" />
              AUDVERTAX / ACCOUNT
            </div>
            <h1 className="max-w-sm font-display text-4xl font-bold leading-[.98] tracking-[-.055em]">
              Build your account.{" "}
              <span className="text-[var(--fm-lime)]">Build your business.</span>
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-7 text-[var(--fm-text-secondary)]">
              Keep company formation applications, orders, payments, and documents connected to one
              secure account.
            </p>
          </div>
          <div className="relative flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.12em] text-[var(--fm-text-tertiary)]">
            <ShieldCheck className="h-5 w-5 text-[var(--fm-lime)]" />
            Protected account access
          </div>
        </div>

        <div className="bg-[var(--fm-surface-raised)] p-7 sm:p-10 lg:p-14">
          <div className="mb-8">
            <SectionLabel>Get started</SectionLabel>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-[-.04em] text-[var(--fm-text-primary)]">
              Create your Audvertax account
            </h2>
            <p className="mt-2 text-sm text-[var(--fm-text-secondary)]">
              It only takes a minute to set up your account.
            </p>
          </div>
          {error && (
            <div
              role="alert"
              className="mb-5 rounded-[var(--fm-radius-md)] border border-[var(--fm-danger)]/25 bg-[var(--fm-danger-soft)] px-4 py-3 text-sm text-[var(--fm-danger)]"
            >
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[.12em] text-[var(--fm-text-secondary)]">
                  First name
                </span>
                <input
                  value={form.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                  autoComplete="given-name"
                  required
                  placeholder="John"
                  className="w-full rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] px-4 py-3.5 text-sm text-[var(--fm-text-primary)] outline-none placeholder:text-[var(--fm-text-tertiary)] transition focus:border-[var(--fm-lime)] focus:ring-4 focus:ring-[var(--fm-lime-soft)]"
                />
              </label>
              <label className="block">
                <span className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[.12em] text-[var(--fm-text-secondary)]">
                  Last name
                </span>
                <input
                  value={form.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                  autoComplete="family-name"
                  required
                  placeholder="Doe"
                  className="w-full rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] px-4 py-3.5 text-sm text-[var(--fm-text-primary)] outline-none placeholder:text-[var(--fm-text-tertiary)] transition focus:border-[var(--fm-lime)] focus:ring-4 focus:ring-[var(--fm-lime-soft)]"
                />
              </label>
            </div>
            <label className="block">
              <span className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[.12em] text-[var(--fm-text-secondary)]">
                Email address
              </span>
              <input
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                className="w-full rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] px-4 py-3.5 text-sm text-[var(--fm-text-primary)] outline-none placeholder:text-[var(--fm-text-tertiary)] transition focus:border-[var(--fm-lime)] focus:ring-4 focus:ring-[var(--fm-lime-soft)]"
              />
            </label>
            <label className="block">
              <span className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[.12em] text-[var(--fm-text-secondary)]">
                Password
              </span>
              <input
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                placeholder="At least 8 characters"
                className="w-full rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] px-4 py-3.5 text-sm text-[var(--fm-text-primary)] outline-none placeholder:text-[var(--fm-text-tertiary)] transition focus:border-[var(--fm-lime)] focus:ring-4 focus:ring-[var(--fm-lime-soft)]"
              />
              <span className="mt-2 block font-mono text-[9px] uppercase tracking-[.1em] text-[var(--fm-text-tertiary)]">
                Minimum 8 characters
              </span>
            </label>
            <button
              disabled={loading}
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-[var(--fm-radius-pill)] bg-[var(--fm-lime)] px-5 py-3.5 text-sm font-bold text-[var(--fm-graphite-deep)] transition hover:-translate-y-0.5 hover:bg-[var(--fm-lime-bright)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Create account <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-[var(--fm-text-tertiary)]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[var(--fm-lime)] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </main>
  );
}

export default function Signup() {
  return (
    <GuestGuard>
      <SignupForm />
    </GuestGuard>
  );
}
