import { useEffect, useMemo, useState } from "react";
import PageLayout from "@/components/PageLayout";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { annualEventApi, type AnnualEventItem } from "@/lib/api";
import {
  CalendarDays,
  ExternalLink,
  GalleryHorizontalEnd,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Megaphone,
  MoonStar,
  Presentation,
  Users,
  X,
} from "lucide-react";

type EventType = AnnualEventItem["event_type"];
type ActiveType = "all" | EventType;

const annualSessionEvents: Array<{
  id: EventType;
  title: string;
  subtitle: string;
  Icon: typeof Users;
}> = [
  { id: "agm", title: "AGM", subtitle: "Annual General Meeting", Icon: Users },
  { id: "inauguration", title: "Inauguration", subtitle: "Annual Session Opening", Icon: Megaphone },
  { id: "conference", title: "Conference", subtitle: "Architecture and Built Environment", Icon: Presentation },
  { id: "exhibition", title: "Exhibition", subtitle: "Architects' Work and Trade Exhibition", Icon: GalleryHorizontalEnd },
  { id: "members-night", title: "Members Night", subtitle: "Member fellowship evening", Icon: MoonStar },
];

const eventTypeLabels = annualSessionEvents.reduce(
  (labels, item) => ({ ...labels, [item.id]: item.title }),
  {} as Record<EventType, string>
);

const eventTypeOrder = annualSessionEvents.reduce(
  (order, item, index) => ({ ...order, [item.id]: index }),
  {} as Record<EventType, number>
);

const getYear = (item: AnnualEventItem) => item.year || item.title.match(/\b(19|20)\d{2}\b/)?.[0] || "";
const getImages = (item: AnnualEventItem) => (item.images?.length ? item.images : item.image ? [item.image] : []);

const SliaAnnualSessions = () => {
  const [annualEvents, setAnnualEvents] = useState<AnnualEventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<ActiveType>("all");
  const [activeYear, setActiveYear] = useState("latest");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    annualEventApi
      .list()
      .then((data) => {
        if (cancelled) return;
        setAnnualEvents(data.filter((item) => item.is_active));
      })
      .catch((err) => {
        console.warn("Failed to fetch annual events:", err);
        if (!cancelled) setAnnualEvents([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const sortedAnnualEvents = useMemo(
    () =>
      [...annualEvents].sort((a, b) => {
        const byYear = Number(getYear(b)) - Number(getYear(a));
        if (!Number.isNaN(byYear) && byYear !== 0) return byYear;
        return (a.sort_order || 0) - (b.sort_order || 0) || eventTypeOrder[a.event_type] - eventTypeOrder[b.event_type];
      }),
    [annualEvents]
  );

  const years = useMemo(
    () => Array.from(new Set(sortedAnnualEvents.map((item) => getYear(item)).filter(Boolean))).sort((a, b) => Number(b) - Number(a)),
    [sortedAnnualEvents]
  );

  const latestYear = years[0] || "";
  const selectedYear = activeYear === "latest" ? latestYear : activeYear === "all" ? "" : activeYear;

  const filteredEvents = useMemo(
    () =>
      sortedAnnualEvents
        .filter((item) => !selectedYear || getYear(item) === selectedYear)
        .filter((item) => activeType === "all" || item.event_type === activeType),
    [activeType, selectedYear, sortedAnnualEvents]
  );

  const eventCounts = useMemo(
    () =>
      sortedAnnualEvents.reduce(
        (counts, item) => ({
          ...counts,
          [item.event_type]: (counts[item.event_type] || 0) + 1,
        }),
        {} as Record<EventType, number>
      ),
    [sortedAnnualEvents]
  );

  const heroImages = useMemo(
    () => sortedAnnualEvents.flatMap((item) => getImages(item)).slice(0, 4),
    [sortedAnnualEvents]
  );

  const totalImages = useMemo(
    () => sortedAnnualEvents.reduce((count, item) => count + getImages(item).length, 0),
    [sortedAnnualEvents]
  );

  const lightboxImages = useMemo(
    () =>
      filteredEvents.flatMap((item) =>
        getImages(item).map((image, imageIndex) => ({
          image,
          title: item.title || `${eventTypeLabels[item.event_type]} ${getYear(item)}`,
          label: `${eventTypeLabels[item.event_type]} ${getYear(item)}`.trim(),
          alt: `${item.title || eventTypeLabels[item.event_type]} image ${imageIndex + 1}`,
        }))
      ),
    [filteredEvents]
  );

  const activeLightbox = lightboxIndex === null ? null : lightboxImages[lightboxIndex];

  const openLightbox = (image: string) => {
    const nextIndex = lightboxImages.findIndex((item) => item.image === image);
    setLightboxIndex(nextIndex >= 0 ? nextIndex : 0);
  };

  const closeLightbox = () => setLightboxIndex(null);

  const showPreviousImage = () => {
    setLightboxIndex((current) => {
      if (current === null || lightboxImages.length === 0) return current;
      return current === 0 ? lightboxImages.length - 1 : current - 1;
    });
  };

  const showNextImage = () => {
    setLightboxIndex((current) => {
      if (current === null || lightboxImages.length === 0) return current;
      return current === lightboxImages.length - 1 ? 0 : current + 1;
    });
  };

  return (
    <PageLayout
      title="SLIA Annual Sessions"
      subtitle="A yearly SLIA program bringing together formal sessions, talks, exhibitions, and member events."
      breadcrumb="Home / Events / SLIA Annual Sessions"
    >
      <section className="bg-background py-10 md:py-14">
        <div className="container space-y-12">
          <ScrollReveal variant="fadeUp">
            <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-stretch">
              <div className="flex min-h-[420px] flex-col justify-between border border-border bg-card p-6 shadow-sm md:p-8">
                <div>
                  <div className="inline-flex w-fit items-center gap-2 border border-border bg-background px-3 py-1 text-xs font-medium text-foreground/70">
                    <CalendarDays className="h-4 w-4 text-primary" />
                    Official annual event hub
                  </div>

                  <h2 className="mt-6 font-heading text-4xl font-semibold leading-tight text-foreground md:text-5xl">
                    Annual Sessions by year and event
                  </h2>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-foreground/70 md:text-base">
                    Browse official SLIA Annual Sessions galleries across AGM, inauguration, conference,
                    exhibition, and members night events.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-3">
                  <div className="border border-border bg-background p-4">
                    <p className="text-xs uppercase tracking-widest text-foreground/50">Years</p>
                    <p className="mt-1 text-2xl font-semibold text-foreground">{sortedAnnualEvents.length}</p>
                  </div>
                  <div className="border border-border bg-background p-4">
                    <p className="text-xs uppercase tracking-widest text-foreground/50">Photos</p>
                    <p className="mt-1 text-2xl font-semibold text-foreground">{totalImages}</p>
                  </div>
                  <div className="border border-border bg-background p-4">
                    <p className="text-xs uppercase tracking-widest text-foreground/50">Latest</p>
                    <p className="mt-1 text-2xl font-semibold text-foreground">{latestYear || "-"}</p>
                  </div>
                </div>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Button asChild>
                    <a href="https://sliaannualsessions.lk/" target="_blank" rel="noreferrer">
                      Visit SLIA Annual Sessions Website <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="#galleries">View galleries</a>
                  </Button>
                </div>
              </div>

              <div className="grid min-h-[420px] gap-3 sm:grid-cols-2">
                {heroImages.length > 0 ? (
                  heroImages.map((image, index) => (
                    <div
                      key={`${image.slice(0, 24)}-${index}`}
                      className={index === 0 ? "relative min-h-[300px] overflow-hidden sm:row-span-2" : "relative min-h-[200px] overflow-hidden"}
                    >
                      <img
                        src={image}
                        alt={`SLIA Annual Sessions highlight ${index + 1}`}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading={index === 0 ? "eager" : "lazy"}
                      />
                      <div className="absolute inset-0 bg-black/10" />
                    </div>
                  ))
                ) : (
                  <div className="grid min-h-[420px] place-items-center border border-dashed border-border bg-card sm:col-span-2">
                    {loading ? (
                      <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
                    ) : (
                      <GalleryHorizontalEnd className="h-16 w-16 text-primary/25" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fadeUp" delay={0.05}>
            <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveYear("latest")}
                className={`border px-4 py-2 text-sm font-medium transition ${
                  activeYear === "latest"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground/70 hover:border-primary/50 hover:text-foreground"
                }`}
              >
                Latest Year {latestYear ? `(${latestYear})` : ""}
              </button>
              <button
                type="button"
                onClick={() => setActiveYear("all")}
                className={`border px-4 py-2 text-sm font-medium transition ${
                  activeYear === "all"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground/70 hover:border-primary/50 hover:text-foreground"
                }`}
              >
                All Years
              </button>
              {years.map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => setActiveYear(year)}
                  className={`border px-4 py-2 text-sm font-medium transition ${
                    activeYear === year
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground/70 hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveType("all")}
                className={`border px-4 py-2 text-sm font-medium transition ${
                  activeType === "all"
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground/70 hover:border-primary/50 hover:text-foreground"
                }`}
              >
                All Events
              </button>
              {annualSessionEvents.map((event) => {
                const Icon = event.Icon;
                const isActive = activeType === event.id;

                return (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => setActiveType(event.id)}
                    className={`inline-flex items-center gap-2 border px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-foreground/70 hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {event.title}
                    <span className="text-xs opacity-70">{eventCounts[event.id] || 0}</span>
                  </button>
                );
              })}
            </div>
            </div>
          </ScrollReveal>

          <section id="galleries" className="scroll-mt-24 space-y-6">
            <ScrollReveal variant="fadeUp">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">Year Galleries</p>
                  <h3 className="mt-2 font-heading text-3xl font-semibold text-foreground">Annual Sessions Archive</h3>
                </div>
                {!loading && (
                  <p className="text-sm text-foreground/60">
                    Showing {filteredEvents.length} of {sortedAnnualEvents.length}
                    {selectedYear ? ` for ${selectedYear}` : ""}
                  </p>
                )}
              </div>
            </ScrollReveal>

            {loading && (
              <div className="flex items-center justify-center border border-border bg-card py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary/60" />
              </div>
            )}

            {!loading && filteredEvents.length === 0 && (
              <div className="border border-dashed border-border bg-card py-20 text-center">
                <p className="text-foreground/60">No annual session galleries are published for this selection yet.</p>
              </div>
            )}

            {!loading &&
              filteredEvents.map((item, index) => {
                const images = getImages(item);
                const year = getYear(item);
                const EventIcon = annualSessionEvents.find((event) => event.id === item.event_type)?.Icon || CalendarDays;

                return (
                  <ScrollReveal key={item.id} variant="fadeUp" delay={index * 0.03}>
                    <article className="border border-border bg-card shadow-sm">
                      <div className="grid gap-0 lg:grid-cols-[360px_1fr]">
                        <div className="flex flex-col justify-between border-b border-border p-6 md:p-8 lg:border-b-0 lg:border-r">
                          <div>
                            <div className="flex items-center gap-3">
                              <div className="grid h-11 w-11 place-items-center border border-border bg-background text-primary">
                                <EventIcon className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{eventTypeLabels[item.event_type]}</p>
                                <p className="mt-1 text-sm text-foreground/60">{year || "Annual Sessions"}</p>
                              </div>
                            </div>

                            <h4 className="mt-6 font-heading text-2xl font-semibold leading-tight text-foreground">
                              {item.title || `${eventTypeLabels[item.event_type]} ${year}`}
                            </h4>
                            {item.subtitle && <p className="mt-3 text-sm font-medium text-foreground/80">{item.subtitle}</p>}
                            {item.description && <p className="mt-4 text-sm leading-relaxed text-foreground/70">{item.description}</p>}
                          </div>

                          <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-foreground/50">
                            {images.length} image{images.length === 1 ? "" : "s"}
                          </p>
                        </div>

                        <div className="grid gap-2 bg-muted p-2 sm:grid-cols-4">
                          {images.length > 0 ? (
                            images.map((image, imageIndex) => (
                              <button
                                key={`${item.id}-${imageIndex}`}
                                type="button"
                                onClick={() => openLightbox(image)}
                                className={
                                  imageIndex === 0
                                    ? "group relative min-h-[280px] overflow-hidden sm:col-span-2 sm:row-span-2"
                                    : "group relative min-h-[136px] overflow-hidden"
                                }
                              >
                                <img
                                  src={image}
                                  alt={`${item.title} image ${imageIndex + 1}`}
                                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/20" />
                              </button>
                            ))
                          ) : (
                            <div className="grid min-h-[300px] place-items-center bg-background sm:col-span-4">
                              <GalleryHorizontalEnd className="h-14 w-14 text-primary/25" />
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  </ScrollReveal>
                );
              })}
          </section>
        </div>
      </section>

      {activeLightbox && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4">
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Close image preview"
            className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>

          {lightboxImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={showPreviousImage}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={showNextImage}
                aria-label="Next image"
                className="absolute right-4 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div className="flex h-full w-full max-w-6xl flex-col items-center justify-center gap-4">
            <img
              src={activeLightbox.image}
              alt={activeLightbox.alt}
              className="max-h-[82vh] max-w-full object-contain shadow-2xl"
            />
            <div className="text-center text-white">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">{activeLightbox.label}</p>
              <p className="mt-1 font-heading text-lg font-semibold">{activeLightbox.title}</p>
              {lightboxImages.length > 1 && lightboxIndex !== null && (
                <p className="mt-1 text-xs text-white/50">
                  {lightboxIndex + 1} / {lightboxImages.length}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default SliaAnnualSessions;
