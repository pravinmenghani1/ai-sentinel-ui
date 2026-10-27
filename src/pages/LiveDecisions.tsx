import { useState, useMemo } from "react";
import { Search, X, ShieldCheck, ShieldX, ShieldAlert, ChevronRight, Hash, Lock } from "lucide-react";
import { decisions, type Decision } from "@/mock/data";
import { StatusPill } from "@/components/StatusPill";

const decisionIcons = {
  allow: { icon: ShieldCheck, color: "text-sentinel-green-dark", gradient: "bg-gradient-green" },
  block: { icon: ShieldX, color: "text-sentinel-red-dark", gradient: "bg-gradient-red" },
  mask: { icon: ShieldAlert, color: "text-sentinel-amber-dark", gradient: "bg-gradient-amber" },
};

const decisionPills = {
  allow: { status: "matches_policy" as const, label: "Allow" },
  block: { status: "rejected" as const, label: "Block" },
  mask: { status: "weakened" as const, label: "Mask" },
};

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
}

export function LiveDecisions() {
  const [search, setSearch] = useState("");
  const [decisionFilter, setDecisionFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Decision | null>(null);

  const filtered = useMemo(() => {
    return decisions.filter((d) => {
      if (decisionFilter !== "all" && d.decision !== decisionFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          d.id.toLowerCase().includes(s) ||
          d.guardrailName.toLowerCase().includes(s) ||
          d.userId.toLowerCase().includes(s) ||
          d.inputChannel.toLowerCase().includes(s) ||
          d.category.toLowerCase().includes(s) ||
          d.contentHash.toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [search, decisionFilter]);

  const closeDrawer = () => setSelected(null);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-sentinel-text mb-1">Live decisions</h1>
        <p className="text-sm text-sentinel-text-secondary">
          Every allow, block, and mask decision recorded by your guardrails. Sentinel stores a hash, never the message text.
        </p>
      </div>

      {/* Privacy notice */}
      <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-sentinel-surface border border-sentinel-border text-sm">
        <Lock className="w-4 h-4 text-sentinel-teal flex-shrink-0" />
        <span className="text-sentinel-text-secondary">Sentinel stores a hash, never the message text.</span>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sentinel-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, guardrail, user, category, hash…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-sentinel-border rounded-lg bg-sentinel-surface text-sentinel-text placeholder:text-sentinel-text-muted focus:outline-none focus:border-sentinel-teal focus:ring-2 focus:ring-sentinel-teal/20"
          />
        </div>
        <div className="flex gap-1">
          {["all", "allow", "block", "mask"].map((f) => (
            <button
              key={f}
              onClick={() => setDecisionFilter(f)}
              className={`px-3 py-2 text-xs font-medium rounded-lg capitalize transition-colors touch-target ${
                decisionFilter === f
                  ? "bg-gradient-primary text-white"
                  : "bg-sentinel-surface border border-sentinel-border text-sentinel-text-secondary hover:text-sentinel-text"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sentinel-border bg-sentinel-surface-alt">
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Decision ID</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide hidden sm:table-cell">Time</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Guardrail</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Decision</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Check fired</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide hidden lg:table-cell">Content hash</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => {
                const di = decisionIcons[d.decision];
                const blockCheck = d.checksFired.find((c) => c.result === "BLOCK" || c.result === "MASK");
                return (
                  <tr
                    key={d.id}
                    onClick={() => setSelected(d)}
                    className="border-b border-sentinel-border last:border-b-0 hover:bg-sentinel-surface-alt transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-sentinel-text-secondary">{d.id}</td>
                    <td className="px-4 py-3 font-mono text-xs text-sentinel-text-secondary hidden sm:table-cell">{formatTime(d.timestamp)}</td>
                    <td className="px-4 py-3 text-sentinel-text font-medium">{d.guardrailName}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 ${di.color}`}>
                        <di.icon className="w-4 h-4" />
                        <span className="font-bold capitalize">{d.decision}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sentinel-text-secondary hidden md:table-cell">{d.category}</td>
                    <td className="px-4 py-3">
                      {blockCheck ? (
                        <span className="text-xs font-medium text-sentinel-text">{blockCheck.check}</span>
                      ) : (
                        <span className="text-xs text-sentinel-text-muted">none</span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="font-mono text-xs text-sentinel-text-muted">{d.contentHash.slice(0, 12)}…</span>
                    </td>
                    <td className="px-2 py-3">
                      <ChevronRight className="w-4 h-4 text-sentinel-text-muted" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-sentinel-text-muted">No decisions match your filters.</div>
        )}
      </div>

      {/* Drawer overlay */}
      {selected && <div className="fixed inset-0 bg-black/30 z-40" onClick={closeDrawer} />}

      {/* Detail drawer */}
      {selected && (
        <div className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-sentinel-surface border-l border-sentinel-border z-50 overflow-y-auto shadow-xl">
          <div className="sticky top-0 bg-sentinel-surface border-b border-sentinel-border px-4 py-3 flex items-center justify-between z-10">
            <div>
              <p className="text-xs text-sentinel-text-muted font-mono">{selected.id}</p>
              <h2 className="text-sm font-bold text-sentinel-text">Decision detail</h2>
            </div>
            <button
              onClick={closeDrawer}
              className="touch-target flex items-center justify-center text-sentinel-text-muted hover:text-sentinel-text rounded-lg"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-5">
            {/* Decision summary */}
            <div className="flex items-center gap-3">
              {(() => {
                const di = decisionIcons[selected.decision];
                return (
                  <div className={`w-12 h-12 rounded-xl ${di.gradient} flex items-center justify-center flex-shrink-0`}>
                    <di.icon className="w-6 h-6 text-white" />
                  </div>
                );
              })()}
              <div>
                <p className="text-sm font-bold text-sentinel-text capitalize">{selected.decision}</p>
                <p className="text-xs text-sentinel-text-secondary">{selected.responseAction}</p>
              </div>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-sentinel-text-muted mb-0.5">Time</p>
                <p className="font-mono text-sentinel-text text-xs">{new Date(selected.timestamp).toLocaleString("en-US")}</p>
              </div>
              <div>
                <p className="text-xs text-sentinel-text-muted mb-0.5">Guardrail</p>
                <p className="text-sentinel-text font-medium">{selected.guardrailName}</p>
              </div>
              <div>
                <p className="text-xs text-sentinel-text-muted mb-0.5">Provider</p>
                <p className="text-sentinel-text-secondary">{selected.provider}</p>
              </div>
              <div>
                <p className="text-xs text-sentinel-text-muted mb-0.5">Channel</p>
                <p className="text-sentinel-text-secondary">{selected.inputChannel}</p>
              </div>
              <div>
                <p className="text-xs text-sentinel-text-muted mb-0.5">User</p>
                <p className="font-mono text-sentinel-text-secondary text-xs">{selected.userId}</p>
              </div>
              <div>
                <p className="text-xs text-sentinel-text-muted mb-0.5">Category</p>
                <p className="text-sentinel-text-secondary">{selected.category}</p>
              </div>
            </div>

            {/* Content hash */}
            <div>
              <h3 className="text-sm font-bold text-sentinel-text mb-2 flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-sentinel-teal" /> Content hash (SHA-256)
              </h3>
              <div className="border border-sentinel-border rounded-lg p-3 bg-sentinel-surface-alt font-mono text-xs text-sentinel-text break-all leading-relaxed">
                {selected.contentHash}
              </div>
              <p className="text-xs text-sentinel-text-muted mt-2 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> Sentinel stores a hash, never the message text.
              </p>
            </div>

            {/* Checks that fired */}
            <div>
              <h3 className="text-sm font-bold text-sentinel-text mb-2">Checks that fired</h3>
              <div className="space-y-2">
                {selected.checksFired.map((check, i) => {
                  const isBlock = check.result === "BLOCK";
                  const isMask = check.result === "MASK";
                  const isPass = check.result === "PASS";
                  return (
                    <div key={i} className={`border rounded-lg p-3 ${
                      isBlock ? "border-sentinel-red/30 bg-sentinel-red-light/40" :
                      isMask ? "border-sentinel-amber/30 bg-sentinel-amber-light/40" :
                      "border-sentinel-border bg-sentinel-surface-alt"
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-sentinel-text">{check.check}</span>
                        <span className={`text-xs font-mono font-bold ${
                          isBlock ? "text-sentinel-red-dark" :
                          isMask ? "text-sentinel-amber-dark" :
                          "text-sentinel-green-dark"
                        }`}>
                          {check.result}
                        </span>
                      </div>
                      <p className="text-xs text-sentinel-text-secondary">{check.detail}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action */}
            <div>
              <h3 className="text-sm font-bold text-sentinel-text mb-2">Action</h3>
              <div className="border border-sentinel-border rounded-lg p-3 bg-sentinel-surface-alt">
                <p className="text-sm text-sentinel-text">{selected.responseAction}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
