"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { resetPassword } from "@/lib/api";
import { Card, SectionLabel } from "@/components/ui/design-system";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordPageContent />
    </Suspense>
  );
}

function ResetPasswordFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--fm-graphite-deep)] px-5 py-12">
      <Card variant="feature" tone="dark" className="w-full max-w-md p-7 sm:p-10">
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-[var(--fm-lime)]" />
        </div>
      </Card>
    </main>
  );
}

function ResetPasswordPageContent() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Your new password must be at least 6 characters.");
      return;
    }
    if (password !== confirmation) {
      setError("The passwords do not match.");
      return;
    }
    if (!token) {
      setError("This password reset link is missing its token.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reset your password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--fm-graphite-deep)] px-5 py-12">
      <Card variant="feature" tone="dark" className="w-full max-w-md p-7 sm:p-10">
        <SectionLabel>Account recovery</SectionLabel>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-[-.04em]">
          Set a new password
        </h1>
        {done ? (
          <>
            <p className="mt-3 text-sm leading-6 text-[var(--fm-text-secondary)]">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            <button
              type="button"
              onClick={() => router.replace("/login")}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-[var(--fm-radius-pill)] bg-[var(--fm-lime)] px-5 py-3.5 text-sm font-bold text-[var(--fm-graphite-deep)]"
            >
              Back to sign in <ArrowRight className="h-4 w-4" />
            </button>
          </>
        ) : (
          <form onSubmit={submit} className="mt-7 space-y-5">
            {error && (
              <div
                role="alert"
                className="rounded-[var(--fm-radius-md)] border border-[var(--fm-danger)]/30 bg-[var(--fm-danger-soft)] p-4 text-sm text-[var(--fm-danger)]"
              >
                {error}
              </div>
            )}
            <label className="block">
              <span className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[.12em] text-[var(--fm-text-secondary)]">
                New password
              </span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                minLength={6}
                required
                autoComplete="new-password"
                className="w-full rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] px-4 py-3.5 text-sm text-[var(--fm-text-primary)] outline-none focus:border-[var(--fm-lime)]"
              />
            </label>
            <label className="block">
              <span className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-[.12em] text-[var(--fm-text-secondary)]">
                Confirm password
              </span>
              <input
                value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)}
                type="password"
                minLength={6}
                required
                autoComplete="new-password"
                className="w-full rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] px-4 py-3.5 text-sm text-[var(--fm-text-primary)] outline-none focus:border-[var(--fm-lime)]"
              />
            </label>
            <button
              disabled={loading}
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-[var(--fm-radius-pill)] bg-[var(--fm-lime)] px-5 py-3.5 text-sm font-bold text-[var(--fm-graphite-deep)] disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Reset password <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}
      </Card>
    </main>
  );
}
