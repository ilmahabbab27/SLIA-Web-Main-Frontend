import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X, Facebook, Instagram, Youtube, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  {
    label: "About Us",
    children: [
      { name: "about the Institute", path: "/about" },
      { name: "The Council", path: "/council" },
      { name: "Board of Trustees", path: "/about-trustees" },
      { name: "Board of Management", path: "/about-management" },
      { name: "Board of Architectural Education", path: "/about-bae" },
      { name: "Professional Affairs Board", path: "/about-pab" },
      { name: "Board of Architectural Publications", path: "/about-bap" },
    ],
  },
  {
    label: "Boards",
    children: [
      { name: "All Boards", path: "/boards" },
      { name: "Board of Architectural Education", path: "/bae" },
      { name: "Board of Architectural Publications", path: "/bap" },
      { name: "Board of Management", path: "/management" },
      { name: "Professional Affairs Board", path: "/pab" },
    ],
  },
  {
    label: "Architect",
    children: [
      { name: "Find an Architect", path: "/find-an-architect" },
      { name: "Architect Practices", path: "/architect-practices" },
      { name: "Why be an Architect", path: "/why-be-an-architect" },
    ],
  },
  {
    label: "News",
    children: [
      { name: "Latest News", path: "/latest-news" },
    ],
  },
  {
    label: "Events",
    children: [
      { name: "Upcoming Events", path: "/upcoming-events" },
      { name: "Past Events", path: "/past-events" },
      { name: "SLIA Annual Sessions", path: "/slia-annual-sessions" },
    ],
  },
  { label: "SLIA Awards", path: "/slia-awards" },
  { label: "Contact Us", path: "/contact" },
];

const isExternalUrl = (path: string) => /^https?:\/\//i.test(path);

const SiteHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`sticky top-0 z-50 bg-background transition-shadow duration-300 ${scrolled ? "shadow-md" : "shadow-sm"}`}
    >
      <div className="container flex items-center justify-between py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center justify-center"
            >
              <img src="/images/logo.png" alt="SLIA Logo" className="h-14 w-auto object-contain" />
            </motion.div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative group"
              onMouseEnter={() => setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              {item.children ? (
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                  {item.label}
                  <motion.span animate={{ rotate: openDropdown === item.label ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </motion.span>
                </button>
              ) : (
                <Link
                  to={(item as any).path || "#"}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              )}
              <AnimatePresence>
                {item.children && openDropdown === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 bg-background border border-border shadow-lg rounded-sm min-w-[200px] py-1 z-50 overflow-hidden"
                  >
                    {item.children.map((child, ci) => (
                      <motion.div
                        key={child.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: ci * 0.05 }}
                      >
                        {isExternalUrl(child.path) ? (
                          <a
                            href={child.path}
                            target="_blank"
                            rel="noreferrer"
                            className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary hover:pl-5 transition-all"
                          >
                            {child.name}
                          </a>
                        ) : (
                          <Link
                            to={child.path}
                            className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary hover:pl-5 transition-all"
                          >
                            {child.name}
                          </Link>
                        )}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button size="sm" className="hidden sm:inline-flex bg-primary text-primary-foreground hover:bg-primary/90">
              Register with Annual Sessions
            </Button>
          </motion.div>
          <div className="hidden lg:flex items-center gap-2">
            {[Facebook, Instagram, Youtube, Linkedin].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.2, y: -1 }}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Icon className="w-4 h-4" />
              </motion.a>
            ))}
          </div>
          <button
            className="lg:hidden text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={mobileOpen ? "close" : "menu"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-background border-t border-border overflow-hidden"
          >
            <div className="container py-4 space-y-2">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {item.children ? (
                    <>
                      <button
                        className="flex items-center justify-between w-full py-2 text-sm font-medium text-foreground"
                        onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      >
                        {item.label}
                        <motion.span animate={{ rotate: openDropdown === item.label ? 180 : 0 }}>
                          <ChevronDown className="w-4 h-4" />
                        </motion.span>
                      </button>
                      <AnimatePresence>
                        {openDropdown === item.label && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="pl-4 space-y-1 overflow-hidden"
                          >
                            {item.children.map((child) =>
                              isExternalUrl(child.path) ? (
                                <a
                                  key={child.name}
                                  href={child.path}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="block py-1.5 text-sm text-muted-foreground hover:text-primary"
                                  onClick={() => setMobileOpen(false)}
                                >
                                  {child.name}
                                </a>
                              ) : (
                                <Link
                                  key={child.name}
                                  to={child.path}
                                  className="block py-1.5 text-sm text-muted-foreground hover:text-primary"
                                  onClick={() => setMobileOpen(false)}
                                >
                                  {child.name}
                                </Link>
                              )
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      to={(item as any).path || "#"}
                      className="block py-2 text-sm font-medium text-foreground hover:text-primary"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default SiteHeader;
