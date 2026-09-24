import { cva, type VariantProps } from "class-variance-authority";
import { cloneElement, isValidElement, type ButtonHTMLAttributes, type ReactElement } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center border text-sm font-medium whitespace-nowrap transition-[transform,background-color,border-color,color,box-shadow] duration-[var(--fm-motion-component)] ease-[var(--fm-motion-ease)] outline-none select-none focus-visible:border-[var(--fm-lime)] focus-visible:ring-3 focus-visible:ring-[var(--fm-lime-soft)] active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "rounded-[var(--fm-radius-pill)] border-[var(--fm-lime)] bg-[var(--fm-lime)] text-[var(--fm-graphite-deep)] hover:border-[var(--fm-lime-bright)] hover:bg-[var(--fm-lime-bright)]",
        outline:
          "rounded-[var(--fm-radius-pill)] border-[var(--fm-border)] bg-[var(--fm-surface)] text-[var(--fm-text-primary)] hover:border-[var(--fm-border-accent)] hover:bg-[var(--fm-surface-raised)]",
        secondary:
          "rounded-[var(--fm-radius-pill)] border-[var(--fm-border)] bg-[var(--fm-surface-raised)] text-[var(--fm-text-primary)] hover:border-[var(--fm-border-accent)] hover:bg-[var(--fm-surface)]",
        ghost:
          "rounded-[var(--fm-radius-md)] border-transparent text-[var(--fm-text-secondary)] hover:bg-[var(--fm-surface-raised)] hover:text-[var(--fm-text-primary)]",
        destructive:
          "rounded-[var(--fm-radius-pill)] border-[var(--fm-danger)]/30 bg-[var(--fm-danger-soft)] text-[var(--fm-danger)] hover:bg-[var(--fm-danger)]/20",
        link: "rounded-[var(--fm-radius-sm)] border-transparent text-[var(--fm-lime)] hover:text-[var(--fm-lime-bright)] hover:underline underline-offset-4",
        card: "w-full rounded-[var(--fm-radius-pill)] border-transparent bg-(--fm-card-action-bg) px-4 py-[15px] text-[15.5px] font-semibold text-(--fm-card-action-text) hover:border-transparent hover:bg-(--fm-card-action-hover-bg) hover:text-(--fm-card-action-text) hover:-translate-y-0.5",
      },
      size: {
        default: "h-10 gap-1.5 px-4",
        xs: 'h-7 gap-1 rounded-[var(--fm-radius-sm)] px-2 text-xs [&_svg:not([class*="size-"])]:size-3',
        sm: "h-8 gap-1.5 rounded-[var(--fm-radius-md)] px-3 text-[0.8rem]",
        lg: "h-12 gap-2 px-5",
        icon: "size-10 rounded-[var(--fm-radius-md)]",
        "icon-xs": 'size-7 rounded-[var(--fm-radius-sm)] [&_svg:not([class*="size-"])]:size-3',
        "icon-sm": "size-8 rounded-[var(--fm-radius-md)]",
        "icon-lg": "size-12 rounded-[var(--fm-radius-md)]",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

type ButtonRender = ReactElement<any>;
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    render?: ButtonRender;
    asChild?: boolean;
  };

function Button({
  className,
  variant = "default",
  size = "default",
  render,
  asChild = false,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size, className }));

  if (render) {
    return cloneElement(render, {
      ...props,
      className: cn(render.props.className, classes),
      children,
    });
  }

  if (asChild && isValidElement(children)) {
    const child = children as ButtonRender;
    return cloneElement(child, {
      ...props,
      className: cn(child.props.className, classes),
    });
  }

  return (
    <button data-slot="button" className={classes} {...props}>
      {children}
    </button>
  );
}

export { Button, buttonVariants };
