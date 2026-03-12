import PageLayout from "@/components/PageLayout";
import ScrollReveal from "@/components/ScrollReveal";

const WhyBeAnArchitect = () => (
  <PageLayout
    title="Why be an Architect"
    subtitle="An overview of what architects do and why the profession matters."
    breadcrumb="Home / Architect / Why be an Architect"
  >
    <section className="py-12">
      <div className="container">
        <ScrollReveal variant="fadeUp">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            <p className="text-foreground/70 leading-relaxed">
              This page can cover the role of architects, the value to society, typical career paths, and how to start
              the journey through education and training.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  </PageLayout>
);

export default WhyBeAnArchitect;

