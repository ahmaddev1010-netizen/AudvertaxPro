import * as React from "react";
import { cn } from "@/lib/utils";

export function Tabs({
  value,
  onValueChange,
  children,
  className,
}: {
  value: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div data-value={value} className={className}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{
                value?: string;
                activeValue?: string;
                onValueChange?: (value: string) => void;
              }>,
              { activeValue: value, onValueChange },
            )
          : child,
      )}
    </div>
  );
}

export function TabsList({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex items-center gap-1 rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-surface)] p-1",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  activeValue,
  onValueChange,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value: string;
  activeValue?: string;
  onValueChange?: (value: string) => void;
}) {
  const active = value === activeValue;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={() => onValueChange?.(value)}
      className={cn(
        "h-8 rounded-[var(--fm-radius-sm)] px-3 text-xs font-medium transition-[background-color,color,border-color] duration-[var(--fm-motion-micro)] ease-[var(--fm-motion-ease)]",
        active
          ? "bg-[var(--fm-surface-raised)] text-[var(--fm-text-primary)] shadow-[var(--fm-shadow-subtle)]"
          : "text-[var(--fm-text-tertiary)] hover:bg-[var(--fm-surface-raised)] hover:text-[var(--fm-text-primary)]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Progress({ value = 0, className }: { value?: number; className?: string }) {
  const safeValue = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={safeValue}
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-[var(--fm-radius-pill)] bg-[var(--fm-surface-raised)]",
        className,
      )}
    >
      <div
        className="h-full rounded-[var(--fm-radius-pill)] bg-[var(--fm-lime)] transition-[width] duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)]"
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
}

export function LoadingState({
  label = "Loading...",
  className,
}: {
  label?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--fm-text-tertiary)]",
        className,
      )}
    >
      {label}
    </div>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-52 flex-col items-center justify-center rounded-[var(--fm-radius-xl)] border border-dashed border-[var(--fm-border)] bg-[var(--fm-surface)] px-6 py-10 text-center",
        className,
      )}
    >
      {icon && <div className="mb-4 text-[var(--fm-text-tertiary)]">{icon}</div>}
      <h3 className="text-base font-semibold text-[var(--fm-text-primary)]">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-md text-sm leading-6 text-[var(--fm-text-tertiary)]">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}
    >
      <div>
        {eyebrow && (
          <div className="mb-2 font-mono text-fm-label font-bold uppercase tracking-fm-label text-[var(--fm-lime)]">
            {eyebrow}
          </div>
        )}
        <h2 className="text-2xl font-semibold tracking-[-0.035em] text-[var(--fm-text-primary)] sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--fm-text-secondary)]">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
