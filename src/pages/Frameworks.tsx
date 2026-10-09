import { frameworks } from "@/mock/data";
import { BookOpen, Info } from "lucide-react";

const frameworkGradients: Record<string, string> = {
  "eu-ai-act": "bg-gradient-blue",
  "nist-ai-rmf": "bg-gradient-violet",
  "owasp-llm": "bg-gradient-red",
  "iso-42001": "bg-gradient-green",
};

export function Frameworks() {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-sentinel-text mb-1">Frameworks</h1>
        <p className="text-sm text-sentinel-text-secondary">
          How Sentinel evidence maps to regulatory and standards frameworks. All mappings are indicative, not certified.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {frameworks.map((fw) => (
          <div key={fw.id} className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden hover:shadow-md card-lift transition-all">
            <div className={`h-1.5 ${frameworkGradients[fw.id] || "bg-gradient-primary"}`} />
            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg ${frameworkGradients[fw.id] || "bg-gradient-primary"} flex items-center justify-center`}>
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-sentinel-text">{fw.name}</h2>
                    <p className="text-xs font-mono text-sentinel-teal mt-0.5">{fw.label}</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded border border-sentinel-border font-mono text-sentinel-text-muted">indicative</span>
              </div>
              <p className="text-sm text-sentinel-text-secondary mb-3 leading-relaxed">{fw.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {fw.articles.map((article) => (
                  <span key={article} className="text-xs font-mono px-2 py-1 rounded bg-sentinel-surface-alt border border-sentinel-border text-sentinel-text-secondary">
                    {article}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 bg-sentinel-amber-light/40 border border-sentinel-amber/20 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-sentinel-amber flex-shrink-0 mt-0.5" />
        <p className="text-sm text-sentinel-text-secondary">
          "Indicative" means Sentinel's evidence can support your compliance process for these frameworks, but Sentinel is not a certified auditor. Your compliance team should confirm the mapping applies to your specific obligations.
        </p>
      </div>
    </div>
  );
}
