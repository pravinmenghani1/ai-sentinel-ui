import { assessments } from "@/mock/data";
import { StatusPill } from "@/components/StatusPill";
import { ClipboardList } from "lucide-react";

const statusMap = {
  completed: { status: "matches_policy" as const, label: "Completed" },
  in_progress: { status: "collecting" as const, label: "In progress" },
  scheduled: { status: "pending" as const, label: "Scheduled" },
};

export function Assessments() {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-sentinel-text mb-1">Assessments</h1>
        <p className="text-sm text-sentinel-text-secondary">
          Monthly and on-change test runs for each guardrail. Each assessment runs the full attack test set.
        </p>
      </div>

      <div className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-sentinel-border bg-sentinel-surface-alt">
              <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Assessment</th>
              <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Guardrail</th>
              <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Date</th>
              <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Catch rate</th>
              <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Tests</th>
              <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Status</th>
            </tr>
          </thead>
          <tbody>
            {assessments.map((a) => (
              <tr key={a.id} className="border-b border-sentinel-border last:border-b-0 hover:bg-sentinel-surface-alt transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-blue flex items-center justify-center flex-shrink-0">
                      <ClipboardList className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="font-medium text-sentinel-text">{a.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sentinel-text-secondary">{a.guardrailName}</td>
                <td className="px-4 py-3 font-mono text-xs text-sentinel-text-secondary">{a.date}</td>
                <td className="px-4 py-3">
                  {a.catchRate !== null ? (
                    <span className="font-mono font-medium text-sentinel-teal-dark">{a.catchRate}%</span>
                  ) : (
                    <span className="font-mono text-sentinel-text-muted">—</span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-sentinel-text-secondary">{a.testCount.toLocaleString()}</td>
                <td className="px-4 py-3"><StatusPill status={statusMap[a.status].status} label={statusMap[a.status].label} size="sm" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
