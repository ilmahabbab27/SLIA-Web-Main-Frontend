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
    <div className="min-h-screen bg-background pt-20 sm:pt-20">
      <SiteHeader />
      <div className="section-dark py-8 sm:py-12 md:py-16">
        <div className="mx-auto w-full max-w-7xl px-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between sm:px-4 lg:px-6">
          <div>
            <p className="mb-2 flex flex-wrap items-center gap-1 text-sm font-medium uppercase tracking-wider text-section-dark-foreground/50">
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
            <h1 className="font-heading text-2xl font-bold text-primary-foreground md:text-5xl">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-3 max-w-2xl text-base text-primary-foreground/70 sm:text-lg">{subtitle}</p>
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
