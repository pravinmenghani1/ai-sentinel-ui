import type { RangeBarData as RangeBarType, MeasurementState } from "@/mock/data";

interface RangeBarProps {
  data: RangeBarType | null;
  state?: MeasurementState;
  showLabels?: boolean;
  width?: string;
}

export function RangeBar({ data, state = "measured", showLabels = false, width = "100%" }: RangeBarProps) {
  if (state === "not_measured" || !data) {
    return (
      <div className="flex flex-col gap-1">
        <div className="h-1.5 rounded hatch-pattern" style={{ width }} aria-label="Not measured" />
        {showLabels && <span className="text-xs text-sentinel-text-muted font-mono">—</span>}
      </div>
    );
  }

  if (state === "attested") {
    return (
      <div className="flex flex-col gap-1">
        <div className="h-1.5 rounded hatch-pattern-dark border border-sentinel-border" style={{ width }} aria-label="Attested by a person" />
        {showLabels && <span className="text-xs text-sentinel-text-muted font-mono">attested</span>}
      </div>
    );
  }

  const leftPct = (data.low / 100) * 100;
  const widthPct = ((data.high - data.low) / 100) * 100;
  const markerPct = data.value;

  const barColor = data.value >= 85 ? "var(--sentinel-green)" : data.value >= 70 ? "var(--sentinel-teal)" : data.value >= 60 ? "var(--sentinel-amber)" : "var(--sentinel-red)";
  const markerColor = data.value >= 85 ? "var(--sentinel-green-dark)" : data.value >= 70 ? "var(--sentinel-teal-dark)" : data.value >= 60 ? "var(--sentinel-amber-dark)" : "var(--sentinel-red-dark)";

  return (
    <div className="flex flex-col gap-1">
      <div className="range-bar-track" style={{ width }} role="img" aria-label={`Catch rate ${data.value}%, 95% range ${data.low} to ${data.high}`}>
        <div
          className="range-bar-fill"
          style={{ left: `${leftPct}%`, width: `${widthPct}%`, opacity: 0.3, background: barColor }}
        />
        <div
          className="range-bar-marker"
          style={{ left: `${markerPct}%`, background: markerColor }}
        />
      </div>
      {showLabels && (
        <div className="flex justify-between text-xs text-sentinel-text-muted font-mono">
          <span>{data.low}</span>
          <span style={{ color: barColor, fontWeight: 600 }}>{data.value}%</span>
          <span>{data.high}</span>
        </div>
      )}
    </div>
  );
}
