import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function AdminExports() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-10">
        <h1 className="font-heading text-4xl font-bold">CSV Exports</h1>
        <p className="mt-2 text-muted-foreground">
          Download admin reports for users and problems.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <a href={`${API_BASE}/export/users.csv`} target="_blank" rel="noreferrer">
            <Button className="rounded-xl">Export Users CSV</Button>
          </a>

          <a href={`${API_BASE}/export/problems.csv`} target="_blank" rel="noreferrer">
            <Button variant="outline" className="rounded-xl">
              Export Problems CSV
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}