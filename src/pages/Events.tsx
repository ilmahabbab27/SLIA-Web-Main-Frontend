import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { eventApi, newsApi, type EventItem, type NewsItem } from "@/lib/api";
import { Search } from "lucide-react";

type EventCard = {
  id: string;
  title: string;
  date: string;
  venue?: string;
  description?: string;
  image: string;
  link?: string;
  sort_order: number;
};

const mapEventCards = (items: EventItem[]): EventCard[] =>
  items
    .filter((item) => item.is_active && item.title)
    .sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0))
    .map((item) => ({
      id: String(item.id),
      title: item.title,
      date: item.date || item.subtitle || "",
      venue: item.venue || undefined,
      description: item.description || undefined,
      image: item.images?.[0] || item.image || "",
      link: `/events/${item.id}`,
      sort_order: Number(item.sort_order ?? 0),
    }));


const Events = () => {
  const [latestNews, setLatestNews] = useState<NewsItem[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<EventCard[]>([]);
  const [pastEvents, setPastEvents] = useState<EventCard[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    eventApi
      .list("upcoming")
      .then((items) => {
        const next = mapEventCards(items);
        if (next.length > 0) setUpcomingEvents(next);
      })
      .catch((err) => console.warn("Failed to fetch upcoming events:", err));

    eventApi
      .list("past")
      .then((items) => {
        const next = mapEventCards(items);
        if (next.length > 0) setPastEvents(next);
      })
      .catch((err) => console.warn("Failed to fetch past events:", err));

    Promise.all([eventApi.list("latest"), newsApi.list("news")])
      .then(([eventItems, newsItems]) =>
        setLatestNews([
          ...eventItems
            .filter((item) => item.is_active && item.title)
            .sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0))
            .map((item) => ({
              id: item.id,
              title: item.title,
              subtitle: item.date || item.subtitle || "",
              description: item.description || "",
              image: item.images?.[0] || item.image,
              link: `/events/${item.id}`,
              type: "news" as const,
              is_active: item.is_active,
              sort_order: item.sort_order,
            })),
          ...newsItems.filter((item) => item.is_active),
        ])
      )
      .catch((err) => console.warn("Failed to fetch latest news for events page:", err));
  }, []);

  const filteredNews = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return latestNews;

    return latestNews.filter((item) =>
      [item.title, item.subtitle, item.description]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [latestNews, searchQuery]);

  const filteredUpcoming = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return upcomingEvents;

    return upcomingEvents.filter((item) =>
      [item.title, item.date, item.venue, item.description]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [searchQuery, upcomingEvents]);

  const filteredPast = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return pastEvents;

    return pastEvents.filter((item) =>
      [item.title, item.date, item.venue, item.description]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [pastEvents, searchQuery]);

  const visibleNews = useMemo(() => filteredNews.slice(0, 3), [filteredNews]);
  const visibleUpcoming = useMemo(() => filteredUpcoming.slice(0, 3), [filteredUpcoming]);
  const visiblePast = useMemo(() => filteredPast.slice(0, 3), [filteredPast]);

  return (
    <PageLayout
      title="Events"
      subtitle="Updates and information about SLIA events, latest announcements, and annual programs."
      breadcrumb="Home / Events"
    >
      <section className="py-12">
        <div className="container space-y-14">
          <ScrollReveal variant="fadeUp">
            <div className="grid gap-4 sm:grid-cols-3">
              <Link to="/latest-news" className="border border-border bg-card p-6 transition hover:border-primary/50 hover:shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Latest</p>
                <h2 className="mt-3 font-heading text-xl font-semibold text-foreground">News & Announcements</h2>
                <p className="mt-2 text-sm leading-relaxed text-foreground/70">Institute updates and member notices.</p>
              </Link>
              <Link to="/upcoming-events" className="border border-border bg-card p-6 transition hover:border-primary/50 hover:shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Upcoming</p>
                <h2 className="mt-3 font-heading text-xl font-semibold text-foreground">Upcoming Events</h2>
                <p className="mt-2 text-sm leading-relaxed text-foreground/70">Programs and activities on the calendar.</p>
              </Link>
              <Link to="/past-events" className="border border-border bg-card p-6 transition hover:border-primary/50 hover:shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Archive</p>
                <h2 className="mt-3 font-heading text-xl font-semibold text-foreground">Past Events</h2>
                <p className="mt-2 text-sm leading-relaxed text-foreground/70">A record of recent SLIA activities.</p>
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fadeUp" delay={0.03}>
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search news and events"
                className="h-12 w-full border border-border bg-card pl-11 pr-4 text-sm text-foreground outline-none transition focus:border-primary"
              />
            </div>
          </ScrollReveal>

          <EventSection title="Upcoming Events" href="/upcoming-events" items={visibleUpcoming} />
          <NewsSection items={visibleNews} />
          <EventSection title="Past Events" href="/past-events" items={visiblePast} compact />

          <ScrollReveal variant="fadeUp">
            <div className="border border-border bg-card p-8 shadow-sm">
              <h3 className="font-heading text-xl font-semibold text-foreground">SLIA Annual Sessions</h3>
              <p className="mt-3 max-w-3xl leading-relaxed text-foreground/70">
                For SLIA Annual Sessions details and registrations, visit the annual sessions page.
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link to="/slia-annual-sessions">View SLIA Annual Sessions</Link>
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageLayout>
  );
};

const EventSection = ({
  title,
  href,
  items,
  compact = false,
}: {
  title: string;
  href: string;
  items: EventCard[];
  compact?: boolean;
}) => (
  <ScrollReveal variant="fadeUp">
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Events</p>
          <h2 className="mt-2 font-heading text-2xl font-semibold text-foreground">{title}</h2>
        </div>
        <Button variant="outline" asChild>
          <Link to={href}>View All</Link>
        </Button>
      </div>

      {items.length > 0 ? (
        <div className={`grid gap-6 ${compact ? "md:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-3"}`}>
          {items.map((item) => (
          <Link
            key={item.id}
            to={item.link || href}
            className="group overflow-hidden border border-border bg-card transition hover:shadow-lg"
          >
            {item.image ? (
              <div className="overflow-hidden bg-muted">
                <img
                  src={item.image}
                  alt={item.title}
                  className={`${compact ? "h-44" : "h-56"} w-full object-cover transition-transform duration-500 group-hover:scale-105`}
                  loading="lazy"
                />
              </div>
            ) : null}
            <div className="p-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">{item.date}</span>
              <h3 className="mt-1 font-heading text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                {item.title}
              </h3>
              {item.venue ? <p className="mt-2 text-sm text-muted-foreground">{item.venue}</p> : null}
              {item.description ? (
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              ) : null}
              <span className="mt-4 inline-block text-sm font-semibold text-primary group-hover:underline">
                Read More &rarr;
              </span>
            </div>
          </Link>
          ))}
        </div>
      ) : (
        <div className="border border-dashed border-border py-12 text-center text-muted-foreground">
          No items are available.
        </div>
      )}
    </div>
  </ScrollReveal>
);

const NewsSection = ({ items }: { items: NewsItem[] }) => {
  if (items.length === 0) return null;

  return (
    <ScrollReveal variant="fadeUp">
      <div>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Latest</p>
            <h2 className="mt-2 font-heading text-2xl font-semibold text-foreground">Latest News</h2>
          </div>
          <Button variant="outline" asChild>
            <Link to="/latest-news">View All</Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <a key={item.id} href={item.link || "/latest-news"} className="border border-border bg-card p-6 transition hover:shadow-lg">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">{item.subtitle}</span>
              <h3 className="mt-2 font-heading text-lg font-bold text-foreground">{item.title}</h3>
              <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
            </a>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
};

export default Events;
