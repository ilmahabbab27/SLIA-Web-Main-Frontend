import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const boards = [
  {
    name: "Board of Management",
    description: "Governs and oversees the strategic direction, events, and programs of the Institute.",
    path: "/management",
  },
  {
    name: "Board of Architectural Education",
    description: "Supports education, examinations, and member development across architecture schools.",
    path: "/bae",
  },
  {
    name: "Professional Affairs Board",
    description: "Oversees practice registrations, CPD events, and professional conduct standards.",
    path: "/pab",
  },
  {
    name: "Board of Architectural Publications",
    description: "Manages SLIA publications, journals, and archive materials for the profession.",
    path: "/bap",
  },
];

const BoardsSection = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.06),transparent_60%),radial-gradient(ellipse_at_bottom_left,hsl(var(--secondary)/0.05),transparent_60%)] pointer-events-none" />

      <div className="container relative z-10">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-primary font-medium uppercase tracking-widest text-sm mb-3">Governance</p>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
              Our Boards
            </h2>
            <div className="w-20 h-1 rounded-full bg-gradient-to-r from-primary/70 via-secondary/60 to-accent/50 mx-auto mb-6" />
            <p className="text-foreground/70 text-lg leading-relaxed">
              The Sri Lanka Institute of Architects is governed through specialised boards, each responsible for a key
              area of the profession.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {boards.map((board, i) => (
            <ScrollReveal key={board.name} delay={i * 0.1} className="h-full">
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="h-full">
                <Link
                  to={board.path}
                  className="flex flex-col h-full min-h-[250px] rounded-3xl border border-border/60 bg-gradient-to-br from-muted/10 to-transparent p-7 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/50 group"
                >
                  <div className="flex flex-col h-full items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-5 border border-border/50 flex-shrink-0">
                      <img src="/placeholder.svg" alt={`${board.name} logo`} className="w-8 h-8 opacity-40" />
                    </div>
                    <div className="w-10 h-1 rounded-full bg-gradient-to-r from-primary to-secondary mb-4 group-hover:w-16 transition-all duration-300 flex-shrink-0" />
                    <h3 className="font-heading text-lg font-bold text-foreground mb-2 leading-snug">{board.name}</h3>
                    <p className="text-foreground/65 text-sm leading-relaxed flex-1">{board.description}</p>
                    <div className="mt-4 flex items-center justify-center text-primary text-sm font-medium gap-1 group-hover:gap-2 transition-all duration-200">
                      <span>Learn more</span>
                      <span>→</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.4}>
          <div className="mt-10 text-center">
            <Link
              to="/boards"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-medium transition-all hover:shadow-md hover:-translate-y-1"
            >
              View All Boards
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default BoardsSection;

