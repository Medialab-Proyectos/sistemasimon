import type { ComponentProps } from "react";

export function Input({
  className = "",
  ...props
}: Readonly<ComponentProps<"input">>) {
  return (
    <input
      {...props}
      className={`h-10 w-full rounded-xl border border-border-subtle bg-surface px-3 text-sm text-text outline-none transition placeholder:text-text-muted focus:ring-2 focus:ring-primary ${className}`}
    />
  );
}

