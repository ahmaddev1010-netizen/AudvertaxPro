"use client";

import Link from "next/link";
import { CheckCircle2, FileText, XCircle } from "lucide-react";
import {
  useApplicationState,
  type ApplicationStatus,
} from "@/components/application/ApplicationStateProvider";
import { getServiceBySlug } from "@/lib/services";
import { StatusBadge } from "@/components/ui/design-system";
import { ApplicationCard } from "@/components/ui/composite";
import { EmptyState, SectionHeader } from "@/components/ui/interaction-controls";
import { buttonVariants } from "@/components/ui/button";
import { deleteApplication } from "@/lib/api";

function getStatusTone(
  status: ApplicationStatus,
): "success" | "info" | "warning" | "danger" | "neutral" {
  if (status === "completed") return "success";
  if (["paid", "processing"].includes(status)) return "info";
  if (["ready_for_payment", "submitted", "changes_requested"].includes(status)) return "warning";
  if (status === "cancelled") return "danger";
  return "neutral";
}

function getStatusLabel(status: ApplicationStatus) {
  return status.replaceAll("_", " ").replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}

export default function MyApplications() {
  const { applications, hydrated } = useApplicationState();

  if (!hydrated) {
    return (
      <div className="rounded-[var(--fm-radius-xl)] border border-[var(--fm-border)] bg-[var(--fm-surface)] p-6 text-sm text-[var(--fm-text-secondary)]">
        Loading your applications...
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <EmptyState
        icon={<FileText size={28} />}
        title="No applications yet"
        description="Start a service application and it will appear here."
        action={
          <Link className={buttonVariants()} href="/services">
            Explore services
          </Link>
        }
      />
    );
  }

  return (
    <section>
      <SectionHeader
        eyebrow="Portfolio"
        title="My Applications"
        description="Your submitted service applications."
        action={
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--fm-text-tertiary)]">
            {applications.length} total
          </span>
        }
      />
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {applications.map((application) => {
          const service = getServiceBySlug(application.serviceSlug);
          const status = application.status;
          const canCancel = status === "submitted" || status === "ready_for_payment";
          async function cancelApplication() {
            if (
              !window.confirm(
                "Cancel this application? Its application data, documents and pending billing will be removed.",
              )
            )
              return;
            await deleteApplication(application.id);
            window.location.reload();
          }
          return (
            <ApplicationCard
              key={application.id}
              title={service?.name ?? application.serviceSlug}
              subtitle="Service application"
              status={
                <StatusBadge status={getStatusTone(status)}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {getStatusLabel(status)}
                </StatusBadge>
              }
              meta={
                <>
                  {status === "draft" ? "Started" : "Submitted"}{" "}
                  {new Date(application.createdAt).toLocaleDateString()}
                </>
              }
              action={
                <div className="flex gap-3 pb-5">
                  <Link
                    className={buttonVariants({ variant: "outline", size: "sm" }) + " max-w-full"}
                    href={`/dashboard/application?id=${encodeURIComponent(application.id)}`}
                  >
                    View
                    <CheckCircle2 size={15} />
                  </Link>
                  {status === "ready_for_payment" && (
                    <Link
                      className={buttonVariants({ size: "sm" }) + " max-w-full"}
                      href={`/checkout?applicationId=${encodeURIComponent(application.id)}`}
                    >
                      Continue to checkout
                    </Link>
                  )}
                  {canCancel && (
                    <button
                      type="button"
                      onClick={cancelApplication}
                      className={
                        buttonVariants({ variant: "destructive", size: "sm" }) + "max-w-full"
                      }
                    >
                      Cancel <XCircle size={15} />
                    </button>
                  )}
                </div>
              }
            />
          );
        })}
      </div>
    </section>
  );
}
