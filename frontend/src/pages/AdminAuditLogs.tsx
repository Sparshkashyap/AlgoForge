import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { Navbar } from "@/components/Navbar";
import { listAuditLogsApi } from "@/api/admin.api";

export default function AdminAuditLogs() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await listAuditLogsApi();
        setItems(res?.data || []);
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to load audit logs");
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="container py-12 md:py-16">
        <h1 className="text-4xl font-black">Audit Logs</h1>

        {loading ? (
          <div className="mt-8 rounded-3xl border border-border bg-card p-6 text-sm text-muted-foreground">
            Loading audit logs...
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {items.map((log) => (
              <div
                key={log.id}
                className="rounded-[1.5rem] border border-border/70 bg-card/60 p-5"
              >
                <p className="text-sm font-semibold">{log.action}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Actor: {log.actorUser?.email || "-"} | Target:{" "}
                  {log.targetUser?.email || "-"}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}