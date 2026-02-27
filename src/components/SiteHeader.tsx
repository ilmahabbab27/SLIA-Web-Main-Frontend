import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Menu, X, Facebook, Instagram, Youtube, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  return (
    <header className="sticky top-0 z-50 bg-background shadow-sm">
      <div className="container flex items-center justify-between py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center border border-border">
              <span className="font-heading text-sm font-bold text-foreground">SLIA</span>
            </div>
            <div className="hidden sm:block">
              <span className="font-heading text-lg font-bold leading-tight text-foreground block">
                Sri Lanka
              </span>
              <span className="font-heading text-sm leading-tight text-muted-foreground block">
                Institute of Architects
              </span>
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
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              ) : (
                <Link
                  to={(item as any).path || "#"}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              )}
              {item.children && openDropdown === item.label && (
                <div className="absolute top-full left-0 bg-background border border-border shadow-lg rounded-sm min-w-[200px] py-1 z-50">
                  {item.children.map((child) => (
                    <Link
                      key={child.name}
                      to={child.path}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors"
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Button size="sm" className="hidden sm:inline-flex bg-primary text-primary-foreground hover:bg-primary/90">
            Register with Annual Sessions
          </Button>
          <div className="hidden lg:flex items-center gap-2">
            {[Facebook, Instagram, Youtube, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
          <button
            className="lg:hidden text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden bg-background border-t border-border">
          <div className="container py-4 space-y-2">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <>
                    <button
                      className="flex items-center justify-between w-full py-2 text-sm font-medium text-foreground"
                      onClick={() =>
                        setOpenDropdown(openDropdown === item.label ? null : item.label)
                      }
                    >
                      {item.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          openDropdown === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openDropdown === item.label && (
                      <div className="pl-4 space-y-1">
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
                      </div>
                    )}
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
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default SiteHeader;
