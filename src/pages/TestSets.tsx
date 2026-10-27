import { testSets } from "@/mock/data";
import { Globe, Lock, FlaskConical } from "lucide-react";

export function TestSets() {
  const publicSets = testSets.filter((t) => t.visibility === "public");
  const privateSets = testSets.filter((t) => t.visibility === "private");

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-sentinel-text mb-1">Test sets</h1>
        <p className="text-sm text-sentinel-text-secondary">
          Attack prompt collections used to test guardrails. Public sets are maintained by Sentinel; private sets are curated by your team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Public */}
        <div className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-sentinel-border flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-blue flex items-center justify-center">
              <Globe className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-sentinel-text">Public test sets</h2>
              <p className="text-xs text-sentinel-text-secondary">{publicSets.length} sets · maintained by Sentinel</p>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sentinel-border bg-sentinel-surface-alt">
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Prompts</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Updated</th>
              </tr>
            </thead>
            <tbody>
              {publicSets.map((ts) => (
                <tr key={ts.id} className="border-b border-sentinel-border last:border-b-0 hover:bg-sentinel-surface-alt transition-colors">
                  <td className="px-4 py-3 font-medium text-sentinel-text">{ts.name}</td>
                  <td className="px-4 py-3 text-sentinel-text-secondary">{ts.category}</td>
                  <td className="px-4 py-3 font-mono font-medium text-sentinel-blue-dark">{ts.promptCount}</td>
                  <td className="px-4 py-3 font-mono text-xs text-sentinel-text-muted">{ts.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Private */}
        <div className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-sentinel-border flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-violet flex items-center justify-center">
              <Lock className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-sentinel-text">Private test sets</h2>
              <p className="text-xs text-sentinel-text-secondary">{privateSets.length} sets · curated by Acme Bank</p>
            </div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sentinel-border bg-sentinel-surface-alt">
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Prompts</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Updated</th>
              </tr>
            </thead>
            <tbody>
              {privateSets.map((ts) => (
                <tr key={ts.id} className="border-b border-sentinel-border last:border-b-0 hover:bg-sentinel-surface-alt transition-colors">
                  <td className="px-4 py-3 font-medium text-sentinel-text">{ts.name}</td>
                  <td className="px-4 py-3 text-sentinel-text-secondary">{ts.category}</td>
                  <td className="px-4 py-3 font-mono font-medium text-sentinel-violet-dark">{ts.promptCount}</td>
                  <td className="px-4 py-3 font-mono text-xs text-sentinel-text-muted">{ts.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
