import PageLayout from "@/components/PageLayout";

const awards = [
  { name: "Design Award", desc: "Recognizing outstanding architectural design that demonstrates innovation, functionality, and aesthetic excellence." },
  { name: "Colour Award", desc: "Celebrating the creative and effective use of colour in architectural projects across Sri Lanka." },
  { name: "Young Architect of the Year", desc: "Honouring emerging talent under 40 who demonstrate exceptional promise in the field." },
  { name: "Research Award", desc: "Acknowledging significant contributions to architectural research and knowledge." },
  { name: "Green & Sustainable Architecture Award", desc: "Promoting environmentally conscious design and sustainable building practices." },
  { name: "Architectural Conservation Award", desc: "Recognizing efforts in preserving and restoring Sri Lanka's architectural heritage." },
];

const AnnualAwards = () => (
  <PageLayout title="Annual Awards" subtitle="Recognizing Excellence in Architecture" breadcrumb="Architect / Annual Awards">
    <section className="py-16">
      <div className="container">
        <p className="text-muted-foreground max-w-3xl mb-12 leading-relaxed">
          The SLIA Annual Awards celebrate outstanding achievements in architecture across Sri Lanka. 
          These prestigious awards recognize innovation, sustainability, and excellence in design.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {awards.map((a) => (
            <div key={a.name} className="border border-border p-6 rounded-sm hover:shadow-lg transition-shadow group">
              <h3 className="font-heading text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{a.name}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </PageLayout>
);

export default AnnualAwards;
