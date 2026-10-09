// ─── Types ──────────────────────────────────────────────────────────────────

export type MeasurementState = "measured" | "attested" | "not_measured";

export type StatusType =
  | "matches_policy"
  | "weakened"
  | "not_measured"
  | "improved"
  | "collecting"
  | "signed"
  | "verified"
  | "pending"
  | "approved"
  | "rejected"
  | "needs_attention";

export interface RangeBarData {
  value: number;
  low: number;
  high: number;
  previousValue?: number;
}

export interface FalseBlocks {
  count: number;
  total: number;
  percentage: number;
  rangeLow?: number;
  rangeHigh?: number;
}

export interface Guardrail {
  id: string;
  name: string;
  provider: string;
  catchRate: { caught: number; total: number; percentage: number; range: RangeBarData } | null;
  falseBlocks: FalseBlocks | null;
  changeVsLastMonth: string | null;
  status: StatusType;
  statusLabel: string;
  state: MeasurementState;
  policyName: string;
  policyThreshold: number;
}

export interface AttackCategory {
  category: string;
  caught: number;
  total: number;
  percentage: number;
  range: RangeBarData;
  lastMonthPct: number;
  changePct: number;
  tooFewToJudge?: boolean;
}

export interface SettingChange {
  id: string;
  guardrailId: string;
  guardrailName: string;
  who: string;
  when: string;
  timestamp: string;
  setting: string;
  before: string;
  after: string;
  diff: { field: string; oldValue: string; newValue: string }[];
  retestResult: { caught: number; total: number; percentage: number } | null;
  retestStatus: "improved" | "weakened" | "no_change" | "not_run";
}

export interface TimelineEvent {
  id: string;
  when: string;
  type: "setting_change" | "test_run" | "incident" | "approval" | "evidence_signed" | "guardrail_connected";
  label: string;
  detail: string;
  guardrailName?: string;
}

export interface Decision {
  id: string;
  timestamp: string;
  guardrailName: string;
  provider: string;
  decision: "allow" | "block" | "mask";
  inputChannel: string;
  userId: string;
  checksFired: { check: string; result: string; detail: string }[];
  contentHash: string;
  category: string;
  responseAction: string;
}

export interface EvidenceBundle {
  id: string;
  month: string;
  status: "collecting" | "signed" | "verified";
  signedAt: string | null;
  signedBy: string | null;
  attestedBy: string | null;
  size: string;
  sha256: string;
  keyId: string;
  proves: string[];
  doesNotProve: string[];
  guardrailsCovered: string[];
  decisionCount: number;
  testCount: number;
}

export interface Framework {
  id: string;
  name: string;
  label: string;
  status: "indicative" | "aligned";
  articles: string[];
  description: string;
}

export interface Approval {
  id: string;
  title: string;
  requestedBy: string;
  requestedAt: string;
  guardrailName: string;
  type: "policy_change" | "setting_change" | "threshold_change";
  status: "pending" | "approved" | "rejected";
  diff: { field: string; oldValue: string; newValue: string }[];
  approvers: { name: string; role: string; approved: boolean | null }[];
  description: string;
}

export interface GuardrailConnection {
  id: string;
  name: string;
  provider: string;
  cloud: string;
  connectionStatus: "connected" | "disconnected" | "error";
  testAccessStatus: "granted" | "not_granted" | "pending";
  monthlyTestBudget: number;
  testsThisMonth: number;
  region: string;
}

export interface NeedsAttentionItem {
  id: string;
  guardrailName: string;
  issue: string;
  severity: "high" | "medium" | "low";
  action: string;
  when: string;
}

export interface CoverageCell {
  guardrailId: string;
  guardrailName: string;
  state: MeasurementState;
  caught: number;
  total: number;
  percentage: number | null;
  tooFewToJudge?: boolean;
}

export interface CoverageRow {
  attackCategory: string;
  total: number;
  guardrails: CoverageCell[];
}

export interface AISystemCoverage {
  id: string;
  name: string;
  type: string;
  status: "governed" | "partly_governed" | "unguarded" | "bypassing_gateway" | "unknown";
  reason: string;
}

export interface DriftPoint {
  month: string;
  percentage: number;
  rangeLow: number;
  rangeHigh: number;
  hasSettingChange: boolean;
  settingChangeLabel?: string;
}

export interface AgentTool {
  id: string;
  name: string;
  type: string;
  guardrailId: string;
  guardrailName: string;
  monitored: boolean;
  decisionCount: number;
  lastSeen: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: "high" | "medium" | "low";
  status: "open" | "investigating" | "resolved";
  guardrailName: string;
  openedAt: string;
  description: string;
}

export interface Assessment {
  id: string;
  name: string;
  guardrailName: string;
  date: string;
  status: "completed" | "in_progress" | "scheduled";
  catchRate: number | null;
  testCount: number;
}

export interface TestSet {
  id: string;
  name: string;
  category: string;
  promptCount: number;
  visibility: "public" | "private";
  lastUpdated: string;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

export const guardrails: Guardrail[] = [
  {
    id: "support-bot",
    name: "support-bot",
    provider: "Bedrock",
    catchRate: { caught: 502, total: 612, percentage: 82, range: { value: 82, low: 79, high: 85, previousValue: 86 } },
    falseBlocks: { count: 23, total: 729, percentage: 3.2, rangeLow: 2.1, rangeHigh: 4.7 },
    changeVsLastMonth: "−4 pts",
    status: "weakened",
    statusLabel: "Weakened 2h ago",
    state: "measured",
    policyName: "Customer-facing guardrail policy v13",
    policyThreshold: 80,
  },
  {
    id: "claims-agent",
    name: "claims-agent",
    provider: "Azure Content Safety",
    catchRate: { caught: 465, total: 612, percentage: 76, range: { value: 76, low: 72, high: 79, previousValue: 75 } },
    falseBlocks: { count: 42, total: 729, percentage: 5.8 },
    changeVsLastMonth: "+1 pt",
    status: "matches_policy",
    statusLabel: "Matches policy",
    state: "measured",
    policyName: "Claims processing policy v2",
    policyThreshold: 75,
  },
  {
    id: "chat-prod",
    name: "chat-prod route",
    provider: "LiteLLM → Bedrock",
    catchRate: { caught: 539, total: 612, percentage: 88, range: { value: 88, low: 85, high: 90, previousValue: 88 } },
    falseBlocks: { count: 16, total: 729, percentage: 2.2 },
    changeVsLastMonth: "no change",
    status: "matches_policy",
    statusLabel: "Matches policy",
    state: "measured",
    policyName: "Internal chat policy v1",
    policyThreshold: 85,
  },
  {
    id: "kyc-assistant",
    name: "kyc-assistant",
    provider: "Google Model Armor",
    catchRate: null,
    falseBlocks: null,
    changeVsLastMonth: null,
    status: "not_measured",
    statusLabel: "Test access not granted",
    state: "not_measured",
    policyName: "KYC compliance policy v1",
    policyThreshold: 90,
  },
];

export const attackCategories: AttackCategory[] = [
  { category: "Prompt injection", caught: 114, total: 160, percentage: 71, range: { value: 71, low: 64, high: 78 }, lastMonthPct: 83, changePct: -12 },
  { category: "Jailbreak", caught: 89, total: 100, percentage: 89, range: { value: 89, low: 81, high: 94 }, lastMonthPct: 90, changePct: -1 },
  { category: "Harmful content", caught: 113, total: 120, percentage: 94, range: { value: 94, low: 88, high: 97 }, lastMonthPct: 94, changePct: 0 },
  { category: "Personal data", caught: 72, total: 80, percentage: 90, range: { value: 90, low: 81, high: 95 }, lastMonthPct: 91, changePct: -1 },
  { category: "Misconduct", caught: 69, total: 80, percentage: 86, range: { value: 86, low: 77, high: 92 }, lastMonthPct: 85, changePct: 1 },
  { category: "Investment advice", caught: 32, total: 50, percentage: 64, range: { value: 64, low: 50, high: 76 }, lastMonthPct: 66, changePct: -2 },
  { category: "Account changes by chat", caught: 13, total: 22, percentage: 59, range: { value: 59, low: 39, high: 78 }, lastMonthPct: 60, changePct: -1, tooFewToJudge: true },
];

export const driftHistory: DriftPoint[] = [
  { month: "Aug", percentage: 90, rangeLow: 87, rangeHigh: 92, hasSettingChange: false },
  { month: "Sep", percentage: 86, rangeLow: 83, rangeHigh: 89, hasSettingChange: true, settingChangeLabel: "PII categories expanded" },
  { month: "Oct", percentage: 82, rangeLow: 79, rangeHigh: 85, hasSettingChange: true, settingChangeLabel: "Prompt attack HIGH → LOW" },
];

export const whyDroppedPanel = {
  guardrailId: "support-bot",
  guardrailName: "support-bot",
  dropPoints: 4,
  affectedCategory: "Prompt injection",
  previousRate: 83,
  newRate: 71,
  settingChange: {
    who: "role/AdminDeploy",
    when: "11:48 UTC",
    setting: "Bedrock Prompt attack filter",
    before: "HIGH",
    after: "LOW",
    source: "AWS CloudTrail",
    eventId: "UpdateGuardrail",
  },
  policyReference: "Approved policy v13 requires HIGH",
  timeline: [
    { time: "11:48", event: "Setting changed by role/AdminDeploy (CloudTrail UpdateGuardrail)", value: "HIGH → LOW" },
    { time: "11:52", event: "Sentinel detects the change" },
    { time: "12:10", event: "Re-test completed — prompt injection dropped", value: "83% → 71%" },
    { time: "12:11", event: "Alert sent to risk-alerts@acmebank.com" },
  ],
  explanation: "Sentinel has read-only access. Fix it in AWS, or propose the change as policy v14 for two-person approval.",
};

export const testSetComparison = {
  publicSet: { name: "Public attack set (Oct 2026)", prompts: 540, caught: 449, percentage: 83, range: { value: 83, low: 80, high: 86 } },
  privateSet: { name: "Acme private attack set (customer's own)", prompts: 72, caught: 53, percentage: 74, range: { value: 74, low: 63, high: 83 } },
  note: "The private set is curated by your team to reflect attacks specific to banking and claims workflows. A gap between public and private performance is expected but should narrow over time.",
};

export const settingChanges: SettingChange[] = [
  {
    id: "sc-001",
    guardrailId: "support-bot",
    guardrailName: "support-bot",
    who: "role/AdminDeploy",
    when: "2h ago",
    timestamp: "2026-10-09T11:48:00Z",
    setting: "Bedrock Prompt attack filter",
    before: "HIGH",
    after: "LOW",
    diff: [
      { field: "Prompt attack filter", oldValue: "HIGH", newValue: "LOW" },
    ],
    retestResult: { caught: 502, total: 612, percentage: 82 },
    retestStatus: "weakened",
  },
  {
    id: "sc-002",
    guardrailId: "support-bot",
    guardrailName: "support-bot",
    who: "sarah.chen@acmebank.com",
    when: "25 days ago",
    timestamp: "2026-09-14T11:20:00Z",
    setting: "PII detection → Enabled categories",
    before: "Name, Email, Phone",
    after: "Name, Email, Phone, SSN, DOB",
    diff: [
      { field: "Categories", oldValue: "Name, Email, Phone", newValue: "Name, Email, Phone, SSN, DOB" },
    ],
    retestResult: { caught: 527, total: 612, percentage: 86 },
    retestStatus: "improved",
  },
  {
    id: "sc-003",
    guardrailId: "claims-agent",
    guardrailName: "claims-agent",
    who: "amrita.patel@acmebank.com",
    when: "12 days ago",
    timestamp: "2026-09-27T09:00:00Z",
    setting: "Hate speech → Severity threshold",
    before: "2",
    after: "3",
    diff: [
      { field: "Severity threshold", oldValue: "2 (low)", newValue: "3 (medium)" },
      { field: "Block threshold", oldValue: "4", newValue: "3" },
    ],
    retestResult: { caught: 465, total: 612, percentage: 76 },
    retestStatus: "improved",
  },
  {
    id: "sc-004",
    guardrailId: "chat-prod",
    guardrailName: "chat-prod route",
    who: "liam.ohara@acmebank.com",
    when: "18 days ago",
    timestamp: "2026-09-21T16:45:00Z",
    setting: "LiteLLM → Fallback model",
    before: "claude-3-haiku",
    after: "claude-3-sonnet",
    diff: [
      { field: "Fallback model", oldValue: "claude-3-haiku", newValue: "claude-3-sonnet" },
    ],
    retestResult: { caught: 539, total: 612, percentage: 88 },
    retestStatus: "no_change",
  },
];

export const timelineEvents: TimelineEvent[] = [
  { id: "tl-1", when: "2h ago", type: "setting_change", label: "support-bot Prompt attack filter lowered", detail: "HIGH → LOW by role/AdminDeploy — retest dropped 4 pts", guardrailName: "support-bot" },
  { id: "tl-2", when: "5h ago", type: "incident", label: "Prompt injection incident opened", detail: "46 prompt injection attacks bypassed support-bot after filter lowered", guardrailName: "support-bot" },
  { id: "tl-3", when: "1 day ago", type: "evidence_signed", label: "September evidence bundle signed", detail: "Signed by Sentinel (KMS key 7c1e…a94b) · SHA-256: a3f2…b1c9" },
  { id: "tl-4", when: "8 days ago", type: "test_run", label: "Monthly assessment completed for claims-agent", detail: "Catch rate 76% (465 of 612) — matches policy", guardrailName: "claims-agent" },
  { id: "tl-5", when: "12 days ago", type: "setting_change", label: "claims-agent hate speech threshold adjusted", detail: "Severity 2→3 by amrita.patel — retest improved 1 pt", guardrailName: "claims-agent" },
  { id: "tl-6", when: "18 days ago", type: "setting_change", label: "chat-prod fallback model changed", detail: "haiku → sonnet by liam.ohara — retest: no change", guardrailName: "chat-prod route" },
  { id: "tl-7", when: "20 days ago", type: "approval", label: "Policy v13 approved (2/2)", detail: "Customer-facing guardrail policy v13 — approved by sarah.chen + amrita.patel" },
  { id: "tl-8", when: "25 days ago", type: "setting_change", label: "support-bot PII categories expanded", detail: "Added SSN, DOB by sarah.chen — retest improved 2 pts", guardrailName: "support-bot" },
  { id: "tl-9", when: "28 days ago", type: "guardrail_connected", label: "kyc-assistant connected", detail: "Google Model Armor — test access not yet granted", guardrailName: "kyc-assistant" },
];

export const decisions: Decision[] = [
  {
    id: "d-10042",
    timestamp: "2026-10-09T12:42:00Z",
    guardrailName: "support-bot",
    provider: "Bedrock",
    decision: "block",
    inputChannel: "Web chat",
    userId: "user_88421",
    checksFired: [
      { check: "Prompt attack filter", result: "BLOCK", detail: "Matched: prompt injection pattern" },
      { check: "Personal data", result: "PASS", detail: "No personal data detected" },
    ],
    contentHash: "a1b2c3d4e5f6789012345678abcdef01a1b2c3d4e5f6789012345678abcdef01",
    category: "Prompt injection",
    responseAction: "Blocked — no response sent to user",
  },
  {
    id: "d-10041",
    timestamp: "2026-10-09T12:38:00Z",
    guardrailName: "support-bot",
    provider: "Bedrock",
    decision: "mask",
    inputChannel: "Web chat",
    userId: "user_88421",
    checksFired: [
      { check: "Personal data", result: "MASK", detail: "SSN detected and masked" },
      { check: "Prompt attack filter", result: "PASS", detail: "No attack pattern matched" },
    ],
    contentHash: "d4e5f6a7b8c9012345678abcdef0123456789abcdef0123456789abcdef01234",
    category: "Personal data",
    responseAction: "Masked — response sent with personal data redacted",
  },
  {
    id: "d-10040",
    timestamp: "2026-10-09T12:30:00Z",
    guardrailName: "chat-prod route",
    provider: "LiteLLM → Bedrock",
    decision: "allow",
    inputChannel: "Internal API",
    userId: "svc_reporting",
    checksFired: [
      { check: "Prompt attack filter", result: "PASS", detail: "No attack pattern matched" },
      { check: "Harmful content", result: "PASS", detail: "Below threshold" },
    ],
    contentHash: "g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2a3b4c5d6e7f8",
    category: "Harmless",
    responseAction: "Allowed — full response sent",
  },
  {
    id: "d-10039",
    timestamp: "2026-10-09T12:22:00Z",
    guardrailName: "claims-agent",
    provider: "Azure Content Safety",
    decision: "block",
    inputChannel: "Claims portal",
    userId: "user_44102",
    checksFired: [
      { check: "Harmful content", result: "BLOCK", detail: "Severity 4 (high) detected — threshold is 3" },
    ],
    contentHash: "j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1",
    category: "Harmful content",
    responseAction: "Blocked — no response sent",
  },
  {
    id: "d-10038",
    timestamp: "2026-10-09T12:15:00Z",
    guardrailName: "support-bot",
    provider: "Bedrock",
    decision: "allow",
    inputChannel: "Web chat",
    userId: "user_77233",
    checksFired: [
      { check: "Prompt attack filter", result: "PASS", detail: "No attack pattern matched" },
      { check: "Personal data", result: "PASS", detail: "No personal data detected" },
    ],
    contentHash: "m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4",
    category: "Harmless",
    responseAction: "Allowed — full response sent",
  },
  {
    id: "d-10037",
    timestamp: "2026-10-09T12:08:00Z",
    guardrailName: "chat-prod route",
    provider: "LiteLLM → Bedrock",
    decision: "mask",
    inputChannel: "Internal API",
    userId: "svc_analytics",
    checksFired: [
      { check: "Personal data", result: "MASK", detail: "Email detected and masked" },
      { check: "Prompt attack filter", result: "PASS", detail: "No attack pattern matched" },
    ],
    contentHash: "p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7",
    category: "Personal data",
    responseAction: "Masked — response sent with emails redacted",
  },
  {
    id: "d-10036",
    timestamp: "2026-10-09T11:55:00Z",
    guardrailName: "claims-agent",
    provider: "Azure Content Safety",
    decision: "allow",
    inputChannel: "Claims portal",
    userId: "user_44102",
    checksFired: [
      { check: "Harmful content", result: "PASS", detail: "Below threshold" },
      { check: "Personal data", result: "PASS", detail: "No personal data detected" },
    ],
    contentHash: "s9t0u1v2w3x4y5z6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
    category: "Harmless",
    responseAction: "Allowed — full response sent",
  },
  {
    id: "d-10035",
    timestamp: "2026-10-09T11:42:00Z",
    guardrailName: "support-bot",
    provider: "Bedrock",
    decision: "block",
    inputChannel: "Web chat",
    userId: "user_99120",
    checksFired: [
      { check: "Misconduct filter", result: "BLOCK", detail: "Attempted solicitation of improper account changes" },
      { check: "Prompt attack filter", result: "BLOCK", detail: "Matched: indirect manipulation via role-play" },
    ],
    contentHash: "v2w3x4y5z6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3",
    category: "Misconduct",
    responseAction: "Blocked — no response sent",
  },
  {
    id: "d-10034",
    timestamp: "2026-10-09T11:30:00Z",
    guardrailName: "support-bot",
    provider: "Bedrock",
    decision: "allow",
    inputChannel: "Mobile app",
    userId: "user_55301",
    checksFired: [
      { check: "Prompt attack filter", result: "PASS", detail: "No attack pattern matched" },
      { check: "Personal data", result: "PASS", detail: "No personal data detected" },
    ],
    contentHash: "y5z6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6",
    category: "Harmless",
    responseAction: "Allowed — full response sent",
  },
  {
    id: "d-10033",
    timestamp: "2026-10-09T11:18:00Z",
    guardrailName: "chat-prod route",
    provider: "LiteLLM → Bedrock",
    decision: "allow",
    inputChannel: "Internal API",
    userId: "svc_reporting",
    checksFired: [
      { check: "Prompt attack filter", result: "PASS", detail: "No attack pattern matched" },
      { check: "Harmful content", result: "PASS", detail: "Below threshold" },
    ],
    contentHash: "b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9",
    category: "Harmless",
    responseAction: "Allowed — full response sent",
  },
  {
    id: "d-10032",
    timestamp: "2026-10-09T11:05:00Z",
    guardrailName: "claims-agent",
    provider: "Azure Content Safety",
    decision: "mask",
    inputChannel: "Claims portal",
    userId: "user_33021",
    checksFired: [
      { check: "Personal data", result: "MASK", detail: "Phone number detected and masked" },
      { check: "Harmful content", result: "PASS", detail: "Below threshold" },
    ],
    contentHash: "e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2",
    category: "Personal data",
    responseAction: "Masked — response sent with phone redacted",
  },
  {
    id: "d-10031",
    timestamp: "2026-10-09T10:48:00Z",
    guardrailName: "support-bot",
    provider: "Bedrock",
    decision: "block",
    inputChannel: "Web chat",
    userId: "user_66412",
    checksFired: [
      { check: "Prompt attack filter", result: "BLOCK", detail: "Matched: DAN-style jailbreak attempt" },
    ],
    contentHash: "h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8a9b0c1d2e3f4a5",
    category: "Jailbreak",
    responseAction: "Blocked — no response sent",
  },
];

export const evidenceBundles: EvidenceBundle[] = [
  {
    id: "ev-2026-10",
    month: "October 2026",
    status: "collecting",
    signedAt: null,
    signedBy: null,
    attestedBy: null,
    size: "—",
    sha256: "—",
    keyId: "—",
    proves: [
      "612 attack prompts and 729 harmless prompts were run against support-bot, claims-agent, and chat-prod route",
      "Catch rates were measured with 95% confidence intervals",
      "All allow, block, and mask decisions from Oct 1–9 were recorded",
    ],
    doesNotProve: [
      "That untested guardrails (kyc-assistant) are effective",
      "That real-world attack distributions match the test sets",
    ],
    guardrailsCovered: ["support-bot", "claims-agent", "chat-prod route"],
    decisionCount: 14288,
    testCount: 1836,
  },
  {
    id: "ev-2026-09",
    month: "September 2026",
    status: "verified",
    signedAt: "2026-10-01T14:00:00Z",
    signedBy: "Sentinel (KMS key 7c1e…a94b)",
    attestedBy: "Verified offline by Internal Audit, 3 Oct",
    size: "184 MB",
    sha256: "a3f2e1d4b5c6789012345678abcdef0123456789abcdef0123456789abcdef01",
    keyId: "kms-key-7c1e-a94b",
    proves: [
      "612 attack prompts and 729 harmless prompts were run against all 3 measured guardrails",
      "Catch rates: support-bot 86%, claims-agent 75%, chat-prod route 88%",
      "38,402 allow/block/mask decisions were recorded for September",
      "2 setting changes were detected and re-tested",
    ],
    doesNotProve: [
      "That kyc-assistant was tested (test access was not granted until Oct)",
      "That real-world attack distributions match the test sets",
    ],
    guardrailsCovered: ["support-bot", "claims-agent", "chat-prod route"],
    decisionCount: 38402,
    testCount: 1836,
  },
  {
    id: "ev-2026-08",
    month: "August 2026",
    status: "verified",
    signedAt: "2026-09-01T14:00:00Z",
    signedBy: "Sentinel (KMS key 7c1e…a94b)",
    attestedBy: "Verified offline by Internal Audit, 5 Sep",
    size: "172 MB",
    sha256: "b8c7d6e5f4a3210987654321fedcba9876543210fedcba9876543210fedcba98",
    keyId: "kms-key-7c1e-a94b",
    proves: [
      "612 attack prompts and 729 harmless prompts were run against all 3 measured guardrails",
      "Catch rates: support-bot 90%, claims-agent 74%, chat-prod route 88%",
      "41,200 allow/block/mask decisions were recorded for August",
      "1 setting change was detected and re-tested",
    ],
    doesNotProve: [
      "That kyc-assistant was tested (not connected until Sep)",
      "That real-world attack distributions match the test sets",
    ],
    guardrailsCovered: ["support-bot", "claims-agent", "chat-prod route"],
    decisionCount: 41200,
    testCount: 1836,
  },
  {
    id: "ev-2026-07",
    month: "July 2026",
    status: "signed",
    signedAt: "2026-08-01T14:00:00Z",
    signedBy: "Sentinel (KMS key 7c1e…a94b)",
    attestedBy: null,
    size: "165 MB",
    sha256: "c9d8e7f6a5b432109876543210fedcba9876543210fedcba9876543210fedcba87",
    keyId: "kms-key-7c1e-a94b",
    proves: [
      "612 attack prompts and 729 harmless prompts were run against all 3 measured guardrails",
      "Catch rates: support-bot 90%, claims-agent 73%, chat-prod route 87%",
      "35,801 allow/block/mask decisions were recorded for July",
    ],
    doesNotProve: [
      "That kyc-assistant was tested (not connected until Sep)",
      "That real-world attack distributions match the test sets",
    ],
    guardrailsCovered: ["support-bot", "claims-agent", "chat-prod route"],
    decisionCount: 35801,
    testCount: 1836,
  },
];

export const frameworks: Framework[] = [
  {
    id: "eu-ai-act",
    name: "EU AI Act",
    label: "Art. 12 — Logging",
    status: "indicative",
    articles: ["Art. 12(1)", "Art. 12(2)", "Art. 12(3)"],
    description: "Article 12 requires providers of high-risk AI systems to keep automatically generated logs. Sentinel's decision log and evidence bundles map to these requirements.",
  },
  {
    id: "nist-ai-rmf",
    name: "NIST AI RMF",
    label: "MEASURE 2.7",
    status: "indicative",
    articles: ["MEASURE 2.7", "MEASURE 2.9", "GOVERN 4.1"],
    description: "The NIST AI Risk Management Framework's MEASURE function calls for tracking, measuring, and monitoring AI system characteristics. Sentinel's scorecards and drift detection address MEASURE 2.7.",
  },
  {
    id: "owasp-llm",
    name: "OWASP LLM",
    label: "LLM01 — Prompt Injection",
    status: "indicative",
    articles: ["LLM01", "LLM02", "LLM06"],
    description: "OWASP's Top 10 for Large Language Model Applications identifies prompt injection as the top risk. Sentinel's attack test sets include prompt injection, jailbreak, and harmful content categories.",
  },
  {
    id: "iso-42001",
    name: "ISO/IEC 42001",
    label: "Clause 7.3 — Awareness",
    status: "indicative",
    articles: ["Clause 7.3", "Clause 8.3", "Clause 9.1"],
    description: "ISO 42001 is the AI management system standard. Sentinel's evidence bundles and catch-rate matrix support the monitoring and measurement requirements in Clause 9.1.",
  },
];

export const approvals: Approval[] = [
  {
    id: "ap-001",
    title: "Lower support-bot Prompt attack filter from HIGH to LOW",
    requestedBy: "role/AdminDeploy",
    requestedAt: "2h ago",
    guardrailName: "support-bot",
    type: "setting_change",
    status: "pending",
    diff: [
      { field: "Prompt attack filter", oldValue: "HIGH", newValue: "LOW" },
    ],
    approvers: [
      { name: "sarah.chen@acmebank.com", role: "AI platform lead", approved: null },
      { name: "amrita.patel@acmebank.com", role: "Risk officer", approved: null },
    ],
    description: "This change weakens the prompt attack filter from HIGH to LOW. Re-test showed a 4-point drop in catch rate, driven by a 12-point drop in prompt injection. Approval requires two sign-offs per policy v13.",
  },
  {
    id: "ap-002",
    title: "Raise claims-agent hate speech severity threshold from 2 to 3",
    requestedBy: "amrita.patel@acmebank.com",
    requestedAt: "12 days ago",
    guardrailName: "claims-agent",
    type: "setting_change",
    status: "approved",
    diff: [
      { field: "Severity threshold", oldValue: "2 (low)", newValue: "3 (medium)" },
      { field: "Block threshold", oldValue: "4", newValue: "3" },
    ],
    approvers: [
      { name: "amrita.patel@acmebank.com", role: "Risk officer", approved: true },
      { name: "mike.johnson@acmebank.com", role: "AI platform lead", approved: true },
    ],
    description: "This change tightens the hate speech filter by raising the detection severity threshold. Re-test showed a 1-point improvement in catch rate.",
  },
  {
    id: "ap-003",
    title: "Update customer-facing guardrail policy to v13",
    requestedBy: "sarah.chen@acmebank.com",
    requestedAt: "20 days ago",
    guardrailName: "All customer-facing guardrails",
    type: "policy_change",
    status: "approved",
    diff: [
      { field: "Minimum catch rate", oldValue: "75%", newValue: "80%" },
      { field: "Re-test window after change", oldValue: "24h", newValue: "1h" },
      { field: "Required approvals", oldValue: "1", newValue: "2" },
      { field: "Prompt attack filter", oldValue: "MEDIUM", newValue: "HIGH" },
    ],
    approvers: [
      { name: "sarah.chen@acmebank.com", role: "AI platform lead", approved: true },
      { name: "amrita.patel@acmebank.com", role: "Risk officer", approved: true },
    ],
    description: "Policy v13 raises the minimum catch rate for customer-facing guardrails from 75% to 80%, requires two approvals for any setting change, and mandates HIGH for the Prompt attack filter.",
  },
];

export const guardrailConnections: GuardrailConnection[] = [
  {
    id: "gc-support-bot",
    name: "support-bot",
    provider: "Amazon Bedrock Guardrails",
    cloud: "AWS",
    connectionStatus: "connected",
    testAccessStatus: "granted",
    monthlyTestBudget: 2000,
    testsThisMonth: 1836,
    region: "us-east-1",
  },
  {
    id: "gc-claims-agent",
    name: "claims-agent",
    provider: "Azure AI Content Safety",
    cloud: "Azure",
    connectionStatus: "connected",
    testAccessStatus: "granted",
    monthlyTestBudget: 1500,
    testsThisMonth: 612,
    region: "eastus2",
  },
  {
    id: "gc-chat-prod",
    name: "chat-prod route",
    provider: "LiteLLM → Bedrock",
    cloud: "AWS",
    connectionStatus: "connected",
    testAccessStatus: "granted",
    monthlyTestBudget: 1500,
    testsThisMonth: 612,
    region: "us-east-1",
  },
  {
    id: "gc-kyc",
    name: "kyc-assistant",
    provider: "Google Model Armor",
    cloud: "Google Cloud",
    connectionStatus: "connected",
    testAccessStatus: "not_granted",
    monthlyTestBudget: 1000,
    testsThisMonth: 0,
    region: "us-central1",
  },
];

export const needsAttention: NeedsAttentionItem[] = [
  {
    id: "na-1",
    guardrailName: "support-bot",
    issue: "Catch rate dropped 4 points after Prompt attack filter changed from HIGH to LOW",
    severity: "high",
    action: "Fix in AWS or propose as policy v14 for two-person approval",
    when: "2h ago",
  },
  {
    id: "na-2",
    guardrailName: "kyc-assistant",
    issue: "Test access not granted — guardrail is unmeasured",
    severity: "medium",
    action: "Grant test access in Google Cloud IAM",
    when: "28 days ago",
  },
  {
    id: "na-3",
    guardrailName: "support-bot",
    issue: "Prompt injection catch rate dropped from 83% to 71%",
    severity: "high",
    action: "Revert Prompt attack filter to HIGH in AWS",
    when: "2h ago",
  },
  {
    id: "na-4",
    guardrailName: "claims-agent",
    issue: "False block rate at 5.8% (42 of 729 harmless prompts, policy threshold: 5%)",
    severity: "low",
    action: "Review blocked prompts for over-filtering",
    when: "3 days ago",
  },
];

export const coverageRows: CoverageRow[] = [
  {
    attackCategory: "Prompt injection",
    total: 160,
    guardrails: [
      { guardrailId: "support-bot", guardrailName: "support-bot", state: "measured", caught: 114, total: 160, percentage: 71 },
      { guardrailId: "claims-agent", guardrailName: "claims-agent", state: "measured", caught: 104, total: 160, percentage: 65 },
      { guardrailId: "chat-prod", guardrailName: "chat-prod route", state: "measured", caught: 134, total: 160, percentage: 84 },
      { guardrailId: "kyc-assistant", guardrailName: "kyc-assistant", state: "not_measured", caught: 0, total: 0, percentage: null },
    ],
  },
  {
    attackCategory: "Jailbreak",
    total: 100,
    guardrails: [
      { guardrailId: "support-bot", guardrailName: "support-bot", state: "measured", caught: 89, total: 100, percentage: 89 },
      { guardrailId: "claims-agent", guardrailName: "claims-agent", state: "measured", caught: 78, total: 100, percentage: 78 },
      { guardrailId: "chat-prod", guardrailName: "chat-prod route", state: "measured", caught: 93, total: 100, percentage: 93 },
      { guardrailId: "kyc-assistant", guardrailName: "kyc-assistant", state: "not_measured", caught: 0, total: 0, percentage: null },
    ],
  },
  {
    attackCategory: "Harmful content",
    total: 120,
    guardrails: [
      { guardrailId: "support-bot", guardrailName: "support-bot", state: "measured", caught: 113, total: 120, percentage: 94 },
      { guardrailId: "claims-agent", guardrailName: "claims-agent", state: "measured", caught: 110, total: 120, percentage: 92 },
      { guardrailId: "chat-prod", guardrailName: "chat-prod route", state: "measured", caught: 116, total: 120, percentage: 97 },
      { guardrailId: "kyc-assistant", guardrailName: "kyc-assistant", state: "not_measured", caught: 0, total: 0, percentage: null },
    ],
  },
  {
    attackCategory: "Personal data",
    total: 80,
    guardrails: [
      { guardrailId: "support-bot", guardrailName: "support-bot", state: "measured", caught: 72, total: 80, percentage: 90 },
      { guardrailId: "claims-agent", guardrailName: "claims-agent", state: "measured", caught: 66, total: 80, percentage: 83 },
      { guardrailId: "chat-prod", guardrailName: "chat-prod route", state: "measured", caught: 74, total: 80, percentage: 93 },
      { guardrailId: "kyc-assistant", guardrailName: "kyc-assistant", state: "not_measured", caught: 0, total: 0, percentage: null },
    ],
  },
  {
    attackCategory: "Misconduct",
    total: 80,
    guardrails: [
      { guardrailId: "support-bot", guardrailName: "support-bot", state: "measured", caught: 69, total: 80, percentage: 86 },
      { guardrailId: "claims-agent", guardrailName: "claims-agent", state: "measured", caught: 60, total: 80, percentage: 75 },
      { guardrailId: "chat-prod", guardrailName: "chat-prod route", state: "measured", caught: 71, total: 80, percentage: 89 },
      { guardrailId: "kyc-assistant", guardrailName: "kyc-assistant", state: "not_measured", caught: 0, total: 0, percentage: null },
    ],
  },
  {
    attackCategory: "Investment advice",
    total: 50,
    guardrails: [
      { guardrailId: "support-bot", guardrailName: "support-bot", state: "measured", caught: 32, total: 50, percentage: 64 },
      { guardrailId: "claims-agent", guardrailName: "claims-agent", state: "measured", caught: 28, total: 50, percentage: 56 },
      { guardrailId: "chat-prod", guardrailName: "chat-prod route", state: "measured", caught: 35, total: 50, percentage: 70 },
      { guardrailId: "kyc-assistant", guardrailName: "kyc-assistant", state: "not_measured", caught: 0, total: 0, percentage: null },
    ],
  },
  {
    attackCategory: "Account changes by chat",
    total: 22,
    guardrails: [
      { guardrailId: "support-bot", guardrailName: "support-bot", state: "measured", caught: 13, total: 22, percentage: null, tooFewToJudge: true },
      { guardrailId: "claims-agent", guardrailName: "claims-agent", state: "measured", caught: 19, total: 22, percentage: null, tooFewToJudge: true },
      { guardrailId: "chat-prod", guardrailName: "chat-prod route", state: "measured", caught: 16, total: 22, percentage: null, tooFewToJudge: true },
      { guardrailId: "kyc-assistant", guardrailName: "kyc-assistant", state: "not_measured", caught: 0, total: 0, percentage: null },
    ],
  },
];

export const aiSystemCoverage: AISystemCoverage[] = [
  { id: "ai-1", name: "Customer support assistant", type: "Chatbot", status: "governed", reason: "All traffic routed through support-bot guardrail" },
  { id: "ai-2", name: "Claims intake agent", type: "Workflow agent", status: "governed", reason: "All traffic routed through claims-agent guardrail" },
  { id: "ai-3", name: "Internal knowledge search", type: "RAG agent", status: "governed", reason: "All traffic routed through chat-prod route guardrail" },
  { id: "ai-4", name: "KYC document checker", type: "Workflow agent", status: "partly_governed", reason: "Connected to guardrail but test access not granted" },
  { id: "ai-5", name: "Loan eligibility bot", type: "Chatbot", status: "governed", reason: "Routed through support-bot guardrail" },
  { id: "ai-6", name: "Marketing email generator", type: "LLM call", status: "unguarded", reason: "No guardrail in front of this LLM call" },
  { id: "ai-7", name: "Code review assistant", type: "LLM call", status: "bypassing_gateway", reason: "Calls Bedrock directly, bypassing the LiteLLM proxy" },
  { id: "ai-8", name: "HR policy chatbot", type: "Chatbot", status: "unknown", reason: "No telemetry; cannot confirm if a guardrail is applied" },
];

export const agentsAndTools: AgentTool[] = [
  { id: "at-1", name: "Customer support assistant", type: "Chatbot", guardrailId: "support-bot", guardrailName: "support-bot", monitored: true, decisionCount: 28432, lastSeen: "Just now" },
  { id: "at-2", name: "Claims intake agent", type: "Workflow agent", guardrailId: "claims-agent", guardrailName: "claims-agent", monitored: true, decisionCount: 12401, lastSeen: "2 min ago" },
  { id: "at-3", name: "Internal knowledge search", type: "RAG agent", guardrailId: "chat-prod", guardrailName: "chat-prod route", monitored: true, decisionCount: 18920, lastSeen: "5 min ago" },
  { id: "at-4", name: "KYC document checker", type: "Workflow agent", guardrailId: "kyc-assistant", guardrailName: "kyc-assistant", monitored: false, decisionCount: 0, lastSeen: "Never" },
  { id: "at-5", name: "Loan eligibility bot", type: "Chatbot", guardrailId: "support-bot", guardrailName: "support-bot", monitored: true, decisionCount: 8421, lastSeen: "12 min ago" },
];

export const incidents: Incident[] = [
  {
    id: "inc-001",
    title: "Prompt injection: 46 attacks bypassed support-bot after filter lowered",
    severity: "high",
    status: "open",
    guardrailName: "support-bot",
    openedAt: "2h ago",
    description: "After the Prompt attack filter was changed from HIGH to LOW at 11:48 UTC, 46 prompt injection attacks passed through support-bot without being blocked. The re-test confirmed the catch rate for prompt injection dropped from 83% to 71%. Root cause is the filter sensitivity change made by role/AdminDeploy via CloudTrail UpdateGuardrail.",
  },
  {
    id: "inc-002",
    title: "Jailbreak pattern detected: DAN-style attack on support-bot",
    severity: "medium",
    status: "investigating",
    guardrailName: "support-bot",
    openedAt: "3h ago",
    description: "A series of DAN-style jailbreak prompts were sent to support-bot. 3 were blocked, 1 passed through. The one that passed used a novel variant not in the current attack pattern database. Re-test has been triggered.",
  },
  {
    id: "inc-003",
    title: "False block spike on claims-agent",
    severity: "low",
    status: "resolved",
    guardrailName: "claims-agent",
    openedAt: "3 days ago",
    description: "False block rate on claims-agent spiked to 7.2% over a 6-hour window, above the 5% policy threshold. Investigation found that legitimate claims language was triggering the hate speech filter at severity 2. The threshold was raised to 3 with approval, reducing false blocks to 5.8% (42 of 729 harmless prompts).",
  },
];

export const assessments: Assessment[] = [
  { id: "as-1", name: "October 2026 monthly assessment", guardrailName: "support-bot", date: "2026-10-09", status: "in_progress", catchRate: 82, testCount: 612 },
  { id: "as-2", name: "September 2026 monthly assessment", guardrailName: "support-bot", date: "2026-09-30", status: "completed", catchRate: 86, testCount: 612 },
  { id: "as-3", name: "August 2026 monthly assessment", guardrailName: "support-bot", date: "2026-08-31", status: "completed", catchRate: 90, testCount: 612 },
  { id: "as-4", name: "September 2026 monthly assessment", guardrailName: "claims-agent", date: "2026-09-30", status: "completed", catchRate: 75, testCount: 612 },
  { id: "as-5", name: "September 2026 monthly assessment", guardrailName: "chat-prod route", date: "2026-09-30", status: "completed", catchRate: 88, testCount: 612 },
  { id: "as-6", name: "October 2026 monthly assessment", guardrailName: "claims-agent", date: "2026-10-09", status: "in_progress", catchRate: 76, testCount: 612 },
  { id: "as-7", name: "October 2026 monthly assessment", guardrailName: "chat-prod route", date: "2026-10-09", status: "in_progress", catchRate: 88, testCount: 612 },
];

export const testSets: TestSet[] = [
  { id: "ts-1", name: "Standard prompt injection", category: "Prompt injection", promptCount: 160, visibility: "public", lastUpdated: "2026-10-01" },
  { id: "ts-2", name: "Jailbreak collection v2", category: "Jailbreak", promptCount: 100, visibility: "public", lastUpdated: "2026-10-01" },
  { id: "ts-3", name: "Harmful content probes", category: "Harmful content", promptCount: 120, visibility: "public", lastUpdated: "2026-10-01" },
  { id: "ts-4", name: "Personal data vectors", category: "Personal data", promptCount: 80, visibility: "public", lastUpdated: "2026-10-01" },
  { id: "ts-5", name: "Misconduct scenarios", category: "Misconduct", promptCount: 80, visibility: "public", lastUpdated: "2026-10-01" },
  { id: "ts-6", name: "Investment advice attacks", category: "Investment advice", promptCount: 50, visibility: "private", lastUpdated: "2026-09-28" },
  { id: "ts-7", name: "Account changes by chat", category: "Account changes by chat", promptCount: 22, visibility: "private", lastUpdated: "2026-09-25" },
];

export const tenants = [
  { id: "acme-prod", name: "Acme Bank · Production" },
  { id: "acme-staging", name: "Acme Bank · Staging" },
  { id: "globex-prod", name: "Globex Corp · Production" },
];
