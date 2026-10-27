import { Shield, Users, Check, X, Clock } from "lucide-react";
import { users, roles, businessUnits } from "@/mock/data";

export function UsersRoles() {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-sentinel-text mb-1">Users & roles</h1>
        <p className="text-sm text-sentinel-text-secondary">
          Manage who can access Sentinel and what they can do. Roles control permissions and which approval chains a user can participate in.
        </p>
      </div>

      {/* Role legend */}
      <div className="bg-sentinel-surface border border-sentinel-border rounded-xl p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-sentinel-teal" />
          <h2 className="text-sm font-bold text-sentinel-text">Roles ({Object.keys(roles).length})</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.values(roles).map((role) => (
            <div key={role.id} className="border border-sentinel-border rounded-lg p-3 bg-sentinel-surface-alt">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded" style={{ backgroundColor: role.color }} />
                <span className="text-sm font-bold text-sentinel-text">{role.name}</span>
                {role.system && <span className="text-[10px] text-sentinel-text-muted font-mono">system</span>}
              </div>
              <div className="flex flex-wrap gap-1">
                {role.perms.map((p) => (
                  <span key={p} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sentinel-surface border border-sentinel-border text-sentinel-text-secondary">{p}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Users table */}
      <div className="bg-sentinel-surface border border-sentinel-border rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-sentinel-border flex items-center gap-2">
          <Users className="w-4 h-4 text-sentinel-teal" />
          <h2 className="text-sm font-bold text-sentinel-text">Users ({users.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sentinel-border bg-sentinel-surface-alt">
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">User</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Role</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide hidden md:table-cell">Business units</th>
                <th className="text-left px-4 py-2.5 font-semibold text-sentinel-text-secondary text-xs uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const role = roles[u.role];
                return (
                  <tr key={u.id} className="border-b border-sentinel-border last:border-b-0 hover:bg-sentinel-surface-alt transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: role?.color }}>{u.initials}</div>
                        <div>
                          <p className="font-medium text-sentinel-text">{u.name}</p>
                          <p className="text-xs text-sentinel-text-muted">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg" style={{ backgroundColor: `${role?.color}20`, color: role?.color }}>
                        {role?.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {u.bus.map((bu) => <span key={bu} className="text-[10px] px-1.5 py-0.5 rounded bg-sentinel-surface-alt border border-sentinel-border text-sentinel-text-secondary">{bu}</span>)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {u.status === "Active" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-sentinel-green-dark"><Check className="w-3 h-3" /> Active</span>
                      ) : u.status === "Invited" ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-sentinel-amber-dark"><Clock className="w-3 h-3" /> Invited</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-sentinel-red-dark"><X className="w-3 h-3" /> Suspended</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
