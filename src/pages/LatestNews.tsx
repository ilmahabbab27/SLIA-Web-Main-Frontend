import PageLayout from "@/components/PageLayout";

const newsItems = [
  { title: "Online Revit Course for Architects", date: "January 2025", desc: "The Sri Lanka Institute of Architects has scheduled the 9th intake of the online Certificate Course in Revit." },
  { title: "Trainer Practices Registration for 2024", date: "December 2024", desc: "SLIA Council ratified a BAE recommendation to register Trainer Practices annually." },
  { title: "Call for Entries for Annual Awards 2023/24", date: "November 2024", desc: "Design Award, Colour Award, Young Architect of the Year Award, Research Award and more." },
  { title: "BAE Notice — Periodical Assessment", date: "October 2024", desc: "Applications for exemption from the Parts I & II Examinations are assessed by the BAE." },
  { title: "SLIA Product Awards", date: "September 2024", desc: "SLIA Product Awards recognise excellence in building products and materials." },
  { title: "The First Quarterly General Meeting", date: "August 2024", desc: "Session 2025/2026 quarterly general meeting held at the SLIA Auditorium." },
  { title: "ARCHIve i — Volume 2, Issue 1", date: "July 2024", desc: "The latest issue of the SLIA journal featuring research articles and project reviews." },
  { title: "Specification Writing for Architects", date: "June 2024", desc: "Certificate course in collaboration with the Sri Lanka Association of Project Managers." },
];

const LatestNews = () => (
  <PageLayout title="Latest News" subtitle="Stay updated with SLIA activities and announcements" breadcrumb="News & Events / Latest News">
    <section className="py-16">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-6">
          {newsItems.map((item, i) => (
            <div key={i} className="border border-border p-6 rounded-sm hover:shadow-lg transition-shadow group">
              <span className="text-primary text-xs font-semibold uppercase tracking-wider">{item.date}</span>
              <h3 className="font-heading text-lg font-bold text-foreground mt-1 mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              <a href="#" className="inline-block mt-3 text-primary text-sm font-semibold hover:underline">Read More →</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  </PageLayout>
);

export default LatestNews;
