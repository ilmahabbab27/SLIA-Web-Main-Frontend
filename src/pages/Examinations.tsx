import PageLayout from "@/components/PageLayout";

const Examinations = () => (
  <PageLayout title="Examinations" subtitle="Pathways to becoming a Chartered Architect" breadcrumb="Education / Examinations">
    <section className="py-16">
      <div className="container max-w-4xl">
        <div className="space-y-8">
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Part I Examination</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Part I Examination is conducted annually to assess candidates' knowledge in architectural design, history, theory, building construction, structures, and environmental science. Candidates with recognised qualifications may apply for exemption.
            </p>
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Part II Examination</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Part II Examination evaluates advanced design skills, professional practice knowledge, and the ability to integrate technical requirements with creative design solutions.
            </p>
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Part III — Professional Practice Examination</h2>
            <p className="text-muted-foreground leading-relaxed">
              The final examination assesses candidates' readiness for independent professional practice. It includes a logbook review, written papers on professional practice, and an oral examination.
            </p>
          </div>
          <div className="section-dark rounded-sm p-8">
            <h3 className="font-heading text-xl font-semibold mb-3">Exemption Applications</h3>
            <p className="text-section-dark-foreground/70 text-sm leading-relaxed">
              Applications for exemption from Parts I & II are assessed by the Board of Architectural Education (BAE). The BAE holds 3 interview sessions annually. Contact BAE for application deadlines and requirements.
            </p>
          </div>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Examinations;
