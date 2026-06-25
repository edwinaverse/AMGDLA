import { ReactNode } from "react";

export function SectionHeader({
  children,
  subtitle,
  action,
}: {
  children: ReactNode;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2 className="section-header">{children}</h2>
        {subtitle && <p className="mt-1 pl-3 text-sm text-ink-dim">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
