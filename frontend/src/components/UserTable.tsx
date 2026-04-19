import { useMemo, useState } from "react";
import {
  Crown,
  Search,
  ShieldCheck,
  UserCircle2,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type UserRow = {
  id: string | number;
  name: string;
  email: string;
  role?: string;
  plan?: string;
  createdAt?: string;
};

type Props = {
  users: UserRow[];
  onView?: (user: UserRow) => void;
  onEdit?: (user: UserRow) => void;
  onDelete?: (user: UserRow) => void;
};

function formatDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
}

function getRoleClasses(role?: string) {
  const value = String(role || "USER").toUpperCase();

  if (value === "ADMIN") {
    return "border-rose-500/20 bg-rose-500/10 text-rose-400";
  }

  if (value === "CREATOR") {
    return "border-amber-500/20 bg-amber-500/10 text-amber-400";
  }

  return "border-emerald-500/20 bg-emerald-500/10 text-emerald-400";
}

function getPlanClasses(plan?: string) {
  const value = String(plan || "FREE").toUpperCase();

  if (value === "PRO") {
    return "border-primary/20 bg-primary/10 text-primary";
  }

  if (value === "STANDARD") {
    return "border-sky-500/20 bg-sky-500/10 text-sky-400";
  }

  return "border-border/70 bg-background/60 text-muted-foreground";
}

export default function UserTable({
  users,
  onView,
  onEdit,
  onDelete,
}: Props) {
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;

    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        String(user.role || "").toLowerCase().includes(q) ||
        String(user.plan || "").toLowerCase().includes(q)
      );
    });
  }, [users, search]);

  return (
    <div className="rounded-[1.8rem] border border-border/70 bg-card/75 p-5 backdrop-blur-2xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/55 px-3 py-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
            <Users className="h-3.5 w-3.5 text-primary" />
            User management
          </div>

          <h3 className="mt-4 font-heading text-2xl font-black">
            Platform users
          </h3>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            Search users, inspect roles and plans, and take quick admin actions.
          </p>
        </div>

        <div className="relative w-full max-w-sm">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, role, or plan"
            className="h-12 rounded-2xl border-border/70 bg-background/55 pl-11"
          />
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-[1.4rem] border border-border/70">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px]">
            <thead className="bg-background/65">
              <tr className="border-b border-border/70 text-left">
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  User
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Role
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Plan
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Joined
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-sm text-muted-foreground"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-border/60 bg-card/45 transition hover:bg-background/35"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] border border-border/70 bg-gradient-to-br from-primary/15 to-accent/10">
                          <UserCircle2 className="h-5 w-5 text-primary" />
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-foreground">
                            {user.name}
                          </p>
                          <p className="truncate text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${getRoleClasses(
                          user.role
                        )}`}
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                        {String(user.role || "USER")}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${getPlanClasses(
                          user.plan
                        )}`}
                      >
                        <Crown className="h-3.5 w-3.5" />
                        {String(user.plan || "FREE")}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        {onView ? (
                          <Button
                            type="button"
                            variant="outline"
                            className="rounded-xl border-border/70 bg-background/55"
                            onClick={() => onView(user)}
                          >
                            View
                          </Button>
                        ) : null}

                        {onEdit ? (
                          <Button
                            type="button"
                            variant="outline"
                            className="rounded-xl border-border/70 bg-background/55"
                            onClick={() => onEdit(user)}
                          >
                            Edit
                          </Button>
                        ) : null}

                        {onDelete ? (
                          <Button
                            type="button"
                            variant="outline"
                            className="rounded-xl border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/15 hover:text-rose-300"
                            onClick={() => onDelete(user)}
                          >
                            Delete
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}