interface HonestNumberProps {
  caught: number | null;
  total: number | null;
  percentage: number | null;
  state?: "measured" | "attested" | "not_measured";
  showRange?: string | null;
  size?: "sm" | "md" | "lg";
  tooFew?: boolean;
}

export function HonestNumber({
  caught,
  total,
  percentage,
  state = "measured",
  showRange,
  size = "md",
  tooFew = false,
}: HonestNumberProps) {
  const sizeClass = {
    sm: "text-base",
    md: "text-2xl",
    lg: "text-4xl",
  }[size];

  const subSizeClass = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }[size];

  if (state === "not_measured" || (caught === null && total === null)) {
    return (
      <div className="flex flex-col gap-0.5">
        <span className={`${sizeClass} font-mono text-sentinel-text-muted hatch-pattern-dark px-2 rounded`}>
          —
        </span>
        <span className={`${subSizeClass} text-sentinel-text-muted`}>Not measured</span>
      </div>
    );
  }

  if (state === "attested") {
    return (
      <div className="flex flex-col gap-0.5">
        <span className={`${sizeClass} font-mono text-sentinel-amber`}>attested</span>
        <span className={`${subSizeClass} text-sentinel-text-muted`}>Attested by a person</span>
      </div>
    );
  }

  if (tooFew) {
    return (
      <div className="flex flex-col gap-0.5">
        <span className={`${sizeClass} font-mono text-sentinel-text-muted`}>too few to judge</span>
        <span className={`${subSizeClass} text-sentinel-text-muted`}>
          {caught} of {total} samples
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      <span className={`${sizeClass} font-mono font-medium text-sentinel-text`}>
        {percentage}%
      </span>
      <span className={`${subSizeClass} text-sentinel-text-secondary font-mono`}>
        {caught?.toLocaleString()} of {total?.toLocaleString()}
        {showRange && <span className="text-sentinel-text-muted"> · 95% range {showRange}</span>}
      </span>
    </div>
  );
}
