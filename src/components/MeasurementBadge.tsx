import type { MeasurementState } from "@/mock/data";

interface MeasurementBadgeProps {
  state: MeasurementState;
  size?: "sm" | "md";
}

const labels: Record<MeasurementState, { text: string }> = {
  measured: { text: "Measured" },
  attested: { text: "Attested" },
  not_measured: { text: "Not measured" },
};

export function MeasurementBadge({ state, size = "md" }: MeasurementBadgeProps) {
  const l = labels[state];
  const sizeClass = size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1";

  if (state === "not_measured") {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded font-mono font-semibold hatch-pattern-dark border border-sentinel-border-strong text-sentinel-text-muted ${sizeClass}`}
        title="Not measured"
      >
        {l.text}
      </span>
    );
  }

  if (state === "attested") {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded font-mono font-semibold border border-sentinel-amber/20 bg-sentinel-amber-light text-sentinel-amber-dark ${sizeClass}`}
        title="Attested by a person, not measured"
      >
        {l.text}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded font-mono font-semibold bg-sentinel-teal-light text-sentinel-teal-dark border border-sentinel-teal/20 ${sizeClass}`}
      title="Measured"
    >
      {l.text}
    </span>
  );
}
