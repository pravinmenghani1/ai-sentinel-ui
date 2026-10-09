import { AlertTriangle, ChevronRight } from "lucide-react";
import { incidents } from "@/mock/data";
import { StatusPill } from "@/components/StatusPill";

const severityColor = {
  high: "text-sentinel-red",
  medium: "text-sentinel-amber",
  low: "text-sentinel-text-muted",
};

const severityBg = {
  high: "bg-gradient-red",
  medium: "bg-gradient-amber",
  low: "bg-sentinel-surface-alt",
};

const statusMap = {
  open: { status: "weakened" as const, label: "Open" },
  investigating: { status: "pending" as const, label: "Investigating" },
  resolved: { status: "matches_policy" as const, label: "Resolved" },
};

export function Incidents() {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-sentinel-text mb-1">Incidents</h1>
        <p className="text-sm text-sentinel-text-secondary">
          Guardrail failures, bypasses, and anomalies detected by Sentinel or reported by your team.
        </p>
      </div>

      <div className="space-y-3">
        {incidents.map((incident) => (
          <div key={incident.id} className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden hover:border-sentinel-border-strong hover:shadow-md card-lift transition-all cursor-pointer">
            <div className="p-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${severityBg[incident.severity]}`}>
                    <AlertTriangle className={`w-4 h-4 ${incident.severity === "high" || incident.severity === "medium" ? "text-white" : severityColor[incident.severity]}`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-sentinel-text">{incident.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-sentinel-text-muted flex-wrap">
                      <span className="font-mono">{incident.guardrailName}</span>
                      <span>·</span>
                      <span>Opened {incident.openedAt}</span>
                      <span>·</span>
                      <span className={`font-bold ${severityColor[incident.severity]}`}>{incident.severity} severity</span>
                    </div>
                    <p className="text-sm text-sentinel-text-secondary mt-2 leading-relaxed">{incident.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <StatusPill status={statusMap[incident.status].status} label={statusMap[incident.status].label} size="sm" />
                  <ChevronRight className="w-4 h-4 text-sentinel-text-muted" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
