import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";

type Props = {
  end: number;
  suffix?: string;
  label: string;
};

export default function HeroCounter({ end, suffix = "", label }: Props) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.35,
  });

  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -6, scale: 1.015 }}
      transition={{ duration: 0.22 }}
      className="group relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/70 p-6 text-left shadow-[0_10px_40px_rgba(0,0,0,0.16)] backdrop-blur-2xl"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.18),transparent_35%),radial-gradient(circle_at_bottom_left,hsl(var(--accent)/0.12),transparent_28%)] opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative z-10">
        <div className="font-heading text-3xl font-black tracking-tight md:text-4xl">
          {inView ? <CountUp end={end} duration={2.2} separator="," /> : 0}
          {suffix}
        </div>
        <p className="mt-2 text-sm uppercase tracking-[0.18em] text-muted-foreground">
          {label}
        </p>
      </div>
    </motion.div>
  );
}