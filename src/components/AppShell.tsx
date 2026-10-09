import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  ShieldCheck,
  FlaskConical,
  Activity,
  LayoutGrid,
  FileCheck2,
  Settings,
  ChevronDown,
  Sun,
  Moon,
  Menu,
  X,
  Building2,
  Bell,
} from "lucide-react";
import { tenants } from "@/mock/data";
import { useTheme } from "@/components/ThemeProvider";

interface NavGroup {
  label: string;
  accent: string;
  accentLight: string;
  items: { to: string; label: string; icon: typeof ShieldCheck }[];
}

const navGroups: NavGroup[] = [
  {
    label: "Assurance",
    accent: "text-sentinel-teal",
    accentLight: "bg-sentinel-teal-light",
    items: [{ to: "/", label: "Assurance home", icon: ShieldCheck }],
  },
  {
    label: "Test",
    accent: "text-sentinel-blue",
    accentLight: "bg-sentinel-blue-light",
    items: [
      { to: "/test/scorecards", label: "Scorecards", icon: FlaskConical },
      { to: "/test/catch-rate-matrix", label: "Catch-rate matrix", icon: LayoutGrid },
      { to: "/test/assessments", label: "Assessments", icon: FileCheck2 },
      { to: "/test/test-sets", label: "Test sets", icon: LayoutGrid },
    ],
  },
  {
    label: "Monitor",
    accent: "text-sentinel-amber",
    accentLight: "bg-sentinel-amber-light",
    items: [
      { to: "/monitor/changes", label: "Changes & drift", icon: Activity },
      { to: "/monitor/decisions", label: "Live decisions", icon: Activity },
      { to: "/monitor/incidents", label: "Incidents", icon: Bell },
    ],
  },
  {
    label: "Explain",
    accent: "text-sentinel-violet",
    accentLight: "bg-sentinel-violet-light",
    items: [
      { to: "/explain/coverage", label: "Coverage map", icon: LayoutGrid },
      { to: "/explain/agents", label: "Agents & tools", icon: LayoutGrid },
    ],
  },
  {
    label: "Prove",
    accent: "text-sentinel-green",
    accentLight: "bg-sentinel-green-light",
    items: [
      { to: "/prove/evidence", label: "Evidence", icon: FileCheck2 },
      { to: "/prove/approvals", label: "Approvals", icon: FileCheck2 },
      { to: "/prove/frameworks", label: "Frameworks", icon: FileCheck2 },
    ],
  },
];

const setupItems: NavGroup["items"] = [
  { to: "/setup/guardrails", label: "Guardrails & connections", icon: Settings },
  { to: "/setup/policies", label: "Policies", icon: Settings },
  { to: "/setup/access", label: "Access & keys", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tenantOpen, setTenantOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(tenants[0]);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const currentPage = (() => {
    for (const group of navGroups) {
      for (const item of group.items) {
        if (item.to === location.pathname) return `${group.label} · ${item.label}`;
        if (item.to !== "/" && location.pathname.startsWith(item.to)) return `${group.label} · ${item.label}`;
      }
    }
    for (const item of setupItems) {
      if (location.pathname.startsWith(item.to)) return `Set up · ${item.label}`;
    }
    return "Assurance · Home";
  })();

  return (
    <div className="flex h-screen overflow-hidden bg-sentinel-bg">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static z-40 w-64 h-full bg-sentinel-surface border-r border-sentinel-border flex flex-col transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 h-14 border-b border-sentinel-border flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow-teal">
            <ShieldCheck className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-bold text-sentinel-text text-base tracking-tight">Sentinel</span>
          <button
            className="ml-auto md:hidden touch-target flex items-center justify-center text-sentinel-text-muted hover:text-sentinel-text"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin py-3 px-2">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-4">
              <div className={`px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider ${group.accent}`}>
                {group.label}
              </div>
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? `${group.accentLight} ${group.accent} font-medium`
                        : "text-sentinel-text-secondary hover:bg-sentinel-bg hover:text-sentinel-text"
                    }`
                  }
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}

          {/* Set up — pinned to bottom */}
          <div className="mt-auto">
            <div className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-sentinel-text-muted border-t border-sentinel-border pt-3">
              Set up
            </div>
            {setupItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-sentinel-surface-alt text-sentinel-text-secondary font-medium"
                      : "text-sentinel-text-secondary hover:bg-sentinel-bg hover:text-sentinel-text"
                  }`
                }
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-sentinel-border bg-sentinel-surface flex items-center px-4 gap-3 flex-shrink-0">
          <button
            className="md:hidden touch-target flex items-center justify-center text-sentinel-text-secondary hover:text-sentinel-text"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Tenant switcher */}
          <div className="relative">
            <button
              onClick={() => setTenantOpen(!tenantOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-sentinel-border hover:border-sentinel-border-strong transition-colors text-sm bg-sentinel-surface"
            >
              <Building2 className="w-4 h-4 text-sentinel-blue" />
              <span className="font-medium text-sentinel-text">{selectedTenant.name}</span>
              <ChevronDown className="w-4 h-4 text-sentinel-text-muted" />
            </button>
            {tenantOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setTenantOpen(false)} />
                <div className="absolute top-full left-0 mt-1 w-64 bg-sentinel-surface border border-sentinel-border rounded-xl shadow-lg z-20 py-1">
                  {tenants.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setSelectedTenant(t);
                        setTenantOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-sentinel-bg transition-colors ${
                        t.id === selectedTenant.id ? "text-sentinel-teal font-medium" : "text-sentinel-text-secondary"
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex-1" />

          {/* Breadcrumb */}
          <div className="hidden sm:flex items-center text-sm text-sentinel-text-muted">
            {currentPage}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="touch-target flex items-center justify-center text-sentinel-text-secondary hover:text-sentinel-amber rounded-lg hover:bg-sentinel-amber-light/50 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          {/* User avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-medium text-xs shadow-glow-teal">
            SC
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
