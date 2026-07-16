import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";

import { newsApi, type NewsItem } from "@/lib/api";

const NewsSection = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    newsApi.list("news")
      .then(data => {
        const active = data.filter(n => n.is_active);
        setNewsItems(active);
        if (active.length > 0) {
          setSelectedNews(active[0]);
        }
      })
      .catch(err => console.warn("Failed to fetch news:", err))
      .finally(() => setLoading(false));
  }, []);

  const openModal = (item: NewsItem) => {
    setSelectedNews(item);
    setModalOpen(true);
  };

  if (!loading && newsItems.length === 0) return null;

  return (
    <section className="py-16 section-muted">
      <div className="container">
        <ScrollReveal>
          <Link to="/latest-news" className="text-primary font-semibold uppercase tracking-wider text-sm mb-2 inline-block hover:opacity-75 transition-opacity">
            News & Events
          </Link>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-10">
            Sri Lanka Institute of Architects
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: (i % 3) * 0.1, duration: 0.4 }}
              whileHover={{ y: -6, boxShadow: "0 12px 40px -10px hsla(0, 0%, 0%, 0.15)" }}
              className="bg-background border border-border p-6 rounded-sm cursor-pointer group"
              onClick={() => openModal(item)}
              style={{ position: "relative" }}
            >
              <h3 className="font-heading text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-primary text-sm font-semibold mb-4 tracking-wide">{item.subtitle}</p>
              <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4">
                {item.description}
              </p>
              <span className="inline-block mt-6 text-primary text-sm font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                Read More &rarr;
              </span>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {modalOpen && selectedNews && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-md p-4"
              onClick={() => setModalOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                className="bg-background rounded-2xl max-w-2xl w-full p-10 relative shadow-2xl border border-border/50"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setModalOpen(false)}
                  className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-full"
                >
                  <X className="w-6 h-6" />
                </button>
                
                <p className="text-primary font-bold uppercase tracking-[0.2em] text-xs mb-3">{selectedNews.subtitle}</p>
                <h3 className="font-heading text-3xl font-bold text-foreground mb-6 leading-tight">
                  {selectedNews.title}
                </h3>
                
                <div className="w-20 h-1 bg-primary mb-8" />
                
                <p className="text-foreground/80 text-lg leading-relaxed mb-10 whitespace-pre-line">
                  {selectedNews.description}
                </p>
                
                <motion.a
                  href={selectedNews.link}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center bg-primary text-primary-foreground px-10 py-4 rounded-xl text-sm font-bold tracking-widest uppercase hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                >
                  Visit Link
                </motion.a>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default NewsSection;
