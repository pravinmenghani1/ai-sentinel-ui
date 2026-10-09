import { useState } from "react";
import { FileCheck2, Download, Copy, Check, ShieldCheck, Info, X, KeyRound, BadgeCheck } from "lucide-react";
import { evidenceBundles, frameworks, type EvidenceBundle } from "@/mock/data";
import { StatusPill } from "@/components/StatusPill";

const statusMap = {
  collecting: { status: "collecting" as const, label: "Collecting" },
  signed: { status: "signed" as const, label: "Signed" },
  verified: { status: "verified" as const, label: "Verified" },
};

const bundleGradients: Record<string, string> = {
  collecting: "bg-gradient-blue",
  signed: "bg-gradient-primary",
  verified: "bg-gradient-green",
};

const opensslCommands = `# 1. Download the bundle and public key
curl -O https://sentinel.example.com/evidence/ev-2026-09.bundle
curl -O https://sentinel.example.com/keys/kms-key-7c1e-a94b.pub

# 2. Verify the signature
openssl dgst -sha256 -verify \\
  kms-key-7c1e-a94b.pub \\
  -signature ev-2026-09.bundle.sig \\
  ev-2026-09.bundle

# 3. Check the SHA-256 matches
sha256sum ev-2026-09.bundle
# Expected: a3f2e1d4b5c67890...`;

export function Evidence() {
  const [selected, setSelected] = useState<EvidenceBundle | null>(evidenceBundles.find((b) => b.status === "verified") || evidenceBundles[1] || null);
  const [copied, setCopied] = useState(false);

  const copyCommands = () => {
    navigator.clipboard?.writeText(opensslCommands);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-sentinel-text mb-1">Evidence</h1>
        <p className="text-sm text-sentinel-text-secondary">
          Monthly signed bundles of test results and decision logs. Each bundle is cryptographically signed and can be verified offline.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Bundle list */}
        <div className="lg:col-span-1 space-y-3">
          {evidenceBundles.map((bundle) => {
            const s = statusMap[bundle.status];
            return (
              <button
                key={bundle.id}
                onClick={() => setSelected(bundle)}
                className={`text-left w-full bg-sentinel-surface border rounded-xl overflow-hidden hover:shadow-md transition-all ${
                  selected?.id === bundle.id ? "border-sentinel-teal ring-2 ring-sentinel-teal/20" : "border-sentinel-border hover:border-sentinel-border-strong"
                }`}
              >
                <div className={`h-1.5 ${bundleGradients[bundle.status]}`} />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-9 h-9 rounded-lg ${bundleGradients[bundle.status]} flex items-center justify-center`}>
                      <FileCheck2 className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <StatusPill status={s.status} label={s.label} size="sm" />
                      {bundle.attestedBy && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sentinel-green-dark bg-sentinel-green-light border border-sentinel-green/20 px-2 py-0.5 rounded-lg">
                          <BadgeCheck className="w-3 h-3" /> Attested
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm font-bold text-sentinel-text mb-1">{bundle.month}</p>
                  <p className="text-xs text-sentinel-text-secondary">
                    {bundle.status === "collecting"
                      ? "Collecting decisions and test results…"
                      : `${bundle.decisionCount.toLocaleString()} decisions · ${bundle.testCount.toLocaleString()} tests`}
                  </p>
                  {bundle.signedBy && (
                    <p className="text-xs text-sentinel-text-muted font-mono mt-2">
                      {bundle.signedBy}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Selected bundle detail */}
        {selected && (
          <div className="lg:col-span-2 space-y-4">
            {/* Header */}
            <div className="bg-sentinel-surface border border-sentinel-border rounded-xl p-4">
              <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
                <div>
                  <p className="text-xs text-sentinel-text-muted font-mono">{selected.id}</p>
                  <h2 className="text-lg font-bold text-sentinel-text">{selected.month} evidence bundle</h2>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusPill status={statusMap[selected.status].status} label={statusMap[selected.status].label} />
                  {selected.attestedBy && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-sentinel-green-dark bg-sentinel-green-light border border-sentinel-green/20 px-2.5 py-1 rounded-lg">
                      <BadgeCheck className="w-3.5 h-3.5" /> {selected.attestedBy}
                    </span>
                  )}
                </div>
              </div>
              {selected.signedBy && (
                <div className="flex items-center gap-2 text-sm text-sentinel-text-secondary">
                  <KeyRound className="w-4 h-4 text-sentinel-teal" />
                  <span className="font-mono">{selected.signedBy}</span>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="border border-sentinel-border rounded-lg p-3 bg-sentinel-surface-alt">
                <p className="text-xs text-sentinel-text-muted mb-1">Decisions</p>
                <p className="text-lg font-mono font-bold text-sentinel-text">{selected.decisionCount.toLocaleString()}</p>
              </div>
              <div className="border border-sentinel-border rounded-lg p-3 bg-sentinel-surface-alt">
                <p className="text-xs text-sentinel-text-muted mb-1">Tests</p>
                <p className="text-lg font-mono font-bold text-sentinel-text">{selected.testCount.toLocaleString()}</p>
              </div>
              <div className="border border-sentinel-border rounded-lg p-3 bg-sentinel-surface-alt">
                <p className="text-xs text-sentinel-text-muted mb-1">Size</p>
                <p className="text-lg font-mono font-bold text-sentinel-text">{selected.size}</p>
              </div>
            </div>

            {/* What it proves */}
            <div className="bg-sentinel-surface border border-sentinel-border rounded-xl p-4">
              <h3 className="text-sm font-bold text-sentinel-green-dark mb-3 flex items-center gap-1.5">
                <Check className="w-4 h-4" /> What this bundle proves
              </h3>
              <ul className="space-y-1.5">
                {selected.proves.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-sentinel-text-secondary">
                    <span className="text-sentinel-green mt-0.5">✓</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* What it doesn't prove */}
            <div className="bg-sentinel-surface border border-sentinel-border rounded-xl p-4">
              <h3 className="text-sm font-bold text-sentinel-amber-dark mb-3 flex items-center gap-1.5">
                <Info className="w-4 h-4" /> What this bundle does not prove
              </h3>
              <ul className="space-y-1.5">
                {selected.doesNotProve.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-sentinel-text-secondary">
                    <span className="text-sentinel-amber mt-0.5">!</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {/* Guardrails covered */}
            <div className="bg-sentinel-surface border border-sentinel-border rounded-xl p-4">
              <h3 className="text-sm font-bold text-sentinel-text mb-2">Guardrails covered</h3>
              <div className="flex flex-wrap gap-2">
                {selected.guardrailsCovered.map((g) => (
                  <span key={g} className="px-2.5 py-1 rounded-lg border border-sentinel-teal/20 bg-sentinel-teal-light text-xs font-mono text-sentinel-teal-dark">
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* Offline verification */}
            {selected.status !== "collecting" && (
              <div className="bg-sentinel-surface border border-sentinel-border rounded-xl p-4">
                <h3 className="text-sm font-bold text-sentinel-text mb-3">Offline verification</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-sentinel-text-muted text-xs w-20">Key ID:</span>
                      <span className="font-mono text-xs text-sentinel-text">{selected.keyId}</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <span className="text-sentinel-text-muted text-xs w-20 flex-shrink-0 pt-0.5">SHA-256:</span>
                      <span className="font-mono text-xs text-sentinel-text break-all">{selected.sha256}</span>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={copyCommands}
                      className="absolute top-2 right-2 flex items-center gap-1 text-xs text-sentinel-teal hover:underline bg-sentinel-surface px-2 py-1 rounded border border-sentinel-border font-medium"
                    >
                      {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                    </button>
                    <pre className="border border-sentinel-border rounded-lg p-3 bg-sentinel-surface-alt font-mono text-xs text-sentinel-text overflow-x-auto leading-relaxed">
                      {opensslCommands}
                    </pre>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-sentinel-text-muted">
                    <ShieldCheck className="w-4 h-4 text-sentinel-green" />
                    Verification can be performed entirely offline. No Sentinel account required.
                  </div>
                </div>
              </div>
            )}

            {/* Download */}
            {selected.status !== "collecting" && (
              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-primary text-white text-sm font-bold hover:opacity-90 transition-opacity touch-target shadow-glow-teal">
                <Download className="w-4 h-4" />
                Download bundle and signature
              </button>
            )}
          </div>
        )}
      </div>

      {/* Framework chips */}
      <div className="bg-sentinel-surface border border-sentinel-border rounded-xl p-4 mt-6">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-bold text-sentinel-text">Framework mapping</h2>
          <span className="text-xs text-sentinel-text-muted px-2 py-0.5 rounded border border-sentinel-border font-mono">indicative</span>
        </div>
        <p className="text-xs text-sentinel-text-secondary mb-4">
          Evidence bundles map to these frameworks. "Indicative" means the mapping is a guide, not a certification.
        </p>
        <div className="flex flex-wrap gap-2">
          {frameworks.map((fw) => (
            <span
              key={fw.id}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sentinel-border bg-sentinel-surface-alt text-sm text-sentinel-text hover:border-sentinel-violet/30 transition-colors"
              title={fw.description}
            >
              <span className="font-medium">{fw.name}</span>
              <span className="text-sentinel-text-muted">·</span>
              <span className="text-sentinel-violet-dark font-mono text-xs">{fw.label}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
