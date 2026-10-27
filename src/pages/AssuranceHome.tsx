import { Link } from "react-router-dom";
import {
  ChevronRight, AlertTriangle, TrendingUp, Shield, ShieldCheck, ShieldAlert,
  Activity, LayoutGrid, FileCheck2, Zap, ArrowRight, Gauge,
} from "lucide-react";
import {
  stats, gaps, posture, activeFrameworks, fwCoverage,
  deployments, aiApps, guardrailDefs, guardrailById,
  remediationRequests, interventionsByGuardrail,
} from "@/mock/data";

const tierColors: Record<string, string> = {
  High: "bg-sentinel-red-light text-sentinel-red-dark border-sentinel-red/20",
  Limited: "bg-sentinel-amber-light text-sentinel-amber-dark border-sentinel-amber/20",
  Minimal: "bg-sentinel-blue-light text-sentinel-blue-dark border-sentinel-blue/20",
};

function categoryColor(cat: string): string {
  const map: Record<string, string> = {
    Security: "bg-sentinel-red-light text-sentinel-red-dark",
    Privacy: "bg-sentinel-blue-light text-sentinel-blue-dark",
    Safety: "bg-sentinel-amber-light text-sentinel-amber-dark",
    Reliability: "bg-sentinel-teal-light text-sentinel-teal-dark",
    Control: "bg-sentinel-violet-light text-sentinel-violet-dark",
    Cost: "bg-sentinel-green-light text-sentinel-green-dark",
    Fairness: "bg-sentinel-surface-alt text-sentinel-text",
  };
  return map[cat] || "bg-sentinel-surface-alt text-sentinel-text";
}

export function AssuranceHome() {
  const allGaps = gaps();
  const currentPosture = posture();
  const fwList = activeFrameworks();
  const criticalGaps = allGaps.filter((g) => g.sev === "Critical");
  const pendingRemediations = remediationRequests.filter((r) => r.status === "Pending");

  const flowCards = [
    {
      question: "What is our governance posture?",
      step: "Overview",
      number: `${currentPosture}%`,
      detail: `${allGaps.length} coverage gaps across ${fwList.length} enabled frameworks`,
      status: currentPosture >= 85 ? "matches_policy" : currentPosture >= 60 ? "weakened" : "needs_attention",
      statusLabel: currentPosture >= 85 ? "Strong" : currentPosture >= 60 ? "Needs work" : "At risk",
      link: "/explain/coverage",
      linkLabel: "Open coverage map",
      icon: Gauge,
      gradient: "bg-gradient-primary",
      accent: "text-sentinel-teal",
    },
    {
      question: "How many calls are governed?",
      step: "Enforce",
      number: "94%",
      detail: `${(stats.calls / 1000000).toFixed(2)}M calls · ${stats.blocked.toLocaleString()} blocked · ${stats.redacted.toLocaleString()} redacted`,
      status: "matches_policy",
      statusLabel: "Enforcing",
      link: "/monitor/decisions",
      linkLabel: "View live calls",
      icon: Zap,
      gradient: "bg-gradient-blue",
      accent: "text-sentinel-blue",
    },
    {
      question: "What gaps need attention?",
      step: "Remediate",
      number: `${allGaps.length}`,
      detail: `${criticalGaps.length} critical · ${pendingRemediations.length} remediations pending approval`,
      status: criticalGaps.length > 0 ? "needs_attention" : "matches_policy",
      statusLabel: criticalGaps.length > 0 ? `${criticalGaps.length} critical` : "No critical gaps",
      link: "/prove/approvals",
      linkLabel: "View remediation queue",
      icon: ShieldAlert,
      gradient: "bg-gradient-amber",
      accent: "text-sentinel-amber",
    },
    {
      question: "Can you prove it to an auditor?",
      step: "Evidence",
      number: "720",
      detail: "hourly hash-chained batches · RFC 3161 timestamps · Merkle root verification",
      status: "verified",
      statusLabel: "Anchored",
      link: "/prove/evidence",
      linkLabel: "View evidence ledger",
      icon: FileCheck2,
      gradient: "bg-gradient-green",
      accent: "text-sentinel-green",
    },
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-sentinel-text mb-1">Assurance overview</h1>
        <p className="text-sm text-sentinel-text-secondary">
          Posture, coverage, live enforcement, and evidence — across {aiApps.length} AI use cases and {guardrailDefs.length} guardrails.
        </p>
      </div>

      {/* Flow cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {flowCards.map((card, i) => (
          <div key={card.step}>
            <Link
              to={card.link}
              className="group block bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden hover:border-sentinel-border-strong card-lift hover:shadow-lg h-full"
            >
              <div className={`h-1.5 ${card.gradient}`} />
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${card.accent} font-mono`}>
                    {card.step}
                  </span>
                  <div className={`w-8 h-8 rounded-lg ${card.gradient} flex items-center justify-center`}>
                    <card.icon className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </div>
                </div>
                <p className="text-sm text-sentinel-text-secondary mb-3 leading-snug min-h-[2.5rem]">{card.question}</p>
                <p className={`text-3xl font-mono font-bold mb-1.5 ${card.accent}`}>{card.number}</p>
                <p className="text-xs text-sentinel-text-secondary mb-3 leading-relaxed min-h-[2.5rem]">{card.detail}</p>
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                    card.status === "matches_policy" ? "bg-sentinel-green-light text-sentinel-green-dark border border-sentinel-green/20" :
                    card.status === "weakened" ? "bg-sentinel-amber-light text-sentinel-amber-dark border border-sentinel-amber/20" :
                    "bg-sentinel-red-light text-sentinel-red-dark border border-sentinel-red/20"
                  }`}>{card.statusLabel}</span>
                  <ArrowRight className="w-4 h-4 text-sentinel-text-muted group-hover:text-sentinel-teal transition-colors flex-shrink-0" />
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Posture trend chart */}
      <div className="bg-sentinel-surface border border-sentinel-border rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-md bg-gradient-primary flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5 text-white" />
          </div>
          <h2 className="text-sm font-bold text-sentinel-text">Posture trend (12 months)</h2>
          <span className="text-xs text-sentinel-text-muted ml-auto font-mono">{currentPosture}% today</span>
        </div>
        <div className="flex items-end gap-1 h-24">
          {stats.postureTrend.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full rounded-t transition-all ${val >= 80 ? "bg-sentinel-green" : val >= 65 ? "bg-sentinel-teal" : "bg-sentinel-amber"}`}
                style={{ height: `${val}%` }}
                title={`${val}%`}
              />
              <span className="text-[9px] text-sentinel-text-muted font-mono">{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Deployments */}
        <div className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-sentinel-border flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-blue flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <h2 className="text-sm font-bold text-sentinel-text">Deployments</h2>
          </div>
          <div className="divide-y divide-sentinel-border">
            {deployments.map((dep) => (
              <div key={dep.id} className="px-4 py-3 hover:bg-sentinel-surface-alt transition-colors">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-medium text-sentinel-text font-mono">{dep.host}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    dep.mode === "Enforce" ? "bg-sentinel-green-light text-sentinel-green-dark" : "bg-sentinel-blue-light text-sentinel-blue-dark"
                  }`}>{dep.mode}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-sentinel-text-secondary">
                  <span>{dep.where}</span>
                  <span>·</span>
                  <span className="font-mono">{dep.rpm.toLocaleString()} rpm</span>
                  <span>·</span>
                  <span className="font-mono">{dep.p95}ms p95</span>
                  <span className={`ml-auto ${dep.status === "Healthy" ? "text-sentinel-green-dark" : "text-sentinel-amber-dark"}`}>● {dep.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Framework coverage */}
        <div className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-sentinel-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-violet flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-white" />
              </div>
              <h2 className="text-sm font-bold text-sentinel-text">Framework coverage</h2>
            </div>
            <Link to="/prove/frameworks" className="text-xs text-sentinel-teal hover:underline flex items-center gap-1 font-medium">
              All frameworks <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-sentinel-border">
            {fwList.map((fw) => {
              const cov = fwCoverage(fw);
              return (
                <div key={fw.id} className="px-4 py-3 hover:bg-sentinel-surface-alt transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-sentinel-text">{fw.name}</span>
                    <span className={`text-xs font-mono font-bold ${cov.pct >= 85 ? "text-sentinel-green-dark" : cov.pct >= 60 ? "text-sentinel-amber-dark" : "text-sentinel-red-dark"}`}>{cov.pct}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-sentinel-border overflow-hidden">
                      <div className={`h-full rounded-full ${cov.pct >= 85 ? "bg-sentinel-green" : cov.pct >= 60 ? "bg-sentinel-amber" : "bg-sentinel-red"}`} style={{ width: `${cov.pct}%` }} />
                    </div>
                    <span className="text-xs text-sentinel-text-muted font-mono">{cov.m}/{cov.n}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Coverage gaps */}
      {allGaps.length > 0 && (
        <div className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden mb-6">
          <div className="px-4 py-3 border-b border-sentinel-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-red flex items-center justify-center">
                <AlertTriangle className="w-3.5 h-3.5 text-white" />
              </div>
              <h2 className="text-sm font-bold text-sentinel-text">Coverage gaps ({allGaps.length})</h2>
            </div>
            <Link to="/prove/approvals" className="text-xs text-sentinel-teal hover:underline flex items-center gap-1 font-medium">
              Remediation queue <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-sentinel-border">
            {allGaps.slice(0, 5).map((gap, i) => (
              <div key={`${gap.app.id}-${gap.g.id}-${i}`} className="px-4 py-3 hover:bg-sentinel-surface-alt transition-colors">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-sentinel-text">{gap.app.name}</span>
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${tierColors[gap.app.tier]}`}>{gap.app.tier}</span>
                      <span className="text-xs text-sentinel-text-muted">·</span>
                      <span className="text-sm text-sentinel-text-secondary">{gap.g.name}</span>
                    </div>
                    <p className="text-xs text-sentinel-text-secondary">
                      Required by: {gap.reqs.join(", ")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {gap.cr ? (
                      <span className="text-xs font-bold text-sentinel-amber-dark bg-sentinel-amber-light border border-sentinel-amber/20 px-2 py-0.5 rounded">{gap.cr.id} · {gap.cr.status}</span>
                    ) : (
                      <span className="text-xs font-bold text-sentinel-red-dark bg-sentinel-red-light border border-sentinel-red/20 px-2 py-0.5 rounded">No remediation</span>
                    )}
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      gap.sev === "Critical" ? "bg-sentinel-red-light text-sentinel-red-dark" : "bg-sentinel-amber-light text-sentinel-amber-dark"
                    }`}>{gap.sev}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guardrail catalog */}
      <div className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-sentinel-border flex items-center justify-between">
          <h2 className="text-sm font-bold text-sentinel-text">Guardrail catalog ({guardrailDefs.length})</h2>
          <Link to="/test/scorecards" className="text-xs text-sentinel-teal hover:underline flex items-center gap-1 font-medium">
            All scorecards <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sentinel-border bg-sentinel-surface-alt">
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide hidden md:table-cell">Engine</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide hidden sm:table-cell">FP rate</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide hidden sm:table-cell">P95 latency</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Interventions</th>
              </tr>
            </thead>
            <tbody>
              {guardrailDefs.map((g) => {
                const interventions = interventionsByGuardrail.find((i) => i.guardrailId === g.id);
                return (
                  <tr key={g.id} className="border-b border-sentinel-border last:border-b-0 hover:bg-sentinel-surface-alt transition-colors">
                    <td className="px-4 py-3">
                      <Link to={`/test/scorecard/${g.id}`} className="font-semibold text-sentinel-text hover:text-sentinel-teal transition-colors">{g.name}</Link>
                      <p className="text-xs text-sentinel-text-muted mt-0.5">{g.description}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${categoryColor(g.category)}`}>{g.category}</span>
                    </td>
                    <td className="px-4 py-3 text-sentinel-text-secondary hidden md:table-cell text-xs">{g.engine}</td>
                    <td className="px-4 py-3 hidden sm:table-cell font-mono text-xs text-sentinel-text-secondary">{g.fp}%</td>
                    <td className="px-4 py-3 hidden sm:table-cell font-mono text-xs text-sentinel-text-secondary">{g.lat}ms</td>
                    <td className="px-4 py-3 font-mono text-sm text-sentinel-text">{interventions?.count.toLocaleString() || "0"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
