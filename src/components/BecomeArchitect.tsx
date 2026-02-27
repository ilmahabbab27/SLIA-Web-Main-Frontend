import { Button } from "@/components/ui/button";

const BecomeArchitect = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/hero-2.jpg)" }}
      />
      <div className="absolute inset-0 bg-foreground/70" />

      <div className="container relative z-10 text-center">
        <p className="text-primary font-semibold uppercase tracking-wider text-sm mb-4">
          Become an Architect
        </p>
        <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
          Chartered Architect
        </h2>
        <p className="text-lg text-primary-foreground/70 uppercase tracking-wider mb-6">
          Pathways to Become a Chartered Architect in Sri Lanka
        </p>
        <p className="text-primary-foreground/60 max-w-xl mx-auto mb-8">
          Becoming a registered architect involves a combination of education,
          experience, and examination.
        </p>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-sm uppercase tracking-wider font-semibold">
          Read More
        </Button>
      </div>
    </section>
  );
};

export default BecomeArchitect;
