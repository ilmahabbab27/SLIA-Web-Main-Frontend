import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";
import { eventApi, type EventItem } from "@/lib/api";
import { Loader2 } from "lucide-react";

const SliaEventsSection = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventApi.list("program")
      .then(data => {
        setEvents(data.filter(e => e.is_active));
      })
      .catch(err => console.warn("Failed to fetch program events:", err))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && events.length === 0) return null;

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <ScrollReveal>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">
            SLIA Events
          </h2>
          <p className="text-muted-foreground text-center mb-8">Explore events and key annual programs</p>
        </ScrollReveal>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
          </div>
        ) : (
          <ScrollReveal variant="fadeUp" delay={0.2}>
            <div className="grid gap-6 md:grid-cols-3">
              {events.map((c, i) => (
                <motion.div
                  key={c.id}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden flex flex-col h-full"
                  style={{ position: "relative" }}
                >
                  <div className="w-full aspect-[16/10] bg-muted overflow-hidden shrink-0">
                    {c.image ? (
                      <img src={c.image} alt={c.title} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary/20">
                        <span className="font-bold text-4xl">{c.title.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-heading text-xl font-semibold text-foreground">{c.title}</h3>
                    {c.subtitle && (
                      <p className="mt-2 text-sm text-foreground/70 line-clamp-2">
                        {c.subtitle}
                      </p>
                    )}
                    <div className="mt-auto pt-5">
                      <Link
                        to={`/events/${c.id}`}
                        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors w-full sm:w-auto"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
};

export default SliaEventsSection;
