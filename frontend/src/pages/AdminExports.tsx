import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Download, FileText, Users } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function AdminExports() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container py-8 md:py-10"
      >
        {/* HEADER */}
        <div className="max-w-3xl">
          <h1 className="font-heading text-4xl font-black md:text-5xl">
            CSV Exports
          </h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">
            Download structured reports for users and problems. Keep exports clean,
            fast, and usable for analysis outside the platform.
          </p>
        </div>

        {/* EXPORT CARDS */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          
          {/* USERS EXPORT */}
          <div className="relative overflow-hidden rounded-[1.8rem] border border-border/70 bg-card/85 p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
            <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-primary/10 to-pink-500/10" />

            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/70 bg-background/60 text-primary">
                  <Users className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    Users Data
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Full user export
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-muted-foreground">
                Includes user roles, plan status, and activity footprint for deeper
                analysis or reporting.
              </p>

              <a
                href={`${API_BASE}/export/users.csv`}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-block"
              >
                <Button className="rounded-xl">
                  <Download className="mr-2 h-4 w-4" />
                  Export Users CSV
                </Button>
              </a>
            </div>
          </div>

          {/* PROBLEMS EXPORT */}
          <div className="relative overflow-hidden rounded-[1.8rem] border border-border/70 bg-card/85 p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_18px_50px_rgba(0,0,0,0.18)]">
            <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-primary/10 to-indigo-500/10" />

            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border/70 bg-background/60 text-primary">
                  <FileText className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    Problems Data
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Problem bank export
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-7 text-muted-foreground">
                Download all problems with metadata including difficulty, tags,
                and publishing state.
              </p>

              <a
                href={`${API_BASE}/export/problems.csv`}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-block"
              >
                <Button variant="outline" className="rounded-xl">
                  <Download className="mr-2 h-4 w-4" />
                  Export Problems CSV
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* NOTE */}
        <div className="mt-10 rounded-[1.6rem] border border-border/70 bg-card/70 p-5 text-sm text-muted-foreground backdrop-blur-xl">
          Exports are generated live. Large datasets may take a few seconds to load depending on size.
        </div>
      </motion.div>
    </div>
  );
}