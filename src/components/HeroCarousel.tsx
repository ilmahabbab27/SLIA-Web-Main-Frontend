import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { heroApi, heroButtonApi, tickerApi, type HeroSlide as ApiSlide, type HeroButton, type TickerItem } from "@/lib/api";

type Slide = { image: string; tag: string; heading: string; sub: string; link: string };

const heroSlidesCacheKey = "slia_home_hero_slides";

const mapApiSlide = (s: ApiSlide): Slide => ({
  image:   s.image,
  tag:     s.tag     || "News & Events",
  heading: s.title   || "",
  sub:     s.description || "",
  link:    s.link    || "#",
});

const getCachedSlides = (): Slide[] => {
  if (typeof window === "undefined") return [];

  try {
    const cached = window.localStorage.getItem(heroSlidesCacheKey);
    const parsed = cached ? JSON.parse(cached) : [];
    return Array.isArray(parsed) ? parsed.filter((slide) => slide?.image) : [];
  } catch {
    return [];
  }
};

// ------------------------------------------------------------------ component
const HeroCarousel = () => {
  const [current,   setCurrent]   = useState(0);
  const [direction, setDirection] = useState(1);
  const [slides,    setSlides]    = useState<Slide[]>(getCachedSlides);
  const [buttons,   setButtons]   = useState<HeroButton[]>([]);
  const [tickers,   setTickers]   = useState<TickerItem[]>([]);

  // ---- fetch slides + buttons + tickers from API on mount -----------------------
  useEffect(() => {
    let cancelled = false;

    const fetchAll = async () => {
      try {
        const [slidesRes, btnsRes, tickersRes] = await Promise.allSettled([
          heroApi.list(),
          heroButtonApi.list(),
          tickerApi.list(),
        ]);

        if (cancelled) return;

        if (slidesRes.status === "fulfilled" && slidesRes.value.length > 0) {
          const freshSlides = slidesRes.value.map(mapApiSlide).filter((slide) => slide.image);
          setSlides(freshSlides);
          setCurrent(0);
          window.localStorage.setItem(heroSlidesCacheKey, JSON.stringify(freshSlides));
        }
        if (btnsRes.status === "fulfilled" && btnsRes.value.length > 0) {
          setButtons(btnsRes.value.filter((b) => b.is_active));
        }
        if (tickersRes.status === "fulfilled" && tickersRes.value.length > 0) {
          setTickers(tickersRes.value.filter(t => t.is_active));
        }
      } catch (err) {
        console.warn("HeroCarousel: API fetch failed.", err);
      }
    };

    fetchAll();
    return () => { cancelled = true; };
  }, []);

  // ---- auto-advance ----------------------------------------------------
  const next = useCallback(() => {
    if (slides.length === 0) return;
    setDirection(1);
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">

      {/* Slides */}
      {slides.length > 0 && (
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
            alt={slides[current].heading}
            className="w-full h-full object-cover"
          />
          <div className="hero-overlay absolute inset-0 bg-black/45" />
        </motion.div>
      </AnimatePresence>
      )}

      {/* Text block */}
      {slides.length > 0 && (
      <div className="absolute bottom-32 left-0 right-0 z-10 container">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-2xl"
            style={{ position: "relative" }}
          >
            <span className="inline-block bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-widest px-3 py-1 mb-4">
              {slides[current].tag}
            </span>
            <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg leading-tight">
              {slides[current].heading}
            </h1>
            {slides[current].sub && (
              <p className="text-white/80 text-base md:text-lg max-w-xl mb-6 line-clamp-3">
                {slides[current].sub}
              </p>
            )}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
              <motion.a
                href={slides[current].link}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-block bg-white text-foreground px-6 py-2.5 text-sm font-semibold tracking-wide hover:bg-white/90 transition-colors shrink-0"
              >
                Read More &rarr;
              </motion.a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      )}

      {/* CTA buttons — loaded from DB */}
      <div className="absolute right-6 top-[112px] z-10 flex w-[230px] flex-col gap-2 sm:right-8 sm:top-1/2 sm:w-auto sm:-translate-y-1/2 sm:gap-3">
        {buttons.map((btn) => (
          <motion.a
            key={btn.id || btn.label}
            href={btn.link || "#"}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block bg-[#b5a07a]/85 px-6 py-3 text-left text-xs font-semibold tracking-widest text-white backdrop-blur-sm transition-colors hover:bg-[#b5a07a] sm:min-w-[260px] sm:px-8 sm:py-4 sm:text-sm"
          >
            {btn.label}
          </motion.a>
        ))}
      </div>

      {/* Dot indicators moved up slightly to make room for full-width ticker */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex gap-2">
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

      {tickers.length > 0 && (
      <div className="absolute bottom-6 left-0 right-0 z-20 overflow-hidden border-y border-white/5 bg-black/30 py-3.5 backdrop-blur-xl">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black/60 to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black/60 to-transparent z-10" />
        
        <motion.div
          animate={{ x: ["100%", "-100%"] }}
          transition={{
            repeat: Infinity,
            duration: tickers.length > 0 ? 40 : 20,
            ease: "linear"
          }}
          className="whitespace-nowrap flex gap-16 items-center"
          style={{ position: "relative" }}
        >
          <>
              {tickers.map((t) => (
                <a 
                  key={t.id} 
                  href={t.link || "#"} 
                  className="text-white/90 text-[11px] font-bold uppercase tracking-[0.25em] hover:text-primary transition-colors flex items-center gap-3"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.6)]" />
                  {t.text}
                </a>
              ))}
              {[1, 2].map((set) => (
                tickers.map((t) => (
                  <a 
                    key={`dup-${set}-${t.id}`} 
                    href={t.link || "#"} 
                    className="text-white/90 text-[11px] font-bold uppercase tracking-[0.25em] hover:text-primary transition-colors flex items-center gap-3"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.6)]" />
                    {t.text}
                  </a>
                ))
              ))}
            </>
        </motion.div>
      </div>
      )}

    </section>
  );
};

export default HeroCarousel;
