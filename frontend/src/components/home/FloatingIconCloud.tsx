import { motion } from "framer-motion";
import {
  BrainCircuit,
  Code2,
  Gem,
  Orbit,
  Sparkles,
  Wand2,
} from "lucide-react";

const items = [
  { icon: BrainCircuit, label: "AI Hints" },
  { icon: Code2, label: "Editor" },
  { icon: Orbit, label: "Contests" },
  { icon: Gem, label: "Premium" },
  { icon: Wand2, label: "Workflow" },
  { icon: Sparkles, label: "Polish" },
];

export default function FloatingIconCloud() {
  return (
    <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-3">
      {items.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: index * 0.08 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="group relative overflow-hidden rounded-[1.6rem] border border-border/70 bg-card/65 p-4 text-left shadow-[0_14px_40px_rgba(0,0,0,0.12)] backdrop-blur-2xl"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.15),transparent_26%),radial-gradient(circle_at_bottom_left,hsl(var(--accent)/0.12),transparent_24%)] opacity-80" />
            <div className="relative z-10 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-gradient-to-br from-primary/20 to-accent/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  premium
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}