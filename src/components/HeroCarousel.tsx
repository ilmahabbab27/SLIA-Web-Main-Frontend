import { useState, useEffect, useCallback } from "react";

import { motion, AnimatePresence } from "framer-motion";

const slides = [
  { image: "/images/hero-1.jpg", label: "Annual Subscriptions", heading: "Shaping the Future of Architecture", sub: "Join the premier professional body for architects in Sri Lanka" },
  { image: "/images/hero-2.jpg", label: "Annual Subscriptions", heading: "Excellence in Design", sub: "Celebrating innovation and creativity in architectural practice" },
  { image: "/images/hero-3.jpg", label: "Annual Subscriptions", heading: "Building Communities", sub: "Architecture that transforms lives and inspires generations" },
  { image: "/images/hero-4.jpg", label: "Annual Subscriptions", heading: "Heritage & Modernity", sub: "Bridging Sri Lanka's rich architectural heritage with contemporary vision" },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % slides.length);
  }, []);


  useEffect(() => {
    const timer = setInterval(next, 7000); // Increased duration to 7 seconds
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
      <AnimatePresence custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={slides[current].image}
            alt={`Sri Lankan architecture ${current + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="hero-overlay absolute inset-0" />
        </motion.div>
      </AnimatePresence>

      {/* Animated text overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="text-center px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 drop-shadow-lg">
                {slides[current].heading}
              </h1>
              <p className="text-primary-foreground/80 text-lg md:text-xl font-bold max-w-2xl mx-auto">
                {slides[current].sub}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* CTA Button */}
      <div className="absolute top-6 right-6 z-10">
        <motion.a
          href="#"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-background/90 backdrop-blur-sm text-foreground px-6 py-3 text-sm font-medium border border-border hover:bg-background transition-colors inline-block"
        >
          Annual Subscriptions
        </motion.a>
      </div>



      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-50">
        {slides.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
            className={`h-3 rounded-full shadow-md transition-all ${i === current ? "bg-white" : "bg-white/40 hover:bg-white/60"}`}
            animate={{ width: i === current ? 32 : 12 }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
