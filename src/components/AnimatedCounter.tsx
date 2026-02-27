import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  label: string;
}

const AnimatedCounter = ({ target, suffix = "", prefix = "", duration = 2000, className = "", label }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!isInView || hasStarted.current) return;
    hasStarted.current = true;

    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return (
    <div ref={ref} className={`text-center ${className}`}>
      <div className="font-heading text-4xl md:text-5xl font-bold text-primary">
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <p className="text-muted-foreground text-sm mt-2 uppercase tracking-wider">{label}</p>
    </div>
  );
};

export default AnimatedCounter;
