import * as React from "react";
import { cn } from "@/lib/utils";

type CardTone = "default" | "lime" | "dark";
type CardStyle = React.CSSProperties & Record<`--${string}`, string>;

const cardBase =
  "rounded-[var(--fm-radius-xl)] border border-[var(--fm-card-border)] bg-[var(--fm-card-bg)] text-[var(--fm-card-text)] shadow-[var(--fm-shadow-subtle)] transition-[transform,border-color,background-color,box-shadow] duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)]";

export const cardVariants = {
  standard: cardBase,
  elevated: `${cardBase} shadow-[var(--fm-shadow-elevated)]`,
  interactive: `${cardBase} rounded-[var(--fm-radius-feature)] border-[var(--fm-card-interactive-border)] bg-[linear-gradient(158deg,var(--fm-card-tint-strong)_0%,var(--fm-card-tint-soft)_32%,var(--fm-card-interactive-gradient-highlight)_70%,var(--fm-card-interactive-gradient-end)_100%)] shadow-[var(--fm-card-interactive-shadow)] backdrop-blur-xl [transform:rotate(var(--fm-card-rotate))] hover:[transform:translateY(-10px)_rotate(0deg)_scale(1.03)] hover:border-[var(--fm-card-interactive-border)] hover:shadow-[var(--fm-card-interactive-hover-shadow)]`,
  feature: `${cardBase} rounded-[var(--fm-radius-feature)] shadow-[var(--fm-shadow-elevated)]`,
} as const;

const cardInteractiveDefaults: CardStyle = {
  "--fm-card-tint-strong": "var(--fm-card-tint-blue-strong)",
  "--fm-card-tint-soft": "var(--fm-card-tint-blue-soft)",
  "--fm-card-marker": "var(--fm-card-tint-blue-marble)",
  "--fm-card-rotate": "0deg",
};

const cardToneStyles: Record<CardTone, CardStyle> = {
  default: {
    "--fm-card-bg": "var(--fm-surface)",
    "--fm-card-hover-bg": "var(--fm-surface-raised)",
    "--fm-card-text": "var(--fm-text-primary)",
    "--fm-card-muted": "var(--fm-text-secondary)",
    "--fm-card-border": "var(--fm-lime)",
    "--fm-card-divider": "var(--fm-border)",
    "--fm-card-action-bg": "var(--fm-lime)",
    "--fm-card-action-text": "var(--fm-graphite-deep)",
    "--fm-card-action-hover-bg": "var(--fm-lime-bright)",
  },
  lime: {
    "--fm-card-bg": "var(--fm-lime)",
    "--fm-card-hover-bg": "var(--fm-lime)",
    "--fm-card-text": "var(--fm-graphite-deep)",
    "--fm-card-muted": "var(--fm-graphite-deep)",
    "--fm-card-border": "var(--fm-lime)",
    "--fm-card-divider": "color-mix(in srgb, var(--fm-graphite-deep) 25%, transparent)",
    "--fm-card-action-bg": "var(--fm-graphite-deep)",
    "--fm-card-action-text": "var(--fm-lime)",
    "--fm-card-action-hover-bg": "var(--fm-graphite)",
  },
  dark: {
    "--fm-card-bg": "var(--fm-surface-raised)",
    "--fm-card-hover-bg": "var(--fm-surface-raised)",
    "--fm-card-text": "var(--fm-text-primary)",
    "--fm-card-muted": "var(--fm-text-secondary)",
    "--fm-card-border": "var(--fm-lime)",
    "--fm-card-divider": "color-mix(in srgb, var(--fm-lime) 20%, transparent)",
    "--fm-card-action-bg": "var(--fm-lime)",
    "--fm-card-action-text": "var(--fm-graphite-deep)",
    "--fm-card-action-hover-bg": "var(--fm-lime-bright)",
  },
};

export function Card({
  className,
  variant = "standard",
  tone = "default",
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: keyof typeof cardVariants;
  tone?: CardTone;
}) {
  return (
    <div
      className={cn(cardVariants[variant], className)}
      style={{ ...cardInteractiveDefaults, ...cardToneStyles[tone], ...style } as CardStyle}
      {...props}
    />
  );
}

export function CardAction({ className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cn(
        "flex w-full items-center justify-center gap-2 rounded-[var(--fm-radius-pill)] bg-(--fm-card-action-bg) px-4 py-[15px] text-center text-[15.5px] font-semibold text-(--fm-card-action-text) transition-[transform,background-color,color] duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)] hover:-translate-y-0.5 hover:bg-(--fm-card-action-hover-bg)",
        className,
      )}
      {...props}
    />
  );
}

export function SectionLabel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "font-mono text-fm-label font-bold uppercase tracking-fm-label text-[var(--fm-lime)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function StatusBadge({
  status,
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  status: "success" | "info" | "warning" | "danger" | "neutral";
}) {
  const styles = {
    success: "bg-[var(--fm-success-soft)] text-[var(--fm-success)]",
    info: "bg-[var(--fm-info-soft)] text-[var(--fm-info)]",
    warning: "bg-[var(--fm-warning-soft)] text-[var(--fm-warning)]",
    danger: "bg-[var(--fm-danger-soft)] text-[var(--fm-danger)]",
    neutral: "bg-[var(--fm-surface-raised)] text-[var(--fm-text-secondary)]",
  };
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-[var(--fm-radius-pill)] px-2.5 font-mono text-[11px] font-medium",
        styles[status],
        className,
      )}
      {...props}
    />
  );
}

export function IconContainer({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-surface-raised)] text-[var(--fm-lime)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("space-y-3", className)}>
      {eyebrow && <SectionLabel>{eyebrow}</SectionLabel>}
      <h1 className="text-3xl font-semibold tracking-[-0.045em] text-[var(--fm-text-primary)] sm:text-4xl">
        {title}
      </h1>
      {description && (
        <p className="max-w-2xl text-sm leading-6 text-[var(--fm-text-secondary)] sm:text-base">
          {description}
        </p>
      )}
    </header>
  );
}
