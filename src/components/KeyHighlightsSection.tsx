import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

type KeyHighlightItem = {
  id: string;
  title: string;
  imageDataUrl: string;
  updatedAt: string;
};

const fallbackHighlights: KeyHighlightItem[] = [];

const KeyHighlightsSection = () => {
  const [items, setItems] = useState<KeyHighlightItem[]>(fallbackHighlights);

  useEffect(() => {
    const raw = localStorage.getItem("site_key_highlights_v1");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as KeyHighlightItem[];
      if (Array.isArray(parsed)) setItems(parsed);
    } catch {
      // ignore
    }
  }, []);

  const visible = useMemo(() => items.filter((i) => i?.imageDataUrl && i?.title), [items]);
  if (visible.length === 0) return null;

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <ScrollReveal>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">
            Key Highlights
          </h2>
          <p className="text-muted-foreground text-center mb-8">Featured items and important updates</p>
        </ScrollReveal>

        <ScrollReveal variant="fadeUp" delay={0.15}>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden"
              >
                <div className="w-full aspect-[16/10] bg-muted overflow-hidden">
                  <img
                    src={item.imageDataUrl}
                    alt={item.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-lg font-semibold text-foreground">{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default KeyHighlightsSection;

