import { useMemo, useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { bapAdminStorage } from "@/pages/bapAdmin/storage";
import type { PublicationRecord } from "@/pages/bapAdmin/types";
import { Link } from "react-router-dom";

type PublicationDoc = {
  coverSrc: string;
  volume: string;
  title: string;
  uploadedAt: string; // YYYY-MM-DD
  href: string;
};

const formatUploadedDate = (isoDate: string) =>
  new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "2-digit" }).format(
    // Ensure a valid ISO-8601 datetime for consistent parsing across browsers.
    new Date(`${isoDate}T00:00:00`)
  );

const getYear = (isoDate: string) => isoDate.slice(0, 4);

const DocumentCard = ({ item }: { item: PublicationDoc }) => (
  <div className="rounded-2xl border border-border/70 bg-background/60 p-5 hover:bg-background/80 hover:shadow-sm transition">
    <div className="w-full aspect-[3/4] rounded-2xl border border-border bg-muted overflow-hidden">
      <img
        src={item.coverSrc}
        alt={`${item.title} cover`}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </div>

    <div className="mt-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-heading font-semibold text-foreground">{item.title}</p>
          <p className="mt-1 text-sm text-foreground/70">{item.volume}</p>
        </div>
        <span className="shrink-0 text-xs rounded-full border border-border bg-muted/40 px-2 py-1 text-foreground/70">
          View
        </span>
      </div>

      <p className="mt-2 text-xs text-foreground/60">
        Uploaded: <span className="font-medium text-foreground/70">{formatUploadedDate(item.uploadedAt)}</span>
      </p>

      <div className="mt-4">
        <Button className="w-full" variant="outline" asChild>
          <a href={item.href} target="_blank" rel="noreferrer">
            View publication
          </a>
        </Button>
      </div>
    </div>
  </div>
);

type SortKey = "newest" | "oldest" | "title_asc" | "title_desc";

const PublicationGrid = ({ items }: { items: PublicationDoc[] }) => {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("newest");

  const years = useMemo(() => {
    const ys = Array.from(new Set(items.map((i) => getYear(i.uploadedAt))));
    ys.sort((a, b) => Number(b) - Number(a));
    return ys;
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      const matchesYear = year === "all" ? true : getYear(i.uploadedAt) === year;
      if (!matchesYear) return false;
      if (!q) return true;
      const hay = `${i.title} ${i.volume} `.toLowerCase();
      return hay.includes(q);
    });
  }, [items, query, year]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      if (sort === "newest") return b.uploadedAt.localeCompare(a.uploadedAt);
      if (sort === "oldest") return a.uploadedAt.localeCompare(b.uploadedAt);
      if (sort === "title_asc") return a.title.localeCompare(b.title);
      return b.title.localeCompare(a.title);
    });
    return arr;
  }, [filtered, sort]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="w-full md:w-[360px]">
          <Label htmlFor="pub-search" className="text-sm text-foreground/70">
            Search
          </Label>
          <Input
            id="pub-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or volume..."
            className="mt-2"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="w-full sm:w-[180px]">
            <Label className="text-sm text-foreground/70">Year</Label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {years.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-[220px]">
            <Label className="text-sm text-foreground/70">Sort</Label>
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="title_asc">Title A → Z</SelectItem>
                <SelectItem value="title_desc">Title Z → A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {sorted.length ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((item) => (
            <DocumentCard key={`${item.title} -${item.volume} `} item={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-background/60 p-8 text-center text-sm text-foreground/70">
          No publications found.
        </div>
      )}
    </div>
  );
};

const theArchitectFallback: PublicationDoc[] = [
  { coverSrc: "/images/hero-1.jpg", volume: "Issue 01", title: "The Architect (Placeholder)", uploadedAt: "2026-03-01", href: "/brochure.pdf" },
  { coverSrc: "/images/hero-2.jpg", volume: "Issue 02", title: "The Architect (Placeholder)", uploadedAt: "2026-02-01", href: "/brochure.pdf" },
  { coverSrc: "/images/hero-3.jpg", volume: "Issue 03", title: "The Architect (Placeholder)", uploadedAt: "2026-01-01", href: "/brochure.pdf" },
];

const vastuFallback: PublicationDoc[] = [
  { coverSrc: "/images/event-1.jpg", volume: "Issue 01", title: "Vastu (Placeholder)", uploadedAt: "2026-03-01", href: "/brochure.pdf" },
  { coverSrc: "/images/event-2.jpg", volume: "Issue 02", title: "Vastu (Placeholder)", uploadedAt: "2026-02-01", href: "/brochure.pdf" },
  { coverSrc: "/images/event-3.jpg", volume: "Issue 03", title: "Vastu (Placeholder)", uploadedAt: "2026-01-01", href: "/brochure.pdf" },
];

const builtEnvironmentJournalFallback: PublicationDoc[] = [
  { coverSrc: "/images/hero-4.jpg", volume: "Vol 01", title: "Built Environment Journal (Placeholder)", uploadedAt: "2026-03-01", href: "/brochure.pdf" },
  { coverSrc: "/images/hero-1.jpg", volume: "Vol 02", title: "Built Environment Journal (Placeholder)", uploadedAt: "2026-02-01", href: "/brochure.pdf" },
  { coverSrc: "/images/hero-2.jpg", volume: "Vol 03", title: "Built Environment Journal (Placeholder)", uploadedAt: "2026-01-01", href: "/brochure.pdf" },
];

const nowArchitectureFallback: PublicationDoc[] = [
  { coverSrc: "/images/event-4.jpg", volume: "2026", title: "Now Architecture (Placeholder)", uploadedAt: "2026-03-01", href: "/brochure.pdf" },
  { coverSrc: "/images/event-1.jpg", volume: "2025", title: "Now Architecture (Placeholder)", uploadedAt: "2026-02-01", href: "/brochure.pdf" },
];

const archiveJournalFallback: PublicationDoc[] = [
  { coverSrc: "/images/hero-3.jpg", volume: "Vol 01", title: "Archive Journal (Placeholder)", uploadedAt: "2026-02-15", href: "/brochure.pdf" },
  { coverSrc: "/images/hero-4.jpg", volume: "Vol 02", title: "Archive Journal (Placeholder)", uploadedAt: "2026-01-15", href: "/brochure.pdf" },
];

const architectsYearBookFallback: PublicationDoc[] = [
  { coverSrc: "/images/hero-2.jpg", volume: "2026", title: "Architects Year Book (Placeholder)", uploadedAt: "2026-03-01", href: "/brochure.pdf" },
  { coverSrc: "/images/hero-1.jpg", volume: "2025", title: "Architects Year Book (Placeholder)", uploadedAt: "2026-02-01", href: "/brochure.pdf" },
];

const toPublicationDoc = (p: PublicationRecord): PublicationDoc => ({
  coverSrc: p.coverSrc,
  volume: p.volume,
  title: p.title,
  uploadedAt: p.uploadedAt,
  href: p.href,
});

const getGroupItems = (
  all: PublicationRecord[],
  group: PublicationRecord["group"],
  fallback: PublicationDoc[]
): PublicationDoc[] => {
  const filtered = all.filter((p) => p.group === group).map(toPublicationDoc);
  return filtered.length ? filtered : fallback;
};

export const BoardOfArchitecturalPublicationsBoardsView = ({ breadcrumb }: { breadcrumb: string }) => {

  return (
    <PageLayout
      title="Board of Architectural Publications"
      subtitle="Publications and archives"
      breadcrumb={breadcrumb}
    >
      <section className="py-16">
        <div className="container max-w-6xl mx-auto space-y-10">
          <Tabs defaultValue="introduction" className="space-y-6">
            <TabsList className="w-full h-auto flex flex-wrap justify-start gap-1">
              <TabsTrigger value="introduction" className="flex-1 sm:flex-none">
                Introduction
              </TabsTrigger>
              <TabsTrigger value="publications" className="flex-1 sm:flex-none">
                Publications
              </TabsTrigger>
            </TabsList>

            <TabsContent value="introduction" className="mt-0">
              <div className="rounded-3xl border border-border bg-card p-8 md:p-10 shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(800px_circle_at_20%_0%,hsl(var(--primary)/0.14),transparent_55%),radial-gradient(700px_circle_at_80%_20%,hsl(var(--secondary)/0.12),transparent_55%)]" />
                <div className="relative">
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                    Introduction
                  </h2>
                  <div className="w-16 h-1 rounded-full bg-gradient-to-r from-primary/70 via-secondary/60 to-accent/50 mt-4" />
                  <p className="mt-5 text-foreground/75 leading-relaxed max-w-3xl text-lg">
                    Browse SLIA publications and archives. Use the Publications tab to download issues and reference
                    material.
                  </p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button asChild>
                      <Link to="/bap-admin/login">BAP Login (Authorities)</Link>
                    </Button>
                    <Button variant="secondary" asChild>
                      <Link to="/about-bap">About this Board</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="publications" className="mt-0">
              <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
                <Tabs defaultValue="the-architect" className="space-y-6">
                  <TabsList className="w-full h-auto flex flex-wrap justify-start gap-1">
                    <TabsTrigger value="the-architect" className="flex-1 sm:flex-none">
                      The Architect
                    </TabsTrigger>
                    <TabsTrigger value="vastu" className="flex-1 sm:flex-none">
                      Vastu
                    </TabsTrigger>
                    <TabsTrigger value="built-environment" className="flex-1 sm:flex-none">
                      Built Environmental journal
                    </TabsTrigger>
                    <TabsTrigger value="other" className="flex-1 sm:flex-none">
                      Other
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="the-architect" className="mt-0">
                    <PublicationGrid
                      items={getGroupItems(bapAdminStorage.publications.getAll([]), "the-architect", theArchitectFallback)}
                    />
                  </TabsContent>

                  <TabsContent value="vastu" className="mt-0">
                    <PublicationGrid
                      items={getGroupItems(bapAdminStorage.publications.getAll([]), "vastu", vastuFallback)}
                    />
                  </TabsContent>

                  <TabsContent value="built-environment" className="mt-0">
                    <PublicationGrid
                      items={getGroupItems(
                        bapAdminStorage.publications.getAll([]),
                        "built-environment",
                        builtEnvironmentJournalFallback
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="other" className="mt-0">
                    <Tabs defaultValue="now-architecture" className="space-y-6">
                      <TabsList className="w-full h-auto flex flex-wrap justify-start gap-1">
                        <TabsTrigger value="now-architecture" className="flex-1 sm:flex-none">
                          Now architecture
                        </TabsTrigger>
                        <TabsTrigger value="archive-journal" className="flex-1 sm:flex-none">
                          Archive Journal
                        </TabsTrigger>
                        <TabsTrigger value="year-book" className="flex-1 sm:flex-none">
                          Architects year book
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="now-architecture" className="mt-0">
                        <PublicationGrid
                          items={getGroupItems(
                            bapAdminStorage.publications.getAll([]),
                            "now-architecture",
                            nowArchitectureFallback
                          )}
                        />
                      </TabsContent>

                      <TabsContent value="archive-journal" className="mt-0">
                        <PublicationGrid
                          items={getGroupItems(
                            bapAdminStorage.publications.getAll([]),
                            "archive-journal",
                            archiveJournalFallback
                          )}
                        />
                      </TabsContent>

                      <TabsContent value="year-book" className="mt-0">
                        <PublicationGrid
                          items={getGroupItems(
                            bapAdminStorage.publications.getAll([]),
                            "year-book",
                            architectsYearBookFallback
                          )}
                        />
                      </TabsContent>
                    </Tabs>
                  </TabsContent>
                </Tabs>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </PageLayout>
  );
};

const BoardOfArchitecturalPublicationsBoards = () => (
  <BoardOfArchitecturalPublicationsBoardsView breadcrumb="Boards / Board of Architectural Publications" />
);

export default BoardOfArchitecturalPublicationsBoards;
