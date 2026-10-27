import { useState } from "react";
import { Info, ToggleLeft, ToggleRight, Search, Shield, ChevronDown, ChevronRight, Plus } from "lucide-react";
import { frameworkDefs, guardrailById, aiApps, activeFrameworks, fwCoverage, reqApplies, reqMet } from "@/mock/data";

export function Frameworks() {
  const [frameworks, setFrameworks] = useState(frameworkDefs);
  const [expanded, setExpanded] = useState<string | null>("eu-ai-act");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const toggleFramework = (id: string) => {
    setFrameworks((prev) => prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f)));
  };

  const industries = ["all", ...Array.from(new Set(frameworkDefs.map((f) => f.industry.split(" · ")[0])))];

  const filtered = frameworks.filter((f) => {
    if (filter !== "all" && !f.industry.startsWith(filter)) return false;
    if (search && !f.name.toLowerCase().includes(search.toLowerCase()) && !f.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const enabledCount = frameworks.filter((f) => f.enabled).length;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-sentinel-text mb-1">Frameworks & standards</h1>
        <p className="text-sm text-sentinel-text-secondary">
          Map guardrails to regulatory and industry frameworks. Toggle frameworks on to include their requirements in coverage and posture calculations.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-sentinel-surface border border-sentinel-border rounded-xl p-4">
          <p className="text-xs text-sentinel-text-muted mb-1">Enabled frameworks</p>
          <p className="text-2xl font-mono font-bold text-sentinel-teal">{enabledCount}<span className="text-sm text-sentinel-text-muted ml-1">of {frameworks.length}</span></p>
        </div>
        <div className="bg-sentinel-surface border border-sentinel-border rounded-xl p-4">
          <p className="text-xs text-sentinel-text-muted mb-1">Total requirements</p>
          <p className="text-2xl font-mono font-bold text-sentinel-text">{frameworks.reduce((s, f) => s + f.reqs.length, 0)}</p>
        </div>
        <div className="bg-sentinel-surface border border-sentinel-border rounded-xl p-4">
          <p className="text-xs text-sentinel-text-muted mb-1">Industries</p>
          <p className="text-2xl font-mono font-bold text-sentinel-text">{new Set(frameworks.map((f) => f.industry.split(" · ")[1] || "All sectors")).size}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sentinel-text-muted" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search frameworks…" className="w-full pl-9 pr-3 py-2 text-sm border border-sentinel-border rounded-lg bg-sentinel-surface text-sentinel-text placeholder:text-sentinel-text-muted focus:outline-none focus:border-sentinel-teal focus:ring-2 focus:ring-sentinel-teal/20" />
        </div>
        <div className="flex gap-1 flex-wrap">
          {industries.map((ind) => (
            <button key={ind} onClick={() => setFilter(ind)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors touch-target ${filter === ind ? "bg-gradient-primary text-white" : "bg-sentinel-surface border border-sentinel-border text-sentinel-text-secondary hover:text-sentinel-text"}`}>{ind === "all" ? "All" : ind}</button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((fw) => {
          const cov = fwCoverage(fw);
          const isExpanded = expanded === fw.id;
          const isActive = fw.enabled;
          return (
            <div key={fw.id} className={`bg-sentinel-surface border rounded-xl overflow-hidden transition-all ${isActive ? "border-sentinel-teal/30" : "border-sentinel-border"}`}>
              <div className="p-4 flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h2 className="text-sm font-bold text-sentinel-text">{fw.name}</h2>
                    <span className="text-xs px-2 py-0.5 rounded border border-sentinel-border text-sentinel-text-muted font-mono">{fw.industry}</span>
                    {isActive ? <span className="text-xs font-bold text-sentinel-green-dark bg-sentinel-green-light border border-sentinel-green/20 px-2 py-0.5 rounded">Enabled</span> : <span className="text-xs font-medium text-sentinel-text-muted bg-sentinel-surface-alt border border-sentinel-border px-2 py-0.5 rounded">Disabled</span>}
                  </div>
                  <p className="text-sm text-sentinel-text-secondary">{fw.description}</p>
                  {isActive && (
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-sentinel-text-muted">{cov.m} of {cov.n} requirements met</span>
                      <div className="w-32 h-1.5 rounded-full bg-sentinel-border overflow-hidden"><div className={`h-full rounded-full ${cov.pct >= 85 ? "bg-sentinel-green" : cov.pct >= 60 ? "bg-sentinel-teal" : "bg-sentinel-amber"}`} style={{ width: `${cov.pct}%` }} /></div>
                      <span className="text-xs font-mono font-bold text-sentinel-text">{cov.pct}%</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleFramework(fw.id)} className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-sentinel-border hover:border-sentinel-teal transition-colors touch-target">
                    {isActive ? <ToggleRight className="w-5 h-5 text-sentinel-teal" /> : <ToggleLeft className="w-5 h-5 text-sentinel-text-muted" />}{isActive ? "Enabled" : "Disabled"}
                  </button>
                  <button onClick={() => setExpanded(isExpanded ? null : fw.id)} className="flex items-center justify-center w-8 h-8 rounded-lg border border-sentinel-border hover:border-sentinel-teal transition-colors touch-target">{isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}</button>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-sentinel-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-sentinel-surface-alt border-b border-sentinel-border">
                        <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Requirement</th>
                        <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Mapped guardrails</th>
                        <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide hidden md:table-cell">Applies to</th>
                        <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {fw.reqs.map((req) => {
                        const applicableApps = aiApps.filter((a) => reqApplies(req, a));
                        const metCount = applicableApps.filter((a) => reqMet(fw, req, a)).length;
                        const allMet = applicableApps.length > 0 && metCount === applicableApps.length;
                        const someMet = metCount > 0 && metCount < applicableApps.length;
                        return (
                          <tr key={req.id} className="border-b border-sentinel-border last:border-b-0 hover:bg-sentinel-surface-alt transition-colors">
                            <td className="px-4 py-3"><span className="font-mono text-xs text-sentinel-text-muted block">{req.id}</span><span className="text-sentinel-text">{req.t}</span></td>
                            <td className="px-4 py-3">
                              {req.guards.length > 0 ? (
                                <div className="flex flex-wrap gap-1">{req.guards.map((gid) => { const g = guardrailById(gid); return g ? <span key={gid} className="text-xs px-2 py-0.5 rounded border border-sentinel-teal/20 bg-sentinel-teal-light text-sentinel-teal-dark font-medium">{g.name}</span> : null; })}</div>
                              ) : <span className="text-xs text-sentinel-text-muted italic">No guardrail mapping — manual control</span>}
                            </td>
                            <td className="px-4 py-3 text-sentinel-text-secondary hidden md:table-cell text-xs">{req.tiers ? `${req.tiers.join(", ")} risk` : req.agentic ? "Agentic use cases" : "All use cases"}</td>
                            <td className="px-4 py-3">
                              {applicableApps.length === 0 ? <span className="text-xs text-sentinel-text-muted">No use case in scope</span> :
                                req.guards.length === 0 ? <span className="text-xs font-medium text-sentinel-amber-dark bg-sentinel-amber-light border border-sentinel-amber/20 px-2 py-0.5 rounded">Manual</span> :
                                allMet ? <span className="text-xs font-bold text-sentinel-green-dark bg-sentinel-green-light border border-sentinel-green/20 px-2 py-0.5 rounded">{metCount}/{applicableApps.length} met</span> :
                                someMet ? <span className="text-xs font-bold text-sentinel-amber-dark bg-sentinel-amber-light border border-sentinel-amber/20 px-2 py-0.5 rounded">{metCount}/{applicableApps.length} met</span> :
                                <span className="text-xs font-bold text-sentinel-red-dark bg-sentinel-red-light border border-sentinel-red/20 px-2 py-0.5 rounded">{metCount}/{applicableApps.length} met</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 bg-sentinel-surface border border-sentinel-border border-dashed rounded-xl p-6 text-center">
        <div className="w-10 h-10 rounded-lg bg-sentinel-surface-alt flex items-center justify-center mx-auto mb-3"><Plus className="w-5 h-5 text-sentinel-text-muted" /></div>
        <h3 className="text-sm font-bold text-sentinel-text mb-1">Add a custom framework</h3>
        <p className="text-sm text-sentinel-text-secondary mb-3">Map your organization's internal standards or industry-specific regulations to guardrails.</p>
        <button className="px-4 py-2 rounded-lg bg-gradient-primary text-white text-sm font-bold hover:opacity-90 transition-opacity touch-target">Request framework mapping</button>
      </div>
    </div>
  );
}
