import PageLayout from "@/components/PageLayout";

const objectives = [
  "Promote and advance the study, practice and application of and research in Architecture",
  "Organise, supervise and control the admission and professional education of persons desirous of qualifying as Architects",
  "Protect and promote the interest, status and welfare of the profession of Architecture",
  "Establish and maintain libraries, reading rooms and collections of works of art and architecture",
  "Establish pension, provident, benefit and benevolent schemes for members",
  "Do all such other acts, matters and things as are conducive or incidental to the above objects",
];

const Objectives = () => (
  <PageLayout title="Objectives" subtitle="The aims and mission of the SLIA" breadcrumb="About Us / Objectives">
    <section className="py-16">
      <div className="container max-w-4xl">
        <p className="text-muted-foreground leading-relaxed mb-10">
          The Sri Lanka Institute of Architects was incorporated by an Act of Parliament (SLIA Law No.1 of 1976) with the following principal objectives:
        </p>
        <div className="space-y-4">
          {objectives.map((obj, i) => (
            <div key={i} className="flex gap-4 items-start border-l-4 border-primary pl-6 py-3">
              <span className="text-primary font-heading font-bold text-xl">{String(i + 1).padStart(2, '0')}</span>
              <p className="text-foreground text-sm leading-relaxed">{obj}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Objectives;
