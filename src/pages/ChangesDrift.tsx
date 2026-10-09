import { Link } from "react-router-dom";
import { TrendingDown, TrendingUp, Minus, Mail, Webhook, Bell, ChevronRight, GitBranch } from "lucide-react";
import { settingChanges } from "@/mock/data";
import { DiffView } from "@/components/DiffView";
import { StatusPill } from "@/components/StatusPill";

const retestStatusMap = {
  weakened: { status: "weakened" as const, label: "Weakened", icon: TrendingDown, color: "text-sentinel-amber-dark" },
  improved: { status: "improved" as const, label: "Improved", icon: TrendingUp, color: "text-sentinel-green-dark" },
  no_change: { status: "matches_policy" as const, label: "No change", icon: Minus, color: "text-sentinel-text-muted" },
  not_run: { status: "not_measured" as const, label: "Not run", icon: Minus, color: "text-sentinel-text-muted" },
};

export function ChangesDrift() {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-sentinel-text mb-1">Changes & drift</h1>
        <p className="text-sm text-sentinel-text-secondary">
          Every setting change detected from cloud audit logs, with before/after diff and automatic re-test result.
        </p>
      </div>

      {/* Timeline */}
      <div className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-sentinel-border flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-amber flex items-center justify-center">
            <GitBranch className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-sentinel-text">Setting change timeline</h2>
            <p className="text-xs text-sentinel-text-secondary mt-0.5">
              Sources: AWS CloudTrail, Azure Activity Log, Google Cloud Audit Logs
            </p>
          </div>
        </div>
        <div className="divide-y divide-sentinel-border">
          {settingChanges.map((change) => {
            const r = retestStatusMap[change.retestStatus];
            return (
              <div key={change.id} className="p-4 hover:bg-sentinel-surface-alt transition-colors">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link to={`/test/scorecard/${change.guardrailId}`} className="font-semibold text-sentinel-text hover:text-sentinel-teal transition-colors">
                        {change.guardrailName}
                      </Link>
                      <span className="text-xs text-sentinel-text-muted font-mono">{change.when}</span>
                    </div>
                    <p className="text-sm text-sentinel-text-secondary mt-1">{change.setting}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-sentinel-text-muted">
                      <span className="font-mono">{change.who}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-sentinel-text-secondary mb-1">Re-test result</p>
                    {change.retestResult ? (
                      <div className="flex items-center gap-2 justify-end">
                        <span className={`font-mono font-bold ${r.color}`}>
                          {change.retestResult.percentage}%
                        </span>
                        <span className="text-xs text-sentinel-text-muted font-mono">
                          ({change.retestResult.caught.toLocaleString()} of {change.retestResult.total.toLocaleString()})
                        </span>
                        <span className={`flex items-center gap-0.5 ${r.color}`}>
                          <r.icon className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-sentinel-text-muted">Not run</span>
                    )}
                  </div>
                </div>
                <DiffView diff={change.diff} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Alert settings */}
      <div className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-sentinel-border">
          <h2 className="text-sm font-bold text-sentinel-text">Alert settings</h2>
          <p className="text-xs text-sentinel-text-secondary mt-0.5">
            Get notified when a setting change weakens a guardrail or a re-test drops below policy threshold.
          </p>
        </div>
        <div className="divide-y divide-sentinel-border">
          <div className="px-4 py-3 flex items-center justify-between gap-4 hover:bg-sentinel-surface-alt transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-sentinel-blue-light flex items-center justify-center flex-shrink-0 border border-sentinel-blue/20">
                <Mail className="w-4 h-4 text-sentinel-blue" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-sentinel-text">Email alerts</p>
                <p className="text-xs text-sentinel-text-secondary truncate">
                  sarah.chen@acmebank.com, amrita.patel@acmebank.com, risk-alerts@acmebank.com
                </p>
              </div>
            </div>
            <button className="text-xs text-sentinel-teal hover:underline flex items-center gap-1 flex-shrink-0 font-medium">
              Edit <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="px-4 py-3 flex items-center justify-between gap-4 hover:bg-sentinel-surface-alt transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-sentinel-teal-light flex items-center justify-center flex-shrink-0 border border-sentinel-teal/20">
                <Webhook className="w-4 h-4 text-sentinel-teal" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-sentinel-text">Webhook</p>
                <p className="text-xs text-sentinel-text-secondary truncate font-mono">
                  https://hooks.slack.com/services/T0/B0/xxxx
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <StatusPill status="matches_policy" label="Active" size="sm" />
              <button className="text-xs text-sentinel-teal hover:underline flex items-center gap-1 font-medium">
                Edit <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div className="px-4 py-3 flex items-center justify-between gap-4 hover:bg-sentinel-surface-alt transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-sentinel-amber-light flex items-center justify-center flex-shrink-0 border border-sentinel-amber/20">
                <Bell className="w-4 h-4 text-sentinel-amber" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-sentinel-text">In-console alerts</p>
                <p className="text-xs text-sentinel-text-secondary">
                  Shown for weakened guardrails and open incidents
                </p>
              </div>
            </div>
            <StatusPill status="matches_policy" label="Always on" size="sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
