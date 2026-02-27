import PageLayout from "@/components/PageLayout";

const DesignCompetition = () => (
  <PageLayout title="Design Competition" subtitle="Promoting architectural creativity and innovation" breadcrumb="Architect / Design Competition">
    <section className="py-16">
      <div className="container max-w-4xl">
        <h2 className="font-heading text-2xl font-bold text-foreground mb-4">World Habitat Day 2025 — Design Competition</h2>
        <p className="text-muted-foreground leading-relaxed mb-6">
          The Sri Lanka Institute of Architects organises annual design competitions to encourage innovative thinking and creative problem-solving in architecture. These competitions provide a platform for both established architects and students to showcase their design skills.
        </p>
        <div className="section-dark rounded-sm p-8 mb-8">
          <h3 className="font-heading text-xl font-semibold mb-4">Competition Guidelines</h3>
          <ul className="space-y-3 text-section-dark-foreground/70 text-sm">
            <li>• Open to all registered architects and architecture students in Sri Lanka</li>
            <li>• Submissions must address the given theme and site constraints</li>
            <li>• Entries must be original works not previously published or submitted</li>
            <li>• Jury comprises distinguished architects and academics</li>
            <li>• Winners will be announced at the Annual Sessions</li>
          </ul>
        </div>
        <div className="border border-border p-6 rounded-sm">
          <h3 className="font-heading text-lg font-bold text-foreground mb-2">Past Competitions</h3>
          <p className="text-muted-foreground text-sm">View winning entries and jury comments from previous years' competitions.</p>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default DesignCompetition;
