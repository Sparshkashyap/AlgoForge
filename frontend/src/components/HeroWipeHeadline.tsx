import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export default function HeroWipeHeadline() {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["center 62%", "center 38%"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 28,
    mass: 0.32,
  });

  // tighter center-focused wipe
  const algoClip = useTransform(
    smooth,
    [0, 0.35, 0.5, 0.65, 1],
    [
      "inset(0% 0% 0% 0%)",
      "inset(0% 0% 18% 0%)",
      "inset(0% 0% 50% 0%)",
      "inset(0% 0% 82% 0%)",
      "inset(0% 0% 100% 0%)",
    ]
  );

  const eruditionClip = useTransform(
    smooth,
    [0, 0.35, 0.5, 0.65, 1],
    [
      "inset(100% 0% 0% 0%)",
      "inset(82% 0% 0% 0%)",
      "inset(50% 0% 0% 0%)",
      "inset(18% 0% 0% 0%)",
      "inset(0% 0% 0% 0%)",
    ]
  );

  const algoOpacity = useTransform(
    smooth,
    [0, 0.42, 0.5, 0.58, 1],
    [1, 0.98, 0.92, 0.84, 0.72]
  );

  const eruditionOpacity = useTransform(
    smooth,
    [0, 0.42, 0.5, 0.58, 1],
    [0.72, 0.84, 0.92, 0.98, 1]
  );

  return (
    <div
      ref={ref}
      className="relative mx-auto flex w-full items-center justify-center overflow-visible px-4 sm:px-6 md:min-h-[320px] lg:min-h-[380px]"
    >
      <div className="hero-center-glow absolute inset-0 z-0" />

      <motion.h1
        style={{ clipPath: algoClip, opacity: algoOpacity }}
        className="hero-brand-title hero-animated-gradient absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 px-4 text-center font-heading text-[4.6rem] font-extrabold uppercase sm:text-[6.4rem] md:text-[8.2rem] lg:text-[10rem] xl:text-[11.2rem] 2xl:text-[12.5rem]"
      >
        ALGOFORGE
      </motion.h1>

      <motion.h1
        style={{ clipPath: eruditionClip, opacity: eruditionOpacity }}
        className="hero-brand-title hero-brand-title-soft hero-animated-gradient absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 px-4 text-center font-heading text-[4.6rem] font-extrabold uppercase sm:text-[6.4rem] md:text-[8.2rem] lg:text-[10rem] xl:text-[11.2rem] 2xl:text-[12.5rem]"
      >
        ERUDITION
      </motion.h1>
    </div>
  );
}