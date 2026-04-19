import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-11 w-11 rounded-full border border-border/70 bg-card/70" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-border/70 bg-card/70 backdrop-blur-xl transition hover:scale-[1.04]"
    >
      <span className="absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-gradient-to-br from-primary/10 to-pink-500/10" />

      {/* Sun */}
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? -90 : 0,
          scale: isDark ? 0.6 : 1,
          opacity: isDark ? 0 : 1,
        }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="absolute"
      >
        <Sun className="h-5 w-5 text-yellow-400" />
      </motion.div>

      {/* Moon */}
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 0 : 90,
          scale: isDark ? 1 : 0.6,
          opacity: isDark ? 1 : 0,
        }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="absolute"
      >
        <Moon className="h-5 w-5 text-blue-400" />
      </motion.div>
    </button>
  );
}