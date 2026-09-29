import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { DocumentLibrary } from "@/pages/boards/BoardOfArchitecturalEducation";
import { baeDocumentApi, type BaeDocumentItem } from "@/lib/api";

const Documents = () => {
  const [documents, setDocuments] = useState<BaeDocumentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    baeDocumentApi
      .list()
      .then((items) => setDocuments(items.filter((item) => item.is_active)))
      .catch((error) => console.warn("Failed to fetch documents:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageLayout title="Resources" subtitle="Forms, resources and reference material" breadcrumb="Resources">
      <section id="documents" className="scroll-mt-28 overflow-hidden py-10 sm:py-16">
        <div className="mx-auto w-full max-w-7xl space-y-8 px-3 sm:px-4 lg:px-6">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Library</p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-foreground md:text-4xl">Resources</h2>
            <p className="mt-4 text-foreground/70">Browse forms, resources and reference material by section, year, or title.</p>
          </div>
          {loading ? (
            <div className="flex items-center justify-center rounded-3xl border border-border bg-card py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
            </div>
          ) : (
            <DocumentLibrary documents={documents} />
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default Documents;
