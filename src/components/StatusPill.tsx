import type { StatusType } from "@/mock/data";

interface StatusPillProps {
  status: StatusType;
  label: string;
  size?: "sm" | "md";
}

const statusStyles: Record<StatusType, { bg: string; color: string; dot: string; border: string }> = {
  matches_policy: { bg: "bg-sentinel-green-light", color: "text-sentinel-green-dark", dot: "bg-sentinel-green", border: "border-sentinel-green/20" },
  improved: { bg: "bg-sentinel-green-light", color: "text-sentinel-green-dark", dot: "bg-sentinel-green", border: "border-sentinel-green/20" },
  weakened: { bg: "bg-sentinel-amber-light", color: "text-sentinel-amber-dark", dot: "bg-sentinel-amber", border: "border-sentinel-amber/20" },
  not_measured: { bg: "bg-sentinel-surface-alt", color: "text-sentinel-text-muted", dot: "bg-sentinel-text-muted", border: "border-sentinel-border-strong" },
  collecting: { bg: "bg-sentinel-blue-light", color: "text-sentinel-blue-dark", dot: "bg-sentinel-blue", border: "border-sentinel-blue/20" },
  signed: { bg: "bg-sentinel-teal-light", color: "text-sentinel-teal-dark", dot: "bg-sentinel-teal", border: "border-sentinel-teal/20" },
  verified: { bg: "bg-sentinel-green-light", color: "text-sentinel-green-dark", dot: "bg-sentinel-green", border: "border-sentinel-green/20" },
  pending: { bg: "bg-sentinel-amber-light", color: "text-sentinel-amber-dark", dot: "bg-sentinel-amber", border: "border-sentinel-amber/20" },
  approved: { bg: "bg-sentinel-green-light", color: "text-sentinel-green-dark", dot: "bg-sentinel-green", border: "border-sentinel-green/20" },
  rejected: { bg: "bg-sentinel-red-light", color: "text-sentinel-red-dark", dot: "bg-sentinel-red", border: "border-sentinel-red/20" },
  needs_attention: { bg: "bg-sentinel-amber-light", color: "text-sentinel-amber-dark", dot: "bg-sentinel-amber", border: "border-sentinel-amber/20" },
};

export function StatusPill({ status, label, size = "md" }: StatusPillProps) {
  const s = statusStyles[status];
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${s.bg} ${s.color} ${s.border} ${sizeClass} border whitespace-nowrap`}
    >
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${s.dot} flex-shrink-0`} aria-hidden="true" />
      {label}
    </span>
  );
}
