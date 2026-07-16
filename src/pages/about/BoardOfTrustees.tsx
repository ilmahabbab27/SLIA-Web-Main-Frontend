import PageLayout from "@/components/PageLayout";
import ManagedMemberGrid from "@/components/ManagedMemberGrid";

const BoardOfTrustees = () => (
    <PageLayout title="Board of Trustees" subtitle="Board of Trustees" breadcrumb="About Us / Board of Trustees">
        <section className="py-16">
            <div className="container">
                <ManagedMemberGrid boardKey="trustees" />
            </div>
        </section>
    </PageLayout>
);

export default BoardOfTrustees;
