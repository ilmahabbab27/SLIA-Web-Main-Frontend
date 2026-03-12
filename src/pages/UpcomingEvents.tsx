import PageLayout from "@/components/PageLayout";
import { useEffect, useState } from "react";

type UpcomingEvent = { title: string; date: string; venue: string; img: string };

const fallbackEvents: UpcomingEvent[] = [
  { title: "Architect 2025 Exhibition", date: "February 2025", venue: "BMICH, Colombo", img: "/images/event-1.jpg" },
  { title: "Regional Exhibition — Kandy", date: "March 2025", venue: "Kandy City Centre", img: "/images/event-2.jpg" },
  { title: "Annual Sessions & AGM", date: "April 2025", venue: "SLIA Auditorium", img: "/images/event-3.jpg" },
  { title: "World Architecture Day", date: "October 2025", venue: "Nationwide", img: "/images/event-4.jpg" },
];

const UpcomingEvents = () => {
  const [events, setEvents] = useState<UpcomingEvent[]>(fallbackEvents);

  useEffect(() => {
    const raw = localStorage.getItem("site_upcoming_events_v1");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as Array<{
        title?: string;
        date?: string;
        venue?: string;
        imageDataUrl?: string;
      }>;
      if (!Array.isArray(parsed) || parsed.length === 0) return;

      const next = parsed
        .filter((e) => e?.title && e?.date && e?.imageDataUrl)
        .map((e) => ({
          title: String(e.title),
          date: String(e.date),
          venue: String(e.venue ?? ""),
          img: String(e.imageDataUrl),
        }));

      if (next.length > 0) setEvents(next);
    } catch {
      // ignore
    }
  }, []);

  return (
    <PageLayout
      title="Upcoming Events"
      subtitle="Mark your calendar for these upcoming SLIA events"
      breadcrumb="News & Events / Upcoming Events"
    >
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8">
            {events.map((e, i) => (
              <div key={i} className="group overflow-hidden rounded-sm border border-border">
                <div className="overflow-hidden">
                  <img
                    src={e.img}
                    alt={e.title}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <span className="text-primary text-xs font-semibold uppercase tracking-wider">{e.date}</span>
                  <h3 className="font-heading text-xl font-bold text-foreground mt-1 mb-2 group-hover:text-primary transition-colors">
                    {e.title}
                  </h3>
                  {e.venue ? <p className="text-muted-foreground text-sm">{e.venue}</p> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default UpcomingEvents;

