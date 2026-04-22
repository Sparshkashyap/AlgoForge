import { toast } from "react-toastify";
import { Download, FileSpreadsheet } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import AdminSidebar from "@/components/AdminSidebar";
import { Button } from "@/components/ui/button";
import {
  downloadProblemsExportApi,
  downloadSubmissionsExportApi,
  downloadUsersExportApi,
} from "@/api/export.api";

const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
};

export default function AdminExports() {
  const handleDownloadUsers = async () => {
    try {
      const blob = await downloadUsersExportApi();
      downloadBlob(blob, "users.csv");
    } catch {
      toast.error("Failed to export users");
    }
  };

  const handleDownloadSubmissions = async () => {
    try {
      const blob = await downloadSubmissionsExportApi();
      downloadBlob(blob, "submissions.csv");
    } catch {
      toast.error("Failed to export submissions");
    }
  };

  const handleDownloadProblems = async () => {
    try {
      const blob = await downloadProblemsExportApi();
      downloadBlob(blob, "problems.csv");
    } catch {
      toast.error("Failed to export problems");
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
                Admin Exports
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Export raw platform data directly. No fake buttons. Actual downloads.
              </p>
            </div>

            <div className="grid gap-4 md:max-w-2xl">
              <div className="rounded-[1.6rem] border border-border/70 bg-card/75 p-5">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Users export</p>
                    <p className="text-sm text-muted-foreground">
                      Download registered users, roles, plans, and status.
                    </p>
                  </div>
                </div>

                <Button className="mt-5 rounded-xl" onClick={handleDownloadUsers}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Users CSV
                </Button>
              </div>

              <div className="rounded-[1.6rem] border border-border/70 bg-card/75 p-5">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Submissions export</p>
                    <p className="text-sm text-muted-foreground">
                      Download submission records for review and analysis.
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="mt-5 rounded-xl"
                  onClick={handleDownloadSubmissions}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Submissions CSV
                </Button>
              </div>

              <div className="rounded-[1.6rem] border border-border/70 bg-card/75 p-5">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-semibold">Problems export</p>
                    <p className="text-sm text-muted-foreground">
                      Download problem inventory with publishing and premium flags.
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="mt-5 rounded-xl"
                  onClick={handleDownloadProblems}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Problems CSV
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}