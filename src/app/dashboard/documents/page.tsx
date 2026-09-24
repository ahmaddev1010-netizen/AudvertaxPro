"use client";

import Link from "next/link";
import { CheckCircle2, Clock3, Download, FileText, Upload } from "lucide-react";
import { useApplicationState } from "@/components/application/ApplicationStateProvider";
import { getDocumentsForService } from "@/lib/documents/catalog";
import { resolveDashboardDocument } from "@/lib/documents/dashboard-resolution";
import { Card, IconContainer, StatusBadge, SectionLabel } from "@/components/ui/design-system";
import { Button } from "@/components/ui/button";
import { Progress, EmptyState, SectionHeader } from "@/components/ui/interaction-controls";

const statusConfig: Record<
  string,
  { label: string; icon: typeof Upload; tone: "warning" | "neutral" | "info" | "success" }
> = {
  required: { label: "Required", icon: Upload, tone: "warning" },
  requested: { label: "Pending", icon: Clock3, tone: "neutral" },
  uploaded: { label: "Uploaded", icon: FileText, tone: "info" },
  approved: { label: "Approved", icon: CheckCircle2, tone: "success" },
};

export default function DocumentsPage() {
  const { application } = useApplicationState();

  if (!application) {
    return (
      <main className="min-h-screen bg-[var(--fm-graphite)] px-4 py-12 text-[var(--fm-text-primary)] md:px-8">
        <div className="mx-auto max-w-4xl">
          <EmptyState
            icon={<FileText size={22} />}
            title="Your documents"
            description="Documents associated with your applications will appear here."
            action={
              <Link href="/usa-llc">
                <Button>Start an LLC</Button>
              </Link>
            }
          />
        </div>
      </main>
    );
  }

  const definitions = getDocumentsForService(application.serviceSlug);
  const documents = definitions.map((definition) =>
    resolveDashboardDocument(
      definition,
      application.documents,
      application.members.map((member) => member.id),
    ),
  );
  const required = documents.filter((document) => document.required);
  const completed = documents.filter((document) => document.status === "approved").length;
  const requiredCompleted = required.filter((document) =>
    ["uploaded", "approved"].includes(document.status),
  ).length;
  const requiredComplete = required.every((document) =>
    ["uploaded", "approved"].includes(document.status),
  );
  const progress = required.length ? (requiredCompleted / required.length) * 100 : 0;

  return (
    <main className="min-h-screen bg-[var(--fm-graphite)] text-[var(--fm-text-primary)]">
      <header className="border-b border-[var(--fm-border)] bg-[var(--fm-graphite-deep)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-5 md:px-8">
          <div>
            <SectionLabel>Audvertax</SectionLabel>
            <h1 className="mt-1 font-semibold">Documents</h1>
          </div>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-[var(--fm-text-secondary)] transition-colors hover:text-[var(--fm-text-primary)]"
          >
            Back to dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 md:py-12">
        <SectionHeader
          eyebrow={application.serviceSlug}
          title="Documents"
          description="Required documents, formation documents and files made available during your service."
          className="mb-8"
        />

        <Card variant="standard" className="mb-6 p-6">
          <div className="flex flex-col gap-fm-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold">Document progress</h3>
              <p className="mt-1 text-sm text-[var(--fm-text-secondary)]">
                {completed} of {documents.length} documents approved.
              </p>
            </div>
            <div className="w-full sm:w-56">
              <div className="mb-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--fm-text-tertiary)]">
                <span>Required items</span>
                <span>
                  {requiredComplete ? "Complete" : `${requiredCompleted}/${required.length}`}
                </span>
              </div>
              <Progress value={progress} />
            </div>
          </div>
        </Card>

        <Card variant="standard" className="overflow-hidden">
          <div className="border-b border-[var(--fm-border)] px-6 py-5">
            <h3 className="font-semibold">Your files</h3>
            <p className="mt-1 font-mono text-[10px] text-[var(--fm-text-tertiary)]">
              Application ID: {application.id}
            </p>
          </div>
          <div className="divide-y divide-[var(--fm-border)]">
            {documents.map((document) => {
              const config = statusConfig[document.status] ?? statusConfig.required;
              const Icon = config.icon;
              return (
                <div
                  key={document.id}
                  className="flex flex-col gap-4 px-6 py-5 transition-colors hover:bg-[var(--fm-surface-raised)] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-start gap-4">
                    <IconContainer className="size-11">
                      <FileText size={20} />
                    </IconContainer>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-semibold">{document.name}</h4>
                        {document.required && document.status === "required" && (
                          <StatusBadge status="danger">Required</StatusBadge>
                        )}
                      </div>
                      <p className="mt-1 max-w-xl text-xs leading-5 text-[var(--fm-text-secondary)]">
                        {document.description}
                      </p>
                      {document.fileName && (
                        <p className="mt-2 font-mono text-[11px] text-[var(--fm-text-tertiary)]">
                          {document.fileName}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:shrink-0">
                    <StatusBadge status={config.tone}>
                      <Icon size={13} />
                      {config.label}
                    </StatusBadge>
                    {(document.status === "required" || document.status === "requested") && (
                      <Link href={`/apply/${application.id}?step=documents`}>
                        <Button type="button" size="sm">
                          <Upload size={14} />
                          Upload
                        </Button>
                      </Link>
                    )}
                    {document.status === "approved" && (
                      <Button type="button" size="sm" variant="outline" disabled>
                        <Download size={14} />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {!documents.length && (
            <div className="p-10 text-center text-sm text-[var(--fm-text-secondary)]">
              No document requirements have been configured for this service yet.
            </div>
          )}
        </Card>

        <Card variant="standard" className="mt-6 p-6">
          <div className="flex items-start gap-4">
            <IconContainer>
              <FileText size={19} />
            </IconContainer>
            <div>
              <h3 className="font-semibold">Your documents are protected</h3>
              <p className="mt-1 text-sm leading-6 text-[var(--fm-text-secondary)]">
                Documents are attached to the application and their current upload status is derived
                from the application's document records.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
