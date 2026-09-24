import { notFound } from "next/navigation";

import StartApplicationButton from "@/components/services/StartApplicationButton";
import { Card, SectionLabel } from "@/components/ui/design-system";
import { getServiceBySlug } from "@/lib/services";

export default function PakSoleBusinessRegistrationApplyPage() {
  const service = getServiceBySlug("pak-sole-business-registration");
  if (!service) notFound();

  return (
    <main className="fm-page min-h-screen bg-[var(--fm-graphite-deep)] px-fm-6 pb-24 pt-36 sm:px-fm-10 lg:px-fm-14">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="mb-10 max-w-3xl">
          <SectionLabel>Pakistan · Business registration</SectionLabel>
          <h1 className="mt-4 max-w-[14ch] font-display text-fm-hero font-bold tracking-[-.06em] text-[var(--fm-text-primary)]">
            Sole Business Registration
          </h1>
          <p className="mt-6 max-w-2xl text-fm-body text-[var(--fm-text-secondary)]">
            Complete your sole business registration application with your business, contact and
            CNIC details.
          </p>
        </div>
        <Card
          variant="elevated"
          className="mb-8 flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8"
        >
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[.12em] text-[var(--fm-text-tertiary)]">
              Service fee
            </p>
            <p className="mt-2 text-3xl font-bold tracking-[-.04em] text-[var(--fm-text-primary)]">
              PKR 1,500
            </p>
          </div>
          <StartApplicationButton
            serviceSlug="pak-sole-business-registration"
            size="lg"
            className="shrink-0"
          >
            Proceed to payment →
          </StartApplicationButton>
        </Card>
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <Card variant="standard" className="p-6 sm:p-8">
            <SectionLabel>Application requirements</SectionLabel>
            <div className="mt-6 divide-y divide-[var(--fm-border)]">
              {[
                "CNIC — front and back",
                "Phone number registered on your CNIC",
                "Email address",
                "Name of business",
                "Nature of business",
                "Office address",
              ].map((item, index) => (
                <div key={item} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <span className="font-mono text-[10px] font-bold text-[var(--fm-lime-bright)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-medium text-[var(--fm-text-primary)]">{item}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card variant="standard" className="p-6 sm:p-8">
            <SectionLabel>Payment</SectionLabel>
            <h2 className="mt-4 text-xl font-semibold tracking-[-.02em] text-[var(--fm-text-primary)]">
              Pay the service fee
            </h2>
            <p className="mt-6 text-sm leading-6 text-[var(--fm-text-secondary)]">
              The application collects the required information and CNIC documents before proceeding
              through the normal payment flow.
            </p>
          </Card>
        </div>
      </div>
    </main>
  );
}
