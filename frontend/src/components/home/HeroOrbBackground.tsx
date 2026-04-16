import { motion } from "framer-motion";

export default function HeroOrbBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[-8rem] top-16 h-[24rem] w-[24rem] rounded-full bg-primary/16 blur-[90px] md:h-[34rem] md:w-[34rem]"
      />
      <motion.div
        animate={{ x: [0, -60, 25, 0], y: [0, 30, -10, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute right-[-10rem] top-10 h-[20rem] w-[20rem] rounded-full bg-accent/14 blur-[90px] md:h-[30rem] md:w-[30rem]"
      />
      <motion.div
        animate={{ x: [0, 30, -30, 0], y: [0, 20, -25, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-8rem] left-1/2 h-[18rem] w-[18rem] -translate-x-1/2 rounded-full bg-primary/10 blur-[95px] md:h-[24rem] md:w-[24rem]"
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_24%),linear-gradient(180deg,transparent,rgba(255,255,255,0.02))]" />
    </div>
  );
}