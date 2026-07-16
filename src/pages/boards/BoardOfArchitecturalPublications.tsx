import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, BookOpen, FileText, Loader2, Search } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  bapPublicationApi,
  bapSettingApi,
  boardApi,
  type BapPublicationCategory,
  type BapPublicationItem,
} from "@/lib/api";

const publicationCategories: Array<{
  value: BapPublicationCategory;
  label: string;
}> = [
  { value: "the-architect", label: "The Architect" },
  { value: "vastu", label: "Vastu" },
  { value: "built-environment", label: "Built Environmental Journal" },
  { value: "now-architecture", label: "Now Architecture" },
  { value: "archive-journal", label: "Archive Journal" },
  { value: "year-book", label: "Architects Year Book" },
];

const defaultBapIntroduction =
  "The Board of Architectural Publications (BAP) provides assistance, advice, control and manages the printing and publications for the Sri Lanka Institute of Architects in printed, electronic or digital format.\n\nThe BAP consists of three Standing Committees and six working committees.\n\nStanding Committees\n1. Printing and Publications Committee\n2. Graphics Committee\n3. Library Committee\n\nWorking Committees\n1. Media Committee\n2. The Architect magazine editorial board\n3. Vastu magazine editorial board\n4. Built environmental journal editorial board\n5. Archive journal editorial board\n6. Art Circle - Ad Hoc committee";
const oldBapPlaceholder = "Browse SLIA publications and archives. Use the Publications tab to download issues and reference material.";

const resolveBapIntroduction = (value?: string) => {
  const introduction = value?.trim();
  if (!introduction || introduction === oldBapPlaceholder) return defaultBapIntroduction;
  return value || defaultBapIntroduction;
};

type CategoryFilter = "all" | BapPublicationCategory;
type SortKey = "newest" | "oldest" | "title_asc" | "title_desc";

const isPublicationCategory = (value: string | null): value is BapPublicationCategory =>
  publicationCategories.some((category) => category.value === value);

const formatUploadedDate = (isoDate?: string) => {
  const date = isoDate || new Date().toISOString().slice(0, 10);
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "2-digit" }).format(
    new Date(`${date}T00:00:00`)
  );
};

const getYear = (item: BapPublicationItem) =>
  (item.uploaded_at || item.created_at?.slice(0, 10) || new Date().toISOString().slice(0, 10)).slice(0, 4);

const categoryLabel = (value: BapPublicationCategory) =>
  publicationCategories.find((category) => category.value === value)?.label || value;

const PublicationCard = ({ item }: { item: BapPublicationItem }) => {
  const href = item.file_src || item.external_url || "#";

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      download={Boolean(item.file_src)}
      className="group grid gap-5 rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/50 hover:shadow-md sm:p-5 md:grid-cols-[220px_minmax(0,1fr)]"
    >
      <div className="aspect-[3/4] min-h-[320px] overflow-hidden rounded-xl border border-border bg-muted md:min-h-[300px]">
        {item.cover_src ? (
          <img src={item.cover_src} alt={`${item.title} cover`} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted/60 text-xs font-bold uppercase tracking-widest text-foreground/40">
            SLIA
          </div>
        )}
      </div>

      <div className="min-w-0 self-center">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
            {categoryLabel(item.category)}
          </span>
          <span className="text-xs text-foreground/50">{formatUploadedDate(item.uploaded_at)}</span>
        </div>
        <h3 className="font-heading text-lg font-bold leading-snug text-foreground group-hover:text-primary">
          {item.title}
        </h3>
        {item.volume && <p className="mt-1 text-sm text-foreground/65">{item.volume}</p>}
        <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
          View publication
          <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </a>
  );
};

const PublicationLibrary = ({ publications }: { publications: BapPublicationItem[] }) => {
  const location = useLocation();
  const categoryParam = new URLSearchParams(location.search).get("category");
  const [category, setCategory] = useState<CategoryFilter>(isPublicationCategory(categoryParam) ? categoryParam : "all");
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("all");
  const [sort, setSort] = useState<SortKey>("newest");

  useEffect(() => {
    const selected = new URLSearchParams(location.search).get("category");
    setCategory(isPublicationCategory(selected) ? selected : "all");
  }, [location.search]);

  const years = useMemo(() => {
    const values = Array.from(new Set(publications.map(getYear)));
    return values.sort((a, b) => Number(b) - Number(a));
  }, [publications]);

  const categoryCounts = useMemo(
    () =>
      publicationCategories.reduce(
        (counts, item) => ({
          ...counts,
          [item.value]: publications.filter((publication) => publication.category === item.value).length,
        }),
        {} as Record<BapPublicationCategory, number>
      ),
    [publications]
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const items = publications
      .filter((item) => category === "all" || item.category === category)
      .filter((item) => year === "all" || getYear(item) === year)
      .filter((item) => {
        if (!normalizedQuery) return true;
        return `${item.title} ${item.volume || ""} ${categoryLabel(item.category)}`.toLowerCase().includes(normalizedQuery);
      });

    items.sort((a, b) => {
      const dateA = a.uploaded_at || a.created_at || "";
      const dateB = b.uploaded_at || b.created_at || "";
      if (sort === "newest") return dateB.localeCompare(dateA);
      if (sort === "oldest") return dateA.localeCompare(dateB);
      if (sort === "title_asc") return a.title.localeCompare(b.title);
      return b.title.localeCompare(a.title);
    });

    return items;
  }, [category, publications, query, sort, year]);

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
      <div className="lg:hidden">
        <Label className="text-sm text-foreground/70">Publication Section</Label>
        <Select value={category} onValueChange={(value) => setCategory(value as CategoryFilter)}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Publications ({publications.length})</SelectItem>
            {publicationCategories.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label} ({categoryCounts[item.value] || 0})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <aside className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={`mb-2 flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
              category === "all" ? "bg-primary text-primary-foreground" : "text-foreground/75 hover:bg-muted"
            }`}
          >
            All Publications
            <span>{publications.length}</span>
          </button>
          {publicationCategories.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setCategory(item.value)}
              className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                category === item.value ? "bg-primary text-primary-foreground" : "text-foreground/75 hover:bg-muted"
              }`}
            >
              <span>{item.label}</span>
              <span>{categoryCounts[item.value] || 0}</span>
            </button>
          ))}
        </div>
      </aside>

      <div className="min-w-0 space-y-6">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_160px_180px] md:items-end">
            <div>
              <Label htmlFor="bap-search" className="text-sm text-foreground/70">
                Search
              </Label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                <Input
                  id="bap-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search title, volume, or category"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:contents">
              <div>
                <Label className="text-sm text-foreground/70">Year</Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="All years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All years</SelectItem>
                    {years.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm text-foreground/70">Sort</Label>
                <Select value={sort} onValueChange={(value) => setSort(value as SortKey)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest first</SelectItem>
                    <SelectItem value="oldest">Oldest first</SelectItem>
                    <SelectItem value="title_asc">Title A to Z</SelectItem>
                    <SelectItem value="title_desc">Title Z to A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {filtered.map((item) => (
              <PublicationCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <FileText className="mx-auto mb-4 h-10 w-10 text-foreground/30" />
            <p className="font-medium text-foreground">No publications found.</p>
            <p className="mt-2 text-sm text-foreground/60">Try a different category, year, or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const BoardOfArchitecturalPublicationsBoardsView = ({ breadcrumb }: { breadcrumb: string }) => {
  const location = useLocation();
  const [introduction, setIntroduction] = useState(defaultBapIntroduction);
  const [publications, setPublications] = useState<BapPublicationItem[]>([]);
  const [logo, setLogo] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([bapSettingApi.show(), bapPublicationApi.list(), boardApi.list()])
      .then(([settings, items, boards]) => {
        setIntroduction(resolveBapIntroduction(settings.introduction));
        setPublications(items.filter((item) => item.is_active));
        setLogo(boards.find((board) => board.path === "/bap")?.icon || "/images/board-bap.svg");
      })
      .catch((err) => console.warn("Failed to fetch BAP content:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (location.hash !== "#publications") return;

    window.setTimeout(() => {
      document.getElementById("publications")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, [loading, location.hash]);

  return (
    <PageLayout title="Board of Architectural Publications" subtitle="Publications and archives" breadcrumb={breadcrumb}>
      <section className="py-16">
        <div className="mx-auto w-full max-w-7xl space-y-10 px-3 sm:px-4 lg:px-6">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8 md:p-10">
            <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-border bg-background p-3 shadow-sm">
                {logo ? (
                  <img src={logo} alt="Board of Architectural Publications logo" className="h-full w-full object-contain" />
                ) : (
                  <BookOpen className="h-8 w-8 text-primary" />
                )}
              </div>
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-foreground/60">
                  <BookOpen className="h-3.5 w-3.5 text-primary" />
                  Board of Architectural Publications
                </div>
                <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">Introduction</h2>
              </div>
            </div>
            <div className="mt-4 h-px w-16 bg-border" />
            <div className="mt-5 max-w-3xl whitespace-pre-line text-lg leading-relaxed text-foreground/75">{introduction}</div>
            <div className="mt-8 flex flex-wrap gap-6">
              <Link to="/about-bap" className="text-sm font-medium text-foreground/60 hover:text-foreground hover:underline">
                About this Board
              </Link>
              <a href="#publications" className="text-sm font-medium text-primary hover:underline">
                View Publications
              </a>
            </div>
          </div>

          <div id="publications" className="scroll-mt-28">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Library</p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-foreground md:text-4xl">Publications</h2>
            <p className="mt-4 max-w-3xl text-foreground/70">
              Browse BAP publications by category, year, or title. Each record links directly to the uploaded file or external source.
            </p>
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

const BoardOfArchitecturalPublicationsBoards = () => (
  <BoardOfArchitecturalPublicationsBoardsView breadcrumb="Boards / Board of Architectural Publications" />
);

export default BoardOfArchitecturalPublicationsBoards;
