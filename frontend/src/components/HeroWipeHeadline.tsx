import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const WORDS = [
  "Crack interviews",
  "Build consistency",
  "Solve with depth",
  "Forge real skill",
];

export default function HeroWipeHeadline() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % WORDS.length);
    }, 2400);

    return () => window.clearInterval(timer);
  }, []);

  const word = useMemo(() => WORDS[index], [index]);

  return (
    <div className="relative overflow-hidden">
      <motion.div
        key={word}
        initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0.4 }}
        animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
        exit={{ clipPath: "inset(0 0 0 100%)", opacity: 0.3 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="inline-block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
      >
        {word}
      </motion.div>
    </div>
  );
}