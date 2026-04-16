import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HeroWipeHeadline() {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["center 85%", "center 15%"],
  });

  const algoClip = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.8, 1],
    [
      "inset(0% 0% 0% 0%)",
      "inset(0% 0% 18% 0%)",
      "inset(0% 0% 50% 0%)",
      "inset(0% 0% 82% 0%)",
      "inset(0% 0% 100% 0%)",
    ]
  );

  const eruditionClip = useTransform(
    scrollYProgress,
    [0, 0.2, 0.5, 0.8, 1],
    [
      "inset(100% 0% 0% 0%)",
      "inset(82% 0% 0% 0%)",
      "inset(50% 0% 0% 0%)",
      "inset(18% 0% 0% 0%)",
      "inset(0% 0% 0% 0%)",
    ]
  );

  const algoOpacity = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    [1, 1, 0.9, 0.75]
  );

  const eruditionOpacity = useTransform(
    scrollYProgress,
    [0, 0.4, 0.6, 1],
    [0.75, 0.9, 1, 1]
  );

  return (
    <div
      ref={ref}
      className="relative mx-auto flex min-h-[260px] w-full items-center justify-center overflow-hidden sm:min-h-[300px] md:min-h-[340px] lg:min-h-[380px]"
    >
      <div className="hero-center-glow absolute inset-0 z-0" />

      {/* ALGOFORGE */}
      <motion.h1
        style={{ clipPath: algoClip, opacity: algoOpacity }}
        className="hero-brand-title hero-animated-gradient absolute inset-0 z-10 flex items-center justify-center text-center font-heading text-[4.6rem] font-extrabold uppercase sm:text-[6.4rem] md:text-[8.2rem] lg:text-[10rem] xl:text-[11.2rem] 2xl:text-[12.5rem]"
      >
        ALGOFORGE
      </motion.h1>

      {/* ERUDITION */}
      <motion.h1
        style={{ clipPath: eruditionClip, opacity: eruditionOpacity }}
        className="hero-brand-title hero-brand-title-soft hero-animated-gradient absolute inset-0 z-20 flex items-center justify-center text-center font-heading text-[4.6rem] font-extrabold uppercase sm:text-[6.4rem] md:text-[8.2rem] lg:text-[10rem] xl:text-[11.2rem] 2xl:text-[12.5rem]"
      >
        ERUDITION
      </motion.h1>
    </div>
  );
}