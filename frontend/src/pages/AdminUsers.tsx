import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { Navbar } from "@/components/Navbar";
import {
  blockUserApi,
  listAdminUsersApi,
  unblockUserApi,
  updateUserRoleApi,
} from "@/api/admin.api";
import { Button } from "@/components/ui/button";

export default function AdminUsers() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleRole = async (userId: string, role: string) => {
    try {
      await updateUserRoleApi(userId, role);
      toast.success("Role updated");
      await loadUsers();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to update role");
    }
  };

  const handleBlock = async (userId: string) => {
    try {
      await blockUserApi(userId, "Blocked by admin");
      toast.success("User blocked");
      await loadUsers();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to block user");
    }
  };

  const handleUnblock = async (userId: string) => {
    try {
      await unblockUserApi(userId);
      toast.success("User unblocked");
      await loadUsers();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to unblock user");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container py-12 md:py-16">
        <h1 className="text-4xl font-black">User Moderation</h1>

        {loading ? (
          <div className="mt-8 rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground">
            Loading users...
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {items.map((user) => (
              <div
                key={user.id}
                className="rounded-[1.5rem] border border-border/70 bg-card/60 p-5"
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{user.name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {user.email}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span>Role: {user.role}</span>
                      <span>Plan: {user.plan}</span>
                      <span>Solved: {user.solvedCount}</span>
                      <span>Blocked: {user.isBlocked ? "Yes" : "No"}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      className="rounded-xl"
                      onClick={() => handleRole(user.id, "USER")}
                    >
                      Make USER
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-xl"
                      onClick={() => handleRole(user.id, "CREATOR")}
                    >
                      Make CREATOR
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-xl"
                      onClick={() => handleRole(user.id, "ADMIN")}
                    >
                      Make ADMIN
                    </Button>

                    {user.isBlocked ? (
                      <Button
                        variant="outline"
                        className="rounded-xl"
                        onClick={() => handleUnblock(user.id)}
                      >
                        Unblock
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="rounded-xl border-rose-500/30 text-rose-400"
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
  );
}