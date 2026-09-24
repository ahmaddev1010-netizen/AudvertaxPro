"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKey, SignIn, UserPlus, X } from "@phosphor-icons/react";
import { createPortal } from "react-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { VariantProps } from "class-variance-authority";

type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
type ButtonSize = VariantProps<typeof buttonVariants>["size"];

type Props = {
  serviceSlug: string;
  packageSlug?: string;
  formationState?: string;
  variantSlug?: string;
  addOnSlugs?: string[];
  initialAnswers?: Record<string, unknown>;
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
};

export default function StartApplicationButton({
  serviceSlug,
  packageSlug,
  formationState,
  variantSlug,
  addOnSlugs = [],
  initialAnswers,
  children,
  className,
  variant,
  size,
  disabled = false,
}: Props) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [showAuthMessage, setShowAuthMessage] = useState(false);

  function start() {
    if (disabled || authLoading) return;

    if (!user) {
      setShowAuthMessage(true);
      return;
    }

    const params = new URLSearchParams({ service: serviceSlug });
    if (packageSlug) params.set("package", packageSlug);
    if (formationState) params.set("state", formationState);
    if (variantSlug) params.set("variant", variantSlug);
    if (addOnSlugs.length) params.set("addons", addOnSlugs.join(","));
    if (initialAnswers && Object.keys(initialAnswers).length) {
      params.set("answers", JSON.stringify(initialAnswers));
    }

    const dedicatedApplicationServices = new Set([
      "pak-sole-business-registration",
      "pak-private-company-registration",
      "pak-llp-registration",
      "pak-ntn-registration",
      "pak-become-filer",
      "pak-salary-return",
      "pak-business-return",
      "pak-dnfbp-certificate",
      "pak-pseb",
      "pak-psw",
      "uk-confirmation-statement",
      "uk-vat-registration",
      "uk-vat-filing",
      "uk-director-id-verification",
      "uk-address",
    ]);

    if (dedicatedApplicationServices.has(serviceSlug)) {
      router.push(`/${serviceSlug}/application`);
      return;
    }

    router.push(`/application?${params.toString()}`);
  }

  function chooseAuth(destination: "/login" | "/signup") {
    setShowAuthMessage(false);
    window.sessionStorage.setItem(
      "audvertax.pendingApplicationSelection",
      JSON.stringify({
        serviceSlug,
        packageSlug,
        jurisdictionSlug: formationState,
        variantSlug,
        addOnSlugs,
        initialAnswers,
      }),
    );
    router.push(destination);
  }

  const authMessage =
    showAuthMessage && typeof document !== "undefined"
      ? createPortal(
          <div
            className="fixed inset-0 z-[9999] flex min-h-[100dvh] items-center justify-center overflow-y-auto bg-[rgba(11,14,11,.75)] px-4 py-6 backdrop-blur-sm"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setShowAuthMessage(false);
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="start-application-auth-title"
              className="my-auto w-full max-w-[430px] rounded-[var(--fm-radius-feature)] border border-[var(--fm-border)] bg-[var(--fm-surface)] p-6 shadow-[var(--fm-shadow-overlay)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--fm-radius-md)] border border-[var(--fm-lime)]/25 bg-[var(--fm-lime)]/10 text-[var(--fm-lime-bright)]">
                  <LockKey className="h-5 w-5" weight="duotone" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowAuthMessage(false)}
                  aria-label="Close"
                  className="flex h-9 w-9 items-center justify-center rounded-[var(--fm-radius-md)] text-[var(--fm-text-tertiary)] hover:bg-[var(--fm-surface-raised)] hover:text-[var(--fm-text-primary)]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <h2
                id="start-application-auth-title"
                className="mt-5 font-display text-[22px] font-semibold tracking-[-0.02em] text-[var(--fm-text-primary)]"
              >
                Sign in to start your application
              </h2>
              <p className="mt-2 text-[14px] leading-6 text-[var(--fm-text-secondary)]">
                Your selected service options will be carried into the new application process.
              </p>
              <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => chooseAuth("/login")}
                  className="flex h-11 items-center justify-center gap-2 rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] text-[14px] font-semibold text-[var(--fm-text-primary)] hover:border-[var(--fm-border-accent)]"
                >
                  <SignIn className="h-4 w-4" />
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => chooseAuth("/signup")}
                  className="flex h-11 items-center justify-center gap-2 rounded-[var(--fm-radius-md)] border border-[var(--fm-lime)] bg-[var(--fm-lime)] text-[14px] font-semibold text-[var(--fm-graphite-deep)] hover:bg-[var(--fm-lime-bright)]"
                >
                  <UserPlus className="h-4 w-4" />
                  Create account
                  <ArrowRight className="h-3.5 w-3.5" weight="bold" />
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        type="button"
        onClick={start}
        disabled={Boolean(disabled) || authLoading}
        className={cn(variant ? buttonVariants({ variant, size }) : undefined, className)}
      >
        {children}
      </button>
      {authMessage}
    </>
  );
}
