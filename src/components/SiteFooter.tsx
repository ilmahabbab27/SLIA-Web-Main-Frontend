import { Facebook, Instagram, Youtube, Linkedin, Mail, Phone, MapPin } from "lucide-react";

const SiteFooter = () => {
  return (
    <footer className="section-dark pt-16 pb-8">
      <div className="container">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Logo & info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="font-heading text-xs font-bold text-primary-foreground">SLIA</span>
              </div>
              <span className="font-heading text-lg font-bold text-section-dark-foreground">
                SLIA
              </span>
            </div>
            <p className="text-section-dark-foreground/60 text-sm leading-relaxed">
              Sri Lanka Institute of Architects — one of the foremost professional organisations in
              Sri Lanka and the Asian region.
            </p>
            <div className="flex gap-3 mt-4">
              {[Facebook, Instagram, Youtube, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-section-dark-foreground/40 hover:text-primary transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-base font-semibold text-section-dark-foreground mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {["Architect", "News & Events", "Education", "Resources", "About Us"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-section-dark-foreground/60 text-sm hover:text-primary transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-heading text-base font-semibold text-section-dark-foreground mb-4">
              Resources
            </h4>
            <ul className="space-y-2">
              {["Annual Awards", "Publications", "Examinations", "Downloads", "Registration"].map((l) => (
                <li key={l}>
                  <a href="#" className="text-section-dark-foreground/60 text-sm hover:text-primary transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-base font-semibold text-section-dark-foreground mb-4">
              Contact Us
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-section-dark-foreground/60 text-sm">
                  120/7, Vidya Mawatha, Colombo 07, Sri Lanka
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-section-dark-foreground/60 text-sm">072 71 64 900</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-section-dark-foreground/60 text-sm">webmaster@architects.lk</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-section-dark-foreground/10 pt-6 text-center">
          <p className="text-section-dark-foreground/40 text-xs">
            © {new Date().getFullYear()} Sri Lanka Institute of Architects. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
