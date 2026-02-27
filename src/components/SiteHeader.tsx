import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X, Facebook, Instagram, Youtube, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  {
    label: "Architect",
    children: [
      { name: "Annual Awards", path: "/annual-awards" },
      { name: "Architect Exhibition", path: "/architect-exhibition" },
      { name: "Design Competition", path: "/design-competition" },
    ],
  },
  {
    label: "News & Events",
    children: [
      { name: "Latest News", path: "/latest-news" },
      { name: "Upcoming Events", path: "/upcoming-events" },
      { name: "Past Events", path: "/past-events" },
    ],
  },
  {
    label: "Education",
    children: [
      { name: "Courses", path: "/courses" },
      { name: "Examinations", path: "/examinations" },
      { name: "BAE Notices", path: "/bae-notices" },
    ],
  },
  {
    label: "Resources",
    children: [
      { name: "Publications", path: "/publications" },
      { name: "Specifications", path: "/specifications" },
      { name: "Downloads", path: "/downloads" },
    ],
  },
  {
    label: "About Us",
    children: [
      { name: "History", path: "/history" },
      { name: "Council", path: "/council" },
      { name: "Objectives", path: "/objectives" },
    ],
  },
  { label: "Contact Us", path: "/contact" },
];

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
              whileHover={{ rotate: 10 }}
              className="w-12 h-12 rounded-full bg-muted flex items-center justify-center border border-border"
            >
              <span className="font-heading text-sm font-bold text-foreground">SLIA</span>
            </motion.div>
            <div className="hidden sm:block">
              <span className="font-heading text-lg font-bold leading-tight text-foreground block">Sri Lanka</span>
              <span className="font-heading text-sm leading-tight text-muted-foreground block">Institute of Architects</span>
            </div>
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
                        <Link
                          to={child.path}
                          className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary hover:pl-5 transition-all"
                        >
                          {child.name}
                        </Link>
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
                            {item.children.map((child) => (
                              <Link
                                key={child.name}
                                to={child.path}
                                className="block py-1.5 text-sm text-muted-foreground hover:text-primary"
                                onClick={() => setMobileOpen(false)}
                              >
                                {child.name}
                              </Link>
                            ))}
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
