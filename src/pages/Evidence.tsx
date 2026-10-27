import { useState } from "react";
import { FileCheck2, Download, Copy, Check, KeyRound, BadgeCheck, Link2, Clock, ShieldCheck, Info } from "lucide-react";
import { evidenceBatches, ledgerEntries, evidenceBundlesLegacy, frameworks, type EvidenceBatch } from "@/mock/data";

export function Evidence() {
  const [view, setView] = useState<"ledger" | "bundles" | "frameworks">("ledger");
  const [selectedBatch, setSelectedBatch] = useState<EvidenceBatch | null>(evidenceBatches[0]);
  const [copied, setCopied] = useState(false);

  const copyHash = (hash: string) => {
    navigator.clipboard?.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const opensslCmd = `# Verify a batch offline
openssl dgst -sha256 -verify \\
  sentinel-pub.key \\
  -signature EB-20261027-00.sig \\
  EB-20261027-00.bundle

# Check the Merkle root
sha256sum EB-20261027-00.bundle
# Expected: ${evidenceBatches[0]?.merkleRoot}

# Verify RFC 3161 timestamp
openssl ts -verify \\
  -in EB-20261027-00.tsr \\
  -CAfile rfc3161-ca.pem`;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-sentinel-text mb-1">Evidence</h1>
        <p className="text-sm text-sentinel-text-secondary">
          Hash-chained decision ledger with RFC 3161 timestamps. Every batch links to the previous one — tampering with any entry breaks the chain.
        </p>
      </div>

      <div className="flex gap-1 mb-4">
        <button onClick={() => setView("ledger")} className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors touch-target ${view === "ledger" ? "bg-gradient-primary text-white" : "bg-sentinel-surface border border-sentinel-border text-sentinel-text-secondary"}`}>Hash chain ledger</button>
        <button onClick={() => setView("bundles")} className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors touch-target ${view === "bundles" ? "bg-gradient-primary text-white" : "bg-sentinel-surface border border-sentinel-border text-sentinel-text-secondary"}`}>Monthly bundles</button>
        <button onClick={() => setView("frameworks")} className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors touch-target ${view === "frameworks" ? "bg-gradient-primary text-white" : "bg-sentinel-surface border border-sentinel-border text-sentinel-text-secondary"}`}>Framework mapping</button>
      </div>

      {view === "ledger" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            <div className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-sentinel-border flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-gradient-primary flex items-center justify-center"><Link2 className="w-3.5 h-3.5 text-white" /></div>
                <h2 className="text-sm font-bold text-sentinel-text">Hash chain — today</h2>
                <span className="text-xs text-sentinel-text-muted ml-auto font-mono">{evidenceBatches.length} batches</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-sentinel-border bg-sentinel-surface-alt">
                      <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Batch ID</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide hidden sm:table-cell">Window</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Decisions</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide hidden md:table-cell">Prev hash</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide hidden lg:table-cell">This hash</th>
                      <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Anchored</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evidenceBatches.map((batch) => (
                      <tr key={batch.id} onClick={() => setSelectedBatch(batch)} className={`border-b border-sentinel-border last:border-b-0 hover:bg-sentinel-surface-alt transition-colors cursor-pointer ${selectedBatch?.id === batch.id ? "bg-sentinel-teal/5" : ""}`}>
                        <td className="px-4 py-3 font-mono text-xs text-sentinel-text">{batch.id}</td>
                        <td className="px-4 py-3 text-sentinel-text-secondary hidden sm:table-cell text-xs">{batch.window}</td>
                        <td className="px-4 py-3 font-mono text-sentinel-text">{batch.decisions.toLocaleString()}</td>
                        <td className="px-4 py-3 font-mono text-xs text-sentinel-text-muted hidden md:table-cell">{batch.prevBatch.slice(0, 12)}…</td>
                        <td className="px-4 py-3 font-mono text-xs text-sentinel-text-muted hidden lg:table-cell">{batch.hash.slice(0, 12)}…</td>
                        <td className="px-4 py-3">{batch.anchored ? <span className="flex items-center gap-1 text-xs font-bold text-sentinel-green-dark"><ShieldCheck className="w-3 h-3" /> RFC 3161</span> : <span className="text-xs text-sentinel-amber-dark">Pending</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-sentinel-border"><h2 className="text-sm font-bold text-sentinel-text">Audit ledger</h2></div>
              <div className="divide-y divide-sentinel-border">
                {ledgerEntries.map((entry) => (
                  <div key={entry.id} className="px-4 py-3 hover:bg-sentinel-surface-alt transition-colors">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div><span className="text-xs font-mono text-sentinel-text-muted">{entry.t}</span><span className="text-sm font-medium text-sentinel-text ml-2">{entry.action}</span></div>
                      <span className="text-xs font-mono text-sentinel-text-muted">{entry.hash.slice(0, 16)}…</span>
                    </div>
                    <p className="text-xs text-sentinel-text-secondary">{entry.detail}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-sentinel-text-muted">
                      <span>{entry.actor}</span>{entry.role && <><span>·</span><span>{entry.role}</span></>}<span>·</span><span className="font-mono">prev: {entry.prev.slice(0, 8)}…</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {selectedBatch && (
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-sentinel-surface border border-sentinel-border rounded-xl p-4">
                <p className="text-xs text-sentinel-text-muted font-mono mb-1">{selectedBatch.id}</p>
                <h2 className="text-sm font-bold text-sentinel-text mb-3">{selectedBatch.window}</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between"><span className="text-sentinel-text-secondary">Decisions</span><span className="font-mono font-bold text-sentinel-text">{selectedBatch.decisions.toLocaleString()}</span></div>
                  <div className="flex items-center justify-between"><span className="text-sentinel-text-secondary">Anchored</span><span className="font-bold text-sentinel-green-dark text-xs">RFC 3161 ✓</span></div>
                  <div><p className="text-xs text-sentinel-text-muted mb-1">Merkle root</p><p className="font-mono text-xs text-sentinel-text break-all bg-sentinel-surface-alt border border-sentinel-border rounded p-2">{selectedBatch.merkleRoot}</p></div>
                  <div><p className="text-xs text-sentinel-text-muted mb-1">Previous batch hash</p><p className="font-mono text-xs text-sentinel-text-muted break-all bg-sentinel-surface-alt border border-sentinel-border rounded p-2">{selectedBatch.prevBatch}</p></div>
                  <div><p className="text-xs text-sentinel-text-muted mb-1">This batch hash</p>
                    <div className="relative">
                      <button onClick={() => copyHash(selectedBatch.hash)} className="absolute top-1 right-1 text-xs text-sentinel-teal hover:underline bg-sentinel-surface px-1.5 py-0.5 rounded border border-sentinel-border font-medium">{copied ? <Check className="w-3 h-3 inline" /> : "Copy"}</button>
                      <p className="font-mono text-xs text-sentinel-text break-all bg-sentinel-surface-alt border border-sentinel-border rounded p-2 pr-12">{selectedBatch.hash}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-sentinel-surface border border-sentinel-border rounded-xl p-4">
                <h3 className="text-sm font-bold text-sentinel-text mb-2">Offline verification</h3>
                <pre className="border border-sentinel-border rounded-lg p-3 bg-sentinel-surface-alt font-mono text-xs text-sentinel-text overflow-x-auto leading-relaxed">{opensslCmd}</pre>
                <div className="flex items-center gap-2 text-xs text-sentinel-text-muted mt-2"><ShieldCheck className="w-4 h-4 text-sentinel-green" /> Verification can be performed entirely offline.</div>
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-primary text-white text-sm font-bold hover:opacity-90 transition-opacity touch-target shadow-glow-teal"><Download className="w-4 h-4" /> Download batch + signature</button>
            </div>
          )}
        </div>
      )}

      {view === "bundles" && (
        <div className="space-y-3">
          {evidenceBundlesLegacy.map((bundle) => (
            <div key={bundle.id} className="bg-sentinel-surface border border-sentinel-border rounded-xl p-4">
              <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
                <div><h2 className="text-sm font-bold text-sentinel-text">{bundle.month}</h2><p className="text-xs text-sentinel-text-muted font-mono">{bundle.id}</p></div>
                {bundle.attestedBy && <span className="inline-flex items-center gap-1 text-xs font-bold text-sentinel-green-dark bg-sentinel-green-light border border-sentinel-green/20 px-2.5 py-1 rounded-lg"><BadgeCheck className="w-3.5 h-3.5" /> {bundle.attestedBy}</span>}
              </div>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="border border-sentinel-border rounded-lg p-2 bg-sentinel-surface-alt"><p className="text-xs text-sentinel-text-muted">Decisions</p><p className="text-sm font-mono font-bold text-sentinel-text">{bundle.decisionCount.toLocaleString()}</p></div>
                <div className="border border-sentinel-border rounded-lg p-2 bg-sentinel-surface-alt"><p className="text-xs text-sentinel-text-muted">Tests</p><p className="text-sm font-mono font-bold text-sentinel-text">{bundle.testCount.toLocaleString()}</p></div>
                <div className="border border-sentinel-border rounded-lg p-2 bg-sentinel-surface-alt"><p className="text-xs text-sentinel-text-muted">Size</p><p className="text-sm font-mono font-bold text-sentinel-text">{bundle.size}</p></div>
              </div>
              {bundle.signedBy && <div className="flex items-center gap-2 text-sm text-sentinel-text-secondary mb-2"><KeyRound className="w-4 h-4 text-sentinel-teal" /><span className="font-mono text-xs">{bundle.signedBy}</span></div>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div><h3 className="text-xs font-bold text-sentinel-green-dark mb-1.5">What it proves</h3><ul className="space-y-1">{bundle.proves.map((p, i) => <li key={i} className="text-xs text-sentinel-text-secondary flex items-start gap-1.5"><span className="text-sentinel-green">✓</span>{p}</li>)}</ul></div>
                <div><h3 className="text-xs font-bold text-sentinel-amber-dark mb-1.5">What it does not prove</h3><ul className="space-y-1">{bundle.doesNotProve.map((p, i) => <li key={i} className="text-xs text-sentinel-text-secondary flex items-start gap-1.5"><span className="text-sentinel-amber">!</span>{p}</li>)}</ul></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "frameworks" && (
        <div className="bg-sentinel-surface border border-sentinel-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3"><h2 className="text-sm font-bold text-sentinel-text">Framework mapping</h2><span className="text-xs text-sentinel-text-muted px-2 py-0.5 rounded border border-sentinel-border font-mono">indicative</span></div>
          <p className="text-xs text-sentinel-text-secondary mb-4">Evidence bundles map to these frameworks. "Indicative" means the mapping is a guide, not a certification.</p>
          <div className="flex flex-wrap gap-2">
            {frameworks.map((fw) => (<span key={fw.id} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-sentinel-border bg-sentinel-surface-alt text-sm text-sentinel-text" title={fw.description}><span className="font-medium">{fw.name}</span><span className="text-sentinel-text-muted">·</span><span className="text-sentinel-violet-dark font-mono text-xs">{fw.label}</span></span>))}
          </div>
        </div>
      )}
    </div>
  );
}
