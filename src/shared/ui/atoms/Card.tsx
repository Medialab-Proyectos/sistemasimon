import type { ComponentProps } from "react";

export function Card({
  className = "",
  ...props
}: Readonly<ComponentProps<"div">>) {
  return (
    <div
      {...props}
      // Use elevated surface so cards are visible on dark backgrounds.
      className={`rounded-2xl border border-border-subtle bg-surface-elevated ${className}`}
    />
  );
}

