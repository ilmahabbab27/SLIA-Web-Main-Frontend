import PageLayout from "@/components/PageLayout";

const courses = [
  { name: "Certificate Course in Revit (Online)", duration: "3 months", desc: "Online programme designed for practicing architects to master Building Information Modelling using Autodesk Revit." },
  { name: "Certificate Course in Specification Writing", duration: "6 weeks", desc: "In collaboration with Sri Lanka Association of Project Managers, covering construction specification standards." },
  { name: "CPD Programme", duration: "Ongoing", desc: "Continuing Professional Development workshops and seminars for registered architects." },
  { name: "Architectural Photography Workshop", duration: "2 days", desc: "Practical workshop on photographing buildings and architectural spaces effectively." },
];

const Courses = () => (
  <PageLayout title="Courses" subtitle="Professional development programmes for architects" breadcrumb="Education / Courses">
    <section className="py-16">
      <div className="container">
        <div className="space-y-6 max-w-4xl">
          {courses.map((c, i) => (
            <div key={i} className="border border-border p-6 rounded-sm hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <h3 className="font-heading text-lg font-bold text-foreground">{c.name}</h3>
                <span className="text-primary text-xs font-semibold bg-primary/10 px-3 py-1 rounded-full">{c.duration}</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mt-2">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Courses;
