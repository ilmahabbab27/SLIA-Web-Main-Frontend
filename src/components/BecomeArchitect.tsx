import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import ScrollReveal from "./ScrollReveal";

const BecomeArchitect = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section ref={ref} className="relative py-20 overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/hero-2.jpg)", y: backgroundY }}
      />
      <div className="absolute inset-0 bg-foreground/70" />

      <div className="container relative z-10 text-center">
        <ScrollReveal variant="blur">
          <p className="text-primary font-semibold uppercase tracking-wider text-sm mb-4">
            Become an Architect
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Chartered Architect
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <p className="text-lg text-primary-foreground/70 uppercase tracking-wider mb-6">
            Pathways to Become a Chartered Architect in Sri Lanka
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.3}>
          <p className="text-primary-foreground/60 max-w-xl mx-auto mb-8">
            Becoming a registered architect involves a combination of education,
            experience, and examination.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-sm uppercase tracking-wider font-semibold">
              Read More
            </Button>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default BecomeArchitect;
