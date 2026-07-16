import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight, BookOpenCheck, CalendarDays, FileText, GraduationCap, Loader2, Search, Users } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { baeDocumentApi, baeSettingApi, boardApi, type BaeDocumentCategory, type BaeDocumentItem } from "@/lib/api";

const defaultBaeIntroduction =
  "The Board of Architectural Education supports the Institute's education and examination related work, including application processes, notices, reference material, and member resources.";

const documentCategories: Array<{ value: BaeDocumentCategory; label: string }> = [
  {
    value: "applications",
    label: "Applications",
  },
  {
    value: "notices",
    label: "Notices",
  },
  {
    value: "references",
    label: "References",
  },
];

const isDocumentCategory = (value: string | null): value is BaeDocumentCategory =>
  documentCategories.some((category) => category.value === value);

type CategoryFilter = "all" | BaeDocumentCategory;
type SortKey = "newest" | "oldest" | "title_asc" | "title_desc";

const formatDate = (date?: string) => {
  const value = date || new Date().toISOString().slice(0, 10);
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "2-digit" }).format(
    new Date(`${value}T00:00:00`)
  );
};

const documentDate = (item: BaeDocumentItem) =>
  item.uploaded_at || item.created_at?.slice(0, 10) || new Date().toISOString().slice(0, 10);

const documentYear = (item: BaeDocumentItem) => documentDate(item).slice(0, 4);

const categoryLabel = (value: BaeDocumentCategory) =>
  documentCategories.find((category) => category.value === value)?.label || value;

const documentHref = (item: BaeDocumentItem) => item.file_src || item.external_url || "";

const DocumentCard = ({ item }: { item: BaeDocumentItem }) => {
  const href = documentHref(item);

  return (
    <article className="group rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/45 hover:shadow-md sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <FileText className="h-6 w-6" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
              {item.meta || categoryLabel(item.category)}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-foreground/55">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(documentDate(item))}
            </span>
          </div>

          <h3 className="font-heading text-lg font-bold leading-snug text-foreground group-hover:text-primary">
            {item.title}
          </h3>

          {(item.file_name || item.external_url) && (
            <p className="mt-2 truncate text-sm text-foreground/55">{item.file_name || item.external_url}</p>
          )}

          {href ? (
            <a
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer" : undefined}
              download={item.file_src ? item.file_name || item.title : undefined}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Open document
              <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          ) : (
            <p className="mt-5 text-sm font-medium text-foreground/45">Document link not available</p>
          )}
        </div>
      </div>
    </article>
  );
};

const EmptyState = () => (
  <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
    <FileText className="mx-auto mb-4 h-10 w-10 text-foreground/30" />
    <p className="font-medium text-foreground">No documents found.</p>
    <p className="mt-2 text-sm text-foreground/60">Try a different section, year, or search term.</p>
  </div>
);

const DocumentLibrary = ({ documents }: { documents: BaeDocumentItem[] }) => {
  const location = useLocation();
  const section = new URLSearchParams(location.search).get("section");
  const initialCategory = isDocumentCategory(section) ? section : "all";
  const [category, setCategory] = useState<CategoryFilter>(initialCategory);
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("all");
  const [sort, setSort] = useState<SortKey>("newest");

  useEffect(() => {
    const selected = new URLSearchParams(location.search).get("section");
    setCategory(isDocumentCategory(selected) ? selected : "all");
  }, [location.search]);

  const years = useMemo(() => {
    const values = Array.from(new Set(documents.map(documentYear)));
    return values.sort((a, b) => Number(b) - Number(a));
  }, [documents]);

  const categoryCounts = useMemo(
    () =>
      documentCategories.reduce(
        (counts, item) => ({
          ...counts,
          [item.value]: documents.filter((document) => document.category === item.value).length,
        }),
        {} as Record<BaeDocumentCategory, number>
      ),
    [documents]
  );

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const items = documents
      .filter((item) => category === "all" || item.category === category)
      .filter((item) => year === "all" || documentYear(item) === year)
      .filter((item) => {
        if (!normalizedQuery) return true;
        return `${item.title} ${item.meta || ""} ${item.file_name || ""} ${categoryLabel(item.category)}`
          .toLowerCase()
          .includes(normalizedQuery);
      });

    items.sort((a, b) => {
      const dateA = documentDate(a);
      const dateB = documentDate(b);
      if (sort === "newest") return dateB.localeCompare(dateA);
      if (sort === "oldest") return dateA.localeCompare(dateB);
      if (sort === "title_asc") return a.title.localeCompare(b.title);
      return b.title.localeCompare(a.title);
    });

    return items;
  }, [category, documents, query, sort, year]);

  return (
    <div className="space-y-8 lg:flex lg:items-start lg:gap-8 lg:space-y-0">
      <div className="lg:hidden">
        <Label className="text-sm text-foreground/70">Document Section</Label>
        <Select value={category} onValueChange={(value) => setCategory(value as CategoryFilter)}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Documents ({documents.length})</SelectItem>
            {documentCategories.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label} ({categoryCounts[item.value] || 0})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <aside className="hidden lg:sticky lg:top-28 lg:block lg:w-[280px] lg:shrink-0 lg:self-start">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={`mb-2 flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
              category === "all" ? "bg-primary text-primary-foreground" : "text-foreground/75 hover:bg-muted"
            }`}
          >
            <span className="min-w-0 truncate">All Documents</span>
            <span className="shrink-0">{documents.length}</span>
          </button>
          {documentCategories.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setCategory(item.value)}
              className={`flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                category === item.value ? "bg-primary text-primary-foreground" : "text-foreground/75 hover:bg-muted"
              }`}
            >
              <span className="min-w-0 truncate">{item.label}</span>
              <span className="shrink-0">{categoryCounts[item.value] || 0}</span>
            </button>
          ))}
        </div>
      </aside>

      <div className="min-w-0 flex-1 space-y-6">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="min-w-0 flex-1">
              <Label htmlFor="bae-search" className="text-sm text-foreground/70">
                Search
              </Label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                <Input
                  id="bae-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search documents, forms, notices, or references"
                  className="pl-9"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 md:w-[340px] md:shrink-0">
              <div className="min-w-0">
                <Label className="text-sm text-foreground/70">Year</Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
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

              <div className="min-w-0">
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
          <div className="grid gap-4 2xl:grid-cols-2">
            {filtered.map((item) => (
              <DocumentCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export const BoardOfArchitecturalEducationView = ({ breadcrumb }: { breadcrumb: string }) => {
  const location = useLocation();
  const [documents, setDocuments] = useState<BaeDocumentItem[]>([]);
  const [logo, setLogo] = useState("");
  const [introduction, setIntroduction] = useState(defaultBaeIntroduction);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([baeDocumentApi.list(), boardApi.list(), baeSettingApi.show()])
      .then(([items, boards, settings]) => {
        setDocuments(items.filter((item) => item.is_active));
        setLogo(boards.find((board) => board.path === "/bae")?.icon || "/images/board-bae.svg");
        setIntroduction(settings.introduction || defaultBaeIntroduction);
      })
      .catch((err) => console.warn("Failed to fetch BAE content:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (location.hash !== "#bae-documents") return;

    window.setTimeout(() => {
      document.getElementById("bae-documents")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, [loading, location.hash, location.search]);

  return (
    <PageLayout title="Board of Architectural Education" subtitle="Education, documents and member resources" breadcrumb={breadcrumb}>
      <section className="py-16">
        <div className="mx-auto w-full max-w-7xl space-y-10 px-3 sm:px-4 lg:px-6">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-8 md:p-10">
            <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-border bg-background p-3 shadow-sm">
                {logo ? (
                  <img src={logo} alt="Board of Architectural Education logo" className="h-full w-full object-contain" />
                ) : (
                  <GraduationCap className="h-8 w-8 text-primary" />
                )}
              </div>
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-foreground/60">
                  <BookOpenCheck className="h-3.5 w-3.5 text-primary" />
                  Board of Architectural Education
                </div>
                <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">Introduction</h2>
              </div>
            </div>
            <div className="mt-4 h-px w-16 bg-border" />
            <div className="mt-5 max-w-3xl whitespace-pre-line text-lg leading-relaxed text-foreground/75">{introduction}</div>
            <div className="mt-8 flex flex-wrap gap-6">
              <Link to="/about-bae" className="text-sm font-medium text-foreground/60 hover:text-foreground hover:underline">
                About this Board
              </Link>
              <a href="#bae-documents" className="text-sm font-medium text-primary hover:underline">
                View Documents
              </a>
            </div>
          </div>

          <section id="bae-documents" className="scroll-mt-28 space-y-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">Library</p>
              <h2 className="mt-2 font-heading text-3xl font-bold text-foreground md:text-4xl">Documents</h2>
              <p className="mt-4 text-foreground/70">
                Browse education-related documents by section, year, or title. Each record opens the uploaded file or linked resource.
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center rounded-3xl border border-border bg-card py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
              </div>
            ) : (
              <DocumentLibrary documents={documents} />
            )}
          </section>

          <section className="grid gap-5 md:grid-cols-2">
            <Link
              to="/bae/graduate-members"
              className="group rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:border-primary/45 hover:shadow-md sm:p-8"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <GraduationCap className="h-7 w-7" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">Members</p>
              <h2 className="mt-2 font-heading text-2xl font-bold text-foreground group-hover:text-primary">Graduate Members</h2>
              <p className="mt-4 text-foreground/70">View the separate Graduate Members page.</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Open page
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>

            <Link
              to="/bae/student-members"
              className="group rounded-3xl border border-border bg-card p-6 shadow-sm transition hover:border-primary/45 hover:shadow-md sm:p-8"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Users className="h-7 w-7" />
              </div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">Members</p>
              <h2 className="mt-2 font-heading text-2xl font-bold text-foreground group-hover:text-primary">Student Members</h2>
              <p className="mt-4 text-foreground/70">View the separate Student Members page.</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Open page
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>

          </section>
        </div>
      </section>
    </PageLayout>
  );
};

const BoardOfArchitecturalEducation = () => (
  <BoardOfArchitecturalEducationView breadcrumb="Boards / Board of Architectural Education" />
);

export default BoardOfArchitecturalEducation;
