import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { PublicationLibrary } from "@/pages/boards/BoardOfArchitecturalPublications";
import { bapPublicationApi, type BapPublicationItem } from "@/lib/api";

const Publications = () => {
  const [publications, setPublications] = useState<BapPublicationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bapPublicationApi
      .list()
      .then((items) => setPublications(items.filter((item) => item.is_active)))
      .catch((error) => console.warn("Failed to fetch publications:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout title="Publications" subtitle="SLIA journals, books and archive material" breadcrumb="Publications">
      <section id="publications" className="scroll-mt-28 py-16">
        <div className="mx-auto w-full max-w-7xl space-y-8 px-3 sm:px-4 lg:px-6">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Library</p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-foreground md:text-4xl">Publications</h2>
            <p className="mt-4 text-foreground/70">Browse publications by category, year, or title.</p>
          </div>
          {loading ? (
            <div className="flex items-center justify-center rounded-3xl border border-border bg-card py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
            </div>
          ) : (
            <PublicationLibrary publications={publications} />
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default Publications;
