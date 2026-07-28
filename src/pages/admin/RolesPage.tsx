import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Users, Check, X } from "lucide-react";
import { adminRoles, allPermissions, type AdminRole, type Permission } from "@/lib/admin-data";
import { Button } from "@/components/primitives/Button";
import { cn } from "@/lib/utils";

export function AdminRolesPage() {
  const [roles] = useState(adminRoles);
  const [selectedRole, setSelectedRole] = useState<AdminRole | null>(null);

  const hasPermission = (role: AdminRole, permKey: string): boolean => {
    if (role.permissions.includes("all")) return true;
    return role.permissions.some((p) => permKey.startsWith(p));
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl text-[color:var(--color-text-primary)] md:text-3xl">Roles & Permissions</h1>
        <p className="mt-0.5 text-sm text-[color:var(--color-text-secondary)]">Manage roles and access control</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="grid gap-4 sm:grid-cols-3">
          {roles.map((role, i) => (
            <motion.button
              key={role.id}
              type="button"
              onClick={() => setSelectedRole(role)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn("rounded-2xl border p-5 text-left transition-all", selectedRole?.id === role.id ? "border-[color:var(--color-accent-teal)] ring-2 ring-[color:var(--color-accent-teal)]/20" : "border-[color:var(--color-border)] hover:border-[color:var(--color-accent-teal)]/50")}
            >
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-white", role.color)}>
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-[color:var(--color-text-primary)]">{role.name}</h3>
              <p className="mt-1 text-[10px] text-[color:var(--color-text-tertiary)]">{role.description}</p>
              <div className="mt-3 flex items-center gap-1 text-[10px] text-[color:var(--color-text-tertiary)]">
                <Users className="h-3 w-3" />
                <span>{role.users} users</span>
              </div>
            </motion.button>
          ))}
        </div>

        <motion.div key={selectedRole?.id || "none"} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-5">
          <h3 className="text-sm font-semibold text-[color:var(--color-text-primary)]">
            {selectedRole ? `${selectedRole.name} Permissions` : "Select a role to view permissions"}
          </h3>
          {selectedRole && (
            <div className="mt-4 space-y-4">
              {allPermissions.map((perm) => {
                const granted = hasPermission(selectedRole, perm.id);
                return (
                  <div key={perm.id} className={cn("rounded-xl border p-3", granted ? "border-emerald-500/20 bg-emerald-500/5" : "border-[color:var(--color-border)]")}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-[color:var(--color-text-primary)]">{perm.module}</span>
                      {granted ? <Check className="h-4 w-4 text-emerald-500" /> : <X className="h-4 w-4 text-[color:var(--color-text-tertiary)]" />}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {perm.actions.map((action) => (
                        <span key={action.key} className={cn("rounded-lg px-2 py-0.5 text-[10px] font-medium", granted ? "bg-emerald-500/10 text-emerald-600" : "bg-[color:var(--color-surface-muted)] text-[color:var(--color-text-tertiary)]")}>
                          {action.label}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
