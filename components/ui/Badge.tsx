const TONES: Record<string, string> = {
  pink: "bg-pink/15 text-pink border-pink/30",
  ice: "bg-ice/15 text-ice border-ice/30",
  grey: "bg-grey/15 text-grey border-grey/30",
  neutral: "bg-white/[0.06] text-ink-dim border-white/10",
};

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: keyof typeof TONES }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${TONES[tone]}`}>
      {children}
    </span>
  );
}
