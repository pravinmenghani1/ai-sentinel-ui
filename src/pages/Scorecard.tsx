import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  TrendingDown,
  TrendingUp,
  Minus,
  Info,
  Cloud,
  User,
  Clock,
  ExternalLink,
  Target,
  ShieldX,
  Gauge,
  TrendingUp as TrendingUpIcon,
  Wrench,
} from "lucide-react";
import { guardrails, attackCategories, whyDroppedPanel, testSetComparison, settingChanges, driftHistory } from "@/mock/data";
import { StatusPill } from "@/components/StatusPill";
import { RangeBar } from "@/components/RangeBar";
import { MeasurementBadge } from "@/components/MeasurementBadge";
import { HonestNumber } from "@/components/HonestNumber";
import { DiffView } from "@/components/DiffView";

type Tab = "scorecard" | "drift" | "settings" | "runs";

export function Scorecard() {
  const { guardrailId } = useParams();
  const [activeTab, setActiveTab] = useState<Tab>("scorecard");

  const guardrail = guardrails.find((g) => g.id === guardrailId) || guardrails[0];
  const guardrailChanges = settingChanges.filter((sc) => sc.guardrailId === guardrail.id);

  const tabs: { id: Tab; label: string }[] = [
    { id: "scorecard", label: "Scorecard" },
    { id: "drift", label: "Drift" },
    { id: "settings", label: "Settings" },
    { id: "runs", label: "Runs" },
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 mb-4 text-sm">
        <Link to="/" className="text-sentinel-text-secondary hover:text-sentinel-teal flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
        <span className="text-sentinel-text-muted">/</span>
        <Link to="/test/scorecards" className="text-sentinel-text-secondary hover:text-sentinel-teal transition-colors">
          Scorecards
        </Link>
        <span className="text-sentinel-text-muted">/</span>
        <span className="text-sentinel-text font-semibold">{guardrail.name}</span>
      </div>

      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-sentinel-text">{guardrail.name}</h1>
            <StatusPill status={guardrail.status} label={guardrail.statusLabel} size="sm" />
          </div>
          <div className="flex items-center gap-3 text-sm text-sentinel-text-secondary">
            <span className="flex items-center gap-1"><Cloud className="w-3.5 h-3.5 text-sentinel-blue" /> {guardrail.provider}</span>
            <span>·</span>
            <span>{guardrail.policyName}</span>
          </div>
        </div>
        {guardrail.state === "not_measured" && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sentinel-amber-light text-sentinel-amber-dark text-sm border border-sentinel-amber/20">
            <Info className="w-4 h-4 flex-shrink-0" />
            Test access not granted — no measurements available
          </div>
        )}
      </div>

      <div className="border-b border-sentinel-border mb-6">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2.5 text-sm font-semibold border-b-2 transition-colors touch-target ${
                activeTab === tab.id
                  ? "border-sentinel-teal text-sentinel-teal"
                  : "border-transparent text-sentinel-text-secondary hover:text-sentinel-text"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "scorecard" && <ScorecardTab guardrail={guardrail} />}
      {activeTab === "drift" && <DriftTab guardrail={guardrail} changes={guardrailChanges} />}
      {activeTab === "settings" && <SettingsTab guardrail={guardrail} changes={guardrailChanges} />}
      {activeTab === "runs" && <RunsTab guardrail={guardrail} />}
    </div>
  );
}

function ScorecardTab({ guardrail }: { guardrail: typeof guardrails[0] }) {
  return (
    <>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden card-lift hover:shadow-lg">
          <div className="h-1 bg-gradient-primary" />
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Target className="w-3.5 h-3.5 text-white" />
              </div>
              <p className="text-xs font-medium text-sentinel-text-secondary">Overall catch rate</p>
            </div>
            {guardrail.catchRate ? (
              <HonestNumber
                caught={guardrail.catchRate.caught}
                total={guardrail.catchRate.total}
                percentage={guardrail.catchRate.percentage}
                showRange={`${guardrail.catchRate.range.low}–${guardrail.catchRate.range.high}`}
                size="lg"
              />
            ) : (
              <HonestNumber caught={null} total={null} percentage={null} state="not_measured" size="lg" />
            )}
          </div>
        </div>
        <div className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden card-lift hover:shadow-lg">
          <div className="h-1 bg-gradient-amber" />
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-amber flex items-center justify-center">
                <ShieldX className="w-3.5 h-3.5 text-white" />
              </div>
              <p className="text-xs font-medium text-sentinel-text-secondary">False blocks</p>
            </div>
            {guardrail.falseBlocks ? (
              <>
                <p className="text-4xl font-mono font-bold text-sentinel-text">{guardrail.falseBlocks.percentage}%</p>
                <p className="text-xs text-sentinel-text-secondary mt-1">
                  {guardrail.falseBlocks.count} of {guardrail.falseBlocks.total} harmless prompts
                  {guardrail.falseBlocks.rangeLow && (
                    <span className="block text-xs text-sentinel-text-muted font-mono">range {guardrail.falseBlocks.rangeLow}–{guardrail.falseBlocks.rangeHigh}%</span>
                  )}
                </p>
              </>
            ) : (
              <HonestNumber caught={null} total={null} percentage={null} state="not_measured" size="lg" />
            )}
          </div>
        </div>
        <div className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden card-lift hover:shadow-lg">
          <div className="h-1 bg-gradient-blue" />
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-blue flex items-center justify-center">
                <Gauge className="w-3.5 h-3.5 text-white" />
              </div>
              <p className="text-xs font-medium text-sentinel-text-secondary">Policy threshold</p>
            </div>
            <p className="text-4xl font-mono font-bold text-sentinel-text">{guardrail.policyThreshold}%</p>
            <p className="text-xs text-sentinel-text-secondary mt-1">minimum catch rate</p>
          </div>
        </div>
        <div className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden card-lift hover:shadow-lg">
          <div className="h-1 bg-gradient-green" />
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-green flex items-center justify-center">
                <TrendingUpIcon className="w-3.5 h-3.5 text-white" />
              </div>
              <p className="text-xs font-medium text-sentinel-text-secondary">vs last month</p>
            </div>
            {guardrail.changeVsLastMonth ? (
              <p className={`text-4xl font-mono font-bold ${
                guardrail.changeVsLastMonth.startsWith("−") ? "text-sentinel-amber" :
                guardrail.changeVsLastMonth.startsWith("+") ? "text-sentinel-green" : "text-sentinel-text"
              }`}>{guardrail.changeVsLastMonth}</p>
            ) : (
              <p className="text-4xl font-mono font-bold text-sentinel-text-muted">—</p>
            )}
            <p className="text-xs text-sentinel-text-secondary mt-1">catch rate change</p>
          </div>
        </div>
      </div>

      {/* Catch rate by attack category */}
      <div className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-sentinel-border flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-violet flex items-center justify-center">
            <Target className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-sentinel-text">Catch rate by attack category</h2>
            <p className="text-xs text-sentinel-text-secondary mt-0.5">Measured against 540 public attack prompts plus 72 customer-specific prompts</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sentinel-border bg-sentinel-surface-alt">
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Attack category</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Catch rate</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide hidden md:table-cell">95% range</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Last month</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Change</th>
              </tr>
            </thead>
            <tbody>
              {attackCategories.map((cat) => {
                const changeStr = cat.changePct > 0 ? `+${cat.changePct}` : `${cat.changePct}`;
                const isNegative = cat.changePct < 0;
                const isPositive = cat.changePct > 0;
                return (
                  <tr key={cat.category} className="border-b border-sentinel-border last:border-b-0 hover:bg-sentinel-surface-alt transition-colors">
                    <td className="px-4 py-3 font-medium text-sentinel-text">
                      {cat.category}
                      {cat.tooFewToJudge && (
                        <span className="ml-2 text-xs text-sentinel-amber-dark font-medium">too few to judge</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {cat.tooFewToJudge ? (
                        <>
                          <span className="font-mono font-medium text-sentinel-amber-dark">{cat.caught} of {cat.total}</span>
                          <span className="block text-xs text-sentinel-text-muted">no rate shown</span>
                        </>
                      ) : (
                        <>
                          <span className="font-mono font-medium text-sentinel-text">{cat.percentage}%</span>
                          <span className="block text-xs text-sentinel-text-muted font-mono">{cat.caught} of {cat.total}</span>
                        </>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell w-40">
                      {!cat.tooFewToJudge && <RangeBar data={cat.range} showLabels />}
                    </td>
                    <td className="px-4 py-3 font-mono text-sentinel-text-secondary">{cat.lastMonthPct}%</td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1 font-mono font-medium ${isNegative ? "text-sentinel-amber" : isPositive ? "text-sentinel-green" : "text-sentinel-text-muted"}`}>
                        {isNegative ? <TrendingDown className="w-3 h-3" /> : isPositive ? <TrendingUp className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                        {changeStr} pts
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Why it dropped */}
      {guardrail.id === "support-bot" && (
        <div className="bg-sentinel-surface border border-sentinel-amber/30 rounded-xl overflow-hidden mb-6 shadow-glow-amber">
          <div className="px-4 py-3 border-b border-sentinel-border bg-sentinel-amber-light/50 flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-amber flex items-center justify-center">
              <TrendingDown className="w-3.5 h-3.5 text-white" />
            </div>
            <h2 className="text-sm font-bold text-sentinel-text">Why it dropped</h2>
          </div>
          <div className="p-4 space-y-4">
            <p className="text-sm text-sentinel-text-secondary">
              Catch rate dropped <span className="font-mono font-bold text-sentinel-amber-dark">{whyDroppedPanel.dropPoints} points</span> — driven by{" "}
              <span className="font-bold text-sentinel-amber-dark">{whyDroppedPanel.affectedCategory}</span> dropping from{" "}
              <span className="font-mono font-bold">{whyDroppedPanel.previousRate}%</span> to{" "}
              <span className="font-mono font-bold text-sentinel-amber-dark">{whyDroppedPanel.newRate}%</span>.
            </p>

            {/* Setting change detail */}
            <div className="border border-sentinel-border rounded-lg p-4 bg-sentinel-surface-alt">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wide text-sentinel-text-muted">Setting change from CloudTrail</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-sentinel-text-muted" />
                  <span className="text-sentinel-text-secondary">Who:</span>
                  <span className="font-mono text-sentinel-text">{whyDroppedPanel.settingChange.who}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-sentinel-text-muted" />
                  <span className="text-sentinel-text-secondary">When:</span>
                  <span className="font-mono text-sentinel-text">{whyDroppedPanel.settingChange.when}</span>
                </div>
              </div>
              <div className="text-sm mb-3">
                <span className="text-sentinel-text-secondary">Setting: </span>
                <span className="text-sentinel-text font-medium">{whyDroppedPanel.settingChange.setting}</span>
              </div>
              <div className="flex items-center gap-3 text-sm mb-3">
                <span className="font-mono text-sentinel-green-dark bg-sentinel-green-light px-2 py-1 rounded font-medium">
                  {whyDroppedPanel.settingChange.before}
                </span>
                <span className="text-sentinel-text-muted">→</span>
                <span className="font-mono text-sentinel-amber-dark bg-sentinel-amber-light px-2 py-1 rounded font-medium border border-sentinel-amber/20">
                  {whyDroppedPanel.settingChange.after}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-sentinel-text-muted">
                <ExternalLink className="w-3 h-3" />
                <span className="font-mono">Source: {whyDroppedPanel.settingChange.source}</span>
                <span>·</span>
                <span className="font-mono">Event: {whyDroppedPanel.settingChange.eventId}</span>
              </div>
              <div className="mt-2 text-xs text-sentinel-amber-dark font-medium">
                {whyDroppedPanel.policyReference}
              </div>
            </div>

            {/* Timeline */}
            <div className="relative pl-6">
              <div className="absolute left-2 top-2 bottom-2 w-px bg-sentinel-border" />
              {whyDroppedPanel.timeline.map((event, i) => (
                <div key={i} className="relative flex gap-3 pb-3 last:pb-0">
                  <div className={`absolute -left-4 w-2.5 h-2.5 rounded-full mt-1.5 ring-2 ring-sentinel-surface ${
                    i === 0 ? "bg-sentinel-amber" : i === 3 ? "bg-sentinel-red" : "bg-sentinel-blue"
                  }`} />
                  <div>
                    <span className="text-xs font-mono text-sentinel-text-muted">{event.time}</span>
                    <p className="text-sm text-sentinel-text mt-0.5">
                      {event.event}
                      {event.value && <span className="font-mono font-medium ml-1">{event.value}</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-2 text-sm text-sentinel-amber-dark bg-sentinel-amber-light/50 rounded-lg p-3 border border-sentinel-amber/20">
              <Wrench className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p className="font-medium">{whyDroppedPanel.explanation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Public vs private test set comparison */}
      <div className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-sentinel-border flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-blue flex items-center justify-center">
            <Target className="w-3.5 h-3.5 text-white" />
          </div>
          <h2 className="text-sm font-bold text-sentinel-text">Public vs private test sets</h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="border border-sentinel-border rounded-xl p-4 bg-sentinel-surface-alt">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wide text-sentinel-blue">Public</span>
              </div>
              <p className="text-sm text-sentinel-text-secondary mb-3">{testSetComparison.publicSet.name}</p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-mono font-bold text-sentinel-blue-dark">{testSetComparison.publicSet.percentage}%</span>
                <span className="text-xs text-sentinel-text-muted font-mono">{testSetComparison.publicSet.caught} of {testSetComparison.publicSet.prompts}</span>
              </div>
              <RangeBar data={testSetComparison.publicSet.range} showLabels />
            </div>
            <div className="border border-sentinel-border rounded-xl p-4 bg-sentinel-surface-alt">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wide text-sentinel-violet">Private (customer's own)</span>
              </div>
              <p className="text-sm text-sentinel-text-secondary mb-3">{testSetComparison.privateSet.name}</p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-2xl font-mono font-bold text-sentinel-violet-dark">{testSetComparison.privateSet.percentage}%</span>
                <span className="text-xs text-sentinel-text-muted font-mono">{testSetComparison.privateSet.caught} of {testSetComparison.privateSet.prompts}</span>
              </div>
              <RangeBar data={testSetComparison.privateSet.range} showLabels />
            </div>
          </div>
          <div className="flex items-start gap-2 text-sm text-sentinel-text-secondary bg-sentinel-blue-light/50 rounded-lg p-3 border border-sentinel-blue/10">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-sentinel-blue" />
            <p>{testSetComparison.note}</p>
          </div>
        </div>
      </div>
    </>
  );
}

function DriftTab({ guardrail, changes }: { guardrail: typeof guardrails[0]; changes: typeof settingChanges }) {
  const minY = 50;
  const maxY = 100;
  const chartHeight = 180;
  const yToPx = (val: number) => chartHeight - ((val - minY) / (maxY - minY)) * chartHeight;

  return (
    <div className="space-y-4">
      <div className="bg-sentinel-surface border border-sentinel-border rounded-xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-md bg-gradient-primary flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5 text-white" />
          </div>
          <h2 className="text-sm font-bold text-sentinel-text">Monthly catch rate with 95% range</h2>
        </div>
        <p className="text-sm text-sentinel-text-secondary mb-4">
          Catch rate history for {guardrail.name}. The shaded band shows the 95% confidence range. Markers on the line indicate setting changes.
        </p>

        {/* SVG chart */}
        <div className="relative">
          <svg viewBox="0 0 600 220" className="w-full" preserveAspectRatio="xMidYMid meet">
            {/* Y-axis labels */}
            {[100, 90, 80, 70, 60, 50].map((y) => {
              const py = yToPx(y) + 20;
              return (
                <g key={y}>
                  <line x1="40" y1={py} x2="580" y2={py} stroke="currentColor" className="text-sentinel-border" strokeWidth="1" strokeDasharray="2 4" />
                  <text x="30" y={py + 4} textAnchor="end" className="fill-sentinel-text-muted" fontSize="10" fontFamily="monospace">{y}%</text>
                </g>
              );
            })}

            {/* 95% range band */}
            {driftHistory.length > 0 && (
              <>
                {(() => {
                  const points = driftHistory.map((d, i) => {
                    const x = 80 + i * 220;
                    return { x, top: yToPx(d.rangeHigh) + 20, bottom: yToPx(d.rangeLow) + 20 };
                  });
                  const pathTop = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.top}`).join(" ");
                  const pathBottom = points.slice().reverse().map((p) => `L ${p.x} ${p.bottom}`).join(" ");
                  return <path d={`${pathTop} ${pathBottom} Z`} className="fill-sentinel-teal/15" stroke="none" />;
                })()}
              </>
            )}

            {/* Main line */}
            <polyline
              points={driftHistory.map((d, i) => `${80 + i * 220},${yToPx(d.percentage) + 20}`).join(" ")}
              fill="none"
              className="stroke-sentinel-teal"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Data points and setting change markers */}
            {driftHistory.map((d, i) => {
              const x = 80 + i * 220;
              const y = yToPx(d.percentage) + 20;
              return (
                <g key={i}>
                  {/* Setting change marker */}
                  {d.hasSettingChange && (
                    <line x1={x} y1={y - 8} x2={x} y2={y - 20} className="stroke-sentinel-amber" strokeWidth="2" />
                  )}
                  <circle cx={x} cy={y} r="5" className="fill-sentinel-teal stroke-sentinel-surface" strokeWidth="2" />
                  {d.hasSettingChange && (
                    <circle cx={x} cy={y - 22} r="3" className="fill-sentinel-amber" />
                  )}
                  <text x={x} y={y + 20} textAnchor="middle" className="fill-sentinel-text-muted" fontSize="10" fontFamily="monospace">{d.month}</text>
                  <text x={x} y={y - 30} textAnchor="middle" className="fill-sentinel-text font-bold" fontSize="11" fontFamily="monospace">{d.percentage}%</text>
                  {d.settingChangeLabel && (
                    <text x={x} y={y - 42} textAnchor="middle" className="fill-sentinel-amber-dark" fontSize="8" fontFamily="monospace">⚙</text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <div className="flex items-center gap-4 mt-3 text-xs text-sentinel-text-secondary flex-wrap">
          <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-sentinel-teal rounded" /> Catch rate</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-sentinel-teal/15 rounded" /> 95% range</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-sentinel-amber" /> Setting change</span>
        </div>
      </div>

      <div className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-sentinel-border">
          <h2 className="text-sm font-bold text-sentinel-text">Setting changes and re-test results</h2>
        </div>
        {changes.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-sentinel-text-muted">
            No setting changes recorded for this guardrail.
          </div>
        ) : (
          <div className="divide-y divide-sentinel-border">
            {changes.map((change) => (
              <div key={change.id} className="p-4 hover:bg-sentinel-surface-alt transition-colors">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                  <div>
                    <p className="text-sm font-medium text-sentinel-text">{change.setting}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-sentinel-text-secondary">
                      <span className="font-mono">{change.who}</span>
                      <span>·</span>
                      <span>{change.when}</span>
                    </div>
                  </div>
                  {change.retestResult && (
                    <div className="text-right">
                      <p className="text-xs text-sentinel-text-secondary">Re-test result</p>
                      <p className={`font-mono font-bold ${
                        change.retestStatus === "weakened" ? "text-sentinel-amber-dark" :
                        change.retestStatus === "improved" ? "text-sentinel-green-dark" :
                        "text-sentinel-text"
                      }`}>
                        {change.retestResult.percentage}% ({change.retestResult.caught} of {change.retestResult.total})
                      </p>
                    </div>
                  )}
                </div>
                <DiffView diff={change.diff} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsTab({ guardrail, changes }: { guardrail: typeof guardrails[0]; changes: typeof settingChanges }) {
  const isSupportBot = guardrail.id === "support-bot";

  const settings = isSupportBot ? [
    { name: "Prompt attack filter", value: "LOW", policyReq: "HIGH", flagged: true },
    { name: "PII categories", value: "Name, Email, Phone, SSN, DOB", policyReq: null, flagged: false },
  ] : [
    { name: "Severity threshold", value: "3 (medium)", policyReq: null, flagged: false },
    { name: "Block threshold", value: "3", policyReq: null, flagged: false },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-sentinel-border">
          <h2 className="text-sm font-bold text-sentinel-text">Current settings</h2>
          <p className="text-xs text-sentinel-text-secondary mt-0.5">Approved policy: {guardrail.policyName}</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-sentinel-border bg-sentinel-surface-alt">
              <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Setting</th>
              <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Value</th>
              <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Policy requirement</th>
            </tr>
          </thead>
          <tbody>
            {settings.map((s, i) => (
              <tr key={i} className="border-b border-sentinel-border last:border-b-0 hover:bg-sentinel-surface-alt transition-colors">
                <td className="px-4 py-3 font-medium text-sentinel-text">{s.name}</td>
                <td className={`px-4 py-3 font-mono ${s.flagged ? "text-sentinel-amber-dark font-bold" : "text-sentinel-text"}`}>{s.value}</td>
                <td className="px-4 py-3">
                  {s.flagged ? (
                    <span className="text-xs text-sentinel-amber-dark font-medium flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" /> Flagged — policy requires {s.policyReq}
                    </span>
                  ) : (
                    <span className="text-xs text-sentinel-green-dark font-medium">Within policy</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-sentinel-border">
          <h2 className="text-sm font-bold text-sentinel-text">Setting change history</h2>
        </div>
        {changes.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-sentinel-text-muted">No changes recorded.</div>
        ) : (
          <div className="divide-y divide-sentinel-border">
            {changes.map((change) => (
              <div key={change.id} className="p-4 hover:bg-sentinel-surface-alt transition-colors">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                  <div>
                    <p className="text-sm font-medium text-sentinel-text">{change.setting}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-sentinel-text-secondary">
                      <span className="font-mono">{change.who}</span>
                      <span>·</span>
                      <span>{change.when}</span>
                    </div>
                  </div>
                </div>
                <DiffView diff={change.diff} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RunsTab({ guardrail }: { guardrail: typeof guardrails[0] }) {
  const runs = [
    { id: "run-2026-10-09", date: "2026-10-09 12:10", trigger: "After setting change", status: "completed", caught: 502, total: 612, pct: 82 },
    { id: "run-2026-10-01", date: "2026-10-01 02:00", trigger: "Monthly assessment", status: "completed", caught: 527, total: 612, pct: 86 },
    { id: "run-2026-09-30", date: "2026-09-30 02:00", trigger: "Monthly assessment", status: "completed", caught: 527, total: 612, pct: 86 },
    { id: "run-2026-09-14", date: "2026-09-14 11:20", trigger: "After setting change", status: "completed", caught: 527, total: 612, pct: 86 },
    { id: "run-2026-09-01", date: "2026-09-01 02:00", trigger: "Monthly assessment", status: "completed", caught: 551, total: 612, pct: 90 },
    { id: "run-2026-08-01", date: "2026-08-01 02:00", trigger: "Monthly assessment", status: "completed", caught: 551, total: 612, pct: 90 },
  ];

  return (
    <div className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-sentinel-border">
        <h2 className="text-sm font-bold text-sentinel-text">Test runs for {guardrail.name}</h2>
        <p className="text-xs text-sentinel-text-secondary mt-0.5">Each run uses 540 attack prompts and 729 harmless prompts</p>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-sentinel-border bg-sentinel-surface-alt">
            <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Date</th>
            <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Trigger</th>
            <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Catch rate</th>
            <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Samples</th>
            <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Status</th>
          </tr>
        </thead>
        <tbody>
          {runs.map((run) => (
            <tr key={run.id} className="border-b border-sentinel-border last:border-b-0 hover:bg-sentinel-surface-alt transition-colors">
              <td className="px-4 py-3 font-mono text-sentinel-text text-xs">{run.date}</td>
              <td className="px-4 py-3 text-sentinel-text-secondary">{run.trigger}</td>
              <td className="px-4 py-3 font-mono font-bold text-sentinel-teal-dark">{run.pct}%</td>
              <td className="px-4 py-3 font-mono text-sentinel-text-secondary text-xs">{run.caught} of {run.total}</td>
              <td className="px-4 py-3"><StatusPill status="matches_policy" label="Completed" size="sm" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
