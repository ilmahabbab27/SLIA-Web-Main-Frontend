import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const breadcrumbPaths: Record<string, string> = {
  "Home": "/",
  "News & Events": "/latest-news",
  "Events": "/events",
  "Education": "/courses",
  "Boards": "/boards",
  "BAE": "/bae",
  "Graduate Member": "/bae/graduate-members",
  "Graduate Members": "/bae/graduate-members",
  "Student Member": "/bae/student-members",
  "Student Members": "/bae/student-members",
  "About Us": "/about",
};

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  breadcrumb?: string;
  action?: React.ReactNode;
}

const PageLayout = ({ children, title, subtitle, breadcrumb, action }: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-background pt-20">
      <SiteHeader />
      <div className="section-dark py-16 md:py-20">
        <div className="container flex flex-col md:flex-row justify-between md:items-end gap-6">
          <div>
            <p className="text-section-dark-foreground/50 font-medium uppercase tracking-wider text-sm mb-2 flex items-center gap-1 flex-wrap">
              {(breadcrumb || "Home").split("/").map((seg, i, arr) => {
                const label = seg.trim();
                const path = breadcrumbPaths[label];
                const isLast = i === arr.length - 1;
                return (
                  <span key={i} className="flex items-center gap-1">
                    {i > 0 && <span className="opacity-50">/</span>}
                    {path && !isLast ? (
                      <Link to={path} className="hover:opacity-75 transition-opacity">{label}</Link>
                    ) : (
                      <span className={isLast ? "opacity-75" : ""}>{label}</span>
                    )}
                  </span>
                );
              })}
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
