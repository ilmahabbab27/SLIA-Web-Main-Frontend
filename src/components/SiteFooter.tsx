import { Facebook, Instagram, Youtube, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";

const footerLinks = [
  { name: "Architect", path: "/annual-awards" },
  { name: "News & Events", path: "/latest-news" },
  { name: "Education", path: "/courses" },
  { name: "Resources", path: "/resources" },
  { name: "About Us", path: "/about" },
];

const resourceLinks = [
  { name: "Annual Awards", path: "/annual-awards" },
  { name: "Publications", path: "/publications" },
  { name: "Examinations", path: "/examinations" },
  { name: "Resources", path: "/resources" },
  { name: "Contact Us", path: "/contact" },
];

const socialLinks = [
  { name: "Facebook", href: "https://www.facebook.com/SLIAArchitectsMedia/", icon: Facebook },
  { name: "Instagram", href: "https://www.instagram.com/srilankainstituteofarchitects/?hl=en", icon: Instagram },
  { name: "YouTube", href: "https://www.youtube.com/channel/UCv7i7wluqV3mi9UUUMoQHdw", icon: Youtube },
  { name: "LinkedIn", href: "https://www.linkedin.com/company/sri-lanka-institute-of-architects-slia", icon: Linkedin },
];

const SiteFooter = () => {
  return (
    <footer className="section-dark pt-16 pb-8">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <ScrollReveal variant="fadeUp" className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center p-1 bg-white/90 rounded-sm"
                style={{ position: "relative" }}
              >
                <img src="/images/logo.png" alt="SLIA Logo" className="h-10 w-auto object-contain" />
              </motion.div>
            </div>
            <p className="text-section-dark-foreground/60 text-sm leading-relaxed">
              Sri Lanka Institute of Architects - one of the foremost professional organisations in Sri Lanka and the Asian region.
            </p>
            <p className="mt-4 text-section-dark-foreground/60 text-sm leading-relaxed">
              Sri Lanka Institute of Architects
              <br />
              Incorporated by Law No. 1 of 1976
              <br />
              www.slia.lk
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              {socialLinks.map(({ name, href, icon: Icon }) => (
                <motion.a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-section-dark-foreground/40 hover:text-primary transition-colors"
                  aria-label={name}
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fadeUp" delay={0.1}>
            <h4 className="font-heading text-base font-semibold text-section-dark-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((l) => (
                <li key={l.name}>
                  <Link to={l.path} className="text-section-dark-foreground/60 text-sm hover:text-primary hover:translate-x-1 transition-all inline-block">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal variant="fadeUp" delay={0.2}>
            <h4 className="font-heading text-base font-semibold text-section-dark-foreground mb-4">Resources</h4>
            <ul className="space-y-2">
              {resourceLinks.map((l) => (
                <li key={l.name}>
                  <Link to={l.path} className="text-section-dark-foreground/60 text-sm hover:text-primary hover:translate-x-1 transition-all inline-block">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </ScrollReveal>

          <ScrollReveal variant="fadeUp" delay={0.3}>
            <h4 className="font-heading text-base font-semibold text-section-dark-foreground mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-section-dark-foreground/60 text-sm">120/7, Vidya Mawatha, Colombo 07, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-section-dark-foreground/60 text-sm">011 268 9900</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-section-dark-foreground/60 text-sm">secretariat@architects.lk</span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="border-t border-section-dark-foreground/10 pt-6 text-center origin-left"
        >
          <p className="text-section-dark-foreground/40 text-xs">
            (c) {new Date().getFullYear()} Sri Lanka Institute of Architects. All rights reserved.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default SiteFooter;
