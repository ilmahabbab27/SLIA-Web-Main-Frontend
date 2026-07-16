import PageLayout from "@/components/PageLayout";
import { eventApi } from "@/lib/api";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

type UpcomingEvent = { id: number; title: string; date: string; venue: string; img: string; description?: string };

const UpcomingEvents = () => {
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    eventApi
      .list("upcoming")
      .then((data) => {
        if (cancelled) return;

        const next = data
          .filter((e) => e.is_active && e.title)
          .sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0))
          .map((e) => ({
            id: e.id,
            title: e.title,
            date: e.date || e.subtitle || "",
            venue: e.venue || "",
            description: e.description || "",
            img: e.images?.[0] || e.image || "",
          }));

        setEvents(next);
      })
      .catch(() => setEvents([]));

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return events;

    return events.filter((event) =>
      [event.title, event.date, event.venue, event.description]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [events, searchQuery]);

  return (
    <PageLayout
      title="Upcoming Events"
      subtitle="Mark your calendar for these upcoming SLIA events"
      breadcrumb="News & Events / Upcoming Events"
    >
      <section className="py-16">
        <div className="container space-y-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search upcoming events"
              className="h-12 w-full border border-border bg-card pl-11 pr-4 text-sm text-foreground outline-none transition focus:border-primary"
            />
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2">
              {filteredEvents.map((e) => (
                <Link key={e.id} to={`/events/${e.id}`} className="group overflow-hidden rounded-sm border border-border">
                  {e.img ? (
                    <div className="overflow-hidden">
                      <img
                        src={e.img}
                        alt={e.title}
                        className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : null}
                  <div className="p-6">
                    {e.date ? <span className="text-xs font-semibold uppercase tracking-wider text-primary">{e.date}</span> : null}
                    <h3 className="mt-1 font-heading text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                      {e.title}
                    </h3>
                    {e.venue ? <p className="mt-2 text-sm text-muted-foreground">{e.venue}</p> : null}
                    {e.description ? <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{e.description}</p> : null}
                    <span className="mt-4 inline-block text-sm font-semibold text-primary group-hover:underline">
                      Read More &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-border py-16 text-center text-muted-foreground">
              No upcoming events match your search.
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default UpcomingEvents;
