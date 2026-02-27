import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const events = [
  { image: "/images/event-1.jpg", title: "Architect 2023" },
  { image: "/images/event-2.jpg", title: "Launching of Regional Exhibition, Kandy" },
  { image: "/images/event-3.jpg", title: "Launching of Specification Writing" },
  { image: "/images/event-4.jpg", title: "Inauguration" },
  { image: "/images/event-1.jpg", title: "Launch of Architects Work & Trade Exhibition" },
  { image: "/images/event-3.jpg", title: "World Habitat Day 2025 - Design Competition" },
  { image: "/images/event-2.jpg", title: "Quarterly General Meeting" },
  { image: "/images/event-4.jpg", title: "Regional Exhibition in Kandy" },
  { image: "/images/event-1.jpg", title: "National Conference" },
];

const EventsCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 320, behavior: "smooth" });
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <ScrollReveal>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground text-center mb-2">
            Sri Lanka Institute of Architects
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-10" />
        </ScrollReveal>

        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll(-1)}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors shadow-md"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {events.map((event, i) => (
              <ScrollReveal key={i} delay={i * 0.08} variant="scaleIn" className="flex-shrink-0 w-[280px]">
                <motion.a
                  href="#"
                  className="block group cursor-pointer"
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="relative overflow-hidden rounded-sm">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-[200px] object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  </div>
                  <h3 className="mt-3 font-heading text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                </motion.a>
              </ScrollReveal>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => scroll(1)}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors shadow-md"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default EventsCarousel;
