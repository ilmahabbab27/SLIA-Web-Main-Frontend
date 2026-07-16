import PageLayout from "@/components/PageLayout";
import { eventApi } from "@/lib/api";
import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

type PastEvent = { id: number; title: string; date: string; img: string; description?: string };

const PastEvents = () => {
  const [events, setEvents] = useState<PastEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    eventApi
      .list("past")
      .then((data) => {
        if (cancelled) return;

        const next = data
          .filter((e) => e.is_active && e.title)
          .sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0))
          .map((e) => ({
            id: e.id,
            title: e.title,
            date: e.date || e.subtitle || "",
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
      [event.title, event.date, event.description]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [events, searchQuery]);

  return (
    <PageLayout title="Past Events" subtitle="A look back at our recent events and activities" breadcrumb="News & Events / Past Events">
      <section className="py-16">
        <div className="container space-y-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search past events"
              className="h-12 w-full border border-border bg-card pl-11 pr-4 text-sm text-foreground outline-none transition focus:border-primary"
            />
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-3">
              {filteredEvents.map((e) => (
                <Link key={e.id} to={`/events/${e.id}`} className="group cursor-pointer">
                  {e.img ? (
                    <div className="overflow-hidden rounded-sm">
                      <img
                        src={e.img}
                        alt={e.title}
                        className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  ) : null}
                  {e.date ? <span className="mt-2 block text-xs text-muted-foreground">{e.date}</span> : null}
                  <h3 className="mt-1 font-heading text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                    {e.title}
                  </h3>
                  {e.description ? <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{e.description}</p> : null}
                  <span className="mt-3 inline-block text-sm font-semibold text-primary group-hover:underline">
                    Read More &rarr;
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-border py-16 text-center text-muted-foreground">
              No past events match your search.
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default PastEvents;
