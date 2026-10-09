import { Check, X, Clock, User } from "lucide-react";
import { approvals as initialApprovals, type Approval } from "@/mock/data";
import { StatusPill } from "@/components/StatusPill";
import { DiffView } from "@/components/DiffView";
import { useState } from "react";

const typeLabels: Record<Approval["type"], string> = {
  policy_change: "Policy change",
  setting_change: "Setting change",
  threshold_change: "Threshold change",
};

const statusMap = {
  pending: { status: "pending" as const, label: "Pending" },
  approved: { status: "approved" as const, label: "Approved" },
  rejected: { status: "rejected" as const, label: "Rejected" },
};

export function Approvals() {
  const [approvals, setApprovals] = useState(initialApprovals);

  const handleApprove = (id: string) => {
    setApprovals((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: "approved",
              approvers: a.approvers.map((ap, i) => (i === 0 ? { ...ap, approved: true } : ap)),
            }
          : a
      )
    );
  };

  const handleReject = (id: string) => {
    setApprovals((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "rejected" } : a))
    );
  };

  const pending = approvals.filter((a) => a.status === "pending");
  const resolved = approvals.filter((a) => a.status !== "pending");

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-sentinel-text mb-1">Approvals</h1>
        <p className="text-sm text-sentinel-text-secondary">
          Policy changes require two people to approve. Each change shows a diff, the requester, and the current approver status.
        </p>
      </div>

      {/* Pending */}
      <div className="mb-6">
        <h2 className="text-sm font-bold text-sentinel-text mb-3 flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-amber flex items-center justify-center">
            <Clock className="w-3.5 h-3.5 text-white" />
          </div>
          Awaiting approval ({pending.length})
        </h2>
        <div className="space-y-3">
          {pending.map((approval) => (
            <div key={approval.id} className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs px-2 py-0.5 rounded font-mono bg-sentinel-amber-light border border-sentinel-amber/20 text-sentinel-amber-dark font-medium">
                        {typeLabels[approval.type]}
                      </span>
                      <StatusPill status="pending" label="Pending" size="sm" />
                    </div>
                    <h3 className="text-sm font-bold text-sentinel-text">{approval.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-sentinel-text-muted">
                      <User className="w-3.5 h-3.5" />
                      <span className="font-mono">{approval.requestedBy}</span>
                      <span>·</span>
                      <span>{approval.requestedAt}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-sentinel-text-secondary mb-3">{approval.description}</p>
                <DiffView diff={approval.diff} />

                {/* Approvers */}
                <div className="mt-4 border-t border-sentinel-border pt-3">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="space-y-1.5">
                      {approval.approvers.map((ap, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium ${
                            ap.approved === true ? "bg-sentinel-green-light text-sentinel-green-dark" :
                            ap.approved === false ? "bg-sentinel-red-light text-sentinel-red-dark" :
                            "bg-sentinel-surface-alt text-sentinel-text-muted border border-sentinel-border"
                          }`}>
                            {ap.approved === true ? <Check className="w-3 h-3" /> :
                             ap.approved === false ? <X className="w-3 h-3" /> :
                             <Clock className="w-3 h-3" />}
                          </div>
                          <span className="font-mono text-xs text-sentinel-text">{ap.name}</span>
                          <span className="text-xs text-sentinel-text-muted">{ap.role}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReject(approval.id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-sentinel-border text-sm font-medium text-sentinel-red-dark hover:bg-sentinel-red-light/50 transition-colors touch-target"
                      >
                        <X className="w-4 h-4" />
                        Reject
                      </button>
                      <button
                        onClick={() => handleApprove(approval.id)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-green text-white text-sm font-bold hover:opacity-90 transition-opacity touch-target shadow-glow-green"
                      >
                        <Check className="w-4 h-4" />
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resolved */}
      <div>
        <h2 className="text-sm font-bold text-sentinel-text mb-3">Resolved ({resolved.length})</h2>
        <div className="space-y-3">
          {resolved.map((approval) => (
            <div key={approval.id} className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden opacity-75">
              <div className="p-4">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs px-2 py-0.5 rounded font-mono bg-sentinel-surface-alt border border-sentinel-border text-sentinel-text-secondary">
                        {typeLabels[approval.type]}
                      </span>
                      <StatusPill status={statusMap[approval.status].status} label={statusMap[approval.status].label} size="sm" />
                    </div>
                    <h3 className="text-sm font-bold text-sentinel-text">{approval.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-sentinel-text-muted">
                      <span className="font-mono">{approval.requestedBy}</span>
                      <span>·</span>
                      <span>{approval.requestedAt}</span>
                    </div>
                  </div>
                </div>
                <DiffView diff={approval.diff} />
                <div className="mt-3 flex items-center gap-4">
                  {approval.approvers.map((ap, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        ap.approved ? "bg-sentinel-green-light text-sentinel-green-dark" : "bg-sentinel-red-light text-sentinel-red-dark"
                      }`}>
                        {ap.approved ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                      </div>
                      <span className="font-mono text-sentinel-text-muted">{ap.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
