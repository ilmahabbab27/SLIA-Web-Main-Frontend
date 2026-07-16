import PageLayout from "@/components/PageLayout";
import ManagedMemberGrid from "@/components/ManagedMemberGrid";

const ProfessionalAffairsBoard = () => (
    <PageLayout
        title="Professional Affairs Board"
        subtitle="Professional Affairs Board"
        breadcrumb="About Us / Professional Affairs Board"
    >
        <section className="py-16">
            <div className="container">
                <ManagedMemberGrid boardKey="pab" />
            </div>
        </section>
    </PageLayout>
);

export default ProfessionalAffairsBoard;
