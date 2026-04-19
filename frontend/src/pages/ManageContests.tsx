import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CalendarClock, PlusSquare } from "lucide-react";
import { getAdminContestsApi } from "@/api/adminContest.api";

export default function ManageContests() {
  const [contests, setContests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminContestsApi()
      .then((res) => setContests(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container grid gap-6 py-8 lg:grid-cols-[280px_1fr]">
        <AdminSidebar />

        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl font-bold">
                Manage Contests
              </h1>
              <p className="mt-2 text-muted-foreground">
                Create, edit and monitor contests.
              </p>
            </div>

            <Link to="/create-contest">
              <Button className="rounded-xl">
                <PlusSquare className="mr-2 h-4 w-4" />
                Create Contest
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="text-muted-foreground">Loading contests...</div>
          ) : contests.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card p-6 text-center text-muted-foreground">
              No contests found. Create your first contest.
            </div>
          ) : (
            <div className="grid gap-4">
              {contests.map((contest) => (
                <div
                  key={contest.id}
                  className="rounded-3xl border border-border bg-card p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="font-heading text-xl font-semibold">
                        {contest.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {contest.description}
                      </p>

                      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CalendarClock className="h-3.5 w-3.5" />
                          {new Date(contest.startTime).toLocaleString()}
                        </span>
                        <span>
                          Duration: {contest.duration} mins
                        </span>
                        <span>
                          {contest.isPublished ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link to={`/edit-contest/${contest.id}`}>
                        <Button variant="outline" className="rounded-xl">
                          Edit
                        </Button>
                      </Link>

                      <Link to={`/contests/${contest.slug}`}>
                        <Button className="rounded-xl">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}