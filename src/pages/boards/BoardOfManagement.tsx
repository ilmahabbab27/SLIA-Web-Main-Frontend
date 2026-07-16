import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, BriefcaseBusiness, CalendarDays, CheckCircle2, Layers3, Loader2, Search } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { bomItemApi, bomSettingApi, boardApi, type BomItem, type BomItemCategory } from "@/lib/api";

const associationDetails: Array<{
  key: Exclude<BomItemCategory, "programs">;
  label: string;
  description: string;
}> = [
  {
    key: "slapm",
    label: "SLAPM",
    description: "Sri Lanka Association of Project Managers focuses on project leadership, delivery, and management in the built environment.",
  },
  {
    key: "slaud",
    label: "SLAUD",
    description: "Sri Lanka Association of Urban Designers supports sustainable, inclusive, and livable urban design practice.",
  },
  {
    key: "slaia",
    label: "SLAIA",
    description: "Sri Lanka Association of Interior Architects promotes excellence in interior architecture and spatial design.",
  },
  {
    key: "slaac",
    label: "SLAAC",
    description: "Sri Lanka Association of Architects' Computer Club encourages digital tools, technology, and innovation in practice.",
  },
];

const formatDate = (date?: string) => {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "2-digit" }).format(
    new Date(`${date}T00:00:00`)
  );
};

const displayDate = (event: BomItem) => event.event_date || event.created_at?.slice(0, 10) || "";
const getYear = (event: BomItem) => displayDate(event).slice(0, 4);

const externalHref = (link?: string) => {
  const value = link?.trim();
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
};

const EntryCard = ({ item }: { item: BomItem }) => {
  const href = externalHref(item.link);
  const date = displayDate(item);

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:border-primary/45 hover:shadow-md">
      <div className="aspect-[16/10] overflow-hidden bg-muted">
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted/70">
            <BriefcaseBusiness className="h-10 w-10 text-foreground/30" />
          </div>
        )}
      </div>

      <div className="p-5">
        {date && (
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <CalendarDays className="h-3.5 w-3.5" />
            {formatDate(date)}
          </div>
        )}
        <h4 className="font-heading text-xl font-bold leading-snug text-foreground group-hover:text-primary">
          {item.title}
        </h4>
        {item.description && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-foreground/68">{item.description}</p>
        )}
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Open external link
            <ArrowUpRight className="h-4 w-4" />
          </a>
        )}
      </div>
    </article>
  );
};

const EmptyState = ({ label }: { label: string }) => (
  <div className="rounded-2xl border border-dashed border-border bg-card/60 p-10 text-center">
    <p className="font-medium text-foreground/70">No {label} currently listed.</p>
  </div>
);

export const BoardOfManagementView = ({ breadcrumb }: { breadcrumb: string }) => {
  const [introduction, setIntroduction] = useState({
    title: "Board of Management",
    description: "The Board of Management oversees strategic direction, programs, and professional associations.",
    focusPoints: [
      "Governance and institutional strategy",
      "Professional development programs",
      "Collaboration with associations",
      "Operational oversight and planning",
    ],
  });
  const [items, setItems] = useState<BomItem[]>([]);
  const [logo, setLogo] = useState("");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | BomItemCategory>("all");
  const [yearFilter, setYearFilter] = useState("all");

  useEffect(() => {
    Promise.all([bomSettingApi.show(), bomItemApi.list(), boardApi.list()])
      .then(([settings, bomItems, boards]) => {
        setIntroduction({
          title: settings.introduction_title || "Board of Management",
          description: settings.introduction || "",
          focusPoints: settings.focus_points?.length ? settings.focus_points : [],
        });
        setItems(bomItems.filter((item) => item.is_active));
        setLogo(boards.find((board) => board.path === "/management")?.icon || "/images/board-bom.svg");
      })
      .catch((err) => console.warn("Failed to fetch BOM content:", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items
      .filter((item) => categoryFilter === "all" || item.category === categoryFilter)
      .filter((item) => yearFilter === "all" || getYear(item) === yearFilter)
      .filter((item) => {
        if (!normalizedQuery) return true;
        return `${item.title} ${item.description || ""} ${item.category}`.toLowerCase().includes(normalizedQuery);
      })
      .sort((a, b) => a.sort_order - b.sort_order || a.title.localeCompare(b.title));
  }, [categoryFilter, items, query, yearFilter]);

  const years = useMemo(() => {
    const values = Array.from(new Set(items.map(getYear).filter(Boolean)));
    return values.sort((a, b) => Number(b) - Number(a));
  }, [items]);

  const byCategory = (category: BomItemCategory) => filteredItems.filter((item) => item.category === category);

  const programItems = byCategory("programs");

  return (
    <PageLayout title="Board of Management" subtitle="Governing Council and Management" breadcrumb={breadcrumb}>
      <section className="py-16">
        <div className="mx-auto w-full max-w-7xl space-y-12 px-3 sm:px-4 lg:px-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8 md:p-10">
              <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-border bg-background p-3 shadow-sm">
                  {logo ? (
                    <img src={logo} alt="Board of Management logo" className="h-full w-full object-contain" />
                  ) : (
                    <BriefcaseBusiness className="h-8 w-8 text-primary" />
                  )}
                </div>
                <div>
                  <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-primary">Governance</p>
                  <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-5xl">
                    {introduction.title}
                  </h2>
                </div>
              </div>

              <div className="h-px w-20 bg-border" />
              <p className="mt-7 max-w-3xl text-lg leading-relaxed text-foreground/75 md:text-xl">
                {introduction.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-6">
                <a href="#bom-programs" className="text-sm font-semibold text-primary hover:underline">
                  View programs
                </a>
                <a href="#bom-associations" className="text-sm font-semibold text-primary hover:underline">
                  View associations
                </a>
                <Link to="/about-management" className="text-sm font-medium text-foreground/60 hover:text-foreground hover:underline">
                  About this Board
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-muted/30 p-6 shadow-sm sm:p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Layers3 className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground">Management Focus</h3>
              <div className="mt-6 space-y-3">
                {introduction.focusPoints.map((point) => (
                  <div key={point} className="flex gap-3 rounded-2xl border border-border bg-background/60 p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <p className="text-sm leading-relaxed text-foreground/72">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <section id="bom-programs" className="scroll-mt-28 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px_160px] md:items-end">
                <div>
                  <Label htmlFor="bom-search" className="text-sm text-foreground/70">
                    Search
                  </Label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                    <Input
                      id="bom-search"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search programs, associations, or descriptions"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:contents">
                  <div>
                    <Label className="text-sm text-foreground/70">Section</Label>
                    <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as "all" | BomItemCategory)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sections</SelectItem>
                        <SelectItem value="programs">Programs</SelectItem>
                        <SelectItem value="slapm">SLAPM</SelectItem>
                        <SelectItem value="slaud">SLAUD</SelectItem>
                        <SelectItem value="slaia">SLAIA</SelectItem>
                        <SelectItem value="slaac">SLAAC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm text-foreground/70">Year</Label>
                    <Select value={yearFilter} onValueChange={setYearFilter}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Years</SelectItem>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">Programs</p>
              <h2 className="mt-2 font-heading text-3xl font-bold text-foreground md:text-4xl">Programs & Workshops</h2>
              <p className="mt-4 text-foreground/70">
                Professional development workshops, institutional programs, and management-led initiatives.
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center rounded-3xl border border-border bg-card py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
              </div>
            ) : programItems.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {programItems.map((item) => (
                  <EntryCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <EmptyState label="programs" />
            )}
          </section>

          <section id="bom-associations" className="scroll-mt-28 space-y-8">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">Associations</p>
              <h2 className="mt-2 font-heading text-3xl font-bold text-foreground md:text-4xl">Professional Associations</h2>
              <p className="mt-4 text-foreground/70">
                Specialized associations operating under the SLIA umbrella, supporting focused areas of practice and professional development.
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center rounded-3xl border border-border bg-card py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
              </div>
            ) : (
              <div className="space-y-6">
                {associationDetails.map((association) => {
                  const associationItems = byCategory(association.key);

                  return (
                    <div key={association.key} className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7">
                      <div className="mb-6 grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">{association.label}</p>
                          <h3 className="mt-2 font-heading text-2xl font-bold text-foreground">{association.label}</h3>
                        </div>
                        <p className="max-w-3xl text-sm leading-relaxed text-foreground/68">{association.description}</p>
                      </div>

                      {associationItems.length > 0 ? (
                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                          {associationItems.map((item) => (
                            <EntryCard key={item.id} item={item} />
                          ))}
                        </div>
                      ) : (
                        <EmptyState label={`${association.label} entries`} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </section>
    </PageLayout>
  );
};

const BoardOfManagement = () => <BoardOfManagementView breadcrumb="Boards / Board of Management" />;

export default BoardOfManagement;
