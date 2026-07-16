import { useEffect, useMemo, useState } from "react";
import PageLayout from "@/components/PageLayout";
import { eventApi, newsApi, type EventItem, type NewsItem as ApiNewsItem } from "@/lib/api";
import { Search } from "lucide-react";

type NewsItem = {
  title: string;
  date: string;
  desc: string;
  link: string;
  image?: string;
};

const mapApiNews = (item: ApiNewsItem): NewsItem => ({
  title: item.title,
  date: item.subtitle || "",
  desc: item.description || "",
  image: item.image,
  link: item.link || "/latest-news",
});

const mapEventNews = (item: EventItem): NewsItem => ({
  title: item.title,
  date: item.date || item.subtitle || "",
  desc: item.description || "",
  image: item.images?.[0] || item.image,
  link: `/events/${item.id}`,
});

const LatestNews = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    Promise.all([eventApi.list("latest"), newsApi.list("news")])
      .then(([eventItems, newsItems]) => {
        const eventNews = eventItems
          .filter((item) => item.is_active && item.title)
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
          .map(mapEventNews);

        const legacyNews = newsItems
          .filter((item) => item.is_active && item.title)
          .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
          .map(mapApiNews);

        setNewsItems([...eventNews, ...legacyNews]);
      })
      .catch((err) => console.warn("Failed to fetch latest news:", err));
  }, []);

  const filteredNewsItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return newsItems;

    return newsItems.filter((item) =>
      [item.title, item.date, item.desc]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [newsItems, searchQuery]);

  return (
    <PageLayout
      title="Latest News"
      subtitle="Stay updated with SLIA activities and announcements"
      breadcrumb="News & Events / Latest News"
    >
      <section className="py-16">
        <div className="container space-y-8">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search latest news"
              className="h-12 w-full border border-border bg-card pl-11 pr-4 text-sm text-foreground outline-none transition focus:border-primary"
            />
          </div>

          {filteredNewsItems.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredNewsItems.map((item, i) => (
              <div key={`${item.title}-${i}`} className="group border border-border p-6 transition-shadow hover:shadow-lg">
                {item.image ? (
                  <div className="mb-4 overflow-hidden border border-border">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                ) : null}
                {item.date ? (
                  <span className="text-xs font-semibold uppercase tracking-wider text-primary">{item.date}</span>
                ) : null}
                <h3 className="mt-1 font-heading text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                  {item.title}
                </h3>
                {item.desc ? <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.desc}</p> : null}
                <a href={item.link || "/latest-news"} className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
                  Read More &rarr;
                </a>
              </div>
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-border py-16 text-center text-muted-foreground">
              No news items match your search.
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default LatestNews;
