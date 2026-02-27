import PageLayout from "@/components/PageLayout";

const publications = [
  { title: "ARCHIve i — Volume 2, Issue 1", year: "December 2024", desc: "The bi-annual research journal of the SLIA featuring peer-reviewed articles on architecture." },
  { title: "SLIA Annual Report 2023/24", year: "2024", desc: "Comprehensive annual report covering institute activities, financial statements, and member statistics." },
  { title: "Specification Writing Guidelines", year: "2023", desc: "Standard specification writing guidelines for architectural practice in Sri Lanka." },
  { title: "ARCHITECT Exhibition Catalogue", year: "2023", desc: "Official catalogue of the Members' Work & Trade Exhibition featuring exhibited projects." },
];

const Publications = () => (
  <PageLayout title="Publications" subtitle="SLIA journals, reports, and reference materials" breadcrumb="Resources / Publications">
    <section className="py-16">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-6">
          {publications.map((p, i) => (
            <div key={i} className="border border-border p-6 rounded-sm hover:shadow-lg transition-shadow group">
              <span className="text-primary text-xs font-semibold">{p.year}</span>
              <h3 className="font-heading text-lg font-bold text-foreground mt-1 mb-2 group-hover:text-primary transition-colors">{p.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
              <a href="#" className="inline-block mt-3 text-primary text-sm font-semibold hover:underline">Download →</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Publications;
