import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  breadcrumb?: string;
}

const PageLayout = ({ children, title, subtitle, breadcrumb }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      {/* Page Banner */}
      <div className="relative py-16 md:py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/images/hero-1.jpg)" }}
        />
        <div className="absolute inset-0 bg-foreground/75" />
        <div className="container relative z-10">
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
      </div>
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
};

export default PageLayout;
