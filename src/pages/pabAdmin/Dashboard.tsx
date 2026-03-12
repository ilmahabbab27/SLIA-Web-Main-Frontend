import { useMemo } from "react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { pabAdminStorage } from "./storage";

const Dashboard = () => {
    const content = useMemo(() => pabAdminStorage.content.get(), []);

    const handleLogout = () => {
        pabAdminStorage.auth.logout();
        window.location.assign("/pab-admin/login");
    };

    return (
        <PageLayout title="PAB Admin" subtitle="Professional Affairs Board" breadcrumb="Boards / Professional Affairs Board / Admin">
            <section className="py-16">
                <div className="container max-w-5xl">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">PAB Admin</h1>
                            <p className="mt-2 text-foreground/70">
                                Manage CPD events, applications, and publications for the Professional Affairs Board.
                            </p>
                        </div>
                        <Button variant="outline" onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>

                    <div className="mt-10 grid md:grid-cols-3 gap-4">
                        <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm text-center">
                            <p className="text-4xl font-bold text-foreground">
                                {content?.events?.length ?? 0}
                            </p>
                            <p className="mt-1 text-foreground/70 text-sm">CPD Events</p>
                        </div>
                        <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm text-center">
                            <p className="text-4xl font-bold text-foreground">
                                {content?.documents?.filter(d => d.category === "applications").length ?? 0}
                            </p>
                            <p className="mt-1 text-foreground/70 text-sm">Applications</p>
                        </div>
                        <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-sm text-center">
                            <p className="text-4xl font-bold text-foreground">
                                {content?.documents?.filter(d => d.category === "publications").length ?? 0}
                            </p>
                            <p className="mt-1 text-foreground/70 text-sm">Publications</p>
                        </div>
                    </div>

                    <div className="mt-6 grid md:grid-cols-2 gap-6">
                        <Link
                            to="/pab-admin/management"
                            className="rounded-3xl border border-border/70 bg-card p-7 shadow-sm hover:shadow-md transition hover:border-primary"
                        >
                            <h2 className="text-xl font-semibold text-foreground">Manage All Content</h2>
                            <p className="mt-2 text-foreground/70">Edit events, applications, and publications.</p>
                        </Link>
                        <Link
                            to="/pab"
                            className="rounded-3xl border border-dashed border-border/70 bg-card p-7 shadow-sm hover:shadow-md transition hover:border-primary"
                        >
                            <h2 className="text-xl font-semibold text-foreground">View Public Page</h2>
                            <p className="mt-2 text-foreground/70">See how changes look on the live website.</p>
                        </Link>
                    </div>
                </div>
            </section>
        </PageLayout>
    );
};

export default Dashboard;
