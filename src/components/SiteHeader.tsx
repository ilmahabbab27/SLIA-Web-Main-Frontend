import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X, Facebook, Instagram, Youtube, Linkedin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

type NavChild = {
  name: string;
  path: string;
  children?: NavChild[];
};

const navItems = [
  {
    label: "Architects",
    children: [
      { name: "Find an Architect", path: "/find-an-architect" },
      { name: "Architect Practices", path: "/architect-practices" },
      { name: "Why be an Architect", path: "/why-be-an-architect" },
    ],
  },
  {
    label: "About",
    children: [
      { name: "About the Institute", path: "/about" },
      { name: "The Council", path: "/council" },
      { name: "Board of Trustees", path: "/about-trustees" },
      { name: "Board of Architectural Education", path: "/about-bae" },
      { name: "Professional Affairs Board", path: "/about-pab" },
      { name: "Board of Architectural Publications", path: "/about-bap" },
      { name: "Board of Management", path: "/about-management" },
    ],
  },
  {
    label: "Events",
    children: [
      { name: "Latest News", path: "/latest-news" },
      { name: "Upcoming Events", path: "/upcoming-events" },
      { name: "Past Events", path: "/past-events" },
      { name: "SLIA Annual Sessions", path: "/slia-annual-sessions" },
    ],
  },
  { label: "Publications", path: "/publications#publications" },
  { label: "Resources", path: "/resources" },
  { label: "Awards", path: "/slia-awards" },
  { label: "Contact", path: "/contact" },
];

const isExternalUrl = (path: string) => /^https?:\/\//i.test(path);

const NavLinkItem = ({
  child,
  className,
  onClick,
}: {
  child: NavChild;
  className: string;
  onClick?: () => void;
}) =>
  isExternalUrl(child.path) ? (
    <a href={child.path} target="_blank" rel="noreferrer" className={className} onClick={onClick}>
      {child.name}
    </a>
  ) : (
    <Link to={child.path} className={className} onClick={onClick}>
      {child.name}
    </Link>
  );

const DesktopNavChild = ({ child }: { child: NavChild }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <NavLinkItem
        child={child}
        className="flex items-center justify-between gap-6 px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary hover:pl-5 transition-all"
      />
      {child.children && (
        <>
          <ChevronDown className={`pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 -rotate-90 ${open ? "text-primary" : "text-muted-foreground"}`} />
          {open && (
            <div className="absolute left-full top-0 z-50 min-w-[190px] border border-border bg-background py-1 shadow-lg">
              {child.children.map((subChild) => (
                <DesktopNavChild key={subChild.name} child={subChild} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

const MobileNavChild = ({
  child,
  onNavigate,
  depth = 0,
}: {
  child: NavChild;
  onNavigate: () => void;
  depth?: number;
}) => {
  const [open, setOpen] = useState(false);
  const hasChildren = Boolean(child.children?.length);

  return (
    <div>
      <div className="flex items-center gap-2">
        <NavLinkItem
          child={child}
          className={`block flex-1 py-1.5 text-sm hover:text-primary ${
            depth === 0 ? "text-muted-foreground" : "text-muted-foreground/80"
          }`}
          onClick={onNavigate}
        />
        {hasChildren && (
          <button
            type="button"
            className="flex h-8 w-8 shrink-0 items-center justify-center border border-border text-muted-foreground hover:text-primary"
            onClick={() => setOpen((current) => !current)}
            aria-label={open ? `Collapse ${child.name}` : `Expand ${child.name}`}
          >
            <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.18 }}>
              <ChevronDown className="h-4 w-4" />
            </motion.span>
          </button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {hasChildren && open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="ml-4 overflow-hidden border-l border-border pl-3"
            style={{ position: "relative" }}
          >
            {child.children?.map((subChild) => (
              <MobileNavChild key={subChild.name} child={subChild} onNavigate={onNavigate} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SiteHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [memberLabel, setMemberLabel] = useState("Member Portal");
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const syncMemberLabel = () => {
      try {
        const raw = window.localStorage.getItem("slia_member_session");
        setMemberLabel(raw ? "My Profile" : "Member Portal");
      } catch {
        setMemberLabel("Member Portal");
      }
    };

    syncMemberLabel();
    window.addEventListener("storage", syncMemberLabel);
    window.addEventListener("focus", syncMemberLabel);
    return () => {
      window.removeEventListener("storage", syncMemberLabel);
      window.removeEventListener("focus", syncMemberLabel);
    };
  }, []);

  const isHomePage = location.pathname === "/";

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/95 backdrop-blur-md shadow-sm border-b border-border/50 ${
        scrolled ? "py-0 shadow-md" : "py-0"
      }`}
    >
      <div className="container flex items-center justify-between gap-2 py-0">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <div className="flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="-my-2 flex h-[72px] w-[72px] shrink-0 items-center justify-center sm:-my-4 sm:h-[116px] sm:w-[116px]"
              style={{ position: "relative" }}
            >
              <img src="/images/logo.png" alt="SLIA Logo" className="h-full w-full max-w-none object-contain sm:h-[118%] sm:w-[118%]" />
            </motion.div>
          </div>
        </Link>

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
                    className="absolute top-full left-0 bg-background border border-border shadow-lg rounded-sm min-w-[240px] py-1 z-50 overflow-visible"
                  >
                    {item.children.map((child, ci) => (
                      <motion.div
                        key={child.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: ci * 0.05 }}
                        style={{ position: "relative" }}
                      >
                        <DesktopNavChild child={child} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        <div className="flex min-w-0 items-center gap-2">
          <Link
            to="/member-portal"
            className="hidden px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-foreground transition-all hover:bg-muted border border-border sm:inline-flex sm:px-6 sm:py-2.5 sm:text-xs"
          >
            {memberLabel}
          </Link>
          <button className="lg:hidden p-1 text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            <AnimatePresence mode="wait">
              <motion.span
                key={mobileOpen ? "close" : "menu"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[80] bg-black/45 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="fixed right-0 top-0 z-[90] h-screen w-[86vw] max-w-sm overflow-y-auto border-l border-border bg-background shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-border p-4">
                <Link to="/" className="flex items-center gap-3" onClick={() => setMobileOpen(false)}>
                  <img src="/images/logo.png" alt="SLIA Logo" className="h-10 w-auto object-contain" />
                </Link>
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center border border-border text-foreground"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close navigation"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 p-4">
              <div className="flex flex-col gap-2 pb-4 border-b border-border">
                <Link
                  to="/member-portal"
                  className="flex items-center justify-center py-3 text-sm font-bold uppercase tracking-widest text-foreground border border-border"
                  onClick={() => setMobileOpen(false)}
                >
                  {memberLabel}
                </Link>
              </div>

              {navItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{ position: "relative" }}
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
                              <MobileNavChild key={child.name} child={child} onNavigate={() => setMobileOpen(false)} />
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
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default SiteHeader;
