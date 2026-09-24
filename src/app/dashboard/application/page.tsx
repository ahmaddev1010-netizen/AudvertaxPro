"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Card, CardAction, StatusBadge } from "@/components/ui/design-system";
import { LoadingState } from "@/components/ui/interaction-controls";
import { useApplicationState } from "@/components/application/ApplicationStateProvider";
import { getServiceBySlug, getApplicationConfig } from "@/lib/services";
import { calculateApplicationPricing } from "@/lib/pricing";
import { getBilling, type BillingOrder } from "@/lib/api";
import { isCustomerApplicationEditable } from "@/lib/services/application-lifecycle";

const statusLabels = {
  draft: "Draft",
  ready_for_payment: "Ready for payment",
  submitted: "Submitted",
  paid: "Paid",
  processing: "Processing",
  changes_requested: "Changes requested",
  completed: "Completed",
  cancelled: "Cancelled",
} as const;

export default function DashboardApplicationPage() {
  return (
    <Suspense fallback={<LoadingState label="Loading your application..." />}>
      <DashboardApplicationPageContent />
    </Suspense>
  );
}

function DashboardApplicationPageContent() {
  const params = useSearchParams();
  const requestedId = params.get("id");
  const { application, applications, hydrated } = useApplicationState();
  const [billingOrder, setBillingOrder] = useState<BillingOrder | null>(null);

  const requestedApplication = requestedId
    ? applications.find((candidate) => candidate.id === requestedId) ?? application
    : application;

  useEffect(() => {
    if (!hydrated || !requestedId) return;
    if (requestedApplication?.id !== requestedId) return;
    void getBilling(requestedId)
      .then((response) => setBillingOrder(response.data))
      .catch(() => setBillingOrder(null));
  }, [hydrated, requestedId, requestedApplication?.id]);

  if (!hydrated || (requestedId && !requestedApplication))
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--fm-graphite)] px-6">
        <LoadingState label="Loading your application..." />
      </main>
    );

  if (!requestedApplication)
    return (
      <main className="min-h-screen bg-[var(--fm-graphite)] px-4 py-12">
        <Card className="mx-auto max-w-xl p-8 text-center">
          <h1 className="text-2xl font-semibold text-[var(--fm-text-primary)]">
            No active application
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--fm-text-secondary)]">
            Start an application first, then return here to track it.
          </p>
          <CardAction href="/usa-llc" className="mt-6">
            Start my LLC
          </CardAction>
        </Card>
      </main>
    );

  const service = getServiceBySlug(requestedApplication.serviceSlug);
  const config = getApplicationConfig(requestedApplication.serviceSlug);
  const pricing = calculateApplicationPricing({
    serviceSlug: requestedApplication.serviceSlug,
    packageSlug: requestedApplication.packageSlug,
    formationState: requestedApplication.formationState,
    variantSlug: requestedApplication.variantSlug,
    addOnSlugs: requestedApplication.addOnSlugs,
  });
  const isEditable = isCustomerApplicationEditable(requestedApplication.status);
  const isPaid = requestedApplication.status === "paid";
  const stepCount = config?.steps.length ?? 0;
  const progress = !isEditable
    ? 100
    : requestedApplication.status === "ready_for_payment" || requestedApplication.status === "submitted"
      ? 90
      : stepCount > 0
        ? Math.min(
            85,
            Math.max(10, Math.round(((requestedApplication.currentStep + 1) / stepCount) * 100)),
          )
        : 0;
  const displayTotal = billingOrder?.status === "paid" ? billingOrder.total : pricing.total;
  const displayCurrency =
    billingOrder?.status === "paid" ? billingOrder.currency : pricing.currency;
  const documents = requestedApplication.documents ?? [];
  const isUkDirectorVerification =
    requestedApplication.serviceSlug === "uk-director-id-verification";
  const isPostOrder = ["paid", "processing", "completed"].includes(requestedApplication.status);
  return (
    <main className="min-h-screen bg-[var(--fm-graphite)]">
      <header className="border-b border-[var(--fm-border)] bg-[var(--fm-surface)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 md:px-6">
          <div>
            <p className="text-sm text-[var(--fm-text-tertiary)]">Audvertax</p>
            <p className="font-semibold text-[var(--fm-text-primary)]">Customer Dashboard</p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-[var(--fm-text-secondary)] hover:text-[var(--fm-text-primary)]"
          >
            Dashboard
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-sm text-[var(--fm-text-tertiary)] hover:text-[var(--fm-text-primary)]"
          >
            ← Dashboard
          </Link>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm text-[var(--fm-text-tertiary)]">Application</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[var(--fm-text-primary)]">
                {service?.name ?? requestedApplication.serviceSlug}
              </h1>
              <p className="mt-2 break-all font-mono text-xs text-[var(--fm-text-tertiary)]">
                {requestedApplication.id}
              </p>
            </div>
            <StatusBadge
              status={
                requestedApplication.status === "cancelled"
                  ? "danger"
                  : requestedApplication.status === "completed" ||
                      requestedApplication.status === "paid"
                    ? "success"
                    : requestedApplication.status === "submitted" ||
                        requestedApplication.status === "ready_for_payment" ||
                        requestedApplication.status === "changes_requested"
                      ? "info"
                      : "neutral"
              }
            >
              {statusLabels[requestedApplication.status]}
            </StatusBadge>
          </div>
        </div>
        {isUkDirectorVerification && isPostOrder ? (
          <Card variant="elevated" tone="lime" className="mb-6 p-6 md:p-8">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[.12em] text-[var(--fm-graphite-deep)]/70">
              After your order
            </p>
            <h2 className="mt-3 text-xl font-semibold tracking-[-.02em] text-[var(--fm-graphite-deep)]">
              Your verification is with our team.
            </h2>
            <div className="mt-4 grid gap-3 text-sm leading-6 text-[var(--fm-graphite-deep)]/75 sm:grid-cols-2">
              <p>Our team will contact you within 24 hours after your order is placed.</p>
              <p>Processing normally takes 2 to 3 business days.</p>
            </div>
          </Card>
        ) : null}
        <div className="grid gap-6 lg:grid-cols-[1fr_330px]">
          <Card className="p-6 md:p-8">
            <h2 className="text-lg font-semibold text-[var(--fm-text-primary)]">
              Application progress
            </h2>
            <div className="mt-5 h-2 overflow-hidden rounded-[var(--fm-radius-pill)] bg-[var(--fm-surface-raised)]">
              <div
                className="h-full rounded-[var(--fm-radius-pill)] bg-[var(--fm-lime)] transition-[width] duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-3 flex justify-between text-xs text-[var(--fm-text-secondary)]">
              <span>Started</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="mt-8 space-y-3">
              {(config?.steps ?? []).map((step, index) => {
                const done =
                  !isEditable ||
                  requestedApplication.status === "submitted" ||
                  requestedApplication.status === "ready_for_payment" ||
                  index < requestedApplication.currentStep;
                return (
                  <div
                    key={step.id}
                    className="flex items-center gap-3 rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] p-4"
                  >
                    <span
                      className={`flex size-7 items-center justify-center rounded-full text-xs font-bold ${done ? "bg-[var(--fm-lime)] text-[var(--fm-graphite-deep)]" : "bg-[var(--fm-surface-raised)] text-[var(--fm-text-tertiary)]"}`}
                    >
                      {done ? "✓" : index + 1}
                    </span>
                    <span
                      className={`text-sm ${done ? "font-medium text-[var(--fm-text-primary)]" : "text-[var(--fm-text-tertiary)]"}`}
                    >
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>
            {!isEditable ? (
              <div className="mt-7 space-y-3">
                <div className="rounded-[var(--fm-radius-md)] border border-[var(--fm-success)]/30 bg-[var(--fm-success-soft)] p-4 text-sm text-[var(--fm-success)]">
                  {isPaid
                    ? "This application has been paid and is now locked. Your submitted information cannot be edited."
                    : requestedApplication.status === "ready_for_payment"
                      ? "Your application is submitted and locked. Payment is the only remaining step."
                      : "This application is locked and can no longer be edited."}
                </div>
                {requestedApplication.status === "ready_for_payment" && (
                  <Link
                    href={`/checkout?applicationId=${encodeURIComponent(requestedApplication.id)}`}
                    className="inline-flex items-center justify-center rounded-[var(--fm-radius-pill)] bg-[var(--fm-lime)] px-5 py-3 text-sm font-semibold text-[var(--fm-graphite-deep)]"
                  >
                    Pay now
                  </Link>
                )}
              </div>
            ) : (
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <CardAction href={`/apply/${requestedApplication.id}`} className="sm:w-auto">
                  Continue application
                </CardAction>
                <Link
                  href={`/checkout?applicationId=${requestedApplication.id}`}
                  className="inline-flex items-center justify-center rounded-[var(--fm-radius-pill)] border border-[var(--fm-border)] px-5 py-3 text-sm font-semibold text-[var(--fm-text-primary)] transition-[background-color,border-color,color] duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)] hover:bg-[var(--fm-surface-raised)]"
                >
                  View checkout
                </Link>
              </div>
            )}
          </Card>
          <aside className="space-y-6">
            <Card className="p-6">
              <h2 className="font-semibold text-[var(--fm-text-primary)]">Application summary</h2>
              <dl className="mt-5 space-y-4">
                <div>
                  <dt className="text-xs text-[var(--fm-text-tertiary)]">Formation state</dt>
                  <dd className="mt-1 text-sm font-medium text-[var(--fm-text-primary)]">
                    {requestedApplication.formationState ?? "Not selected"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[var(--fm-text-tertiary)]">Package</dt>
                  <dd className="mt-1 text-sm font-medium text-[var(--fm-text-primary)]">
                    {requestedApplication.packageSlug ?? "Default"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[var(--fm-text-tertiary)]">
                    {billingOrder?.status === "paid" ? "Paid total" : "Current total"}
                  </dt>
                  <dd className="mt-1 text-lg font-semibold text-[var(--fm-text-primary)]">
                    {displayCurrency} {displayTotal.toFixed(2)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-[var(--fm-text-tertiary)]">Last updated</dt>
                  <dd className="mt-1 text-sm text-[var(--fm-text-secondary)]">
                    {new Date(requestedApplication.updatedAt).toLocaleString()}
                  </dd>
                </div>
              </dl>
            </Card>
            <Card className="p-6">
              <h2 className="font-semibold text-[var(--fm-text-primary)]">Documents</h2>
              {documents.length === 0 ? (
                <p className="mt-2 text-sm leading-6 text-[var(--fm-text-secondary)]">
                  No documents have been uploaded yet.
                </p>
              ) : (
                <div className="mt-4 space-y-2">
                  {documents.map((document) => (
                    <div
                      key={document.id}
                      className="flex items-center justify-between gap-3 rounded-[var(--fm-radius-md)] bg-[var(--fm-surface-raised)] p-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-[var(--fm-text-primary)]">
                          {document.fileName}
                        </p>
                        <p className="mt-1 text-xs text-[var(--fm-text-tertiary)]">
                          {document.documentType} · {document.status}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => undefined}
                        className="rounded-[var(--fm-radius-pill)] border border-[var(--fm-border)] px-3 py-2 text-xs font-medium text-[var(--fm-text-primary)] transition-colors hover:bg-[var(--fm-surface-raised)]"
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}
