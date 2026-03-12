import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";
import AnimatedCounter from "./AnimatedCounter";
import { History, Building2, GraduationCap, Target } from "lucide-react";

const AboutSection = () => {
  return (
    <section className="section-dark py-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 rounded-l-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-white/5 rounded-r-full blur-3xl -z-10" />

      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <ScrollReveal>
            <p className="text-primary font-medium uppercase tracking-widest text-sm mb-3">About Us</p>
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6 text-white">
              Sri Lanka Institute of Architects
            </h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-8" />
            <p className="text-section-dark-foreground/80 text-lg leading-relaxed mb-8">
              One of the foremost professional organisations in Sri Lanka and the Asian region,
              dedicated to the professional practices of architecture and education since 1956. We are proud to note that we have seen a lot of improvements in the industry and have played a great role in contributing to the development of architecture as well as the raising of the standards in the country.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {[
                { name: "About the Institute", path: "/about" },
                { name: "The Council", path: "/council" },
                { name: "Board of Trustees", path: "/trustees" },
                { name: "Board of Management", path: "/management" },
                { name: "Board of Education", path: "/bae" },
                { name: "Professional Affairs Board", path: "/pab" },
                { name: "Board of Architectural Publications", path: "/bap" },
              ].map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="bg-white/5 hover:bg-primary text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-300 border border-white/10 hover:border-primary shadow-sm hover:shadow-primary/20 backdrop-blur-sm"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/about" className="inline-block bg-primary text-primary-foreground font-medium px-8 py-3 rounded-md hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                See More
              </Link>
            </motion.div>
          </ScrollReveal>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
          {/* History Column - Spans 7 columns on large screens */}
          <div className="lg:col-span-7 space-y-8">
            <ScrollReveal delay={0.1}>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10 relative overflow-hidden group hover:border-primary/30 transition-all duration-500 h-full">
                <div className="absolute -top-10 -right-10 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-500 transform group-hover:rotate-12 group-hover:scale-110">
                  <History className="w-64 h-64 text-white" />
                </div>

                <h3 className="font-heading text-2xl font-bold text-white mb-8 flex items-center gap-4">
                  <div className="p-3 bg-primary/20 rounded-xl text-primary shadow-inner">
                    <History className="w-6 h-6" />
                  </div>
                  Our History
                </h3>

                <div className="space-y-6 text-section-dark-foreground/80 text-[15px] leading-relaxed relative z-10">
                  <p>
                    The Ceylon Institute of Architects (CIA) was established in 1956 by a small group of foreign qualified Architects following several meetings to work out a constitution. This original group also had membership of the Royal Institute of British Architects (RIBA).The Inaugural meeting of the institute was held on 11th September 1957 at the Tea Propaganda Board on Prince Street in the Colombo Fort with the participation of twelve Architects.
                  </p>
                  <p>
                    Having adopted a constitution, which followed that of the British Institute of Architects, the intention of the CIA was to obtain the status of an allied society of the RIBA. They achieved this in 1960, by which time the membership of The Ceylon Institute of Architects had risen to 30. The CIA received the encouragement of the then President of the RIBA, Sir Basil Spence and the considerable assistance of C.D.Spragg the then Secretary of the RIBA. In recognition of this assistance Mr. Spragg was later elected by the CIA as its first Honorary Fellow. Due to the hard work of these founder members of the Institute, a School of Architecture attached to the Institute of Practical Technology, Katubedda was established in 1961.
                  </p>
                  <p>
                    In 1976, through a private member's motion by the then Minister of Housing and Construction, the Hon. Pieter Keuneman, the Ceylon Institute of Architects was incorporated as the Sri Lanka Institute of Architects (SLIA) by an Act of Parliament, called the Sri Lanka Institute of Architects Law No.1 of 1976.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Additional Info Cards - Spans 5 columns */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <ScrollReveal variant="fadeRight" delay={0.2} className="flex-1">
              <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl hover:bg-white/10 hover:border-primary/50 transition-all duration-300 h-full flex flex-col justify-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <GraduationCap className="w-32 h-32 text-white" />
                </div>
                <div className="flex items-start gap-5 relative z-10">
                  <div className="p-3 bg-white/10 rounded-xl text-white shrink-0 mt-1 shadow-inner">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-semibold mb-3 text-white">
                      Role In Education
                    </h3>
                    <p className="text-section-dark-foreground/70 text-sm leading-relaxed">
                      Sri Lanka Institute of Architects Law No. 1 of 1976 enacted by the National State Assembly vested statutory powers with the SLIA. One of the main objectives of the SLIA is to promote and advance the study, practice and application of and Research in Architecture and kindred subjects and the arts and sciences connected therewith.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fadeRight" delay={0.3} className="flex-1">
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 p-6 md:p-8 rounded-2xl relative overflow-hidden h-full flex flex-col justify-center group">
                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                  <Target className="w-32 h-32 text-primary" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-primary rounded-xl text-primary-foreground shadow-lg shadow-primary/20">
                      <Target className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-white">
                      Institute Objectives
                    </h3>
                  </div>
                  <ul className="text-section-dark-foreground/80 text-[13px] md:text-sm leading-relaxed space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1 shrink-0 h-4 w-4 bg-primary/20 rounded-full flex items-center justify-center text-[10px]">•</span>
                      <span>Promote and advance research in architecture and kindred subjects.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1 shrink-0 h-4 w-4 bg-primary/20 rounded-full flex items-center justify-center text-[10px]">•</span>
                      <span>Organize and supervise admission and professional education.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1 shrink-0 h-4 w-4 bg-primary/20 rounded-full flex items-center justify-center text-[10px]">•</span>
                      <span>Prescribe qualifications and maintain standards of professional conduct.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary mt-1 shrink-0 h-4 w-4 bg-primary/20 rounded-full flex items-center justify-center text-[10px]">•</span>
                      <span>Protect and promote the interests and welfare of the profession and public.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Stats Counter Section */}
        <ScrollReveal delay={0.4}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-16 md:mt-24">
            {[
              { target: 1956, label: "Established" },
              { target: 2500, suffix: "+", label: "Registered Architects" },
              { target: 65, suffix: "+", label: "Years of Excellence" },
              { target: 12, label: "Founding Members" },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-6 text-center hover:bg-white/10 hover:border-white/10 transition-all duration-300 transform hover:-translate-y-1">
                <AnimatedCounter target={stat.target} suffix={stat.suffix} label={stat.label} className="text-3xl md:text-4xl font-bold text-white mb-3 inline-block" />
                <p className="text-section-dark-foreground/60 text-xs md:text-sm font-medium uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default AboutSection;
