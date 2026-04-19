// components/SplashScreen.tsx

import { AnimatePresence, motion } from "framer-motion";
import { BrandLogo } from "@/components/BrandLogo";

export default function SplashScreen({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] overflow-hidden bg-black"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,92,255,0.14),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.08),transparent_24%)]" />

          {/* opening line */}
          <motion.div
            initial={{ scaleY: 0, opacity: 0.9 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-0 h-full w-[2px] origin-center -translate-x-1/2 bg-gradient-to-b from-transparent via-fuchsia-500 to-transparent shadow-[0_0_30px_rgba(236,72,153,0.65)]"
          />

          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-0 h-full w-[8px] origin-center -translate-x-1/2 bg-gradient-to-b from-transparent via-primary to-transparent blur-[10px]"
          />

          {/* curtain opens first */}
          <motion.div
            initial={{ clipPath: "inset(0 50% 0 50%)", opacity: 0 }}
            animate={{ clipPath: "inset(0 0% 0 0%)", opacity: 1 }}
            transition={{ delay: 0.24, duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-background" />
          </motion.div>

          {/* logo comes after curtain open */}
          <motion.div
            initial={{ opacity: 0, scale: 0.82, y: 24 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.82, 1, 1.1, 1.85],
              y: [24, 0, -6, -14],
            }}
            transition={{
              delay: 0.9,
              duration: 1.5,
              times: [0, 0.25, 0.62, 1],
              ease: [0.22, 1, 0.36, 1],
            }}
            className="absolute inset-0 z-10 flex items-center justify-center"
          >
            {/* water/sun spread */}
            <motion.div
              initial={{ opacity: 0, scale: 0.45 }}
              animate={{
                opacity: [0, 0.36, 0.22, 0],
                scale: [0.45, 1.05, 1.7, 2.4],
              }}
              transition={{
                delay: 1.02,
                duration: 1.25,
                times: [0, 0.3, 0.7, 1],
                ease: "easeOut",
              }}
              className="absolute h-44 w-44 rounded-full bg-primary/25 blur-3xl"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.55 }}
              animate={{
                opacity: [0, 0.22, 0.12, 0],
                scale: [0.55, 1.2, 2, 2.9],
              }}
              transition={{
                delay: 1.08,
                duration: 1.35,
                times: [0, 0.35, 0.72, 1],
                ease: "easeOut",
              }}
              className="absolute h-56 w-56 rounded-full bg-cyan-400/18 blur-[80px]"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.92, 1, 1.03, 1.08],
              }}
              transition={{
                delay: 0.9,
                duration: 1.45,
                times: [0, 0.28, 0.7, 1],
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.03] px-8 py-6 backdrop-blur-2xl"
            >
              {/* writing wipe on logo text area */}
              <motion.div
                initial={{ x: "-120%", opacity: 0 }}
                animate={{
                  x: ["-120%", "0%", "110%"],
                  opacity: [0, 0.75, 0],
                }}
                transition={{
                  delay: 1.02,
                  duration: 0.95,
                  times: [0, 0.4, 1],
                  ease: "easeInOut",
                }}
                className="pointer-events-none absolute inset-y-0 left-0 z-20 w-[42%] skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/35 to-transparent blur-[2px]"
              />

              <BrandLogo />
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}