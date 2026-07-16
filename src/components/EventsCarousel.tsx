import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import { eventApi, type EventItem } from "@/lib/api";

const EventsCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  useEffect(() => {
    eventApi.list("highlight")
      .then(data => {
        if (data.length > 0) {
          setEvents(data.filter(e => e.is_active).map(e => ({
            image: e.images?.[0] || e.image,
            title: e.title,
            link: `/events/${e.id}`
          })));
        }
      })
      .catch(err => console.warn("Failed to fetch events:", err))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && events.length === 0) return null;

  const scroll = (dir: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 320, behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="flex items-center justify-between mb-10">
          <ScrollReveal>
            <div className="text-left">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                Key Highlights
              </h2>
              <div className="w-12 h-1 bg-primary mt-2" />
            </div>
          </ScrollReveal>

          {!loading && (
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scroll(-1)}
                className="w-10 h-10 rounded-lg border border-border bg-background flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scroll(1)}
                className="w-10 h-10 rounded-lg border border-border bg-background flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          )}
        </div>

        <div className="relative">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
            </div>
          ) : (
            <>
              <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 -mx-4 px-4 sm:mx-0 sm:px-0"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {events.map((event, i) => (
                  <ScrollReveal key={i} delay={i * 0.08} variant="scaleIn" className="flex-shrink-0 w-[300px]">
                    <motion.div
                      className="block group cursor-pointer"
                      whileHover={{ y: -6 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      onClick={() => setSelectedImg(event.image)}
                      style={{ position: "relative" }}
                    >
                      <div className="relative overflow-hidden rounded-xl aspect-[4/3] bg-muted">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30 text-white">
                            <motion.svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                              initial={{ scale: 0.8 }}
                              animate={{ scale: 1 }}
                            >
                              <path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/>
                            </motion.svg>
                          </div>
                        </div>
                      </div>
                      <h3 className="mt-4 font-heading text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                        {event.title}
                      </h3>
                      {event.link && event.link !== "#" && (
                        <a 
                          href={event.link}
                          onClick={(e) => e.stopPropagation()}
                          className="mt-2 inline-flex items-center text-primary text-xs font-semibold uppercase tracking-widest hover:underline"
                        >
                          Official Link &rarr;
                        </a>
                      )}
                    </motion.div>
                  </ScrollReveal>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            {/* Close button - Top Right of screen */}
            <button 
              onClick={() => setSelectedImg(null)}
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-[110] p-2 hover:bg-white/10 rounded-full"
            >
              <X size={32} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={() => setSelectedImg(null)}
              className="relative max-w-5xl w-full h-full flex items-center justify-center cursor-zoom-out"
            >
              <img 
                src={selectedImg} 
                alt="Highlight detail" 
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default EventsCarousel;
