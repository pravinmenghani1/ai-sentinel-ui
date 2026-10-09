import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppShell } from "@/components/AppShell";
import { AssuranceHome } from "@/pages/AssuranceHome";
import { Scorecard } from "@/pages/Scorecard";
import { Scorecards } from "@/pages/Scorecards";
import { Assessments } from "@/pages/Assessments";
import { TestSets } from "@/pages/TestSets";
import { ChangesDrift } from "@/pages/ChangesDrift";
import { LiveDecisions } from "@/pages/LiveDecisions";
import { Incidents } from "@/pages/Incidents";
import { CoverageMap } from "@/pages/CoverageMap";
import { CatchRateMatrix } from "@/pages/CatchRateMatrix";
import { AgentsTools } from "@/pages/AgentsTools";
import { Evidence } from "@/pages/Evidence";
import { Approvals } from "@/pages/Approvals";
import { Frameworks } from "@/pages/Frameworks";
import { GuardrailConnections } from "@/pages/GuardrailConnections";
import { Policies } from "@/pages/Policies";
import { AccessKeys } from "@/pages/AccessKeys";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<AssuranceHome />} />
            <Route path="/test/scorecards" element={<Scorecards />} />
            <Route path="/test/scorecard/:guardrailId" element={<Scorecard />} />
            <Route path="/test/assessments" element={<Assessments />} />
            <Route path="/test/test-sets" element={<TestSets />} />
            <Route path="/test/catch-rate-matrix" element={<CatchRateMatrix />} />
            <Route path="/monitor/changes" element={<ChangesDrift />} />
            <Route path="/monitor/decisions" element={<LiveDecisions />} />
            <Route path="/monitor/incidents" element={<Incidents />} />
            <Route path="/explain/coverage" element={<CoverageMap />} />
            <Route path="/explain/agents" element={<AgentsTools />} />
            <Route path="/prove/evidence" element={<Evidence />} />
            <Route path="/prove/approvals" element={<Approvals />} />
            <Route path="/prove/frameworks" element={<Frameworks />} />
            <Route path="/setup/guardrails" element={<GuardrailConnections />} />
            <Route path="/setup/policies" element={<Policies />} />
            <Route path="/setup/access" element={<AccessKeys />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
