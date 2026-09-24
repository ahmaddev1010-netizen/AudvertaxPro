import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
  showClose = true,
}: {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  showClose?: boolean;
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open || !mounted) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, mounted, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex min-h-[100dvh] items-center justify-center overflow-y-auto bg-black/70 px-4 py-6 backdrop-blur-[2px]"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "fm-modal-title" : undefined}
        className={cn(
          "my-auto w-full max-w-lg rounded-[var(--fm-radius-feature)] border border-[var(--fm-border)] bg-[var(--fm-surface)] p-6 text-[var(--fm-text-primary)] shadow-[var(--fm-shadow-modal)]",
          className,
        )}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {(title || description || showClose) && (
          <header className="mb-6 flex items-start gap-4">
            <div className="min-w-0 flex-1 space-y-1.5">
              {title && (
                <h2 id="fm-modal-title" className="text-lg font-semibold tracking-[-0.02em]">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-sm leading-6 text-[var(--fm-text-secondary)]">{description}</p>
              )}
            </div>
            {showClose && (
              <button
                type="button"
                aria-label="Close dialog"
                onClick={onClose}
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-[var(--fm-radius-md)] border border-[var(--fm-border)] bg-[var(--fm-surface-raised)] text-[var(--fm-text-secondary)] transition-[background-color,border-color,color] duration-[var(--fm-motion-micro)] hover:border-[var(--fm-border-accent)] hover:bg-[var(--fm-surface-high)] hover:text-[var(--fm-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--fm-lime-soft)]"
              >
                <X size={18} weight="regular" />
              </button>
            )}
          </header>
        )}
        {children}
      </section>
    </div>,
    document.body,
  );
}
