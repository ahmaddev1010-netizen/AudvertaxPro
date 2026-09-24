import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, IconContainer, StatusBadge } from "./design-system";

export function StatCard({
  label,
  value,
  detail,
  icon,
  status,
  className,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  detail?: React.ReactNode;
  icon?: React.ReactNode;
  status?: "success" | "info" | "warning" | "danger" | "neutral";
  className?: string;
}) {
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--fm-text-tertiary)]">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[var(--fm-text-primary)]">
            {value}
          </p>
          {detail && (
            <p className="mt-1 text-xs leading-5 text-[var(--fm-text-tertiary)]">{detail}</p>
          )}
        </div>
        {icon && <IconContainer>{icon}</IconContainer>}
      </div>
      {status && (
        <StatusBadge status={status} className="mt-4">
          {status}
        </StatusBadge>
      )}
    </Card>
  );
}

export function DashboardPanel({
  title,
  description,
  action,
  children,
  className,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <div
        className={cn(
          "flex items-start justify-between gap-4 border-b border-[var(--fm-border)] px-5 py-4",
          !title && !description && "hidden",
        )}
      >
        <div>
          {title && (
            <h3 className="text-sm font-semibold text-[var(--fm-text-primary)]">{title}</h3>
          )}
          {description && (
            <p className="mt-1 text-xs leading-5 text-[var(--fm-text-tertiary)]">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children != null && <div className="p-5">{children}</div>}
    </Card>
  );
}

export function ApplicationCard({
  title,
  subtitle,
  status,
  progress,
  meta,
  action,
  className,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  status?: React.ReactNode;
  progress?: number;
  meta?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  const safeProgress = Math.min(100, Math.max(0, progress ?? 0));
  return (
    <Card variant="interactive" className={cn("min-w-0 overflow-hidden p-5", className)}>
      <div className="">
        {action && <div className="">{action}</div>}
        <div className="">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-base font-semibold text-[var(--fm-text-primary)]">
              {title}
            </h3>
            {status}
          </div>
          {subtitle && (
            <p className="mt-1 break-words text-sm text-[var(--fm-text-secondary)]">{subtitle}</p>
          )}
          {meta && (
            <div className="mt-3 min-w-0 break-words text-xs text-[var(--fm-text-tertiary)]">
              {meta}
            </div>
          )}
        </div>
      </div>
      {/* {typeof progress === "number" && (
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--fm-text-tertiary)]">
            <span>Progress</span>
            <span>{safeProgress}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-[var(--fm-radius-pill)] bg-[var(--fm-surface-raised)]">
            <div
              className="h-full rounded-[var(--fm-radius-pill)] bg-[var(--fm-lime)] transition-[width] duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)]"
              style={{ width: `${safeProgress}%` }}
            />
          </div>
        </div>
      )} */}
    </Card>
  );
}

export function DocumentCard({
  title,
  description,
  status,
  meta,
  action,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  status?: React.ReactNode;
  meta?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card variant="interactive" className={cn("p-4", className)}>
      <div className="flex items-start gap-3">
        <IconContainer className="size-9 rounded-[var(--fm-radius-sm)]">
          {typeof title === "string" ? title.slice(0, 1).toUpperCase() : "D"}
        </IconContainer>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-medium text-[var(--fm-text-primary)]">{title}</h3>
            {status}
          </div>
          {description && (
            <p className="mt-1 text-xs leading-5 text-[var(--fm-text-tertiary)]">{description}</p>
          )}
          {meta && (
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--fm-text-tertiary)]">
              {meta}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </Card>
  );
}

export function NotificationItem({
  title,
  description,
  timestamp,
  status,
  unread = false,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  timestamp?: React.ReactNode;
  status?: React.ReactNode;
  unread?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex gap-3 border-b border-[var(--fm-border-soft)] px-4 py-4 last:border-b-0",
        className,
      )}
    >
      <div
        className={cn(
          "mt-1.5 size-2 shrink-0 rounded-full",
          unread ? "bg-[var(--fm-lime)]" : "bg-[var(--fm-border)]",
        )}
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-[var(--fm-text-primary)]">{title}</p>
          {status}
        </div>
        {description && (
          <p className="mt-1 text-xs leading-5 text-[var(--fm-text-secondary)]">{description}</p>
        )}
        {timestamp && (
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--fm-text-tertiary)]">
            {timestamp}
          </p>
        )}
      </div>
    </div>
  );
}
