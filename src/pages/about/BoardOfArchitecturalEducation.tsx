import PageLayout from "@/components/PageLayout";
import ManagedMemberGrid from "@/components/ManagedMemberGrid";

const BoardOfArchitecturalEducation = () => (
  <PageLayout
    title="Board of Architectural Education"
    subtitle="Board of Architectural Education"
    breadcrumb="About Us / Board of Architectural Education"
  >
    <section className="py-16">
      <div className="container">
        <ManagedMemberGrid boardKey="bae" />
      </div>
    </section>
  </PageLayout>
);

export default BoardOfArchitecturalEducation;
