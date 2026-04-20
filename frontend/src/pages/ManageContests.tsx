import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Plus, Trash2, Pencil } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  deleteContestApi,
  listMyCreatedContestsApi,
} from "@/api/contest.api";

export default function ManageContests() {
  const navigate = useNavigate();

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await listMyCreatedContestsApi();
      setItems(res?.data || []);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to load contests"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleDelete = async (id: string) => {
    const ok = window.confirm("Delete this contest?");
    if (!ok) return;

    try {
      await deleteContestApi(id);
      toast.success("Contest deleted");
      setItems((prev) => prev.filter((c) => c.id !== id));
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Delete failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container py-12">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Manage Contests</h1>

          <Button onClick={() => navigate("/create-contest")}>
            <Plus className="mr-2 h-4 w-4" />
            Create Contest
          </Button>
        </div>

        <div className="mt-6">
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-muted-foreground">No contests found</p>
          ) : (
            <div className="grid gap-4">
              {items.map((c) => (
                <div
                  key={c.id}
                  className="p-4 border border-border rounded-xl flex justify-between items-center"
                >
                  <div>
                    <h2 className="text-lg font-semibold">{c.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {new Date(c.startAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigate(`/create-contest/${c.id}`)
                      }
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => handleDelete(c.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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