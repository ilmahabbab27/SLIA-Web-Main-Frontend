import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";

const eventCards = [
  {
    title: "Upcoming Events",
    subtitle: "See what’s next on the SLIA calendar",
    path: "/upcoming-events",
    image: "/images/event-1.jpg",
  },
  {
    title: "SLIA Annual Sessions",
    subtitle: "Introduction, program items, and official website link",
    path: "/slia-annual-sessions",
    image: "/images/event-2.jpg",
  },
  {
    title: "Past Events",
    subtitle: "Browse previous events and highlights",
    path: "/past-events",
    image: "/images/event-3.jpg",
  },
];

const VideoSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <ScrollReveal>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">
            SLIA Events
          </h2>
          <p className="text-muted-foreground text-center mb-8">Explore events and key annual programs</p>
        </ScrollReveal>

        <ScrollReveal variant="fadeUp" delay={0.2}>
          <div className="grid gap-6 md:grid-cols-3">
            {eventCards.map((c) => (
              <motion.div
                key={c.title}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden"
              >
                <div className="w-full aspect-[16/10] bg-muted overflow-hidden">
                  <img src={c.image} alt={c.title} className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-xl font-semibold text-foreground">{c.title}</h3>
                  <p className="mt-2 text-sm text-foreground/70">
                    {c.subtitle.replaceAll("â€™", "’").replaceAll("â€˜", "‘")}
                  </p>
                  <div className="mt-5">
                    <Link
                      to={c.path}
                      className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default VideoSection;
