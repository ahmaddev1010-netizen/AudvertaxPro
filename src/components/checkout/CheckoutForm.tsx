"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getServiceBySlug } from "@/lib/services";
import { getApplication } from "@/lib/api";
import { calculateApplicationPricing } from "@/lib/pricing";
import {
  createBillingOrder,
  createCheckoutSession,
  getBilling,
  type BillingOrder,
} from "@/lib/api";
import { useApplicationState } from "@/components/application/ApplicationStateProvider";
import { Button } from "@/components/ui/button";
import { Card, StatusBadge } from "@/components/ui/design-system";
import { Input, FieldLabel } from "@/components/ui/form-controls";

type Props = { applicationId: string };

export default function CheckoutForm({ applicationId }: Props) {
  const router = useRouter();
  const { application, hydrated } = useApplicationState();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [billingOrder, setBillingOrder] = useState<BillingOrder | null>(null);
  const [backendApplication, setBackendApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [checkoutState, setCheckoutState] = useState<
    "idle" | "creating-order" | "creating-session" | "success"
  >("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!hydrated) return;
    setLoading(true);
    setError("");

    const applicationRequest = getApplication(applicationId)
      .then((response) => {
        const record = response.data.application;
        const data = record.data ?? {};
        setBackendApplication({
          id: record.id,
          serviceSlug: record.serviceSlug ?? record.service,
          status: record.status ?? "submitted",
          packageSlug: typeof data.packageSlug === "string" ? data.packageSlug : undefined,
          formationState: typeof data.formationState === "string" ? data.formationState : undefined,
          variantSlug: typeof data.variantSlug === "string" ? data.variantSlug : undefined,
          addOnSlugs: Array.isArray(data.addOnSlugs)
            ? data.addOnSlugs.filter((value): value is string => typeof value === "string")
            : [],
          answers: data,
        });
        setName(typeof data.customer_name === "string" ? data.customer_name : "");
        setEmail(typeof data.customer_email === "string" ? data.customer_email : "");
      })
      .catch((applicationError) => {
        console.error("Unable to load checkout application:", applicationError);
        setBackendApplication(null);
        setError(
          applicationError instanceof Error
            ? applicationError.message
            : "This application could not be loaded.",
        );
      });

    const billingRequest = getBilling(applicationId)
      .then((response) => setBillingOrder(response.data))
      .catch((billingError) => {
        if (
          billingError instanceof Error &&
          !billingError.message.toLowerCase().includes("billing information is not available")
        ) {
          console.warn("Unable to load existing billing order:", billingError);
        }
      });

    Promise.allSettled([applicationRequest, billingRequest]).finally(() => setLoading(false));
  }, [applicationId, hydrated]);

  const checkoutApplication =
    backendApplication ?? (application?.id === applicationId ? application : null);
  const service = checkoutApplication
    ? getServiceBySlug(checkoutApplication.serviceSlug)
    : undefined;
  const selectedAddOns = useMemo(
    () =>
      Array.isArray(checkoutApplication?.addOnSlugs)
        ? checkoutApplication.addOnSlugs.map(String)
        : [],
    [checkoutApplication?.addOnSlugs],
  );
  const variantSlug = checkoutApplication?.variantSlug;
  const displayPricing = useMemo(
    () =>
      checkoutApplication
        ? calculateApplicationPricing({
            serviceSlug: checkoutApplication.serviceSlug,
            packageSlug: checkoutApplication.packageSlug,
            formationState: checkoutApplication.formationState,
            addOnSlugs: selectedAddOns,
            variantSlug,
          })
        : null,
    [checkoutApplication, selectedAddOns, variantSlug],
  );
  const alreadyPaid = ["paid", "processing", "completed"].includes(
    checkoutApplication?.status ?? "",
  );
  const readyForPayment = checkoutApplication?.status === "ready_for_payment";

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!name.trim() || !email.trim()) {
      setError("Please enter your name and email address.");
      return;
    }
    if (!checkoutApplication || checkoutApplication.id !== applicationId) {
      setError("This application is no longer available. Please return to your dashboard.");
      return;
    }

    setSubmitting(true);
    setCheckoutState("creating-order");
    try {
      if (["paid", "processing", "completed"].includes(checkoutApplication.status)) {
        setError("This application has already been paid.");
        return;
      }
      if (checkoutApplication.status !== "ready_for_payment") {
        throw new Error(
          "This application is not ready for payment. Return to the application and complete the required information first.",
        );
      }

      try {
        const order = billingOrder ?? (await createBillingOrder(applicationId)).data;
        setBillingOrder(order);
      } catch (orderError) {
        const status =
          orderError instanceof Error && "status" in orderError
            ? Number((orderError as Error & { status?: number }).status)
            : undefined;

        if (status !== 409) {
          throw orderError;
        }
      }

      setCheckoutState("creating-session");
      const checkoutSession = await createCheckoutSession(applicationId);
      const checkoutUrl = checkoutSession.data?.url;
      if (!checkoutUrl) {
        throw new Error("The payment session URL was not returned by the backend.");
      }

      setCheckoutState("success");
      window.location.href = checkoutUrl;
    } catch (submitError) {
      console.error("Unable to complete checkout:", submitError);
      setCheckoutState("idle");
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We couldn't complete your checkout. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--fm-graphite-deep)] px-6">
        <Card className="w-full max-w-md p-8 text-center">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--fm-lime)]">
            Checkout
          </p>
          <h1 className="mt-3 text-xl font-semibold text-[var(--fm-text-primary)]">
            Loading checkout
          </h1>
          <p className="mt-2 text-sm leading-6 text-[var(--fm-text-secondary)]">
            Loading your application and order details.
          </p>
        </Card>
      </main>
    );
  }

  if (!checkoutApplication || checkoutApplication.id !== applicationId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--fm-graphite-deep)] px-6">
        <Card className="w-full max-w-md p-8 text-center">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--fm-lime)]">
            Checkout
          </p>
          <h1 className="mt-3 text-xl font-semibold text-[var(--fm-text-primary)]">
            Checkout unavailable
          </h1>
          <p className="mt-2 max-w-md text-sm leading-6 text-[var(--fm-text-secondary)]">
            {error || "This application is not available."}
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-5 w-full"
            onClick={() => router.push("/dashboard")}
          >
            Return to dashboard
          </Button>
        </Card>
      </main>
    );
  }

  const currency = billingOrder?.currency ?? displayPricing?.currency ?? "USD";
  const total = billingOrder?.total ?? displayPricing?.total ?? 0;

  return (
    <main className="min-h-screen bg-[var(--fm-graphite-deep)] px-4 py-10 md:px-6 md:py-16">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--fm-lime)]">
            Audvertax checkout
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--fm-text-primary)]">
                {alreadyPaid ? "Order already paid" : "Review your order"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--fm-text-secondary)]">
                {alreadyPaid
                  ? "This application has already been paid and cannot be paid again."
                  : readyForPayment
                    ? "Confirm your contact information before submitting your order."
                    : "This application is not currently ready for payment."}
              </p>
            </div>
            <StatusBadge status={alreadyPaid ? "success" : readyForPayment ? "neutral" : "warning"}>
              {alreadyPaid ? "Paid" : readyForPayment ? "Ready for payment" : "Not ready"}
            </StatusBadge>
          </div>
        </header>
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <Card variant="elevated" className="p-6 md:p-8">
            <div className="mb-7">
              <p className="text-sm font-semibold text-[var(--fm-text-primary)]">
                Contact information
              </p>
              <p className="mt-1 text-sm text-[var(--fm-text-tertiary)]">
                We'll use this information for your order and application records.
              </p>
            </div>
            <form onSubmit={submit} className="space-y-6">
              <div className="space-y-2">
                <FieldLabel htmlFor="checkout-name">Full name</FieldLabel>
                <Input
                  id="checkout-name"
                  required
                  disabled={alreadyPaid || submitting || !readyForPayment}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your full name"
                />
              </div>
              <div className="space-y-2">
                <FieldLabel htmlFor="checkout-email">Email address</FieldLabel>
                <Input
                  id="checkout-email"
                  required
                  disabled={alreadyPaid || submitting || !readyForPayment}
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              {error && (
                <div
                  className="rounded-[var(--fm-radius-md)] border border-[var(--fm-danger)] bg-[var(--fm-danger-soft)] p-4 text-sm text-[var(--fm-danger)]"
                  role="alert"
                >
                  {error}
                </div>
              )}
              {alreadyPaid ? (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    router.push(`/dashboard/application?id=${encodeURIComponent(applicationId)}`)
                  }
                >
                  View application
                </Button>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button
                    type="submit"
                    disabled={
                      submitting ||
                      checkoutState === "creating-order" ||
                      checkoutState === "creating-session" ||
                      !readyForPayment
                    }
                    className="w-full"
                  >
                    {checkoutState === "creating-order"
                      ? "Creating order..."
                      : checkoutState === "creating-session"
                        ? "Opening Stripe..."
                        : `Pay now — ${currency} ${total.toFixed(2)}`}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={submitting || !readyForPayment}
                    className="w-full"
                    onClick={() => router.push("/dashboard")}
                  >
                    Pay later
                  </Button>
                </div>
              )}
            </form>
          </Card>
          <Card variant="standard" className="h-fit p-6 lg:sticky lg:top-6">
            <div className="border-b border-[var(--fm-border)] pb-5">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--fm-text-tertiary)]">
                Order summary
              </p>
              <h2 className="mt-2 text-xl font-semibold text-[var(--fm-text-primary)]">
                {service?.name ?? "Service"}
              </h2>
            </div>
            <div className="space-y-4 py-5">
              {billingOrder?.lineItems?.length
                ? billingOrder.lineItems.map((item) => (
                    <div key={item.key} className="flex items-start justify-between gap-4 text-sm">
                      <span className="text-[var(--fm-text-secondary)]">{item.label}</span>
                      <span className="font-medium text-[var(--fm-text-primary)]">
                        {item.currency} {item.total.toFixed(2)}
                      </span>
                    </div>
                  ))
                : displayPricing?.lineItems.map((item) => (
                    <div key={item.key} className="flex items-start justify-between gap-4 text-sm">
                      <span className="text-[var(--fm-text-secondary)]">{item.label}</span>
                      <span className="font-medium text-[var(--fm-text-primary)]">
                        {item.currency} {item.total.toFixed(2)}
                      </span>
                    </div>
                  ))}
            </div>
            <div className="border-t border-[var(--fm-border)] pt-5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[var(--fm-text-primary)]">Total</span>
                <span className="text-xl font-semibold text-[var(--fm-lime-bright)]">
                  {currency} {total.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="mt-5 rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-surface-raised)] p-3 text-xs leading-5 text-[var(--fm-text-tertiary)]">
              Secure checkout is handled by Stripe and your session is protected with your account cookie.
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
