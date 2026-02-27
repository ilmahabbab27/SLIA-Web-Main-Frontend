import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const VideoSection = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container">
        <ScrollReveal>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">
            Members' Work & Trade Exhibition
          </h2>
          <p className="text-muted-foreground text-center mb-8">Sri Lanka Institute of Architects</p>
        </ScrollReveal>

        <ScrollReveal variant="scaleIn" delay={0.2}>
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="relative w-full aspect-video rounded-sm overflow-hidden shadow-lg"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <iframe
                src="https://www.youtube.com/embed/6eM6V7Bxxo8"
                title="ARCHITECT 2024"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </motion.div>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="fadeUp" delay={0.3}>
          <motion.div
            className="mt-12 section-dark rounded-sm p-8 md:p-12 text-center max-w-4xl mx-auto relative overflow-hidden"
            whileHover={{ boxShadow: "0 20px 60px -15px hsla(22, 100%, 45%, 0.2)" }}
          >
            {/* Animated background accent */}
            <motion.div
              className="absolute top-0 left-0 w-full h-1 bg-primary"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{ transformOrigin: "left" }}
            />
            <h3 className="font-heading text-2xl md:text-3xl font-bold mb-4">
              Walk through the Architects' Work & Trade Exhibition
            </h3>
            <p className="text-section-dark-foreground/70 mb-6">
              23rd to 25th February, 2023 at BMICH from 10.00 am - 10.00 pm
            </p>
            <motion.a
              href="#"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block bg-primary text-primary-foreground px-8 py-3 font-semibold text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors"
            >
              Reserve Your Trade Stall
            </motion.a>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default VideoSection;
