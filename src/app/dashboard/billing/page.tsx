"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, CreditCard, Download, Receipt, ShieldCheck } from "lucide-react";
import { getBillingOrders, getMyApplications, type BillingOrder } from "@/lib/api";
import { downloadPaymentSlip } from "@/lib/payment-slip";
import { getServiceBySlug } from "@/lib/services";
import { Card, SectionLabel, StatusBadge } from "@/components/ui/design-system";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EnrichedBillingOrder = BillingOrder & {
  serviceName: string;
  serviceSlug?: string;
  paymentReference: string;
  paidAt?: string;
};

export default function BillingPage() {
  const [orders, setOrders] = useState<BillingOrder[]>([]);
  const [applications, setApplications] = useState<Array<{ id: string; serviceSlug?: string; service?: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([getBillingOrders(), getMyApplications()])
      .then(([billingResponse, applicationsResponse]) => {
        setOrders(billingResponse.data);
        setApplications(applicationsResponse.data.applications);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unable to load billing.");
      })
      .finally(() => setLoading(false));
  }, []);

  const enrichedOrders = useMemo<EnrichedBillingOrder[]>(() => {
    const lookup = new Map(applications.map((application) => [application.id, application]));

    return orders.map((order) => {
      const app = lookup.get(order.applicationId);
      const serviceFromSlug = app?.serviceSlug ? getServiceBySlug(app.serviceSlug) : undefined;
      const serviceName =
        serviceFromSlug?.name ??
        (typeof app?.service === "string" ? app.service : undefined) ??
        "Service application";

      return {
        ...order,
        serviceName,
        serviceSlug: app?.serviceSlug,
        paymentReference: order.status === "paid" ? (order.id || order.applicationId) : "Pending",
        paidAt: order.status === "paid" ? order.updatedAt : undefined,
      };
    });
  }, [applications, orders]);

  const downloadSlip = (order: EnrichedBillingOrder) => {
    downloadPaymentSlip({
      applicationId: order.applicationId,
      orderId: order.id,
      serviceName: order.serviceName,
      status: order.status === "paid" ? "paid" : "pending",
      currency: order.currency,
      total: order.total,
      paymentReference: order.paymentReference,
      paidAt: order.paidAt,
    });
  };

  return (
    <main className="min-h-screen bg-[var(--fm-graphite)] text-[var(--fm-text-primary)]">
      <header className="border-b border-[var(--fm-border)] bg-[var(--fm-graphite-deep)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 md:px-8">
          <div>
            <SectionLabel>Audvertax</SectionLabel>
            <h1 className="mt-1 font-semibold">Billing & Payments</h1>
          </div>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-[var(--fm-text-secondary)] hover:text-[var(--fm-text-primary)]"
          >
            Back to dashboard
          </Link>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">
        <div className="mb-8">
          <SectionLabel>Payments</SectionLabel>
          <h2 className="mt-1 text-3xl font-semibold tracking-[-0.04em]">Billing overview</h2>
          <p className="mt-2 text-sm text-[var(--fm-text-secondary)]">
            Review your pending and completed application payments.
          </p>
        </div>
        {loading ? (
          <Card className="p-10 text-center">Loading billing...</Card>
        ) : error ? (
          <Card className="p-10 text-center text-[var(--fm-danger)]">{error}</Card>
        ) : (
          <>
            <section className="mb-8 overflow-hidden rounded-[var(--fm-radius-xl)] border border-[var(--fm-border)] bg-[var(--fm-surface)] p-0">
              <div className="px-4 py-4 md:px-6">
                <div className="flex items-center justify-between gap-3 border-b border-[var(--fm-border)] pb-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--fm-text-tertiary)]">
                      Bills
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-[var(--fm-text-primary)]">
                      Your persisted billing orders
                    </h3>
                  </div>
                </div>
                {!enrichedOrders.length ? (
                  <div className="p-10 text-center">
                    <CreditCard className="mx-auto text-[var(--fm-lime)]" size={34} />
                    <h4 className="mt-4 text-xl font-semibold">No bills yet</h4>
                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--fm-text-secondary)]">
                      Paid applications will create their bills here automatically.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 space-y-3">
                    {enrichedOrders.map((order) => (
                      <div
                        key={order.id}
                        className="rounded-[var(--fm-radius-lg)] border border-[var(--fm-border)] bg-[var(--fm-surface-raised)] p-4"
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                          <div className="min-w-0">
                            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--fm-text-tertiary)]">
                              {order.applicationId.slice(0, 12)}
                            </p>
                            <p className="mt-2 text-xl font-semibold text-[var(--fm-text-primary)]">
                              {order.serviceName}
                            </p>
                          </div>
                          <StatusBadge status={order.status === "paid" ? "success" : "info"}>
                            {order.status === "paid" ? "Paid" : "Pending"}
                          </StatusBadge>
                        </div>

                        <div className="mt-4 grid gap-3 md:grid-cols-[1.4fr_1fr_1.2fr_auto] md:items-end">
                          <div>
                            <p className="text-xs uppercase tracking-[0.12em] text-[var(--fm-text-tertiary)]">
                              Payment details
                            </p>
                            <p className="mt-2 text-sm text-[var(--fm-text-secondary)]">
                              {order.status === "paid" ? (
                                <>
                                  <span className="font-medium text-[var(--fm-text-primary)]">
                                    TX: {order.paymentReference.slice(0, 18)}
                                  </span>
                                  <br />
                                  {order.paidAt ? new Date(order.paidAt).toLocaleDateString() : "Completed"}
                                </>
                              ) : (
                                "Reference will appear after payment"
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs uppercase tracking-[0.12em] text-[var(--fm-text-tertiary)]">
                              Amount
                            </p>
                            <p className="mt-2 text-2xl font-bold text-[var(--fm-text-primary)]">
                              {order.currency} {order.total.toFixed(2)}
                            </p>
                          </div>

                          <div className="flex flex-col gap-2">
                            {order.status === "pending" && (
                              <Link
                                href={`/checkout?applicationId=${encodeURIComponent(order.applicationId)}`}
                                className={cn(buttonVariants({ size: "sm" }), "justify-center")}
                              >
                                Pay now <ArrowUpRight size={15} />
                              </Link>
                            )}
                            <button
                              type="button"
                              onClick={() => downloadSlip(order)}
                              className={cn(
                                buttonVariants({ variant: "outline", size: "sm" }),
                                "justify-center",
                              )}
                            >
                              Slip <Download size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <Receipt className="text-[var(--fm-text-secondary)]" size={21} />
            <h3 className="mt-4 font-semibold">Billing records</h3>
            <p className="mt-2 text-sm text-[var(--fm-text-secondary)]">
              Your orders remain linked to the corresponding application.
            </p>
          </Card>
          <Card className="p-6">
            <ShieldCheck className="text-[var(--fm-lime)]" size={21} />
            <h3 className="mt-4 font-semibold">Payment security</h3>
            <p className="mt-2 text-sm text-[var(--fm-text-secondary)]">
              Payment state is confirmed by the backend billing record.
            </p>
          </Card>
        </div>
      </div>
    </main>
  );
}
