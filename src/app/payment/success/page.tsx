"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, IconContainer, SectionLabel, StatusBadge } from "@/components/ui/design-system";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<PaymentSuccessFallback />}>
      <PaymentSuccessContent />
    </Suspense>
  );
}

function PaymentSuccessContent() {
  const params = useSearchParams();
  const sessionId = params.get("session_id") ?? "";
  const applicationId = params.get("application_id") ?? "";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--fm-graphite-deep)] px-5 py-12">
      <Card variant="feature" tone="dark" className="w-full max-w-xl p-7 sm:p-10">
        <div className="flex justify-center">
          <IconContainer className="size-16 rounded-full border border-[var(--fm-lime)]/40 bg-[var(--fm-lime-soft)] text-xl text-[var(--fm-lime)]">
            ✓
          </IconContainer>
        </div>
        <div className="mt-6 text-center">
          <SectionLabel>Payment status</SectionLabel>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[var(--fm-text-primary)]">
            Payment processing is complete
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--fm-text-secondary)]">
            Your Stripe checkout has been completed successfully. We have received the payment request
            and your application will continue to update normally.
          </p>
          {sessionId && (
            <p className="mt-4 break-all font-mono text-[11px] text-[var(--fm-text-tertiary)]">
              Session ID: {sessionId}
            </p>
          )}
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {applicationId ? (
            <Button asChild>
              <Link href={`/dashboard/application?id=${encodeURIComponent(applicationId)}`}>
                View application
              </Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
          )}
          <Button asChild variant="outline">
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </div>
      </Card>
    </main>
  );
}

function PaymentSuccessFallback() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--fm-graphite-deep)] px-5 py-12">
      <Card variant="feature" tone="dark" className="w-full max-w-lg p-7 sm:p-10">
        <div className="flex items-center justify-center py-8">
          <StatusBadge status="success">Processing payment</StatusBadge>
        </div>
      </Card>
    </main>
  );
}
