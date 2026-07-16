import PageLayout from "@/components/PageLayout";
import ManagedMemberGrid from "@/components/ManagedMemberGrid";

const BoardOfManagement = () => (
    <PageLayout title="Board of Management" subtitle="Board of Management" breadcrumb="About Us / Board of Management">
        <section className="py-16">
            <div className="container">
                <ManagedMemberGrid boardKey="management" />
            </div>
        </section>
    </PageLayout>
);

export default BoardOfManagement;
