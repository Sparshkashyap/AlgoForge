import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Settings2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCookies } from "@/context/CookieContext";
import CookieSettingsModal from "@/components/CookieSettings";

export default function CookieBanner() {
  const { preferences, acceptAll, rejectAll } = useCookies();

  const [show, setShow] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);

  useEffect(() => {
    if (!preferences) {
      const timer = window.setTimeout(() => setShow(true), 500);
      return () => window.clearTimeout(timer);
    }

    setShow(false);
  }, [preferences]);

  if (preferences) return null;

  return (
    <>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ y: 80, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            className="fixed bottom-4 left-4 right-4 z-[9999] max-w-[640px]"
          >
            <div className="relative overflow-hidden rounded-[1.6rem] border border-border/70 bg-background/95 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:p-5">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.12),transparent_36%)]" />

              <div className="relative flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="break-words text-sm font-black sm:text-base">
                      We use cookies
                    </p>

                    <p className="mt-1 break-words text-xs leading-6 text-muted-foreground sm:text-sm">
                      Improve experience, analytics, and personalization. You can
                      control your preferences anytime.
                    </p>
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setOpenSettings(true)}
                    className="w-full rounded-full border-border/70 bg-background/70"
                  >
                    <Settings2 className="mr-2 h-4 w-4" />
                    Manage
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={rejectAll}
                    className="w-full rounded-full"
                  >
                    Reject
                  </Button>

                  <Button
                    type="button"
                    size="sm"
                    onClick={acceptAll}
                    className="w-full rounded-full bg-gradient-to-r from-primary to-indigo-500 text-white shadow-[0_12px_30px_rgba(99,102,241,0.28)]"
                  >
                    Accept All
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CookieSettingsModal
        open={openSettings}
        onClose={() => setOpenSettings(false)}
      />
    </>
  );
}