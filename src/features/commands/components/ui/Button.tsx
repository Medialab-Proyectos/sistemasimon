import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

export function Button({
  className = "",
  variant = "primary",
  size = "md",
  ...props
}: Readonly<
  ComponentProps<"button"> & {
    variant?: Variant;
    size?: Size;
  }
>) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:opacity-50 disabled:pointer-events-none";

  const byVariant: Record<Variant, string> = {
    primary:
      "bg-[var(--color-primary)] text-[color:var(--color-primary-foreground)] hover:opacity-90",
    secondary:
      "bg-[var(--color-surface)] text-[color:var(--color-text)] border border-[color:var(--color-border-subtle)] hover:bg-[var(--color-surface-elevated)]",
    ghost:
      "bg-transparent text-[color:var(--color-text-muted)] hover:bg-[var(--color-surface-elevated)]",
  };

  const bySize: Record<Size, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
  };

  return (
    <button
      {...props}
      className={`${base} ${byVariant[variant]} ${bySize[size]} ${className}`}
    />
  );
}
