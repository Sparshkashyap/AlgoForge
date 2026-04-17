import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getAdminProblemsApi } from "@/api/adminProblem.api";
import { useEffect, useMemo, useState } from "react";

export default function CreatorDashboard() {
  const { user } = useAuth();
  const [problems, setProblems] = useState<any[]>([]);

  useEffect(() => {
    getAdminProblemsApi().then((data) => setProblems(data.data || []));
  }, []);

  const mine = useMemo(
    () => problems.filter((item) => item.createdBy?.id === user?.id),
    [problems, user]
  );

  const published = mine.filter((item) => item.isPublished).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-10">
        <h1 className="font-heading text-4xl font-bold">Creator Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome, {user?.name}. Create and manage coding problems here.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">My Problems</p>
            <p className="mt-2 text-3xl font-bold">{mine.length}</p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">Published</p>
            <p className="mt-2 text-3xl font-bold">{published}</p>
          </div>
          <div className="rounded-3xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">Drafts</p>
            <p className="mt-2 text-3xl font-bold">{mine.length - published}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Link to="/create-problem">
            <Button>Create Problem</Button>
          </Link>
          <Link to="/manage-problems">
            <Button variant="outline">Manage Problems</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}