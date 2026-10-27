// ─── Types ──────────────────────────────────────────────────────────────────

export type MeasurementState = "measured" | "attested" | "not_measured";

export type GuardrailCategory =
  | "Security"
  | "Privacy"
  | "Safety"
  | "Reliability"
  | "Control"
  | "Cost"
  | "Fairness";

export type RiskTier = "High" | "Limited" | "Minimal";

export type EnforcementMode = "Enforce" | "Observe";

export type CellState = "E" | "O" | "gap" | "weak" | "wv" | "pend" | "none";

export type Sensitivity = "Permissive" | "Balanced" | "Strict";

export type Verdict = "Allowed" | "Blocked" | "Redacted" | "Would block";

export interface GuardrailDef {
  id: string;
  name: string;
  category: GuardrailCategory;
  engine: string;
  fp: number;
  lat: number;
  defaultSensitivity: Sensitivity;
  description: string;
}

export interface AIApp {
  id: string;
  name: string;
  bu: string;
  tier: RiskTier;
  dep: string;
  agentic: boolean;
}

export interface Deployment {
  id: string;
  host: string;
  name: string;
  where: string;
  mode: EnforcementMode;
  p95: number;
  rpm: number;
  status: "Healthy" | "Degraded";
}

export interface FrameworkRequirement {
  id: string;
  t: string;
  guards: string[];
  tiers?: RiskTier[];
  agentic?: boolean;
}

export interface FrameworkDef {
  id: string;
  name: string;
  industry: string;
  enabled: boolean;
  reqs: FrameworkRequirement[];
  description: string;
}

export interface EvidenceBatch {
  id: string;
  window: string;
  decisions: number;
  merkleRoot: string;
  prevBatch: string;
  hash: string;
  anchored: boolean;
}

export interface LedgerEntry {
  id: string;
  t: string;
  actor: string;
  role: string;
  action: string;
  detail: string;
  hash: string;
  prev: string;
}

export interface ApprovalChain {
  id: string;
  name: string;
  steps: string[];
}

export interface RemediationRequest {
  id: string;
  type: "deploy" | "accept" | "mode";
  app?: string;
  g?: string;
  dep?: string;
  mode?: EnforcementMode;
  chain: string;
  by: string;
  at: string;
  status: "Pending" | "Approved" | "Rejected" | "Applied";
  note: string;
  expires?: string;
  log: { uid: string; d: "Approved" | "Rejected"; t: string }[];
}

export interface LiveCall {
  id: string;
  t: string;
  app: string;
  dep: string;
  principal: string;
  model: string;
  verdict: Verdict;
  g?: string;
  evaluated: number;
  lat: number;
  mode: EnforcementMode;
  hash: string;
  fresh?: boolean;
}

export interface RoleDef {
  id: string;
  name: string;
  color: string;
  perms: string[];
  system?: boolean;
}

export interface UserDef {
  id: string;
  name: string;
  email: string;
  role: string;
  bus: string[];
  status: "Active" | "Invited" | "Suspended";
  initials: string;
}

// Legacy types for backward compatibility
export type StatusType = "matches_policy" | "weakened" | "not_measured" | "improved" | "collecting" | "signed" | "verified" | "pending" | "approved" | "rejected" | "needs_attention";

export interface RangeBarData {
  value: number;
  low: number;
  high: number;
  previousValue?: number;
}

export interface Guardrail {
  id: string;
  name: string;
  provider: string;
  category: GuardrailCategory;
  engine: string;
  fp: number;
  lat: number;
  catchRate: { caught: number; total: number; percentage: number; range: { value: number; low: number; high: number; previousValue?: number } } | null;
  falseBlocks: { count: number; total: number; percentage: number; rangeLow?: number; rangeHigh?: number } | null;
  changeVsLastMonth: string | null;
  status: StatusType;
  statusLabel: string;
  state: MeasurementState;
  policyName: string;
  policyThreshold: number;
  sensitivity: Sensitivity;
}

// ─── Guardrail Definitions ───────────────────────────────────────────────────

export const guardrailDefs: GuardrailDef[] = [
  { id: "inj", name: "Prompt Injection", category: "Security", engine: "ThirdSigma v3", fp: 0.8, lat: 12, defaultSensitivity: "Strict", description: "Detects direct and indirect prompt injection attempts in user messages and retrieved context." },
  { id: "jb", name: "Jailbreak", category: "Security", engine: "ThirdSigma v3", fp: 1.2, lat: 10, defaultSensitivity: "Strict", description: "Identifies jailbreak patterns including DAN, role-play manipulation, and encoding tricks." },
  { id: "pii_in", name: "PII Ingress", category: "Privacy", engine: "Microsoft Presidio", fp: 0.5, lat: 8, defaultSensitivity: "Balanced", description: "Detects personal data entering prompts (SSN, DOB, phone, email, address)." },
  { id: "pii_out", name: "PII Egress", category: "Privacy", engine: "Microsoft Presidio", fp: 0.3, lat: 8, defaultSensitivity: "Balanced", description: "Detects and redacts personal data in model responses before it reaches the user." },
  { id: "secrets", name: "Secrets Detection", category: "Security", engine: "Gitleaks", fp: 0.1, lat: 6, defaultSensitivity: "Strict", description: "Blocks API keys, tokens, and credentials from entering or leaving the model." },
  { id: "tox", name: "Toxicity", category: "Safety", engine: "Azure Content Safety", fp: 2.1, lat: 14, defaultSensitivity: "Balanced", description: "Filters hate, violence, sexual, and self-harm content." },
  { id: "topic", name: "Topic Boundary", category: "Control", engine: "ThirdSigma v3", fp: 1.5, lat: 10, defaultSensitivity: "Balanced", description: "Keeps conversations within approved topics; blocks investment advice, legal opinions, etc." },
  { id: "ground", name: "Grounding", category: "Reliability", engine: "ThirdSigma v3", fp: 3.4, lat: 22, defaultSensitivity: "Balanced", description: "Checks model responses against retrieved context to detect hallucinations." },
  { id: "tool", name: "Tool Control", category: "Control", engine: "ThirdSigma v3", fp: 0.4, lat: 5, defaultSensitivity: "Strict", description: "Validates that agent tool calls are permitted and arguments are safe." },
  { id: "allow", name: "Allow-list", category: "Control", engine: "ThirdSigma v3", fp: 0.0, lat: 3, defaultSensitivity: "Strict", description: "Restricts model access to an approved model and parameter list." },
  { id: "resid", name: "Residual PII", category: "Privacy", engine: "ThirdSigma v3", fp: 0.6, lat: 9, defaultSensitivity: "Balanced", description: "Secondary scan for personal data that survives redaction." },
  { id: "hitl", name: "Human Review", category: "Control", engine: "Manual", fp: 0.0, lat: 0, defaultSensitivity: "Balanced", description: "Routes high-risk decisions to a human reviewer before delivery." },
  { id: "budget", name: "Cost Budget", category: "Cost", engine: "ThirdSigma v3", fp: 0.0, lat: 2, defaultSensitivity: "Permissive", description: "Enforces per-call and daily token spend limits." },
  { id: "bias", name: "Bias Check", category: "Fairness", engine: "ThirdSigma v3", fp: 4.2, lat: 18, defaultSensitivity: "Permissive", description: "Flags demographic bias in model responses." },
];

export const businessUnits = [
  "Retail Banking",
  "Wealth Management",
  "Insurance Claims",
  "Internal IT",
  "Marketing",
];

export const deployments: Deployment[] = [
  { id: "dep-1", host: "gateway-prod-eu", name: "EU Gateway", where: "AWS EKS · Kong proxy", mode: "Enforce", p95: 18, rpm: 4200, status: "Healthy" },
  { id: "dep-2", host: "gateway-prod-us", name: "US Gateway", where: "Azure AKS · APIM policy", mode: "Enforce", p95: 22, rpm: 3800, status: "Healthy" },
  { id: "dep-3", host: "claims-sidecar", name: "Claims Sidecar", where: "GKE · SDK sidecar", mode: "Observe", p95: 15, rpm: 900, status: "Healthy" },
  { id: "dep-4", host: "internal-proxy", name: "Internal Proxy", where: "AWS Lambda · Bedrock proxy", mode: "Enforce", p95: 12, rpm: 1600, status: "Degraded" },
];

export const aiApps: AIApp[] = [
  { id: "app-1", name: "Customer support assistant", bu: "Retail Banking", tier: "High", dep: "dep-1", agentic: false },
  { id: "app-2", name: "Claims intake agent", bu: "Insurance Claims", tier: "High", dep: "dep-3", agentic: true },
  { id: "app-3", name: "Internal knowledge search", bu: "Internal IT", tier: "Limited", dep: "dep-2", agentic: false },
  { id: "app-4", name: "KYC document checker", bu: "Retail Banking", tier: "High", dep: "dep-1", agentic: true },
  { id: "app-5", name: "Loan eligibility bot", bu: "Retail Banking", tier: "High", dep: "dep-1", agentic: false },
  { id: "app-6", name: "Marketing email generator", bu: "Marketing", tier: "Minimal", dep: "dep-4", agentic: false },
  { id: "app-7", name: "Code review assistant", bu: "Internal IT", tier: "Limited", dep: "dep-2", agentic: false },
  { id: "app-8", name: "Wealth advisory summarizer", bu: "Wealth Management", tier: "High", dep: "dep-2", agentic: false },
];

export const coverageMatrix: Record<string, Record<string, CellState>> = {
  "app-1": { inj: "E", jb: "E", pii_in: "E", pii_out: "E", secrets: "E", tox: "E", topic: "E", ground: "O", tool: "none", allow: "E", resid: "E", hitl: "none", budget: "E", bias: "none" },
  "app-2": { inj: "E", jb: "E", pii_in: "E", pii_out: "E", secrets: "E", tox: "E", topic: "E", ground: "O", tool: "E", allow: "E", resid: "E", hitl: "E", budget: "O", bias: "none" },
  "app-3": { inj: "E", jb: "O", pii_in: "E", pii_out: "none", secrets: "E", tox: "O", topic: "none", ground: "E", tool: "none", allow: "E", resid: "none", hitl: "none", budget: "E", bias: "none" },
  "app-4": { inj: "E", jb: "E", pii_in: "E", pii_out: "E", secrets: "E", tox: "E", topic: "E", ground: "O", tool: "E", allow: "E", resid: "E", hitl: "E", budget: "O", bias: "none" },
  "app-5": { inj: "E", jb: "E", pii_in: "E", pii_out: "E", secrets: "O", tox: "E", topic: "E", ground: "gap", tool: "none", allow: "E", resid: "E", hitl: "none", budget: "E", bias: "none" },
  "app-6": { inj: "O", jb: "none", pii_in: "none", pii_out: "none", secrets: "none", tox: "O", topic: "O", ground: "none", tool: "none", allow: "E", resid: "none", hitl: "none", budget: "E", bias: "none" },
  "app-7": { inj: "gap", jb: "gap", pii_in: "O", pii_out: "none", secrets: "E", tox: "none", topic: "none", ground: "O", tool: "none", allow: "pend", resid: "none", hitl: "none", budget: "E", bias: "none" },
  "app-8": { inj: "E", jb: "E", pii_in: "E", pii_out: "E", secrets: "E", tox: "E", topic: "E", ground: "wv", tool: "none", allow: "E", resid: "E", hitl: "none", budget: "E", bias: "O" },
};

// ─── Frameworks ───────────────────────────────────────────────────────────────

export const frameworkDefs: FrameworkDef[] = [
  {
    id: "eu-ai-act",
    name: "EU AI Act",
    industry: "Regulatory · All sectors",
    enabled: true,
    description: "Requirements for high-risk AI systems including logging, transparency, human oversight, and accuracy.",
    reqs: [
      { id: "Art. 12(1)", t: "Automatically generated logs for high-risk AI systems", guards: ["inj", "jb", "tox", "topic"], tiers: ["High"] },
      { id: "Art. 12(2)", t: "Log retention and tamper-evident storage", guards: [], tiers: ["High", "Limited"] },
      { id: "Art. 12(3)", t: "Recording of events that may lead to risk", guards: ["inj", "jb", "secrets", "tool"], tiers: ["High"] },
      { id: "Art. 14(1)", t: "Human oversight for high-risk systems", guards: ["hitl"], tiers: ["High"], agentic: true },
      { id: "Art. 14(4)", t: "Ability to interrupt or stop the system", guards: ["hitl", "tool"], tiers: ["High"], agentic: true },
      { id: "Art. 15(1)", t: "Achieve appropriate level of accuracy, robustness, and cybersecurity", guards: ["inj", "jb", "ground", "secrets"], tiers: ["High"] },
      { id: "Art. 52(1)", t: "Transparency: disclose to users they are interacting with AI", guards: [], tiers: ["High", "Limited"] },
    ],
  },
  {
    id: "nist-ai-rmf",
    name: "NIST AI RMF",
    industry: "Framework · All sectors",
    enabled: true,
    description: "The NIST AI Risk Management Framework's MEASURE and GOVERN functions for tracking and monitoring AI system characteristics.",
    reqs: [
      { id: "MEASURE 2.7", t: "Track, measure, and monitor AI system characteristics", guards: ["inj", "jb", "ground", "tox"] },
      { id: "MEASURE 2.9", t: "Monitor and report on AI system drift", guards: ["ground", "topic"] },
      { id: "GOVERN 4.1", t: "Policies and procedures for AI system accountability", guards: [] },
      { id: "MANAGE 1.1", t: "Identify and document risks from AI systems", guards: ["inj", "jb", "pii_in", "pii_out", "secrets"] },
      { id: "MEASURE 2.11", t: "Evaluate reliability and robustness", guards: ["ground", "allow"] },
    ],
  },
  {
    id: "owasp-llm",
    name: "OWASP LLM Top 10",
    industry: "Security · All sectors",
    enabled: true,
    description: "OWASP's Top 10 for Large Language Model Applications, addressing prompt injection, insecure output handling, and training data poisoning.",
    reqs: [
      { id: "LLM01", t: "Prompt injection", guards: ["inj", "jb"] },
      { id: "LLM02", t: "Insecure output handling", guards: ["pii_out", "secrets", "resid"] },
      { id: "LLM03", t: "Training data poisoning", guards: [] },
      { id: "LLM06", t: "Sensitive information disclosure", guards: ["pii_in", "pii_out", "secrets"] },
      { id: "LLM07", t: "Insecure plugin design", guards: ["tool", "allow"] },
      { id: "LLM09", t: "Overreliance / hallucination", guards: ["ground", "hitl"] },
    ],
  },
  {
    id: "iso-42001",
    name: "ISO/IEC 42001",
    industry: "Standard · All sectors",
    enabled: true,
    description: "AI management system standard covering awareness, monitoring, and measurement requirements.",
    reqs: [
      { id: "Clause 7.3", t: "Awareness of AI system risks and controls", guards: [] },
      { id: "Clause 8.3", t: "AI system risk assessment and treatment", guards: ["inj", "jb", "pii_in", "secrets"] },
      { id: "Clause 9.1", t: "Monitoring, measurement, analysis and evaluation", guards: ["inj", "jb", "ground", "tox", "topic"] },
    ],
  },
  {
    id: "sr-11-7",
    name: "Fed SR 11-7",
    industry: "Regulatory · Financial Services",
    enabled: true,
    description: "Federal Reserve guidance on model risk management — development, validation, and governance of models.",
    reqs: [
      { id: "§ III.3", t: "Model validation: conceptual soundness and ongoing monitoring", guards: ["ground", "topic"] },
      { id: "§ III.5", t: "Model governance: documentation and approval", guards: [], tiers: ["High"] },
      { id: "§ IV.1", t: "Challenge and review of model outputs", guards: ["hitl", "ground"] },
    ],
  },
  {
    id: "ico-ai",
    name: "UK ICO AI & Data Protection",
    industry: "Regulatory · UK",
    enabled: false,
    description: "Information Commissioner's Office guidance on AI and data protection, covering fairness, transparency, and accountability.",
    reqs: [
      { id: "Principle 1", t: "Lawfulness, fairness and transparency in AI", guards: ["pii_in", "pii_out", "bias"] },
      { id: "Principle 2", t: "Purpose limitation", guards: ["topic"] },
      { id: "Principle 6", t: "Accountability and governance", guards: ["hitl"] },
    ],
  },
  {
    id: "mas-feat",
    name: "MAS FEAT",
    industry: "Regulatory · Singapore Financial",
    enabled: false,
    description: "Monetary Authority of Singapore's FEAT principles — Fairness, Ethics, Accountability, and Transparency for AI in financial services.",
    reqs: [
      { id: "FEAT-F", t: "Fairness: justifiability of model outcomes", guards: ["bias"] },
      { id: "FEAT-E", t: "Ethics: alignment with firm values and societal norms", guards: ["tox", "topic"] },
      { id: "FEAT-A", t: "Accountability: clear ownership and review", guards: ["hitl"] },
      { id: "FEAT-T", t: "Transparency: disclosures to consumers", guards: [], tiers: ["High"] },
    ],
  },
  {
    id: "hipaa-ai",
    name: "HIPAA AI Guidance",
    industry: "Regulatory · Healthcare",
    enabled: false,
    description: "HHS guidance on AI use under HIPAA, covering PHI detection, de-identification, and audit logging.",
    reqs: [
      { id: "§ 164.312(b)", t: "Audit controls: hardware, software, and procedural mechanisms", guards: ["inj", "jb", "secrets"] },
      { id: "§ 164.514(a)", t: "De-identification of protected health information", guards: ["pii_in", "pii_out", "resid"] },
      { id: "§ 164.308(a)(1)", t: "Security risk analysis for AI systems", guards: ["inj", "secrets", "tool"] },
    ],
  },
  {
    id: "eu-dga",
    name: "EU Data Governance Act",
    industry: "Regulatory · EU",
    enabled: false,
    description: "Regulation on European data governance, covering data sharing, reuse, and protection in AI contexts.",
    reqs: [
      { id: "Art. 5", t: "Conditions for data reuse in AI", guards: ["pii_in", "pii_out"] },
      { id: "Art. 12", t: "Technical safeguards for data sharing", guards: ["secrets", "pii_out"] },
    ],
  },
  {
    id: "nist-800-53",
    name: "NIST 800-53 Rev 5",
    industry: "Security · US Government",
    enabled: false,
    description: "Security and privacy controls for information systems, adapted for AI workloads.",
    reqs: [
      { id: "AC-3", t: "Access enforcement for AI endpoints", guards: ["allow", "tool"] },
      { id: "AU-2", t: "Audit event recording", guards: ["inj", "jb", "secrets"] },
      { id: "SI-4", t: "Intrusion monitoring for AI systems", guards: ["inj", "jb", "secrets", "tool"] },
      { id: "PT-1", t: "Personally identifiable information policy", guards: ["pii_in", "pii_out"] },
    ],
  },
  {
    id: "basel-23",
    name: "Basel III AI Models",
    industry: "Regulatory · Global Banking",
    enabled: false,
    description: "Basel Committee guidance on AI and ML models for capital calculation and risk assessment.",
    reqs: [
      { id: "§ 156", t: "Model risk management for AI-driven capital models", guards: ["ground", "hitl"] },
      { id: "§ 189", t: "Validation of model inputs and outputs", guards: ["ground", "bias"] },
      { id: "§ 204", t: "Ongoing performance monitoring", guards: ["ground", "topic", "bias"] },
    ],
  },
  {
    id: "asfe",
    name: "ASIC RG 271 (AU)",
    industry: "Regulatory · Australian Financial",
    enabled: false,
    description: "Australian Securities and Investments Commission regulatory guide for AI in financial services.",
    reqs: [
      { id: "RG 271.12", t: "Consumer disclosure of AI use", guards: [], tiers: ["High"] },
      { id: "RG 271.18", t: "Monitoring of AI-driven decisions", guards: ["hitl", "ground"] },
    ],
  },
];

// ─── Roles & Users ─────────────────────────────────────────────────────────────

export const roles: Record<string, RoleDef> = {
  ciso: { id: "ciso", name: "CISO", color: "#e63946", perms: ["overview.view", "coverage.view", "guardrails.view", "evidence.verify", "evidence.export", "deploy.view", "remed.approve"] },
  risk_officer: { id: "risk_officer", name: "Risk Officer", color: "#f4a261", perms: ["overview.view", "coverage.view", "coverage.map", "guardrails.view", "evidence.verify", "evidence.export", "remed.approve", "remed.request"] },
  platform_admin: { id: "platform_admin", name: "Platform Admin", color: "#2a9d8f", perms: ["overview.view", "coverage.view", "coverage.map", "guardrails.view", "guardrails.edit", "evidence.verify", "evidence.export", "deploy.view", "deploy.mode", "remed.approve", "remed.request", "admin.config", "admin.users", "admin.roles", "calls.content"] },
  ai_engineer: { id: "ai_engineer", name: "AI Engineer", color: "#457b9d", perms: ["overview.view", "coverage.view", "guardrails.view", "guardrails.edit", "deploy.view", "remed.request", "calls.content"] },
  auditor: { id: "auditor", name: "Auditor", color: "#6d6875", perms: ["overview.view", "coverage.view", "evidence.verify", "evidence.export", "deploy.view"], system: true },
  compliance: { id: "compliance", name: "Compliance", color: "#9d4edd", perms: ["overview.view", "coverage.view", "coverage.map", "guardrails.view", "evidence.verify", "evidence.export", "remed.approve"] },
  exec: { id: "exec", name: "Executive", color: "#577590", perms: ["overview.view", "coverage.view"] },
  developer: { id: "developer", name: "Developer", color: "#83c5be", perms: ["overview.view", "guardrails.view"] },
};

export const users: UserDef[] = [
  { id: "u1", name: "Sarah Chen", email: "sarah.chen@acmebank.com", role: "ciso", bus: ["Retail Banking", "Wealth Management", "Insurance Claims", "Internal IT", "Marketing"], status: "Active", initials: "SC" },
  { id: "u2", name: "Amrita Patel", email: "amrita.patel@acmebank.com", role: "risk_officer", bus: ["Retail Banking", "Wealth Management", "Insurance Claims"], status: "Active", initials: "AP" },
  { id: "u3", name: "Liam O'Hara", email: "liam.ohara@acmebank.com", role: "platform_admin", bus: ["Retail Banking", "Wealth Management", "Insurance Claims", "Internal IT", "Marketing"], status: "Active", initials: "LO" },
  { id: "u4", name: "Mika Tanaka", email: "mika.tanaka@acmebank.com", role: "ai_engineer", bus: ["Retail Banking", "Internal IT"], status: "Active", initials: "MT" },
  { id: "u5", name: "David Okonkwo", email: "david.okonkwo@acmebank.com", role: "auditor", bus: ["Retail Banking", "Wealth Management", "Insurance Claims", "Internal IT", "Marketing"], status: "Active", initials: "DO" },
  { id: "u6", name: "Elena Rossi", email: "elena.rossi@acmebank.com", role: "compliance", bus: ["Retail Banking", "Insurance Claims"], status: "Active", initials: "ER" },
  { id: "u7", name: "James Park", email: "james.park@acmebank.com", role: "exec", bus: ["Retail Banking", "Wealth Management", "Insurance Claims", "Internal IT", "Marketing"], status: "Active", initials: "JP" },
  { id: "u8", name: "Yuki Watanabe", email: "yuki.watanabe@acmebank.com", role: "developer", bus: ["Internal IT"], status: "Invited", initials: "YW" },
];

// ─── Approval Chains ──────────────────────────────────────────────────────────

export const approvalChains: Record<string, ApprovalChain> = {
  guardrail_high: { id: "guardrail_high", name: "High-risk guardrail change", steps: ["platform_admin", "risk_officer", "ciso"] },
  guardrail_std: { id: "guardrail_std", name: "Standard guardrail change", steps: ["ai_engineer", "platform_admin"] },
  exception: { id: "exception", name: "Risk acceptance", steps: ["platform_admin", "risk_officer"] },
  mode_change: { id: "mode_change", name: "Enforcement mode change", steps: ["platform_admin", "ciso"] },
};

// ─── Remediation Requests ─────────────────────────────────────────────────────

export const remediationRequests: RemediationRequest[] = [
  {
    id: "CR-2026-0042",
    type: "deploy",
    app: "app-5",
    g: "ground",
    mode: "Enforce",
    chain: "guardrail_high",
    by: "u4",
    at: "2 hours ago",
    status: "Pending",
    note: "Loan eligibility bot has no grounding guardrail. Hallucinated income figures could lead to incorrect loan decisions.",
    log: [{ uid: "u3", d: "Approved", t: "1h ago" }],
  },
  {
    id: "CR-2026-0041",
    type: "deploy",
    app: "app-7",
    g: "inj",
    mode: "Observe",
    chain: "guardrail_std",
    by: "u4",
    at: "5 hours ago",
    status: "Pending",
    note: "Code review assistant has no prompt injection guardrail. Starting in observe mode to measure false positive impact.",
    log: [],
  },
  {
    id: "CR-2026-0040",
    type: "accept",
    app: "app-8",
    g: "ground",
    chain: "exception",
    by: "u2",
    at: "1 day ago",
    status: "Approved",
    note: "Wealth advisory summarizer uses curated source documents with human review of all outputs. Grounding guardrail adds latency without meaningful risk reduction.",
    expires: "2027-03-31",
    log: [{ uid: "u3", d: "Approved", t: "20h ago" }, { uid: "u2", d: "Approved", t: "18h ago" }],
  },
  {
    id: "CR-2026-0039",
    type: "mode",
    dep: "dep-3",
    mode: "Enforce",
    chain: "mode_change",
    by: "u3",
    at: "3 days ago",
    status: "Applied",
    note: "Claims intake agent guardrails have been in observe mode for 2 weeks. False positive rate is within budget; switching to enforce.",
    log: [{ uid: "u1", d: "Approved", t: "2d ago" }, { uid: "u3", d: "Approved", t: "2d ago" }],
  },
  {
    id: "CR-2026-0038",
    type: "deploy",
    app: "app-7",
    g: "allow",
    mode: "Enforce",
    chain: "guardrail_std",
    by: "u4",
    at: "4 days ago",
    status: "Applied",
    note: "Add allow-list to code review assistant to restrict model access.",
    log: [{ uid: "u4", d: "Approved", t: "4d ago" }, { uid: "u3", d: "Approved", t: "3d ago" }],
  },
];

// ─── Evidence Batches (hash chain) ────────────────────────────────────────────

function generateBatches(): EvidenceBatch[] {
  const out: EvidenceBatch[] = [];
  let prev = "0".repeat(16);
  for (let h = 7; h >= 0; h--) {
    const hh = String(h).padStart(2, "0");
    const id = `EB-20261027-${hh}`;
    const decisions = 48000 + ((h * 7919) % 9000);
    const root = id + decisions + "root";
    const rootHash = root.slice(0, 16) + root.slice(-8);
    const self = (prev + rootHash).slice(0, 24);
    out.push({ id, window: `Oct 27, ${hh}:00–${hh}:59`, decisions, merkleRoot: rootHash, prevBatch: prev, hash: self, anchored: true });
    prev = self;
  }
  return out;
}

export const evidenceBatches: EvidenceBatch[] = generateBatches();

export const ledgerEntries: LedgerEntry[] = (() => {
  let prev = "0".repeat(16);
  const events = [
    { t: "12:48", actor: "Liam O'Hara", role: "Platform Admin", action: "Mode change applied", detail: "CR-2026-0039: Claims Sidecar → Enforce mode" },
    { t: "11:20", actor: "Liam O'Hara", role: "Platform Admin", action: "Approved request", detail: "CR-2026-0039 step 2 of 2 · Mode change" },
    { t: "11:05", actor: "Sarah Chen", role: "CISO", action: "Approved request", detail: "CR-2026-0039 step 1 of 2 · Mode change" },
    { t: "09:30", actor: "Amrita Patel", role: "Risk Officer", action: "Risk accepted", detail: "CR-2026-0040: Grounding on Wealth advisory summarizer accepted until 2027-03-31" },
    { t: "08:15", actor: "Mika Tanaka", role: "AI Engineer", action: "Submitted request", detail: "CR-2026-0042: Deploy Grounding on Loan eligibility bot (enforce)" },
    { t: "07:00", actor: "System", role: "", action: "Evidence anchored", detail: "EB-20261027-06: 54,219 decisions · RFC 3161 timestamp" },
  ];
  return events.map((e) => {
    const hash = (prev + e.t + e.actor + e.action + e.detail).slice(0, 24);
    const entry: LedgerEntry = { id: `L-${hash.slice(0, 8)}`, t: e.t, actor: e.actor, role: e.role, action: e.action, detail: e.detail, hash, prev };
    prev = hash;
    return entry;
  });
})();

// ─── Live Calls ───────────────────────────────────────────────────────────────

export const liveCalls: LiveCall[] = [
  { id: "c-001", t: "12:42:08", app: "app-1", dep: "dep-1", principal: "user_88421", model: "claude-3.5-sonnet", verdict: "Blocked", g: "inj", evaluated: 8, lat: 18, mode: "Enforce", hash: "a1b2c3d4e5f6789012345678abcdef01", fresh: true },
  { id: "c-002", t: "12:41:54", app: "app-2", dep: "dep-3", principal: "svc_claims", model: "gpt-4o", verdict: "Redacted", g: "pii_out", evaluated: 10, lat: 15, mode: "Observe", hash: "d4e5f6a7b8c9012345678abcdef01234", fresh: true },
  { id: "c-003", t: "12:41:30", app: "app-3", dep: "dep-2", principal: "svc_reporting", model: "claude-3-haiku", verdict: "Allowed", evaluated: 6, lat: 22, mode: "Enforce", hash: "g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2" },
  { id: "c-004", t: "12:40:15", app: "app-5", dep: "dep-1", principal: "user_44102", model: "claude-3.5-sonnet", verdict: "Would block", g: "ground", evaluated: 7, lat: 20, mode: "Observe", hash: "j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5" },
  { id: "c-005", t: "12:39:42", app: "app-1", dep: "dep-1", principal: "user_77233", model: "claude-3.5-sonnet", verdict: "Allowed", evaluated: 8, lat: 16, mode: "Enforce", hash: "m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8" },
  { id: "c-006", t: "12:38:20", app: "app-8", dep: "dep-2", principal: "user_55301", model: "gpt-4o", verdict: "Redacted", g: "pii_out", evaluated: 9, lat: 24, mode: "Enforce", hash: "p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1" },
  { id: "c-007", t: "12:37:55", app: "app-2", dep: "dep-3", principal: "svc_claims", model: "gpt-4o", verdict: "Blocked", g: "tool", evaluated: 11, lat: 14, mode: "Observe", hash: "s9t0u1v2w3x4y5z6a7b8c9d0e1f2a3b4" },
  { id: "c-008", t: "12:36:12", app: "app-7", dep: "dep-2", principal: "svc_coderev", model: "claude-3.5-sonnet", verdict: "Would block", g: "inj", evaluated: 5, lat: 18, mode: "Observe", hash: "v2w3x4y5z6a7b8c9d0e1f2a3b4c5d6e7" },
  { id: "c-009", t: "12:35:30", app: "app-3", dep: "dep-2", principal: "user_33021", model: "claude-3-haiku", verdict: "Allowed", evaluated: 6, lat: 20, mode: "Enforce", hash: "y5z6a7b8c9d0e1f2a3b4c5d6e7f8a9b0" },
  { id: "c-010", t: "12:34:08", app: "app-1", dep: "dep-1", principal: "user_99120", model: "claude-3.5-sonnet", verdict: "Blocked", g: "jb", evaluated: 8, lat: 17, mode: "Enforce", hash: "b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3" },
  { id: "c-011", t: "12:33:22", app: "app-6", dep: "dep-4", principal: "svc_mktg", model: "gpt-4o-mini", verdict: "Allowed", evaluated: 4, lat: 12, mode: "Enforce", hash: "e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6" },
  { id: "c-012", t: "12:32:45", app: "app-5", dep: "dep-1", principal: "user_66412", model: "claude-3.5-sonnet", verdict: "Allowed", evaluated: 7, lat: 19, mode: "Enforce", hash: "h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9" },
];

// ─── Statistics ─────────────────────────────────────────────────────────────────

export const stats = {
  calls: 1284000,
  blocked: 3421,
  redacted: 891,
  flagged: 412,
  posture: 77,
  postureTrend: [61, 63, 62, 66, 68, 70, 71, 73, 74, 76, 77, 77],
};

export const interventionsByGuardrail: { guardrailId: string; count: number }[] = [
  { guardrailId: "inj", count: 1240 },
  { guardrailId: "pii_in", count: 980 },
  { guardrailId: "jb", count: 612 },
  { guardrailId: "topic", count: 389 },
  { guardrailId: "pii_out", count: 236 },
  { guardrailId: "secrets", count: 211 },
  { guardrailId: "tool", count: 144 },
  { guardrailId: "tox", count: 100 },
];

// ─── Helper Functions ──────────────────────────────────────────────────────────

export function guardrailById(id: string): GuardrailDef | undefined {
  return guardrailDefs.find((g) => g.id === id);
}

export function appById(id: string): AIApp | undefined {
  return aiApps.find((a) => a.id === id);
}

export function depById(id: string): Deployment | undefined {
  return deployments.find((d) => d.id === id);
}

export function roleById(id: string): RoleDef | undefined {
  return roles[id];
}

export function userById(id: string): UserDef | undefined {
  return users.find((u) => u.id === id);
}

export function activeFrameworks(): FrameworkDef[] {
  return frameworkDefs.filter((f) => f.enabled);
}

export function cellState(appId: string, guardrailId: string): CellState {
  return coverageMatrix[appId]?.[guardrailId] ?? "none";
}

export function reqApplies(req: FrameworkRequirement, app: AIApp): boolean {
  if (req.tiers) return req.tiers.includes(app.tier);
  if (req.agentic) return app.agentic;
  return true;
}

export function reqMet(fw: FrameworkDef, req: FrameworkRequirement, app: AIApp): boolean {
  const requiredGuards = req.guards;
  if (requiredGuards.length === 0) return false;
  return requiredGuards.every((gid) => {
    const st = cellState(app.id, gid);
    return st === "E" || st === "O";
  });
}

export interface Gap {
  app: AIApp;
  g: GuardrailDef;
  sev: "Critical" | "High" | "Medium" | "Low";
  st: "missing" | "weak";
  reqs: string[];
  cr?: RemediationRequest;
}

export function gaps(scopedApps?: AIApp[]): Gap[] {
  const apps = scopedApps ?? aiApps;
  const list: Gap[] = [];
  for (const app of apps) {
    for (const fw of activeFrameworks()) {
      for (const req of fw.reqs) {
        if (!reqApplies(req, app)) continue;
        for (const gid of req.guards) {
          const st = cellState(app.id, gid);
          if (st === "gap" || st === "weak") {
            const g = guardrailById(gid);
            if (!g) continue;
            const existing = list.find((x) => x.app.id === app.id && x.g.id === gid);
            const reqLabel = `${fw.name} ${req.id}`;
            if (existing) {
              if (!existing.reqs.includes(reqLabel)) existing.reqs.push(reqLabel);
            } else {
              const cr = remediationRequests.find(
                (r) => r.app === app.id && r.g === gid && r.status !== "Rejected" && r.status !== "Applied"
              );
              list.push({
                app,
                g,
                sev: app.tier === "High" ? "Critical" : "Medium",
                st: st === "weak" ? "weak" : "missing",
                reqs: [reqLabel],
                cr,
              });
            }
          }
        }
      }
    }
  }
  return list;
}

export function posture(scopedApps?: AIApp[]): number {
  const apps = scopedApps ?? aiApps;
  let total = 0;
  let met = 0;
  for (const app of apps) {
    for (const fw of activeFrameworks()) {
      for (const req of fw.reqs) {
        if (!reqApplies(req, app)) continue;
        total++;
        if (reqMet(fw, req, app)) met++;
      }
    }
  }
  return total > 0 ? Math.round((met / total) * 100) : 100;
}

export function fwCoverage(fw: FrameworkDef): { m: number; n: number; pct: number } {
  let m = 0;
  let n = 0;
  for (const app of aiApps) {
    for (const req of fw.reqs) {
      if (!reqApplies(req, app)) continue;
      n++;
      if (reqMet(fw, req, app)) m++;
    }
  }
  return { m, n, pct: n > 0 ? Math.round((m / n) * 100) : 0 };
}

// ─── Legacy compatibility exports for existing pages ──────────────────────────

export const guardrails: Guardrail[] = guardrailDefs.map((g, i) => {
  const catchRates = [82, 76, 88, null];
  const cr = catchRates[i] ?? null;
  return {
    id: g.id,
    name: g.name,
    provider: g.engine,
    category: g.category,
    engine: g.engine,
    fp: g.fp,
    lat: g.lat,
    catchRate: cr !== null ? { caught: Math.round(cr * 6.12), total: 612, percentage: cr, range: { value: cr, low: cr - 3, high: cr + 3, previousValue: cr + 4 } } : null,
    falseBlocks: { count: Math.round(g.fp * 7.29), total: 729, percentage: g.fp },
    changeVsLastMonth: i === 0 ? "−4 pts" : i === 1 ? "+1 pt" : "no change",
    status: i === 0 ? "weakened" : "matches_policy",
    statusLabel: i === 0 ? "Weakened 2h ago" : "Matches policy",
    state: cr !== null ? "measured" : "not_measured",
    policyName: "Customer-facing guardrail policy v13",
    policyThreshold: 80,
    sensitivity: g.defaultSensitivity,
  };
});

export const aiSystemCoverage = aiApps.map((app) => {
  const appGuards = coverageMatrix[app.id] || {};
  const hasEnforced = Object.values(appGuards).some((s) => s === "E");
  const hasGap = Object.values(appGuards).some((s) => s === "gap");
  const allNone = Object.values(appGuards).every((s) => s === "none");
  let status: "governed" | "partly_governed" | "unguarded" | "bypassing_gateway" | "unknown";
  let reason: string;
  if (hasEnforced && !hasGap) { status = "governed"; reason = `All traffic routed through guardrails via ${depById(app.dep)?.host}`; }
  else if (hasGap) { status = "partly_governed"; reason = "Connected but missing required guardrails"; }
  else if (allNone) { status = "unguarded"; reason = "No guardrails applied to this use case"; }
  else { status = "bypassing_gateway"; reason = "Guardrails in observe mode only"; }
  return { id: app.id, name: app.name, type: app.agentic ? "Workflow agent" : "Chatbot", status, reason };
});

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

export const coverageRows: CoverageRow[] = [
  { attackCategory: "Prompt injection", total: 160, guardrails: [
    { guardrailId: "inj", guardrailName: "Prompt Injection", state: "measured", caught: 114, total: 160, percentage: 71 },
    { guardrailId: "jb", guardrailName: "Jailbreak", state: "measured", caught: 104, total: 160, percentage: 65 },
    { guardrailId: "topic", guardrailName: "Topic Boundary", state: "measured", caught: 134, total: 160, percentage: 84 },
    { guardrailId: "tox", guardrailName: "Toxicity", state: "not_measured", caught: 0, total: 0, percentage: null },
  ]},
  { attackCategory: "Jailbreak", total: 100, guardrails: [
    { guardrailId: "inj", guardrailName: "Prompt Injection", state: "measured", caught: 89, total: 100, percentage: 89 },
    { guardrailId: "jb", guardrailName: "Jailbreak", state: "measured", caught: 78, total: 100, percentage: 78 },
    { guardrailId: "topic", guardrailName: "Topic Boundary", state: "measured", caught: 93, total: 100, percentage: 93 },
    { guardrailId: "tox", guardrailName: "Toxicity", state: "not_measured", caught: 0, total: 0, percentage: null },
  ]},
  { attackCategory: "Harmful content", total: 120, guardrails: [
    { guardrailId: "inj", guardrailName: "Prompt Injection", state: "measured", caught: 113, total: 120, percentage: 94 },
    { guardrailId: "jb", guardrailName: "Jailbreak", state: "measured", caught: 110, total: 120, percentage: 92 },
    { guardrailId: "topic", guardrailName: "Topic Boundary", state: "measured", caught: 116, total: 120, percentage: 97 },
    { guardrailId: "tox", guardrailName: "Toxicity", state: "measured", caught: 112, total: 120, percentage: 93 },
  ]},
];

// Legacy framework chips for Evidence page
export const frameworks = [
  { id: "eu-ai-act", name: "EU AI Act", label: "Art. 12 — Logging", description: "Article 12 requires providers of high-risk AI systems to keep automatically generated logs." },
  { id: "nist-ai-rmf", name: "NIST AI RMF", label: "MEASURE 2.7", description: "The NIST AI Risk Management Framework's MEASURE function calls for tracking AI system characteristics." },
  { id: "owasp-llm", name: "OWASP LLM", label: "LLM01 — Prompt Injection", description: "OWASP's Top 10 for Large Language Model Applications identifies prompt injection as the top risk." },
  { id: "iso-42001", name: "ISO/IEC 42001", label: "Clause 9.1", description: "ISO 42001 is the AI management system standard." },
];

// Legacy evidence bundles
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

export const evidenceBundlesLegacy: EvidenceBundle[] = [
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
    proves: ["All allow, block, and redact decisions from Oct 1–27 were recorded", "Guardrail evaluations and verdicts logged with hash chain"],
    doesNotProve: ["That untested guardrails are effective", "That real-world attack distributions match the test sets"],
    guardrailsCovered: ["inj", "jb", "tox", "topic", "pii_in", "pii_out"],
    decisionCount: 1284000,
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
    proves: ["38,402 decisions recorded with hash chain", "RFC 3161 timestamps on 720 hourly batches", "Merkle root verification passed"],
    doesNotProve: ["That real-world attack distributions match the test sets"],
    guardrailsCovered: ["inj", "jb", "tox", "topic", "pii_in", "pii_out"],
    decisionCount: 38402,
    testCount: 1836,
  },
];

export const timelineEvents = [
  { id: "tl-1", when: "2h ago", type: "setting_change" as const, label: "Grounding guardrail requested for Loan eligibility bot", detail: "CR-2026-0042 submitted by Mika Tanaka" },
  { id: "tl-2", when: "5h ago", type: "incident" as const, label: "Prompt injection gap on Code review assistant", detail: "CR-2026-0041 submitted — observe mode requested" },
  { id: "tl-3", when: "1 day ago", type: "approval" as const, label: "Risk accepted for Wealth advisory grounding", detail: "CR-2026-0040 approved — expires 2027-03-31" },
  { id: "tl-4", when: "3 days ago", type: "approval" as const, label: "Claims sidecar switched to Enforce", detail: "CR-2026-0039 applied — all guardrails now enforcing" },
];

export const tenants = [
  { id: "acme-prod", name: "Acme Bank · Production" },
  { id: "acme-staging", name: "Acme Bank · Staging" },
];

// ─── Legacy exports for backward compatibility with older pages ───────────────

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

export const agentsAndTools: AgentTool[] = [
  { id: "at-1", name: "Customer support assistant", type: "Chatbot", guardrailId: "inj", guardrailName: "Prompt Injection", monitored: true, decisionCount: 28432, lastSeen: "Just now" },
  { id: "at-2", name: "Claims intake agent", type: "Workflow agent", guardrailId: "tool", guardrailName: "Tool Control", monitored: true, decisionCount: 12401, lastSeen: "2 min ago" },
  { id: "at-3", name: "Internal knowledge search", type: "RAG agent", guardrailId: "ground", guardrailName: "Grounding", monitored: true, decisionCount: 18920, lastSeen: "5 min ago" },
  { id: "at-4", name: "KYC document checker", type: "Workflow agent", guardrailId: "pii_in", guardrailName: "PII Ingress", monitored: true, decisionCount: 8421, lastSeen: "12 min ago" },
  { id: "at-5", name: "Loan eligibility bot", type: "Chatbot", guardrailId: "topic", guardrailName: "Topic Boundary", monitored: true, decisionCount: 5210, lastSeen: "18 min ago" },
];

export interface Assessment {
  id: string;
  name: string;
  guardrailName: string;
  date: string;
  status: "completed" | "in_progress" | "scheduled";
  catchRate: number | null;
  testCount: number;
}

export const assessments: Assessment[] = [
  { id: "as-1", name: "October 2026 monthly assessment", guardrailName: "Prompt Injection", date: "2026-10-27", status: "in_progress", catchRate: 82, testCount: 612 },
  { id: "as-2", name: "September 2026 monthly assessment", guardrailName: "Prompt Injection", date: "2026-09-30", status: "completed", catchRate: 86, testCount: 612 },
  { id: "as-3", name: "August 2026 monthly assessment", guardrailName: "Prompt Injection", date: "2026-08-31", status: "completed", catchRate: 90, testCount: 612 },
  { id: "as-4", name: "September 2026 monthly assessment", guardrailName: "Jailbreak", date: "2026-09-30", status: "completed", catchRate: 78, testCount: 612 },
  { id: "as-5", name: "September 2026 monthly assessment", guardrailName: "Topic Boundary", date: "2026-09-30", status: "completed", catchRate: 88, testCount: 612 },
  { id: "as-6", name: "October 2026 monthly assessment", guardrailName: "Jailbreak", date: "2026-10-27", status: "in_progress", catchRate: 76, testCount: 612 },
  { id: "as-7", name: "October 2026 monthly assessment", guardrailName: "Topic Boundary", date: "2026-10-27", status: "in_progress", catchRate: 88, testCount: 612 },
];

export interface TestSet {
  id: string;
  name: string;
  category: string;
  promptCount: number;
  visibility: "public" | "private";
  lastUpdated: string;
}

export const testSets: TestSet[] = [
  { id: "ts-1", name: "Standard prompt injection", category: "Prompt injection", promptCount: 160, visibility: "public", lastUpdated: "2026-10-01" },
  { id: "ts-2", name: "Jailbreak collection v2", category: "Jailbreak", promptCount: 100, visibility: "public", lastUpdated: "2026-10-01" },
  { id: "ts-3", name: "Harmful content probes", category: "Harmful content", promptCount: 120, visibility: "public", lastUpdated: "2026-10-01" },
  { id: "ts-4", name: "Personal data vectors", category: "Personal data", promptCount: 80, visibility: "public", lastUpdated: "2026-10-01" },
  { id: "ts-5", name: "Misconduct scenarios", category: "Misconduct", promptCount: 80, visibility: "public", lastUpdated: "2026-10-01" },
  { id: "ts-6", name: "Investment advice attacks", category: "Investment advice", promptCount: 50, visibility: "private", lastUpdated: "2026-09-28" },
  { id: "ts-7", name: "Account changes by chat", category: "Account changes by chat", promptCount: 22, visibility: "private", lastUpdated: "2026-09-25" },
];

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

export const attackCategories: AttackCategory[] = [
  { category: "Prompt injection", caught: 114, total: 160, percentage: 71, range: { value: 71, low: 64, high: 78 }, lastMonthPct: 83, changePct: -12 },
  { category: "Jailbreak", caught: 89, total: 100, percentage: 89, range: { value: 89, low: 81, high: 94 }, lastMonthPct: 90, changePct: -1 },
  { category: "Harmful content", caught: 113, total: 120, percentage: 94, range: { value: 94, low: 88, high: 97 }, lastMonthPct: 94, changePct: 0 },
  { category: "Personal data", caught: 72, total: 80, percentage: 90, range: { value: 90, low: 81, high: 95 }, lastMonthPct: 91, changePct: -1 },
  { category: "Misconduct", caught: 69, total: 80, percentage: 86, range: { value: 86, low: 77, high: 92 }, lastMonthPct: 85, changePct: 1 },
  { category: "Investment advice", caught: 32, total: 50, percentage: 64, range: { value: 64, low: 50, high: 76 }, lastMonthPct: 66, changePct: -2 },
  { category: "Account changes by chat", caught: 13, total: 22, percentage: 59, range: { value: 59, low: 39, high: 78 }, lastMonthPct: 60, changePct: -1, tooFewToJudge: true },
];

export interface DriftPoint {
  month: string;
  percentage: number;
  rangeLow: number;
  rangeHigh: number;
  hasSettingChange: boolean;
  settingChangeLabel?: string;
}

export const driftHistory: DriftPoint[] = [
  { month: "Aug", percentage: 90, rangeLow: 87, rangeHigh: 92, hasSettingChange: false },
  { month: "Sep", percentage: 86, rangeLow: 83, rangeHigh: 89, hasSettingChange: true, settingChangeLabel: "PII categories expanded" },
  { month: "Oct", percentage: 82, rangeLow: 79, rangeHigh: 85, hasSettingChange: true, settingChangeLabel: "Prompt attack HIGH → LOW" },
];

export const whyDroppedPanel = {
  guardrailId: "inj",
  guardrailName: "Prompt Injection",
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

export const settingChanges: SettingChange[] = [
  {
    id: "sc-001",
    guardrailId: "inj",
    guardrailName: "Prompt Injection",
    who: "role/AdminDeploy",
    when: "2h ago",
    timestamp: "2026-10-27T11:48:00Z",
    setting: "Bedrock Prompt attack filter",
    before: "HIGH",
    after: "LOW",
    diff: [{ field: "Prompt attack filter", oldValue: "HIGH", newValue: "LOW" }],
    retestResult: { caught: 502, total: 612, percentage: 82 },
    retestStatus: "weakened",
  },
  {
    id: "sc-002",
    guardrailId: "inj",
    guardrailName: "Prompt Injection",
    who: "sarah.chen@acmebank.com",
    when: "25 days ago",
    timestamp: "2026-09-14T11:20:00Z",
    setting: "PII detection → Enabled categories",
    before: "Name, Email, Phone",
    after: "Name, Email, Phone, SSN, DOB",
    diff: [{ field: "Categories", oldValue: "Name, Email, Phone", newValue: "Name, Email, Phone, SSN, DOB" }],
    retestResult: { caught: 527, total: 612, percentage: 86 },
    retestStatus: "improved",
  },
  {
    id: "sc-003",
    guardrailId: "tox",
    guardrailName: "Toxicity",
    who: "amrita.patel@acmebank.com",
    when: "12 days ago",
    timestamp: "2026-09-27T09:00:00Z",
    setting: "Hate speech → Severity threshold",
    before: "2",
    after: "3",
    diff: [{ field: "Severity threshold", oldValue: "2 (low)", newValue: "3 (medium)" }],
    retestResult: { caught: 465, total: 612, percentage: 76 },
    retestStatus: "improved",
  },
  {
    id: "sc-004",
    guardrailId: "allow",
    guardrailName: "Allow-list",
    who: "liam.ohara@acmebank.com",
    when: "18 days ago",
    timestamp: "2026-09-21T16:45:00Z",
    setting: "Fallback model",
    before: "claude-3-haiku",
    after: "claude-3-sonnet",
    diff: [{ field: "Fallback model", oldValue: "claude-3-haiku", newValue: "claude-3-sonnet" }],
    retestResult: { caught: 539, total: 612, percentage: 88 },
    retestStatus: "no_change",
  },
];

export interface NeedsAttentionItem {
  id: string;
  guardrailName: string;
  issue: string;
  severity: "high" | "medium" | "low";
  action: string;
  when: string;
}

export const needsAttention: NeedsAttentionItem[] = [
  { id: "na-1", guardrailName: "Prompt Injection", issue: "Catch rate dropped 4 points after Prompt attack filter changed from HIGH to LOW", severity: "high", action: "Fix in AWS or propose as policy v14 for two-person approval", when: "2h ago" },
  { id: "na-2", guardrailName: "Grounding", issue: "Loan eligibility bot has no grounding guardrail — hallucination risk", severity: "high", action: "Deploy grounding guardrail (CR-2026-0042 pending)", when: "2h ago" },
  { id: "na-3", guardrailName: "Prompt Injection", issue: "Code review assistant has no prompt injection guardrail", severity: "medium", action: "Deploy in observe mode (CR-2026-0041 pending)", when: "5h ago" },
  { id: "na-4", guardrailName: "Toxicity", issue: "False positive rate at 2.1% — within budget but trending up", severity: "low", action: "Monitor over next week", when: "3 days ago" },
];

export interface Incident {
  id: string;
  title: string;
  severity: "high" | "medium" | "low";
  status: "open" | "investigating" | "resolved";
  guardrailName: string;
  openedAt: string;
  description: string;
}

export const incidents: Incident[] = [
  { id: "inc-001", title: "Prompt injection: 46 attacks bypassed support-bot after filter lowered", severity: "high", status: "open", guardrailName: "Prompt Injection", openedAt: "2h ago", description: "After the Prompt attack filter was changed from HIGH to LOW, 46 prompt injection attacks passed through without being blocked." },
  { id: "inc-002", title: "Jailbreak pattern detected: DAN-style attack on support-bot", severity: "medium", status: "investigating", guardrailName: "Jailbreak", openedAt: "3h ago", description: "A series of DAN-style jailbreak prompts were sent. 3 were blocked, 1 passed through using a novel variant." },
  { id: "inc-003", title: "False positive spike on Toxicity guardrail", severity: "low", status: "resolved", guardrailName: "Toxicity", openedAt: "3 days ago", description: "False positive rate spiked to 7.2% over a 6-hour window. Resolved by adjusting severity threshold from 2 to 3." },
];

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

export const guardrailConnections: GuardrailConnection[] = [
  { id: "gc-1", name: "EU Gateway", provider: "ThirdSigma v3", cloud: "AWS", connectionStatus: "connected", testAccessStatus: "granted", monthlyTestBudget: 2000, testsThisMonth: 1836, region: "us-east-1" },
  { id: "gc-2", name: "US Gateway", provider: "ThirdSigma v3", cloud: "Azure", connectionStatus: "connected", testAccessStatus: "granted", monthlyTestBudget: 1500, testsThisMonth: 612, region: "eastus2" },
  { id: "gc-3", name: "Claims Sidecar", provider: "ThirdSigma v3", cloud: "GCP", connectionStatus: "connected", testAccessStatus: "granted", monthlyTestBudget: 1500, testsThisMonth: 612, region: "us-central1" },
  { id: "gc-4", name: "Internal Proxy", provider: "ThirdSigma v3", cloud: "AWS", connectionStatus: "error", testAccessStatus: "not_granted", monthlyTestBudget: 1000, testsThisMonth: 0, region: "us-east-1" },
];

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

export const decisions: Decision[] = liveCalls.slice(0, 8).map((c) => ({
  id: c.id,
  timestamp: `2026-10-27T${c.t}`,
  guardrailName: c.g ? guardrailById(c.g)?.name || c.g : "none",
  provider: "ThirdSigma v3",
  decision: c.verdict === "Blocked" ? "block" : c.verdict === "Redacted" ? "mask" : "allow",
  inputChannel: appById(c.app)?.name || c.app,
  userId: c.principal,
  checksFired: c.g ? [{ check: guardrailById(c.g)?.name || c.g, result: c.verdict === "Allowed" ? "PASS" : c.verdict === "Redacted" ? "MASK" : "BLOCK", detail: c.verdict }] : [],
  contentHash: c.hash,
  category: c.verdict,
  responseAction: c.verdict === "Blocked" ? "Blocked — no response sent" : c.verdict === "Redacted" ? "Redacted — response sent with PII masked" : "Allowed — full response sent",
}));
