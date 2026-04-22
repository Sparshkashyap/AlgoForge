import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  ShieldBan,
  ShieldCheck,
  UserCog,
  Users,
  Camera,
} from "lucide-react";

import { Navbar } from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import {
  blockUserApi,
  listAdminUsersApi,
  unblockUserApi,
  updateUserRoleApi,
} from "@/api/admin.api";
import { updateUserAvatarApi } from "@/api/user.api";
import { Button } from "@/components/ui/button";

export default function AdminUsers() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyUserId, setBusyUserId] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await listAdminUsersApi();
      setItems(res?.data || []);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const stats = useMemo(() => {
    return {
      total: items.length,
      blocked: items.filter((user) => user.isBlocked).length,
      creators: items.filter((user) => user.role === "CREATOR").length,
      admins: items.filter((user) => user.role === "ADMIN").length,
    };
  }, [items]);

  const handleRole = async (userId: string, role: string) => {
    try {
      setBusyUserId(userId);
      await updateUserRoleApi(userId, role);
      toast.success("Role updated");
      await loadUsers();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update role");
    } finally {
      setBusyUserId(null);
    }
  };

  const handleBlock = async (userId: string) => {
    const reason =
      window.prompt("Reason for blocking user") || "Blocked by admin";

    try {
      setBusyUserId(userId);
      await blockUserApi(userId, reason);
      toast.success("User blocked");
      await loadUsers();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to block user");
    } finally {
      setBusyUserId(null);
    }
  };

  const handleUnblock = async (userId: string) => {
    try {
      setBusyUserId(userId);
      await unblockUserApi(userId);
      toast.success("User unblocked");
      await loadUsers();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to unblock user");
    } finally {
      setBusyUserId(null);
    }
  };

  const handleAvatarChange = async (userId: string) => {
    const url = window.prompt("Enter new avatar URL");
    if (!url) return;

    try {
      setBusyUserId(userId);
      await updateUserAvatarApi(userId, url);
      toast.success("Avatar updated");
      await loadUsers();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update avatar");
    } finally {
      setBusyUserId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container py-8">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <AdminSidebar />

          <div>
            <div className="mb-6">
              <h1 className="font-heading text-3xl font-black md:text-4xl">
                User Moderation
              </h1>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                Admin should have full control. Block, unblock, and change roles
                from one clean screen.
              </p>
            </div>

            <div className="mb-6 grid gap-4 md:grid-cols-4">
              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Total
                  </span>
                </div>
                <p className="mt-4 text-3xl font-black">{stats.total}</p>
              </div>

              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <ShieldBan className="h-5 w-5 text-rose-400" />
                  <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Blocked
                  </span>
                </div>
                <p className="mt-4 text-3xl font-black">{stats.blocked}</p>
              </div>

              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <UserCog className="h-5 w-5 text-amber-400" />
                  <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Creators
                  </span>
                </div>
                <p className="mt-4 text-3xl font-black">{stats.creators}</p>
              </div>

              <div className="metric-card">
                <div className="flex items-center justify-between">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    Admins
                  </span>
                </div>
                <p className="mt-4 text-3xl font-black">{stats.admins}</p>
              </div>
            </div>

            {loading ? (
              <div className="rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground">
                Loading users...
              </div>
            ) : (
              <div className="grid gap-4">
                {items.map((user) => (
                  <div
                    key={user.id}
                    className="rounded-[1.5rem] border border-border/70 bg-card/60 p-5"
                  >
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-sm">
                              {user.name?.[0]?.toUpperCase() || "U"}
                            </div>
                          )}

                          <button
                            onClick={() => handleAvatarChange(user.id)}
                            disabled={busyUserId === user.id}
                            className="absolute -bottom-1 -right-1 bg-primary text-white p-1 rounded-full"
                          >
                            <Camera size={14} />
                          </button>
                        </div>

                        <div>
                          <h2 className="text-lg font-semibold">
                            {user.name}
                          </h2>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {user.email}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                            <span>Role: {user.role}</span>
                            <span>Plan: {user.plan}</span>
                            <span>Solved: {user.solvedCount}</span>
                            <span>Streak: {user.streak}</span>
                            <span>
                              Blocked: {user.isBlocked ? "Yes" : "No"}
                            </span>
                          </div>

                          {user.blockedReason && (
                            <p className="mt-3 text-sm text-rose-400">
                              Reason: {user.blockedReason}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          className="rounded-xl"
                          disabled={busyUserId === user.id}
                          onClick={() => handleRole(user.id, "USER")}
                        >
                          USER
                        </Button>

                        <Button
                          variant="outline"
                          className="rounded-xl"
                          disabled={busyUserId === user.id}
                          onClick={() => handleRole(user.id, "CREATOR")}
                        >
                          CREATOR
                        </Button>

                        <Button
                          variant="outline"
                          className="rounded-xl"
                          disabled={busyUserId === user.id}
                          onClick={() => handleRole(user.id, "ADMIN")}
                        >
                          ADMIN
                        </Button>

                        {user.isBlocked ? (
                          <Button
                            variant="outline"
                            className="rounded-xl"
                            disabled={busyUserId === user.id}
                            onClick={() => handleUnblock(user.id)}
                          >
                            Unblock
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            className="rounded-xl border-rose-500/30 text-rose-400"
                            disabled={busyUserId === user.id}
                            onClick={() => handleBlock(user.id)}
                          >
                            Block
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}