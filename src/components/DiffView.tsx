interface DiffRow {
  field: string;
  oldValue: string;
  newValue: string;
}

interface DiffViewProps {
  diff: DiffRow[];
}

export function DiffView({ diff }: DiffViewProps) {
  return (
    <div className="border border-sentinel-border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-sentinel-border bg-sentinel-surface-alt">
            <th className="text-left px-3 py-2 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Setting</th>
            <th className="text-left px-3 py-2 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Before</th>
            <th className="text-left px-3 py-2 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">After</th>
          </tr>
        </thead>
        <tbody>
          {diff.map((row, i) => (
            <tr key={i} className={i < diff.length - 1 ? "border-b border-sentinel-border" : ""}>
              <td className="px-3 py-2 text-sentinel-text font-medium">{row.field}</td>
              <td className="px-3 py-2 font-mono text-sm text-sentinel-red-dark bg-sentinel-red-light/50">
                <span className="mr-1 text-sentinel-red">−</span>
                {row.oldValue}
              </td>
              <td className="px-3 py-2 font-mono text-sm text-sentinel-green-dark bg-sentinel-green-light/50">
                <span className="mr-1 text-sentinel-green">+</span>
                {row.newValue}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
