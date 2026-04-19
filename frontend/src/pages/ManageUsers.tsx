import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ShieldCheck, Users as UsersIcon } from "lucide-react";
import { getAdminUsersApi, updateUserRoleApi } from "@/api/adminUser.api";
import { Navbar } from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import { toast } from "react-toastify";
import type { User } from "@/types/user.types";

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAdminUsersApi();
      setUsers(data.data || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (
    userId: string,
    role: "USER" | "CREATOR" | "ADMIN"
  ) => {
    try {
      setUpdatingUserId(userId);
      await updateUserRoleApi(userId, role);
      toast.success("User role updated");
      await loadUsers();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Role update failed");
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container py-8"
      >
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <AdminSidebar />

          <div>
            <div className="mb-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-4 py-2 text-xs uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-xl">
                <UsersIcon className="h-3.5 w-3.5 text-primary" />
                User control
              </div>

              <h1 className="mt-5 font-heading text-3xl font-black md:text-4xl">
                Manage Users
              </h1>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                Review user accounts, inspect activity, and assign roles cleanly.
                Don’t promote roles casually. Bad access control breaks products fast.
              </p>
            </div>

            {loading ? (
              <div className="rounded-[1.8rem] border border-border/70 bg-card/75 p-8 text-sm text-muted-foreground backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  Loading users...
                </div>
              </div>
            ) : users.length === 0 ? (
              <div className="rounded-[1.8rem] border border-border/70 bg-card/75 p-8 text-sm text-muted-foreground backdrop-blur-xl">
                No users found.
              </div>
            ) : (
              <div className="grid gap-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="rounded-[1.7rem] border border-border/70 bg-card/80 p-5 backdrop-blur-xl transition hover:border-primary/25"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/70 bg-background/55 text-primary">
                            <ShieldCheck className="h-4 w-4" />
                          </div>

                          <h3 className="font-heading text-xl font-bold leading-tight">
                            {user.name}
                          </h3>

                          <span
                            className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                              user.role === "ADMIN"
                                ? "border-rose-500/20 bg-rose-500/10 text-rose-400"
                                : user.role === "CREATOR"
                                ? "border-amber-500/20 bg-amber-500/10 text-amber-400"
                                : "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                            }`}
                          >
                            {user.role}
                          </span>

                          <span className="rounded-full border border-border/70 bg-background/55 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                            {user.plan || "FREE"}
                          </span>
                        </div>

                        <p className="mt-3 text-sm text-muted-foreground">
                          {user.email}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span className="rounded-full border border-border/70 bg-background/55 px-3 py-1">
                            Submissions: {user._count?.submissions ?? 0}
                          </span>
                          <span className="rounded-full border border-border/70 bg-background/55 px-3 py-1">
                            Problems: {user._count?.problems ?? 0}
                          </span>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <select
                          value={user.role}
                          disabled={updatingUserId === user.id}
                          onChange={(e) =>
                            handleRoleChange(
                              user.id,
                              e.target.value as "USER" | "CREATOR" | "ADMIN"
                            )
                          }
                          className="h-11 min-w-[150px] rounded-xl border border-border/70 bg-background px-4"
                        >
                          <option value="USER">USER</option>
                          <option value="CREATOR">CREATOR</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>

                        {updatingUserId === user.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}