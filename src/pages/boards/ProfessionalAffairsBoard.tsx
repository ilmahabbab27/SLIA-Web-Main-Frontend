import PageLayout from "@/components/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileText, Download, Lock, Settings } from "lucide-react";
import { useMemo } from "react";
import { pabAdminStorage } from "../pabAdmin/storage";
import { Link } from "react-router-dom";

export const ProfessionalAffairsBoardView = ({ breadcrumb }: { breadcrumb: string }) => {
    const dynamicDocs = useMemo(() => pabAdminStorage.content.get(), []);

    return (
        <PageLayout title="Professional Affairs Board" subtitle="Professional Affairs Board" breadcrumb={breadcrumb}>
            <section className="py-16">
                <div className="container max-w-6xl mx-auto space-y-10">
                    <Tabs defaultValue="introduction" className="space-y-6">
                        <TabsList className="w-full h-auto flex flex-wrap justify-start gap-1">
                            <TabsTrigger value="introduction" className="flex-1 sm:flex-none">
                                Introduction
                            </TabsTrigger>
                            <TabsTrigger value="cpd" className="flex-1 sm:flex-none">
                                CPD Events & Lectures
                            </TabsTrigger>
                            <TabsTrigger value="applications" className="flex-1 sm:flex-none">
                                Applications
                            </TabsTrigger>
                            <TabsTrigger value="publications" className="flex-1 sm:flex-none">
                                Publications
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="introduction" className="mt-0">
                            <div className="rounded-3xl border border-border bg-card p-8 md:p-10 shadow-sm relative overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(800px_circle_at_20%_0%,hsl(var(--primary)/0.14),transparent_55%),radial-gradient(700px_circle_at_80%_20%,hsl(var(--secondary)/0.12),transparent_55%)]" />
                                <div className="relative">
                                    <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground tracking-tight">
                                        Introduction
                                    </h2>
                                    <div className="w-20 h-1 rounded-full bg-gradient-to-r from-primary/70 via-secondary/60 to-accent/50 mt-6" />
                                    <p className="mt-8 text-foreground/75 leading-relaxed max-w-3xl text-xl font-light whitespace-pre-line">
                                        The Professional Affairs Board oversees the ethical and professional conduct of architectural practices, managing registrations, CPD events, and standard publications to ensure the highest level of architectural service.
                                    </p>

                                    <div className="mt-10 flex flex-wrap gap-3">
                                        <Button asChild>
                                            <Link to="/pab-admin/login">PAB Login (Authorities)</Link>
                                        </Button>
                                        <Button variant="secondary" asChild>
                                            <Link to="/about-pab">About this Board</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="cpd" className="mt-0">
                            {(!dynamicDocs.events || dynamicDocs.events.length === 0) ? (
                                <div className="rounded-3xl border border-border bg-card p-8 shadow-sm text-center">
                                    <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="text-xl font-semibold text-foreground">CPD Events & Lectures</h3>
                                    <p className="text-foreground/70 mt-2 max-w-lg mx-auto">
                                        Information regarding upcoming Continuous Professional Development (CPD) events and lectures will be updated here.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 gap-6">
                                    {dynamicDocs.events.map((event) => (
                                        <div key={event.id} className="rounded-2xl border border-border/70 overflow-hidden bg-card hover:shadow-md transition group">
                                            {event.image && (
                                                <div className="aspect-video relative overflow-hidden">
                                                    <img src={event.image} alt={event.title} className="object-cover w-full h-full group-hover:scale-105 transition duration-500" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                                </div>
                                            )}
                                            <div className="p-6">
                                                <h3 className="text-xl font-bold text-foreground mb-2">{event.title}</h3>
                                                <p className="text-foreground/70 text-sm mb-4 line-clamp-3">{event.description}</p>
                                                {event.link && (
                                                    <Button variant="outline" size="sm" asChild>
                                                        <a href={event.link} target="_blank" rel="noopener noreferrer">View Details</a>
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="applications" className="mt-0">
                            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
                                <h3 className="text-2xl font-semibold text-foreground mb-6">Board Applications</h3>
                                {(!dynamicDocs.documents || dynamicDocs.documents.filter(d => d.category === "applications").length === 0) ? (
                                    <p className="text-foreground/70 text-center py-8">No applications available.</p>
                                ) : (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {dynamicDocs.documents.filter(d => d.category === "applications").map((app) => (
                                            <div key={app.id} className="rounded-2xl border border-border/70 bg-background/60 p-5 hover:bg-background/80 hover:shadow-sm transition flex flex-col justify-between">
                                                <div>
                                                    <div className="flex items-start justify-between gap-3">
                                                        <h4 className="font-heading font-semibold text-lg text-foreground">{app.title}</h4>
                                                        <span className="shrink-0 text-xs rounded-full border border-border bg-muted/40 px-2 py-1 text-foreground/70">
                                                            {app.meta}
                                                        </span>
                                                    </div>
                                                    <p className="mt-2 text-sm text-foreground/70">
                                                        {app.description}
                                                    </p>
                                                </div>
                                                <div className="mt-4 pt-4 border-t border-border/50">
                                                    <Button asChild size="sm" variant="outline" className="w-full gap-2">
                                                        <a href={app.fileUrl} download={app.fileName || app.title}>
                                                            <Download className="w-4 h-4" />
                                                            Download Form
                                                        </a>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="publications" className="mt-0">
                            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
                                <h3 className="text-2xl font-semibold text-foreground mb-6">Publications</h3>
                                {(!dynamicDocs.documents || dynamicDocs.documents.filter(d => d.category === "publications").length === 0) ? (
                                    <p className="text-foreground/70 text-center py-8">No publications available.</p>
                                ) : (
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {dynamicDocs.documents.filter(d => d.category === "publications").map((pub) => (
                                            <div key={pub.id} className="rounded-2xl border border-border/70 bg-background/60 p-5 hover:bg-background/80 hover:shadow-sm transition flex flex-col justify-between">
                                                <div>
                                                    <div className="flex items-start justify-between gap-3">
                                                        <h4 className="font-heading font-semibold text-lg text-foreground">{pub.title}</h4>
                                                        <span className="shrink-0 text-xs rounded-full border border-border bg-muted/40 px-2 py-1 text-foreground/70">
                                                            {pub.meta}
                                                        </span>
                                                    </div>
                                                    <p className="mt-2 text-sm text-foreground/70">
                                                        {pub.description}
                                                    </p>
                                                </div>
                                                <div className="mt-4 pt-4 border-t border-border/50">
                                                    <Button asChild size="sm" variant="outline" className="w-full gap-2">
                                                        <a href={pub.fileUrl} download={pub.fileName || pub.title}>
                                                            <Download className="w-4 h-4" />
                                                            Download Publication
                                                        </a>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </section>
        </PageLayout>
    );
};

const ProfessionalAffairsBoard = () => <ProfessionalAffairsBoardView breadcrumb="Boards / Professional Affairs Board" />;

export default ProfessionalAffairsBoard;
