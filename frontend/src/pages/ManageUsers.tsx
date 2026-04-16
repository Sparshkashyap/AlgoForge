import { useEffect, useState } from "react";
import { getAdminUsersApi, updateUserRoleApi } from "@/api/adminUser.api";
import { Navbar } from "@/components/Navbar";
import type { User } from "@/types/user.types";

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);

  const loadUsers = async () => {
    const data = await getAdminUsersApi();
    setUsers(data.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (
    userId: string,
    role: "USER" | "CREATOR" | "ADMIN"
  ) => {
    await updateUserRoleApi(userId, role);
    await loadUsers();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-10">
        <h1 className="font-heading text-4xl font-bold">Manage Users</h1>

        <div className="mt-8 space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="rounded-3xl border border-border bg-card p-5 flex items-center justify-between gap-4"
            >
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Submissions: {user._count?.submissions ?? 0} • Problems: {user._count?.problems ?? 0}
                </p>
              </div>

              <select
                value={user.role}
                onChange={(e) =>
                  handleRoleChange(
                    user.id,
                    e.target.value as "USER" | "CREATOR" | "ADMIN"
                  )
                }
                className="h-11 rounded-xl border border-border bg-background px-4"
              >
                <option value="USER">USER</option>
                <option value="CREATOR">CREATOR</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}