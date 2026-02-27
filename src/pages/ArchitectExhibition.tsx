import PageLayout from "@/components/PageLayout";

const ArchitectExhibition = () => (
  <PageLayout title="Architect Exhibition" subtitle="Members' Work & Trade Exhibition" breadcrumb="Architect / Exhibition">
    <section className="py-16">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">ARCHITECT 2024</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The annual Members' Work & Trade Exhibition, branded as "ARCHITECT", is the flagship event of the Sri Lanka Institute of Architects. This three-day exhibition showcases architectural works of SLIA members alongside the latest building materials, technologies and services.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Held at the BMICH, the exhibition attracts thousands of visitors including architects, engineers, developers, contractors, and the general public.
            </p>
            <a href="#" className="inline-block bg-primary text-primary-foreground px-6 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors">
              Reserve Your Trade Stall
            </a>
          </div>
          <div className="aspect-video rounded-sm overflow-hidden shadow-lg">
            <iframe
              src="https://www.youtube.com/embed/6eM6V7Bxxo8"
              title="ARCHITECT 2024"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {["/images/event-1.jpg", "/images/event-2.jpg", "/images/event-3.jpg", "/images/event-4.jpg"].map((img, i) => (
            <div key={i} className="overflow-hidden rounded-sm">
              <img src={img} alt={`Exhibition ${i + 1}`} className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  </PageLayout>
);

export default ArchitectExhibition;
