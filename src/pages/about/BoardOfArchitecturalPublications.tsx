import PageLayout from "@/components/PageLayout";

const members = [
    { role: "Chairman", name: "Ar. [Name]" },
    { role: "Member", name: "Ar. [Name]" },
    { role: "Member", name: "Ar. [Name]" },
    { role: "Member", name: "Ar. [Name]" },
];

export const BoardOfArchitecturalPublicationsView = ({ breadcrumb }: { breadcrumb: string }) => (
    <PageLayout title="Board of Architectural Publications" subtitle="Board of Architectural Publications" breadcrumb={breadcrumb}>
        <section className="py-16">
            <div className="container">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {members.map((m, i) => (
                        <div key={i} className="text-center border border-border p-6 rounded-sm">
                            <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                                <span className="text-muted-foreground text-2xl font-heading font-bold">{m.name.charAt(4)}</span>
                            </div>
                            <h3 className="font-heading text-base font-bold text-foreground">{m.name}</h3>
                            <p className="text-primary text-sm font-medium mt-1">{m.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    </PageLayout>
);

const BoardOfArchitecturalPublications = () => (
    <BoardOfArchitecturalPublicationsView breadcrumb="About Us / Board of Architectural Publications" />
);

export default BoardOfArchitecturalPublications;
