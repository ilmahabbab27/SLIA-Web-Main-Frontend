import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import AnimatedCounter from "./AnimatedCounter";

const AboutSection = () => {
  return (
    <section className="section-dark py-20">
      <div className="container">
        <ScrollReveal>
          <p className="text-primary font-medium uppercase tracking-wider text-sm mb-2">About Us</p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-8">
            HISTORY — Sri Lanka Institute of Architects
          </h2>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-5 text-section-dark-foreground/80 text-[15px] leading-relaxed">
            <ScrollReveal delay={0.1}>
              <p>
                The Sri Lanka Institute of Architects is one of the foremost professional organisations
                in Sri Lanka as well as the Asian region. The institute has been working on the
                professional practices of architecture in the country as well as education, which have
                been the primary focuses over the years.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p>
                The Ceylon Institute of Architects (CIA) was established in 1956 by a small group of
                foreign qualified Architects following several meetings to work out a constitution.
                The Inaugural meeting of the institute was held on 11th September 1957 at the Tea
                Propaganda Board on Prince Street in the Colombo Fort with the participation of twelve
                Architects.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.3}>
              <p>
                In 1976, through a private member's motion by the then Minister of Housing and
                Construction, the Ceylon Institute of Architects was incorporated as the Sri Lanka
                Institute of Architects (SLIA) by an Act of Parliament, called the Sri Lanka Institute
                of Architects Law No.1 of 1976.
              </p>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground mt-4">
                  Learn More
                </Button>
              </motion.div>
            </ScrollReveal>
          </div>

          <div className="space-y-6">
            <ScrollReveal variant="fadeRight" delay={0.1}>
              <div className="group p-4 rounded-sm hover:bg-section-dark-foreground/5 transition-colors cursor-pointer">
                <h3 className="font-heading text-xl font-semibold mb-3 group-hover:text-primary transition-colors">About Us</h3>
                <p className="text-section-dark-foreground/70 text-sm leading-relaxed">
                  The institute has been working on the professional practices of architecture in the
                  country as well as education, which have been the primary focuses over the years. We
                  are proud to note that we have seen a lot of improvements in the industry.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal variant="fadeRight" delay={0.2}>
              <div className="group p-4 rounded-sm hover:bg-section-dark-foreground/5 transition-colors cursor-pointer">
                <h3 className="font-heading text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  The Role Of The SLIA In Architectural Education
                </h3>
                <p className="text-section-dark-foreground/70 text-sm leading-relaxed">
                  Sri Lanka Institute of Architects Law No. 1 of 1976 enacted by the National State
                  Assembly vested statutory powers with the SLIA. One of the main objectives of the
                  SLIA is to promote and advance the study, practice and application of and Research
                  in Architecture.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal variant="fadeRight" delay={0.3}>
              <div className="group p-4 rounded-sm hover:bg-section-dark-foreground/5 transition-colors cursor-pointer">
                <h3 className="font-heading text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  Objectives Of The Institute
                </h3>
                <ul className="text-section-dark-foreground/70 text-sm leading-relaxed space-y-2">
                  <li>• Promote and advance the study, practice and application of research in architecture</li>
                  <li>• Organize, supervise and control the admission and professional education</li>
                  <li>• Protect and promote the interest, status, welfare of the profession</li>
                  <li>• Establish and maintain libraries, pension and benefit schemes</li>
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Stats Counter Section */}
        <ScrollReveal delay={0.2}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-12 border-t border-section-dark-foreground/10">
            <AnimatedCounter target={1956} label="Established" className="text-section-dark-foreground" />
            <AnimatedCounter target={2500} suffix="+" label="Registered Architects" className="text-section-dark-foreground" />
            <AnimatedCounter target={65} suffix="+" label="Years of Excellence" className="text-section-dark-foreground" />
            <AnimatedCounter target={12} label="Founding Members" className="text-section-dark-foreground" />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default AboutSection;
