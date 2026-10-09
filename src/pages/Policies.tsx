import { FileText, Plus, ChevronRight } from "lucide-react";

const policies = [
  {
    id: "pol-3",
    name: "Customer-facing guardrail policy v3",
    status: "active",
    minCatchRate: 80,
    retestWindow: "1h after any change",
    requiredApprovals: 2,
    appliesTo: ["support-bot", "claims-agent", "chat-prod route"],
    updated: "20 days ago",
    gradient: "bg-gradient-primary",
  },
  {
    id: "pol-2",
    name: "Claims processing policy v2",
    status: "active",
    minCatchRate: 75,
    retestWindow: "24h after any change",
    requiredApprovals: 1,
    appliesTo: ["claims-agent"],
    updated: "45 days ago",
    gradient: "bg-gradient-amber",
  },
  {
    id: "pol-1",
    name: "Internal chat policy v1",
    status: "active",
    minCatchRate: 85,
    retestWindow: "24h after any change",
    requiredApprovals: 1,
    appliesTo: ["chat-prod route"],
    updated: "90 days ago",
    gradient: "bg-gradient-blue",
  },
  {
    id: "pol-kyc",
    name: "KYC compliance policy v1",
    status: "active",
    minCatchRate: 90,
    retestWindow: "Monthly",
    requiredApprovals: 2,
    appliesTo: ["kyc-assistant"],
    updated: "28 days ago",
    gradient: "bg-gradient-violet",
  },
];

export function Policies() {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-sentinel-text mb-1">Policies</h1>
          <p className="text-sm text-sentinel-text-secondary">
            Guardrail policies define minimum catch rates, re-test windows, and approval requirements. Changes require two approvals.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-primary text-white text-sm font-bold hover:opacity-90 transition-opacity touch-target shadow-glow-teal">
          <Plus className="w-4 h-4" />
          New policy
        </button>
      </div>

      <div className="space-y-3">
        {policies.map((policy) => (
          <div key={policy.id} className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden hover:border-sentinel-border-strong hover:shadow-md card-lift transition-all cursor-pointer">
            <div className="p-4 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-10 h-10 rounded-lg ${policy.gradient} flex items-center justify-center flex-shrink-0`}>
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-sentinel-text">{policy.name}</h3>
                  <p className="text-xs text-sentinel-text-muted mt-0.5">Updated {policy.updated}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="text-right">
                  <p className="text-xs text-sentinel-text-muted">Min catch rate</p>
                  <p className="font-mono text-sm font-bold text-sentinel-teal-dark">{policy.minCatchRate}%</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-sentinel-text-muted">Re-test</p>
                  <p className="text-sm text-sentinel-text">{policy.retestWindow}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-sentinel-text-muted">Approvals</p>
                  <p className="font-mono text-sm font-bold text-sentinel-text">{policy.requiredApprovals}</p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-sentinel-text-muted">Applies to</p>
                  <p className="text-sm text-sentinel-text-secondary">{policy.appliesTo.join(", ")}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-sentinel-text-muted flex-shrink-0" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
