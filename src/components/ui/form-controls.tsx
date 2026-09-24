import * as React from "react";
import { cn } from "@/lib/utils";

export const controlClassName =
  "h-11 w-full rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] px-3 text-sm text-[var(--fm-text-primary)] placeholder:text-[var(--fm-text-tertiary)] outline-none transition-[border-color,box-shadow,background-color] duration-[var(--fm-motion-micro)] focus:border-[var(--fm-lime)] focus:ring-2 focus:ring-[var(--fm-lime-soft)] disabled:cursor-not-allowed disabled:opacity-50";

export const textareaClassName =
  "min-h-28 w-full rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-graphite-deep)] px-3 py-2.5 text-sm text-[var(--fm-text-primary)] placeholder:text-[var(--fm-text-tertiary)] outline-none transition-[border-color,box-shadow] duration-[var(--fm-motion-micro)] focus:border-[var(--fm-lime)] focus:ring-2 focus:ring-[var(--fm-lime-soft)] disabled:cursor-not-allowed disabled:opacity-50";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(controlClassName, className)} {...props} />;
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(textareaClassName, className)} {...props} />;
}

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(controlClassName, "appearance-none", className)} {...props} />;
}

export function FieldLabel({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("text-sm font-medium text-[var(--fm-text-primary)]", className)}
      {...props}
    />
  );
}

export function FieldHint({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("mt-1.5 text-xs leading-5 text-[var(--fm-text-tertiary)]", className)}
      {...props}
    />
  );
}
