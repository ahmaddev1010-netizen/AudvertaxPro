"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CreditCard, Receipt, ArrowUpRight, ShieldCheck } from "lucide-react";
import { getBillingOrders, type BillingOrder } from "@/lib/api";
import { Card, SectionLabel, StatusBadge } from "@/components/ui/design-system";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function BillingPage() {
  const [orders, setOrders] = useState<BillingOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getBillingOrders()
      .then((response) => setOrders(response.data))
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unable to load billing.");
      })
      .finally(() => setLoading(false));
  }, []);

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
        ) : !orders.length ? (
          <Card variant="feature" className="p-10 text-center">
            <CreditCard className="mx-auto text-[var(--fm-lime)]" size={34} />
            <h3 className="mt-4 text-xl font-semibold">No bills yet</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--fm-text-secondary)]">
              Paid applications will create their bills here automatically.
            </p>
          </Card>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <Card key={order.id} variant="standard" className="overflow-hidden">
                <div className="flex flex-col gap-4 border-b border-[var(--fm-border)] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--fm-text-tertiary)]">
                      Application {order.applicationId}
                    </p>
                    <h3 className="mt-1 font-semibold">
                      Order {order.id.slice(0, 8).toUpperCase()}
                    </h3>
                  </div>
                  <StatusBadge status={order.status === "paid" ? "success" : "info"}>
                    {order.status === "paid" ? "Paid" : "Pending payment"}
                  </StatusBadge>
                </div>
                <div className="p-6">
                  {order.lineItems.map((item) => (
                    <div
                      key={item.key}
                      className="flex justify-between border-b border-[var(--fm-border)] py-3 text-sm"
                    >
                      <span>{item.label}</span>
                      <b>
                        {item.currency} {item.total.toFixed(2)}
                      </b>
                    </div>
                  ))}
                  <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs text-[var(--fm-text-tertiary)]">Total</p>
                      <p className="text-xl font-semibold">
                        {order.currency} {order.total.toFixed(2)}
                      </p>
                    </div>
                    {order.status === "pending" && (
                      <Link
                        href={`/checkout?applicationId=${encodeURIComponent(order.applicationId)}`}
                        className={cn(buttonVariants(), "w-full sm:w-auto")}
                      >
                        Continue to payment <ArrowUpRight size={16} />
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
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
