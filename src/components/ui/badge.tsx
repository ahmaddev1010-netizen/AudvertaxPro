import * as React from "react";
import { cn } from "@/lib/utils";

const variants = {
  neutral: "bg-[var(--fm-surface-raised)] text-[var(--fm-text-secondary)]",
  success: "bg-[var(--fm-success-soft)] text-[var(--fm-success)]",
  info: "bg-[var(--fm-info-soft)] text-[var(--fm-info)]",
  warning: "bg-[var(--fm-warning-soft)] text-[var(--fm-warning)]",
  danger: "bg-[var(--fm-danger-soft)] text-[var(--fm-danger)]",
  accent: "bg-[var(--fm-lime-soft)] text-[var(--fm-lime-bright)]",
} as const;

export function Badge({
  variant = "neutral",
  dot = false,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: keyof typeof variants;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-[var(--fm-radius-pill)] px-2.5 font-mono text-[11px] font-medium leading-none",
        variants[variant],
        className,
      )}
      {...props}
    >
      {dot && <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
