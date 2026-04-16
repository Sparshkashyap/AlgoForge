import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="theme-toggle-btn group relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-border/70 bg-card/70 backdrop-blur-xl transition"
    >
      {/* Glow */}
      <span className="theme-toggle-glow absolute inset-0" />

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