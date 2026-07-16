import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Calendar, MapPin } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { eventApi, type EventItem } from "@/lib/api";

const categoryLabels: Record<EventItem["category"], string> = {
  highlight: "Key Highlights",
  program: "SLIA Annual Programs",
  upcoming: "Upcoming Events",
  past: "Past Events",
};

const getDisplayCategory = (event: EventItem) => {
  if (event.show_latest && !event.show_upcoming && !event.show_past && !event.show_program && !event.show_highlight) {
    return "Latest News";
  }

  return categoryLabels[event.category];
};

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const eventId = Number(id);
    if (!eventId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    eventApi
      .show(eventId)
      .then((item) => {
        if (cancelled) return;
        setEvent(item);
        setSelectedImage(item.images?.[0] || item.image || "");
      })
      .catch(() => setEvent(null))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const images = useMemo(() => {
    if (!event) return [];
    const gallery = event.images?.length ? event.images : event.image ? [event.image] : [];
    return gallery.filter(Boolean).slice(0, 5);
  }, [event]);

  if (loading) {
    return (
      <PageLayout title="Event" subtitle="Loading event details" breadcrumb="Home / Events">
        <section className="py-16">
          <div className="container">
            <div className="h-[420px] animate-pulse bg-muted" />
          </div>
        </section>
      </PageLayout>
    );
  }

  if (!event) {
    return (
      <PageLayout title="Event Not Found" subtitle="This event is unavailable or has been removed." breadcrumb="Home / Events">
        <section className="py-16">
          <div className="container">
            <Button asChild>
              <Link to="/events">Back to Events</Link>
            </Button>
          </div>
        </section>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={event.title}
      subtitle={event.description || event.subtitle || "Event details and gallery"}
      breadcrumb={`Home / Events / ${getDisplayCategory(event)}`}
    >
      <section className="py-16">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              {selectedImage ? (
                <div className="overflow-hidden border border-border bg-muted">
                  <img
                    src={selectedImage}
                    alt={event.title}
                    className="h-[320px] w-full object-cover md:h-[520px]"
                  />
                </div>
              ) : null}

              {images.length > 1 && (
                <div className="grid grid-cols-5 gap-3">
                  {images.map((image, index) => (
                    <button
                      key={`${image.slice(0, 32)}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(image)}
                      className={`aspect-square overflow-hidden border transition ${
                        selectedImage === image ? "border-primary" : "border-border hover:border-primary/60"
                      }`}
                    >
                      <img src={image} alt={`${event.title} ${index + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <aside className="space-y-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">{getDisplayCategory(event)}</p>
                <h2 className="mt-3 font-heading text-3xl font-bold text-foreground">{event.title}</h2>
              </div>

              <div className="space-y-4 border-y border-border py-6">
                {(event.date || event.subtitle) && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span>{event.date || event.subtitle}</span>
                  </div>
                )}
                {event.venue && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span>{event.venue}</span>
                  </div>
                )}
              </div>

              {event.description && <p className="leading-relaxed text-foreground/75">{event.description}</p>}

              <Button variant="outline" asChild>
                <Link to={event.category === "past" ? "/past-events" : event.category === "upcoming" ? "/upcoming-events" : event.show_latest ? "/latest-news" : "/events"}>
                  Back to {getDisplayCategory(event)}
                </Link>
              </Button>
            </aside>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default EventDetail;
