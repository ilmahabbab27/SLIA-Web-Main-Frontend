import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import { boardApi, type BoardItem } from "@/lib/api";
import { Loader2 } from "lucide-react";

const BoardsSection = () => {
  const [boards, setBoards] = useState<BoardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    boardApi.list()
      .then(data => {
        setBoards(data.filter(b => b.is_active));
      })
      .catch(err => console.warn("Failed to fetch boards:", err))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && boards.length === 0) return null;

  return (
    <section className="py-24 bg-background">
      <div className="container">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-primary font-medium uppercase tracking-widest text-sm mb-3">Governance</p>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
              Our Boards
            </h2>
            <div className="w-20 h-px bg-border mx-auto mb-6" />
            <p className="text-foreground/70 text-lg leading-relaxed">
              The Sri Lanka Institute of Architects is governed through specialised boards, each responsible for a key
              area of the profession.
            </p>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {boards.map((board, i) => (
              <ScrollReveal key={board.id} delay={i * 0.1} className="h-full">
                <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="h-full" style={{ position: "relative" }}>
                  <Link
                    to={board.path}
                    className="flex flex-col h-full min-h-[250px] rounded-3xl border border-border/60 bg-muted/10 p-7 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/50 group"
                  >
                    <div className="flex flex-col h-full items-center text-center">
                      <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-5 border border-border/50 flex-shrink-0">
                        {board.icon && (
                          <img src={board.icon} alt={`${board.name} logo`} className="w-8 h-8 opacity-40" />
                        )}
                        {!board.icon && (
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                            {board.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="w-10 h-px bg-primary mb-4 group-hover:w-16 transition-all duration-300 flex-shrink-0" />
                      <h3 className="font-heading text-lg font-bold text-foreground mb-2 leading-snug">{board.name}</h3>
                      <p className="text-foreground/65 text-sm leading-relaxed flex-1">{board.description}</p>
                      <div className="mt-4 flex items-center justify-center text-primary text-sm font-medium gap-1 group-hover:gap-2 transition-all duration-200">
                        <span>Learn more</span>
                        <span>&rarr;</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        )}

        <ScrollReveal delay={0.4}>
          <div className="mt-10 text-center">
            <Link
              to="/boards"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium transition-all hover:shadow-md hover:-translate-y-1"
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
