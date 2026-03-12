import { useEffect, useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  breadcrumb?: string;
  action?: React.ReactNode;
}

const PageLayout = ({ children, title, subtitle, breadcrumb, action }: PageLayoutProps) => {
  const [heroImage, setHeroImage] = useState("/images/hero-1.jpg");

  useEffect(() => {
    // Prefer the admin-managed hero items list; fall back to legacy single-image key.
    const rawItems = localStorage.getItem("site_hero_items_v1");
    if (rawItems) {
      try {
        const parsed = JSON.parse(rawItems) as Array<{ imageDataUrl?: string }>;
        const first = Array.isArray(parsed) ? parsed.find((i) => i?.imageDataUrl) : null;
        if (first?.imageDataUrl && first.imageDataUrl.trim()) {
          setHeroImage(first.imageDataUrl.trim());
          return;
        }
      } catch {
        // ignore and fall back
      }
    }

    const stored = localStorage.getItem("site_hero_image_v1");
    if (stored && stored.trim()) {
      setHeroImage(stored.trim());
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      {/* Page Banner */}
      <div className="relative py-16 md:py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-foreground/75" />
        <div className="container relative z-10 flex flex-col md:flex-row justify-between md:items-end gap-6">
          <div>
            <p className="text-primary font-medium uppercase tracking-wider text-sm mb-2">
              {breadcrumb || "Home"}
            </p>
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground">
              {title}
            </h1>
            {subtitle && (
              <p className="text-primary-foreground/70 mt-3 text-lg max-w-2xl">{subtitle}</p>
            )}
          </div>
          {action && (
            <div className="shrink-0 mb-1">
              {action}
            </div>
          )}
        </div>
      </div>
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
};

export default PageLayout;
