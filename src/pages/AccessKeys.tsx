import { Key, Plus, Copy, Eye, EyeOff, Check, Users, KeyRound } from "lucide-react";
import { useState } from "react";

const apiKeys = [
  { id: "key-1", name: "Production read-only", prefix: "sent_live_ro_a1b2", created: "2026-08-15", lastUsed: "2 min ago", scopes: ["read:scorecards", "read:decisions", "read:evidence"] },
  { id: "key-2", name: "Audit export", prefix: "sent_live_ro_c3d4", created: "2026-07-01", lastUsed: "3 days ago", scopes: ["read:evidence", "export:evidence"] },
];

const teamMembers = [
  { id: "u1", name: "Sarah Chen", email: "sarah.chen@acmebank.com", role: "AI platform lead", access: "Daily", gradient: "bg-gradient-primary" },
  { id: "u2", name: "Amrita Patel", email: "amrita.patel@acmebank.com", role: "Risk officer", access: "Weekly", gradient: "bg-gradient-violet" },
  { id: "u3", name: "Mike Johnson", email: "mike.johnson@acmebank.com", role: "AI platform engineer", access: "Daily", gradient: "bg-gradient-blue" },
  { id: "u4", name: "Liam O'Hara", email: "liam.ohara@acmebank.com", role: "Platform engineer", access: "Daily", gradient: "bg-gradient-amber" },
  { id: "u5", name: "External Auditor (KPMG)", email: "auditor@kpmg.com", role: "External auditor", access: "Read-only · Quarterly", gradient: "bg-sentinel-surface-alt" },
];

export function AccessKeys() {
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const copyKey = (id: string, prefix: string) => {
    navigator.clipboard?.writeText(prefix);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-sentinel-text mb-1">Access & keys</h1>
        <p className="text-sm text-sentinel-text-secondary">
          Team members, their access levels, and API keys for integrating with Sentinel.
        </p>
      </div>

      {/* Team members */}
      <div className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-sentinel-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-violet flex items-center justify-center">
              <Users className="w-3.5 h-3.5 text-white" />
            </div>
            <h2 className="text-sm font-bold text-sentinel-text">Team members</h2>
          </div>
          <button className="flex items-center gap-1.5 text-xs text-sentinel-teal hover:underline font-medium">
            <Plus className="w-3.5 h-3.5" /> Invite member
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-sentinel-border bg-sentinel-surface-alt">
              <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Name</th>
              <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide hidden sm:table-cell">Email</th>
              <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Role</th>
              <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Access</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((m) => (
              <tr key={m.id} className="border-b border-sentinel-border last:border-b-0 hover:bg-sentinel-surface-alt transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full ${m.gradient} flex items-center justify-center font-medium text-xs ${m.gradient === "bg-sentinel-surface-alt" ? "text-sentinel-text-muted" : "text-white"}`}>
                      {m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <span className="font-medium text-sentinel-text">{m.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-sentinel-text-secondary hidden sm:table-cell">{m.email}</td>
                <td className="px-4 py-3 text-sentinel-text-secondary">{m.role}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium ${
                    m.access.includes("Read-only") ? "text-sentinel-text-muted" : "text-sentinel-text"
                  }`}>
                    {m.access}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* API keys */}
      <div className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-sentinel-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-amber flex items-center justify-center">
              <KeyRound className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-sentinel-text">API keys</h2>
              <p className="text-xs text-sentinel-text-secondary mt-0.5">Used to read data and export evidence programmatically</p>
            </div>
          </div>
          <button className="flex items-center gap-1.5 text-xs text-sentinel-teal hover:underline font-medium">
            <Plus className="w-3.5 h-3.5" /> Create key
          </button>
        </div>
        <div className="divide-y divide-sentinel-border">
          {apiKeys.map((key) => (
            <div key={key.id} className="p-4 hover:bg-sentinel-surface-alt transition-colors">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-sentinel-amber-light flex items-center justify-center border border-sentinel-amber/20">
                    <Key className="w-4 h-4 text-sentinel-amber" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-sentinel-text">{key.name}</p>
                    <p className="text-xs text-sentinel-text-muted">Created {key.created} · Last used {key.lastUsed}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <code className="font-mono text-xs text-sentinel-text-secondary bg-sentinel-surface-alt px-3 py-1.5 rounded border border-sentinel-border flex-1 overflow-hidden text-ellipsis">
                  {showKey[key.id] ? `${key.prefix}XXXXXXXXXXXXXXXX` : `${key.prefix}••••••••••••••••`}
                </code>
                <button
                  onClick={() => setShowKey((p) => ({ ...p, [key.id]: !p[key.id] }))}
                  className="flex items-center gap-1 text-xs text-sentinel-text-secondary hover:text-sentinel-text px-2 py-1.5 rounded touch-target"
                >
                  {showKey[key.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => copyKey(key.id, key.prefix)}
                  className="flex items-center gap-1 text-xs text-sentinel-text-secondary hover:text-sentinel-text px-2 py-1.5 rounded touch-target"
                >
                  {copied === key.id ? <Check className="w-3.5 h-3.5 text-sentinel-green" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {key.scopes.map((scope) => (
                  <span key={scope} className="text-xs font-mono px-2 py-0.5 rounded bg-sentinel-teal-light border border-sentinel-teal/20 text-sentinel-teal-dark">
                    {scope}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
