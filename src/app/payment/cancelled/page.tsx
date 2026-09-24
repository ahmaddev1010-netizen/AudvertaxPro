"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, IconContainer, SectionLabel } from "@/components/ui/design-system";

export default function PaymentCancelledPage() {
  return (
    <Suspense fallback={<PaymentCancelledFallback />}>
      <PaymentCancelledContent />
    </Suspense>
  );
}

function PaymentCancelledContent() {
  const params = useSearchParams();
  const applicationId = params.get("application_id") ?? "";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--fm-graphite-deep)] px-5 py-12">
      <Card variant="feature" tone="dark" className="w-full max-w-xl p-7 sm:p-10">
        <div className="flex justify-center">
          <IconContainer className="size-16 rounded-full border border-[var(--fm-warning)]/40 bg-[var(--fm-warning-soft)] text-xl text-[var(--fm-warning)]">
            !
          </IconContainer>
        </div>
        <div className="mt-6 text-center">
          <SectionLabel>Payment cancelled</SectionLabel>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--fm-text-primary)]">
            Your payment was cancelled
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--fm-text-secondary)]">
            No charge was made. You can retry the payment at any time and continue your application.
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {applicationId ? (
            <Button asChild>
              <Link href={`/checkout?applicationId=${encodeURIComponent(applicationId)}`}>
                Retry payment
              </Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
          )}
          <Button asChild variant="outline">
            <Link href="/dashboard">Return to dashboard</Link>
          </Button>
        </div>
      </Card>
    </main>
  );
}

function PaymentCancelledFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--fm-graphite-deep)] px-5 py-12">
      <Card variant="feature" tone="dark" className="w-full max-w-lg p-7 sm:p-10">
        <div className="flex items-center justify-center py-8 text-sm text-[var(--fm-text-secondary)]">
          Loading payment status...
        </div>
      </Card>
    </main>
  );
}
