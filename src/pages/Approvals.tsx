import { useState } from "react";
import { Check, X, Clock, User, ChevronRight, Shield, ShieldCheck, ShieldAlert, ArrowRight } from "lucide-react";
import { remediationRequests, approvalChains, roleById, userById, appById, guardrailById, depById, type RemediationRequest } from "@/mock/data";

const typeLabels: Record<RemediationRequest["type"], string> = {
  deploy: "Deploy guardrail",
  accept: "Risk acceptance",
  mode: "Mode change",
};

const statusConfig = {
  Pending: { color: "text-sentinel-amber-dark", bg: "bg-sentinel-amber-light", border: "border-sentinel-amber/20", label: "Pending" },
  Approved: { color: "text-sentinel-green-dark", bg: "bg-sentinel-green-light", border: "border-sentinel-green/20", label: "Approved" },
  Rejected: { color: "text-sentinel-red-dark", bg: "bg-sentinel-red-light", border: "border-sentinel-red/20", label: "Rejected" },
  Applied: { color: "text-sentinel-teal-dark", bg: "bg-sentinel-teal-light", border: "border-sentinel-teal/20", label: "Applied" },
};

export function Approvals() {
  const [requests, setRequests] = useState(remediationRequests);
  const [filter, setFilter] = useState("all");

  const handleApprove = (id: string) => {
    setRequests((prev) => prev.map((r) => {
      if (r.id !== id) return r;
      const chain = approvalChains[r.chain];
      const approvedCount = r.log.filter((l) => l.d === "Approved").length;
      const nextStepIndex = approvedCount;
      if (nextStepIndex >= chain.steps.length) return r;
      const nextRole = chain.steps[nextStepIndex];
      const nextUser = Object.values({ u1: "u1", u2: "u2", u3: "u3", u4: "u4", u5: "u5", u6: "u6", u7: "u7" }).find(() => false);
      const newLog = [...r.log, { uid: "u3", d: "Approved" as const, t: "just now" }];
      const allApproved = newLog.filter((l) => l.d === "Approved").length >= chain.steps.length;
      return { ...r, log: newLog, status: allApproved ? "Approved" : "Pending" };
    }));
  };

  const handleReject = (id: string) => {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: "Rejected", log: [...r.log, { uid: "u3", d: "Rejected" as const, t: "just now" }] } : r));
  };

  const filtered = requests.filter((r) => filter === "all" || r.status === filter);
  const pending = filtered.filter((r) => r.status === "Pending");
  const resolved = filtered.filter((r) => r.status !== "Pending");

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-sentinel-text mb-1">Remediation queue</h1>
        <p className="text-sm text-sentinel-text-secondary">
          Coverage gaps and configuration changes that require approval. Each request follows a multi-step approval chain based on risk level.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-1 mb-4">
        {["all", "Pending", "Approved", "Applied", "Rejected"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors touch-target ${filter === f ? "bg-gradient-primary text-white" : "bg-sentinel-surface border border-sentinel-border text-sentinel-text-secondary hover:text-sentinel-text"}`}>{f}</button>
        ))}
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold text-sentinel-text mb-3 flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-amber flex items-center justify-center"><Clock className="w-3.5 h-3.5 text-white" /></div>
            Awaiting approval ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map((req) => <RequestCard key={req.id} req={req} onApprove={handleApprove} onReject={handleReject} />)}
          </div>
        </div>
      )}

      {/* Resolved */}
      {resolved.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-sentinel-text mb-3">Resolved ({resolved.length})</h2>
          <div className="space-y-3">
            {resolved.map((req) => <RequestCard key={req.id} req={req} onApprove={handleApprove} onReject={handleReject} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function RequestCard({ req, onApprove, onReject }: { req: RemediationRequest; onApprove: (id: string) => void; onReject: (id: string) => void }) {
  const chain = approvalChains[req.chain];
  const sc = statusConfig[req.status];
  const requester = userById(req.by);
  const app = req.app ? appById(req.app) : null;
  const g = req.g ? guardrailById(req.g) : null;
  const dep = req.dep ? depById(req.dep) : null;
  const approvedCount = req.log.filter((l) => l.d === "Approved").length;
  const currentStep = approvedCount;

  return (
    <div className={`bg-sentinel-surface border rounded-xl overflow-hidden transition-shadow ${req.status === "Pending" ? "border-sentinel-amber/30 hover:shadow-md" : "border-sentinel-border opacity-80"}`}>
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-sentinel-surface-alt border border-sentinel-border text-sentinel-text-secondary">{req.id}</span>
              <span className="text-xs px-2 py-0.5 rounded font-mono bg-sentinel-violet-light border border-sentinel-violet/20 text-sentinel-violet-dark font-medium">{typeLabels[req.type]}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${sc.bg} ${sc.color} border ${sc.border}`}>{sc.label}</span>
            </div>
            <h3 className="text-sm font-bold text-sentinel-text">
              {req.type === "deploy" && `Deploy ${g?.name} on ${app?.name}`}
              {req.type === "accept" && `Accept risk: ${g?.name} on ${app?.name}`}
              {req.type === "mode" && `Switch ${dep?.name} to ${req.mode} mode`}
            </h3>
            <div className="flex items-center gap-2 mt-1 text-xs text-sentinel-text-muted">
              <User className="w-3.5 h-3.5" />
              <span>{requester?.name}</span>
              <span>·</span>
              <span>{req.at}</span>
            </div>
          </div>
        </div>

        {/* Note */}
        <p className="text-sm text-sentinel-text-secondary mb-4">{req.note}</p>

        {/* Approval chain */}
        <div className="border-t border-sentinel-border pt-3">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-sentinel-text-muted" />
            <span className="text-xs font-bold text-sentinel-text-secondary uppercase tracking-wide">{chain.name}</span>
            {req.expires && <span className="text-xs text-sentinel-text-muted ml-auto">Expires: {req.expires}</span>}
          </div>

          {/* Steps */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            {chain.steps.map((roleId, i) => {
              const role = roleById(roleId);
              const logEntry = req.log.find((l, li) => li === i);
              const isApproved = logEntry?.d === "Approved";
              const isRejected = logEntry?.d === "Rejected";
              const isCurrent = i === currentStep && req.status === "Pending";
              return (
                <div key={i} className="flex items-center gap-2">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                    isApproved ? "bg-sentinel-green-light border-sentinel-green/20" :
                    isRejected ? "bg-sentinel-red-light border-sentinel-red/20" :
                    isCurrent ? "bg-sentinel-amber-light border-sentinel-amber/30" :
                    "bg-sentinel-surface-alt border-sentinel-border"
                  }`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      isApproved ? "bg-sentinel-green text-white" :
                      isRejected ? "bg-sentinel-red text-white" :
                      isCurrent ? "bg-sentinel-amber text-white" :
                      "bg-sentinel-border text-sentinel-text-muted"
                    }`}>
                      {isApproved ? <Check className="w-3 h-3" /> : isRejected ? <X className="w-3 h-3" /> : isCurrent ? <Clock className="w-3 h-3" /> : <span className="text-[10px] font-mono">{i + 1}</span>}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-sentinel-text block">{role?.name}</span>
                      {logEntry && <span className="text-[10px] text-sentinel-text-muted">{logEntry.t}</span>}
                      {isCurrent && <span className="text-[10px] text-sentinel-amber-dark font-medium">Your turn</span>}
                    </div>
                  </div>
                  {i < chain.steps.length - 1 && <ArrowRight className="w-3 h-3 text-sentinel-text-muted" />}
                </div>
              );
            })}
          </div>

          {/* Actions */}
          {req.status === "Pending" && (
            <div className="flex gap-2">
              <button onClick={() => onReject(req.id)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-sentinel-border text-sm font-medium text-sentinel-red-dark hover:bg-sentinel-red-light/50 transition-colors touch-target">
                <X className="w-4 h-4" /> Reject
              </button>
              <button onClick={() => onApprove(req.id)} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-green text-white text-sm font-bold hover:opacity-90 transition-opacity touch-target shadow-glow-green">
                <Check className="w-4 h-4" /> Approve
              </button>
            </div>
          )}
          {req.status === "Approved" && (
            <div className="flex items-center gap-2 text-sm text-sentinel-green-dark">
              <ShieldCheck className="w-4 h-4" /> All approvals received — ready to apply
            </div>
          )}
          {req.status === "Applied" && (
            <div className="flex items-center gap-2 text-sm text-sentinel-teal-dark">
              <ShieldCheck className="w-4 h-4" /> Applied successfully
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
