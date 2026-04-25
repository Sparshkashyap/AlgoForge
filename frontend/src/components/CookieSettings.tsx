import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { X } from "lucide-react";
import { useCookies } from "@/context/CookieContext";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CookieSettingsModal({ open, onClose }: Props) {
  const { savePreferences } = useCookies();

  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  const handleSave = () => {
    savePreferences({
      necessary: true,
      analytics,
      marketing,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-[92%] max-w-[480px] rounded-[1.6rem] border border-white/10 bg-background p-6 shadow-[0_30px_100px_rgba(0,0,0,0.6)]"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Manage cookies</h2>
              <button onClick={onClose}>
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-sm">

              {/* Necessary */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Necessary</p>
                  <p className="text-xs text-muted-foreground">
                    Required for basic functionality
                  </p>
                </div>
                <span className="text-xs text-green-500 font-semibold">
                  Always On
                </span>
              </div>

              {/* Analytics */}
              <Toggle
                label="Analytics"
                description="Usage tracking and performance"
                checked={analytics}
                onChange={setAnalytics}
              />

              {/* Marketing */}
              <Toggle
                label="Marketing"
                description="Personalized ads and tracking"
                checked={marketing}
                onChange={setMarketing}
              />
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save preferences
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* Toggle component */
function Toggle({
  label,
  description,
  checked,
  onChange,
}: any) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      <button
        onClick={() => onChange(!checked)}
        className={`h-6 w-11 rounded-full transition ${
          checked ? "bg-primary" : "bg-muted"
        }`}
      >
        <div
          className={`h-5 w-5 rounded-full bg-white transition ${
            checked ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}