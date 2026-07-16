import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { eventApi, type EventItem } from "@/lib/api";

type KeyHighlightItem = {
  id: string | number;
  title: string;
  description: string;
  image: string;
  link?: string;
};

type HighlightEvent = EventItem & {
  description?: string;
};

const KeyHighlightsSection = () => {
  const [items, setItems] = useState<KeyHighlightItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let cancelled = false;

    eventApi
      .list("highlight")
      .then((data) => {
        if (cancelled) return;

        const apiHighlights = (data as HighlightEvent[])
            .filter((item) => item.is_active && item.image && item.title)
            .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
            .map((item) => ({
              id: item.id,
              title: item.title,
              description: item.description || item.subtitle || "",
              image: item.images?.[0] || item.image,
              link: `/events/${item.id}`,
            }));

        setItems(apiHighlights);
      })
      .catch((err) => {
        console.warn("Failed to fetch key highlights:", err);
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const visible = useMemo(() => items.filter((i) => i.image && i.title), [items]);
  const activeItem = visible[current] || visible[0];

  const goToPrevious = useCallback(() => {
    setCurrent((index) => (index === 0 ? visible.length - 1 : index - 1));
  }, [visible.length]);

  const goToNext = useCallback(() => {
    setCurrent((index) => (index + 1) % visible.length);
  }, [visible.length]);

  useEffect(() => {
    if (visible.length <= 1) return;

    const timer = window.setInterval(goToNext, 6000);
    return () => window.clearInterval(timer);
  }, [goToNext, visible.length]);

  useEffect(() => {
    setCurrent(0);
  }, [visible.length]);

  if (!loading && visible.length === 0) return null;

  return (
    <section className="bg-background py-16">
      <div className="container">
        <ScrollReveal>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2 text-center">
            Key Highlights
          </h2>
          <p className="text-muted-foreground text-center mb-10">Featured items and important updates</p>
        </ScrollReveal>

        <ScrollReveal variant="fadeUp" delay={0.15}>
          {loading ? (
            <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
              <div className="min-h-[320px] animate-pulse bg-muted md:min-h-[460px]" />
              <div className="space-y-4 border border-border bg-card p-6 md:p-8">
                <div className="h-4 w-24 animate-pulse bg-muted" />
                <div className="h-8 w-3/4 animate-pulse bg-muted" />
                <div className="h-4 w-full animate-pulse bg-muted" />
                <div className="h-4 w-5/6 animate-pulse bg-muted" />
                <div className="h-10 w-32 animate-pulse bg-muted" />
              </div>
            </div>
          ) : activeItem ? (
            <div className="grid overflow-hidden border border-border bg-card shadow-sm lg:grid-cols-[1.35fr_0.65fr]">
              <div className="relative min-h-[320px] bg-muted md:min-h-[460px]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeItem.id}
                    src={activeItem.image}
                    alt={activeItem.title}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.55, ease: "easeOut" }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-black/15" />
              </div>

              <div className="flex flex-col justify-between p-6 md:p-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeItem.id}-content`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                    style={{ position: "relative" }}
                  >
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-primary">
                      Highlight {current + 1} / {visible.length}
                    </p>
                    <h3 className="font-heading text-2xl font-bold leading-tight text-foreground md:text-3xl">
                      {activeItem.title}
                    </h3>
                    {activeItem.description && (
                      <p className="mt-5 text-sm leading-relaxed text-foreground/70 md:text-base">
                        {activeItem.description}
                      </p>
                    )}
                    {activeItem.link && activeItem.link !== "#" && (
                      <a
                        href={activeItem.link}
                        className="mt-7 inline-flex text-xs font-semibold uppercase tracking-widest text-primary hover:underline"
                      >
                        Read More &rarr;
                      </a>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="mt-8 flex items-center justify-between gap-4">
                  <div className="flex gap-2">
                    {visible.map((item, index) => (
                      <button
                        key={item.id}
                        type="button"
                        aria-label={`Show highlight ${index + 1}`}
                        onClick={() => setCurrent(index)}
                        className={`h-2.5 transition-all ${
                          index === current ? "w-8 bg-primary" : "w-2.5 bg-border hover:bg-primary/50"
                        }`}
                      />
                    ))}
                  </div>

                  {visible.length > 1 && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        aria-label="Previous highlight"
                        onClick={goToPrevious}
                        className="flex h-10 w-10 items-center justify-center border border-border bg-background text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        aria-label="Next highlight"
                        onClick={goToNext}
                        className="flex h-10 w-10 items-center justify-center border border-border bg-background text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="overflow-hidden border border-border bg-card shadow-sm">
                  <div className="aspect-[16/10] w-full animate-pulse bg-muted" />
                  <div className="space-y-3 p-6">
                    <div className="h-5 w-3/4 animate-pulse bg-muted" />
                    <div className="h-4 w-full animate-pulse bg-muted" />
                    <div className="h-4 w-2/3 animate-pulse bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
};

export default KeyHighlightsSection;
