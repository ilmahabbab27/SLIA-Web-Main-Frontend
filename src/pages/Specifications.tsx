import PageLayout from "@/components/PageLayout";

const Specifications = () => (
  <PageLayout title="Specifications" subtitle="Standard architectural specifications and guidelines" breadcrumb="Resources / Specifications">
    <section className="py-16">
      <div className="container max-w-4xl">
        <p className="text-muted-foreground leading-relaxed mb-8">
          The SLIA, in collaboration with the Sri Lanka Association of Project Managers, has developed standard specification writing guidelines for architects practising in Sri Lanka. These documents serve as essential references for construction documentation.
        </p>
        <div className="space-y-4">
          {["General Conditions", "Earthwork & Foundations", "Concrete & Reinforcement", "Masonry Work", "Roofing & Waterproofing", "Finishes & Painting", "Plumbing & Drainage", "Electrical Installations"].map((spec, i) => (
            <div key={i} className="flex items-center justify-between border border-border p-4 rounded-sm hover:bg-muted transition-colors">
              <span className="text-foreground font-medium text-sm">{spec}</span>
              <a href="#" className="text-primary text-sm font-semibold hover:underline">View →</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Specifications;
