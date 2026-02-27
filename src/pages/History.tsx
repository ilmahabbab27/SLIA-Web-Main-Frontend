import PageLayout from "@/components/PageLayout";

const History = () => (
  <PageLayout title="History" subtitle="The story of the Sri Lanka Institute of Architects" breadcrumb="About Us / History">
    <section className="py-16">
      <div className="container max-w-4xl">
        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <p>
            The Ceylon Institute of Architects (CIA) was established in 1956 by a small group of foreign-qualified Architects following several meetings to work out a constitution. The Inaugural meeting of the institute was held on 11th September 1957 at the Tea Propaganda Board on Prince Street in the Colombo Fort with the participation of twelve Architects.
          </p>
          <p>
            In 1976, through a private member's motion by the then Minister of Housing and Construction, the Ceylon Institute of Architects was incorporated as the Sri Lanka Institute of Architects (SLIA) by an Act of Parliament, called the Sri Lanka Institute of Architects Law No.1 of 1976.
          </p>
          <div className="section-dark rounded-sm p-8">
            <h3 className="font-heading text-xl font-semibold text-section-dark-foreground mb-4">Key Milestones</h3>
            <ul className="space-y-3 text-section-dark-foreground/70 text-sm">
              <li><strong className="text-section-dark-foreground">1956</strong> — Ceylon Institute of Architects established</li>
              <li><strong className="text-section-dark-foreground">1957</strong> — Inaugural meeting with 12 founding architects</li>
              <li><strong className="text-section-dark-foreground">1976</strong> — Incorporated as SLIA by Act of Parliament</li>
              <li><strong className="text-section-dark-foreground">1980s</strong> — Board of Architectural Education established</li>
              <li><strong className="text-section-dark-foreground">2000s</strong> — Regional chapters and international affiliations</li>
              <li><strong className="text-section-dark-foreground">2020s</strong> — Digital transformation and expanded CPD programmes</li>
            </ul>
          </div>
          <p>
            The institute has been working on the professional practices of architecture in the country as well as education, which have been the primary focuses over the years. We are proud to note that we have seen a lot of improvements in the industry.
          </p>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default History;
