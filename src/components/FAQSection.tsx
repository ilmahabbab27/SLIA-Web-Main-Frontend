import { useState, useEffect } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Loader2 } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { faqApi, type FaqItem } from "@/lib/api";

const FAQSection = () => {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    faqApi.list()
      .then(data => {
        if (data.length > 0) {
          setFaqs(data.filter(f => f.is_active));
        }
      })
      .catch(err => console.warn("Failed to fetch FAQs:", err))
      .finally(() => setLoading(false));
  }, []);

  if (!loading && faqs.length === 0) return null;

  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="container relative z-10">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-primary font-medium uppercase tracking-widest text-sm mb-3">Questions & Answers</p>
            <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
              Frequently Asked Questions
            </h2>
            <div className="w-20 h-px bg-border mx-auto mb-6" />
            <p className="text-foreground/70 text-lg leading-relaxed">
              Find answers to common questions about the Sri Lanka Institute of Architects and the architectural profession.
            </p>
          </div>
        </ScrollReveal>

        <div className="max-w-3xl mx-auto">
          <ScrollReveal delay={0.2}>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="bg-card border border-border/60 rounded-2xl px-6 transition-all duration-300 hover:border-primary/30 shadow-sm"
                  >
                    <AccordionTrigger className="text-left font-bold text-lg hover:no-underline hover:text-primary transition-colors py-6">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/70 text-base pb-6 leading-relaxed whitespace-pre-line">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </ScrollReveal>
        </div>
      </div>

      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
};

export default FAQSection;
