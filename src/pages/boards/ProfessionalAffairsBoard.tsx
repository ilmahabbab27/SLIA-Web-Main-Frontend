import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, CheckCircle2, Loader2, Search, FileText, CalendarDays, Layers3 } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { pabSettingApi, pabEventApi, pabApplicationApi, pabPublicationApi, type PabEvent, type PabApplication, type PabPublication } from "@/lib/api";

type SortKey = "newest" | "oldest" | "title_asc" | "title_desc";

const formatDate = (date?: string) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "2-digit" }).format(
    new Date(`${date}T00:00:00`)
  );
};

const getDate = (item: PabEvent | PabApplication | PabPublication, type: string) => {
  if (type === "cpd") return (item as PabEvent).event_date;
  return item.created_at?.slice(0, 10);
};

const ItemCard = ({ item, type, onDownload }: {
  item: PabEvent | PabApplication | PabPublication;
  type: "cpd" | "applications" | "publications";
  onDownload: (name: string, src: string) => void;
}) => {
  const getCategoryLabel = () => {
    switch(type) {
      case "cpd": return "CPD Event";
      case "applications": return "Application";
      case "publications": return "Publication";
    }
  };

  const date = getDate(item, type);
  const file = type === "cpd"
    ? { name: (item as PabEvent).file_name, src: (item as PabEvent).file_src }
    : { name: (item as any).file_name, src: (item as any).file_src };

  const imageUrl = type === "cpd" ? (item as PabEvent).image_src : undefined;

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:border-primary/45 hover:shadow-md">
      <div className="aspect-[16/10] overflow-hidden bg-muted">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted/70">
            <FileText className="h-10 w-10 text-foreground/30" />
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {getCategoryLabel()}
          </div>
          {date && (
            <span className="inline-flex items-center gap-1.5 text-xs text-foreground/55">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(date)}
            </span>
          )}
        </div>
        <h4 className="font-heading text-xl font-bold leading-snug text-foreground group-hover:text-primary">
          {item.title}
        </h4>
        {item.description && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-foreground/68">{item.description}</p>
        )}
        {file.name && file.src && (
          <button
            onClick={() => onDownload(file.name!, file.src!)}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Download {type === "cpd" ? "materials" : "file"}
            <ArrowUpRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </article>
  );
};

const EmptyState = () => (
  <div className="rounded-2xl border border-dashed border-border bg-card/60 p-10 text-center">
    <p className="font-medium text-foreground/70">No items currently listed.</p>
  </div>
);

export const ProfessionalAffairsBoardView = ({ breadcrumb }: { breadcrumb: string }) => {
  const [introduction, setIntroduction] = useState({
    title: "Professional Affairs Board",
    description: "Oversees practice registrations, CPD events, and professional conduct standards.",
  });
  const [cpdEvents, setCpdEvents] = useState<PabEvent[]>([]);
  const [applications, setApplications] = useState<PabApplication[]>([]);
  const [publications, setPublications] = useState<PabPublication[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settings, events, apps, pubs] = await Promise.all([
          pabSettingApi.show(),
          pabEventApi.list(),
          pabApplicationApi.list(),
          pabPublicationApi.list(),
        ]);
        setIntroduction({
          title: "Professional Affairs Board",
          description: settings.introduction || "Oversees practice registrations, CPD events, and professional conduct standards.",
        });
        setCpdEvents(events.filter(e => e.is_active).sort((a, b) => a.sort_order - b.sort_order));
        setApplications(apps.filter(a => a.is_active).sort((a, b) => a.sort_order - b.sort_order));
        setPublications(pubs.filter(p => p.is_active).sort((a, b) => a.sort_order - b.sort_order));
      } catch (err) {
        console.error("Failed to load PAB data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const downloadFile = (fileName: string, fileSrc: string) => {
    const link = document.createElement("a");
    link.href = fileSrc;
    link.download = fileName;
    link.click();
  };

  const allItems = useMemo(() => {
    const items: Array<{ item: PabEvent | PabApplication | PabPublication; type: "cpd" | "applications" | "publications" }> = [
      ...cpdEvents.map(e => ({ item: e, type: "cpd" as const })),
      ...applications.map(a => ({ item: a, type: "applications" as const })),
      ...publications.map(p => ({ item: p, type: "publications" as const })),
    ];
    return items;
  }, [cpdEvents, applications, publications]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    let items = allItems.filter((item) => {
      if (!normalizedQuery) return true;
      return `${item.item.title} ${item.item.description || ""}`
        .toLowerCase()
        .includes(normalizedQuery);
    });

    if (sort === "newest") {
      items.sort((a, b) => {
        const dateA = getDate(a.item, a.type) || "";
        const dateB = getDate(b.item, b.type) || "";
        return dateB.localeCompare(dateA);
      });
    } else if (sort === "oldest") {
      items.sort((a, b) => {
        const dateA = getDate(a.item, a.type) || "";
        const dateB = getDate(b.item, b.type) || "";
        return dateA.localeCompare(dateB);
      });
    } else if (sort === "title_asc") {
      items.sort((a, b) => a.item.title.localeCompare(b.item.title));
    } else if (sort === "title_desc") {
      items.sort((a, b) => b.item.title.localeCompare(a.item.title));
    }

    return items;
  }, [allItems, query, sort]);

  if (loading) {
    return (
      <PageLayout title="Professional Affairs Board" subtitle="Professional Affairs Board" breadcrumb={breadcrumb}>
        <section className="py-20">
          <div className="container flex justify-center items-center min-h-96">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Professional Affairs Board" subtitle="Professional Affairs Board" breadcrumb={breadcrumb}>
      <section className="py-16">
        <div className="mx-auto w-full max-w-7xl space-y-12 px-3 sm:px-4 lg:px-6">
          {/* Header Section */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8 md:p-10">
            <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-border bg-background p-3 shadow-sm">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-primary">Professional Standards</p>
                <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-5xl">
                  {introduction.title}
                </h2>
              </div>
            </div>

            <div className="h-px w-20 bg-border" />
            <p className="mt-7 max-w-3xl text-lg leading-relaxed text-foreground/75 md:text-xl">
              {introduction.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#cpd-events" className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20 transition">
                CPD Events
              </a>
              <a href="#applications-items" className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20 transition">
                Applications
              </a>
              <a href="#publications-items" className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20 transition">
                Publications
              </a>
              <Link to="/about-pab" className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground/60 hover:bg-muted transition">
                About this Board
              </Link>
            </div>
          </div>

          {/* Search and Filters */}
          <div id="pab-items" className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                  <Input
                    placeholder="Search by title or description..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={sort} onValueChange={(value) => setSort(value as SortKey)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="title_asc">Title A-Z</SelectItem>
                  <SelectItem value="title_desc">Title Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* CPD Events Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CalendarDays className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-2xl font-bold text-foreground">CPD Events</h3>
              </div>
              <a href="#cpd-events" className="text-sm font-semibold text-primary hover:underline">
                Browse items
              </a>
            </div>
            {filtered.filter((item) => item.type === "cpd").length === 0 ? (
              <EmptyState />
            ) : (
              <div id="cpd-events" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filtered
                  .filter((item) => item.type === "cpd")
                  .map((item, idx) => (
                    <ItemCard
                      key={`cpd-${idx}`}
                      item={item.item}
                      type="cpd"
                      onDownload={downloadFile}
                    />
                  ))}
              </div>
            )}
          </div>

          {/* Applications Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-2xl font-bold text-foreground">Applications</h3>
              </div>
              <a href="#applications-items" className="text-sm font-semibold text-primary hover:underline">
                Browse items
              </a>
            </div>
            {filtered.filter((item) => item.type === "applications").length === 0 ? (
              <EmptyState />
            ) : (
              <div id="applications-items" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filtered
                  .filter((item) => item.type === "applications")
                  .map((item, idx) => (
                    <ItemCard
                      key={`app-${idx}`}
                      item={item.item}
                      type="applications"
                      onDownload={downloadFile}
                    />
                  ))}
              </div>
            )}
          </div>

          {/* Publications Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Layers3 className="h-5 w-5 text-primary" />
                <h3 className="font-heading text-2xl font-bold text-foreground">Publications</h3>
              </div>
              <a href="#publications-items" className="text-sm font-semibold text-primary hover:underline">
                Browse items
              </a>
            </div>
            {filtered.filter((item) => item.type === "publications").length === 0 ? (
              <EmptyState />
            ) : (
              <div id="publications-items" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filtered
                  .filter((item) => item.type === "publications")
                  .map((item, idx) => (
                    <ItemCard
                      key={`pub-${idx}`}
                      item={item.item}
                      type="publications"
                      onDownload={downloadFile}
                    />
                  ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

const ProfessionalAffairsBoard = () => <ProfessionalAffairsBoardView breadcrumb="Boards / Professional Affairs Board" />;

export default ProfessionalAffairsBoard;
