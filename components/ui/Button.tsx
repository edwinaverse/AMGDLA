import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "ghost" | "danger";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-pink/90 text-surface hover:bg-pink",
  ghost: "bg-white/[0.04] text-ink-dim border border-white/10 hover:bg-white/[0.08] hover:text-ink",
  danger: "bg-white/[0.04] text-ink-faint border border-white/10 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/30",
};

export function Button({
  variant = "ghost",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}
