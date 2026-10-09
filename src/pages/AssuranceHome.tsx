import { Link } from "react-router-dom";
import { ChevronRight, AlertTriangle, TrendingDown, TrendingUp, Minus, ArrowRight, FlaskConical, Activity, LayoutGrid, FileCheck2 } from "lucide-react";
import { guardrails, needsAttention, timelineEvents } from "@/mock/data";
import { StatusPill } from "@/components/StatusPill";
import { RangeBar } from "@/components/RangeBar";
import { MeasurementBadge } from "@/components/MeasurementBadge";

const flowCards = [
  {
    question: "Do your guardrails catch attacks?",
    step: "Test",
    number: "82%",
    detail: "support-bot catch rate (502 of 612) — down 4 pts",
    status: "weakened" as const,
    statusLabel: "Weakened 2h ago",
    link: "/test/scorecard/support-bot",
    linkLabel: "View support-bot scorecard",
    icon: FlaskConical,
    gradient: "bg-gradient-blue",
    accent: "text-sentinel-blue",
  },
  {
    question: "Did anything change?",
    step: "Monitor",
    number: "5",
    detail: "setting changes in 30 days — 1 weakened, 1 improved, 2 no change",
    status: "needs_attention" as const,
    statusLabel: "1 needs attention",
    link: "/monitor/changes",
    linkLabel: "See changes & drift",
    icon: Activity,
    gradient: "bg-gradient-amber",
    accent: "text-sentinel-amber",
  },
  {
    question: "What's covered and what's not?",
    step: "Explain",
    number: "3 of 4",
    detail: "guardrails measured — kyc-assistant has no test access",
    status: "not_measured" as const,
    statusLabel: "1 not measured",
    link: "/explain/coverage",
    linkLabel: "Open coverage map",
    icon: LayoutGrid,
    gradient: "bg-gradient-violet",
    accent: "text-sentinel-violet",
  },
  {
    question: "Can you prove it to an auditor?",
    step: "Prove",
    number: "3",
    detail: "signed evidence bundles (Jul, Aug, Sep) — Oct collecting",
    status: "signed" as const,
    statusLabel: "3 verified, 1 collecting",
    link: "/prove/evidence",
    linkLabel: "View evidence bundles",
    icon: FileCheck2,
    gradient: "bg-gradient-green",
    accent: "text-sentinel-green",
  },
];

const severityIcon = {
  high: <AlertTriangle className="w-3.5 h-3.5 text-sentinel-red" />,
  medium: <AlertTriangle className="w-3.5 h-3.5 text-sentinel-amber" />,
  low: <AlertTriangle className="w-3.5 h-3.5 text-sentinel-text-muted" />,
};

function ChangeArrow({ change }: { change: string | null }) {
  if (!change || change === "no change") {
    return <span className="flex items-center gap-1 text-sentinel-text-muted font-mono text-sm"><Minus className="w-3 h-3" /> no change</span>;
  }
  const isNegative = change.startsWith("−");
  return (
    <span className={`flex items-center gap-1 font-mono text-sm ${isNegative ? "text-sentinel-amber" : "text-sentinel-green"}`}>
      {isNegative ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
      {change}
    </span>
  );
}

export function AssuranceHome() {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-sentinel-text mb-1">Assurance home</h1>
        <p className="text-sm text-sentinel-text-secondary">
          Independent proof that your AI guardrails work — test, monitor, explain, prove.
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
              {/* Gradient top strip */}
              <div className={`h-1.5 ${card.gradient}`} />
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${card.accent} font-mono`}>
                    Step {i + 1} · {card.step}
                  </span>
                  <div className={`w-8 h-8 rounded-lg ${card.gradient} flex items-center justify-center`}>
                    <card.icon className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </div>
                </div>
                <p className="text-sm text-sentinel-text-secondary mb-3 leading-snug min-h-[2.5rem]">
                  {card.question}
                </p>
                <p className={`text-3xl font-mono font-bold mb-1.5 ${card.accent}`}>
                  {card.number}
                </p>
                <p className="text-xs text-sentinel-text-secondary mb-3 leading-relaxed min-h-[2.5rem]">
                  {card.detail}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <StatusPill status={card.status} label={card.statusLabel} size="sm" />
                  <ArrowRight className="w-4 h-4 text-sentinel-text-muted group-hover:text-sentinel-teal transition-colors flex-shrink-0" />
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Guardrail table */}
      <div className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-sentinel-border flex items-center justify-between">
          <h2 className="text-sm font-bold text-sentinel-text">Guardrails</h2>
          <Link to="/test/scorecards" className="text-xs text-sentinel-teal hover:underline flex items-center gap-1 font-medium">
            All scorecards <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sentinel-border bg-sentinel-surface-alt">
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Provider</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Catch rate</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide hidden md:table-cell">95% range</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide hidden sm:table-cell">False blocks</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">vs last month</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {guardrails.map((g) => (
                <tr key={g.id} className="border-b border-sentinel-border last:border-b-0 hover:bg-sentinel-surface-alt transition-colors">
                  <td className="px-4 py-3">
                    <Link to={`/test/scorecard/${g.id}`} className="font-semibold text-sentinel-text hover:text-sentinel-teal transition-colors">
                      {g.name}
                    </Link>
                    <div className="mt-0.5">
                      <MeasurementBadge state={g.state} size="sm" />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sentinel-text-secondary">{g.provider}</td>
                  <td className="px-4 py-3">
                    {g.catchRate ? (
                      <span className="font-mono font-medium text-sentinel-text">
                        {g.catchRate.percentage}%
                        <span className="block text-xs text-sentinel-text-muted">
                          {g.catchRate.caught.toLocaleString()} of {g.catchRate.total.toLocaleString()}
                        </span>
                      </span>
                    ) : (
                      <span className="font-mono text-sentinel-text-muted hatch-pattern-dark px-2 rounded text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell w-32">
                    {g.catchRate ? (
                      <div className="flex flex-col gap-0.5">
                        <RangeBar data={g.catchRate.range} state={g.state} />
                        <span className="text-xs text-sentinel-text-muted font-mono">{g.catchRate.range.low}–{g.catchRate.range.high}</span>
                      </div>
                    ) : (
                      <span className="font-mono text-sentinel-text-muted text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {g.falseBlocks ? (
                      <span className="font-mono text-sentinel-text">
                        {g.falseBlocks.percentage}%
                        <span className="block text-xs text-sentinel-text-muted">{g.falseBlocks.count} of {g.falseBlocks.total} harmless</span>
                      </span>
                    ) : (
                      <span className="font-mono text-sentinel-text-muted text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <ChangeArrow change={g.changeVsLastMonth} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill status={g.status} label={g.statusLabel} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Needs attention */}
        <div className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-sentinel-border flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-red flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5 text-white" />
            </div>
            <h2 className="text-sm font-bold text-sentinel-text">Needs attention</h2>
          </div>
          <div className="divide-y divide-sentinel-border">
            {needsAttention.map((item) => (
              <div key={item.id} className="px-4 py-3 hover:bg-sentinel-surface-alt transition-colors">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 flex-shrink-0">{severityIcon[item.severity]}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-sentinel-text font-medium">{item.guardrailName}</p>
                    <p className="text-sm text-sentinel-text-secondary mt-0.5">{item.issue}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-sentinel-teal font-medium">{item.action}</span>
                      <span className="text-xs text-sentinel-text-muted">· {item.when}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 30-day timeline */}
        <div className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden">
          <div className="px-4 py-3 border-b border-sentinel-border flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-primary flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-white" />
            </div>
            <h2 className="text-sm font-bold text-sentinel-text">30-day timeline</h2>
          </div>
          <div className="max-h-[360px] overflow-y-auto scrollbar-thin">
            <div className="relative px-4 py-3">
              <div className="absolute left-[1.625rem] top-3 bottom-3 w-px bg-sentinel-border" />
              {timelineEvents.map((event) => (
                <div key={event.id} className="relative flex gap-3 pb-4 last:pb-0">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 z-10 ring-2 ring-sentinel-surface ${
                    event.type === "setting_change" ? "bg-sentinel-amber" :
                    event.type === "incident" ? "bg-sentinel-red" :
                    event.type === "evidence_signed" ? "bg-sentinel-green" :
                    event.type === "approval" ? "bg-sentinel-teal" :
                    event.type === "test_run" ? "bg-sentinel-blue" :
                    "bg-sentinel-text-muted"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-sentinel-text-muted font-mono">{event.when}</span>
                      {event.guardrailName && (
                        <span className="text-xs text-sentinel-text-secondary font-mono">{event.guardrailName}</span>
                      )}
                    </div>
                    <p className="text-sm text-sentinel-text mt-0.5 font-medium">{event.label}</p>
                    <p className="text-xs text-sentinel-text-secondary mt-0.5">{event.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
