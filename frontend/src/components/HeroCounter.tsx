import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

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
    <div
      ref={ref}
      className="rounded-3xl border border-border bg-card/70 p-6 backdrop-blur-xl"
    >
      <div className="font-heading text-3xl font-bold md:text-4xl">
        {inView ? <CountUp end={end} duration={2.2} separator="," /> : 0}
        {suffix}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}