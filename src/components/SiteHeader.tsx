import { useState } from "react";
import { ChevronDown, Menu, X, Facebook, Instagram, Youtube, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    label: "Architect",
    children: ["Annual Awards", "Architect Exhibition", "Design Competition"],
  },
  {
    label: "News & Events",
    children: ["Latest News", "Upcoming Events", "Past Events"],
  },
  {
    label: "Education",
    children: ["Courses", "Examinations", "BAE Notices"],
  },
  {
    label: "Resources",
    children: ["Publications", "Specifications", "Downloads"],
  },
  {
    label: "About Us",
    children: ["History", "Council", "Objectives"],
  },
  { label: "Contact Us" },
];

const SiteHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-background shadow-sm">
      <div className="container flex items-center justify-between py-3">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3">
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
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative group"
              onMouseEnter={() => setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
                {item.label}
                {item.children && <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              {item.children && openDropdown === item.label && (
                <div className="absolute top-full left-0 bg-background border border-border shadow-lg rounded-sm min-w-[200px] py-1 z-50">
                  {item.children.map((child) => (
                    <a
                      key={child}
                      href="#"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors"
                    >
                      {child}
                    </a>
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
                <button
                  className="flex items-center justify-between w-full py-2 text-sm font-medium text-foreground"
                  onClick={() =>
                    setOpenDropdown(openDropdown === item.label ? null : item.label)
                  }
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        openDropdown === item.label ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>
                {item.children && openDropdown === item.label && (
                  <div className="pl-4 space-y-1">
                    {item.children.map((child) => (
                      <a
                        key={child}
                        href="#"
                        className="block py-1.5 text-sm text-muted-foreground hover:text-primary"
                      >
                        {child}
                      </a>
                    ))}
                  </div>
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
