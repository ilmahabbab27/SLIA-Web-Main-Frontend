import PageLayout from "@/components/PageLayout";

const councilMembers = [
  { role: "President", name: "Ar. [Name]" },
  { role: "Senior Vice President", name: "Ar. [Name]" },
  { role: "Junior Vice President", name: "Ar. [Name]" },
  { role: "Honorary Secretary", name: "Ar. [Name]" },
  { role: "Honorary Treasurer", name: "Ar. [Name]" },
  { role: "Editor", name: "Ar. [Name]" },
  { role: "Chairman — BAE", name: "Ar. [Name]" },
  { role: "Immediate Past President", name: "Ar. [Name]" },
];

const Council = () => (
  <PageLayout title="The Council" subtitle="The Council" breadcrumb="About Us / The Council">
    <section className="py-16">
      <div className="container">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {councilMembers.map((m, i) => (
            <div key={i} className="text-center border border-border p-6 rounded-sm">
              <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                <span className="text-muted-foreground text-2xl font-heading font-bold">{m.name.charAt(4)}</span>
              </div>
              <h3 className="font-heading text-base font-bold text-foreground">{m.name}</h3>
              <p className="text-primary text-sm font-medium mt-1">{m.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Council;
