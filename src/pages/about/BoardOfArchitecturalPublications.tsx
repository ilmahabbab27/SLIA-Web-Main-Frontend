import PageLayout from "@/components/PageLayout";
import ManagedMemberGrid from "@/components/ManagedMemberGrid";

export const BoardOfArchitecturalPublicationsView = ({ breadcrumb }: { breadcrumb: string }) => (
    <PageLayout title="Board of Architectural Publications" subtitle="Board of Architectural Publications" breadcrumb={breadcrumb}>
        <section className="py-16">
            <div className="container">
                <ManagedMemberGrid boardKey="bap" />
            </div>
        </section>
    </PageLayout>
);

const BoardOfArchitecturalPublications = () => (
    <BoardOfArchitecturalPublicationsView breadcrumb="About Us / Board of Architectural Publications" />
);

export default BoardOfArchitecturalPublications;
