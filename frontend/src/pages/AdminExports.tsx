import { toast } from "react-toastify";
import { Download } from "lucide-react";

import { Navbar } from "@/components/Navbar";
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

      <div className="container py-12 md:py-16">
        <h1 className="text-4xl font-black">Admin Exports</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Export raw platform data directly. No fluff, just downloads.
        </p>

        <div className="mt-8 grid gap-4 md:max-w-xl">
          <Button className="rounded-xl" onClick={handleDownloadUsers}>
            <Download className="mr-2 h-4 w-4" />
            Export Users CSV
          </Button>

          <Button
            variant="outline"
            className="rounded-xl"
            onClick={handleDownloadSubmissions}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Submissions CSV
          </Button>

          <Button
            variant="outline"
            className="rounded-xl"
            onClick={handleDownloadProblems}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Problems CSV
          </Button>
        </div>
      </div>
    </div>
  );
}