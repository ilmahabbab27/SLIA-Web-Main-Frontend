import PageLayout from "@/components/PageLayout";
import { useEffect, useState } from "react";

type NewsItem = { title: string; date: string; desc: string; link: string; imageDataUrl?: string };

const fallbackNews: NewsItem[] = [
  {
    title: "Online Revit Course for Architects",
    date: "January 2025",
    desc: "The Sri Lanka Institute of Architects has scheduled the 9th intake of the online Certificate Course in Revit.",
    link: "#",
  },
  {
    title: "Trainer Practices Registration for 2024",
    date: "December 2024",
    desc: "SLIA Council ratified a BAE recommendation to register Trainer Practices annually.",
    link: "#",
  },
  {
    title: "Call for Entries for Annual Awards 2023/24",
    date: "November 2024",
    desc: "Design Award, Colour Award, Young Architect of the Year Award, Research Award and more.",
    link: "#",
  },
  {
    title: "BAE Notice — Periodical Assessment",
    date: "October 2024",
    desc: "Applications for exemption from the Parts I & II Examinations are assessed by the BAE.",
    link: "#",
  },
];

const LatestNews = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>(fallbackNews);

  useEffect(() => {
    const raw = localStorage.getItem("site_news_v1");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as Array<{
        title?: string;
        date?: string;
        description?: string;
        imageDataUrl?: string;
        link?: string;
      }>;
      if (!Array.isArray(parsed) || parsed.length === 0) return;

      const next = parsed
        .filter((n) => n?.title && n?.date && n?.description)
        .map((n) => ({
          title: String(n.title),
          date: String(n.date),
          desc: String(n.description),
          imageDataUrl: n.imageDataUrl ? String(n.imageDataUrl) : undefined,
          link: String(n.link ?? "#"),
        }));

      if (next.length > 0) setNewsItems(next);
    } catch {
      // ignore
    }
  }, []);

  return (
    <PageLayout
      title="Latest News"
      subtitle="Stay updated with SLIA activities and announcements"
      breadcrumb="News & Events / Latest News"
    >
      <section className="py-16">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-6">
            {newsItems.map((item, i) => (
              <div key={i} className="border border-border p-6 rounded-sm hover:shadow-lg transition-shadow group">
                {item.imageDataUrl ? (
                  <div className="mb-4 overflow-hidden rounded-sm border border-border">
                    <img
                      src={item.imageDataUrl}
                      alt={item.title}
                      className="h-44 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                ) : null}
                <span className="text-primary text-xs font-semibold uppercase tracking-wider">{item.date}</span>
                <h3 className="font-heading text-lg font-bold text-foreground mt-1 mb-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                <a href={item.link || "#"} className="inline-block mt-3 text-primary text-sm font-semibold hover:underline">
                  Read More →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default LatestNews;
