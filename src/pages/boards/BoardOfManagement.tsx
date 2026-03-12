import { useState, useMemo } from "react";
import PageLayout from "@/components/PageLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { bomAdminStorage } from "@/pages/bomadmin/storage";
import { Link } from "react-router-dom";

const EventCard = ({
    title,
    description,
    image,
    link
}: {
    title: string;
    description: string;
    image: string;
    link: string;
}) => (
    <div className="group rounded-3xl border border-border bg-card overflow-hidden hover:shadow-md transition-all duration-300">
        <div className="aspect-[16/9] overflow-hidden bg-muted relative">
            <img
                src={image || "/images/placeholder.jpg"}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60 group-hover:opacity-80 border-b border-border"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/600x400/27272a/ffffff?text=Image+Not+Found";
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
        </div>
        <div className="p-6 space-y-3">
            <h4 className="text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                {title}
            </h4>
            <p className="text-foreground/70 text-sm leading-relaxed line-clamp-3">
                {description}
            </p>
            <div className="pt-2">
                <Button variant="link" className="p-0 h-auto text-primary font-semibold hover:no-underline group/btn" asChild>
                    <a href={link} className="flex items-center gap-1.5">
                        View details
                        <span className="transform translate-x-0 group-hover/btn:translate-x-1 transition-transform">→</span>
                    </a>
                </Button>
            </div>
        </div>
    </div>
);

export const BoardOfManagementView = ({ breadcrumb }: { breadcrumb: string }) => {
    const content = useMemo(() => bomAdminStorage.content.get(), []);

    if (!content) return null;
    return (
        <PageLayout
            title="Board of Management"
            subtitle="Governing Council and Management"
            breadcrumb={breadcrumb}
        >
            <section className="py-16">
                <div className="container max-w-6xl mx-auto space-y-10">


                    <Tabs defaultValue="introduction" className="space-y-6">
                        <TabsList className="w-full h-auto flex flex-wrap justify-start gap-1 p-1 bg-muted/40 rounded-xl border border-border">
                            <TabsTrigger value="introduction" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                Introduction
                            </TabsTrigger>
                            <TabsTrigger value="programs" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                Programs & Workshops
                            </TabsTrigger>
                            <TabsTrigger value="associations" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">
                                Professional Associations
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="introduction" className="mt-0 focus-visible:outline-none">
                            <div className="rounded-3xl border border-border bg-card p-8 md:p-12 shadow-sm relative overflow-hidden">
                                <div className="absolute inset-0 bg-[radial-gradient(800px_circle_at_20%_0%,hsl(var(--primary)/0.12),transparent_55%),radial-gradient(700px_circle_at_80%_20%,hsl(var(--secondary)/0.1),transparent_55%)]" />
                                <div className="relative">
                                    <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground tracking-tight">
                                        {content.introduction.title}
                                    </h2>
                                    <div className="w-20 h-1 rounded-full bg-gradient-to-r from-primary/70 via-secondary/60 to-accent/50 mt-6" />
                                    <p className="mt-8 text-foreground/75 leading-relaxed max-w-3xl text-xl font-light">
                                        {content.introduction.description}
                                    </p>
                                    <div className="mt-10 grid sm:grid-cols-2 gap-6 max-w-2xl">
                                        {content.introduction.focusPoints.map((point, i) => (
                                            <div key={i} className="flex gap-4 p-5 rounded-2xl bg-muted/30 border border-border">
                                                <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">{i + 1}</div>
                                                <p className="text-sm text-foreground/70">{point}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-10 flex flex-wrap gap-3">
                                        <Button asChild>
                                            <Link to="/bom-admin/login">BOM Login (Authorities)</Link>
                                        </Button>
                                        <Button variant="secondary" asChild>
                                            <Link to="/about-management">About this Board</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="programs" className="mt-0 focus-visible:outline-none">
                            <div className="space-y-8">
                                <div className="max-w-3xl">
                                    <h3 className="text-3xl font-bold">Programs & Workshops</h3>
                                    <p className="mt-3 text-lg text-foreground/70">
                                        Discover upcoming and ongoing professional development workshops and institutional programs managed by the Board.
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {content.events
                                        .filter(e => e.category === "programs")
                                        .map(event => (
                                            <EventCard
                                                key={event.id}
                                                title={event.title}
                                                description={event.description}
                                                image={event.image}
                                                link={event.link}
                                            />
                                        ))
                                    }
                                    {content.events.filter(e => e.category === "programs").length === 0 && (
                                        <p className="text-muted-foreground py-12 text-center border-2 border-dashed rounded-3xl w-full col-span-2">
                                            No programs currently listed.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="associations" className="mt-0 focus-visible:outline-none">
                            <div className="space-y-8">
                                <div className="max-w-3xl">
                                    <h3 className="text-3xl font-bold">Professional Associations</h3>
                                    <p className="mt-3 text-lg text-foreground/70">
                                        The specialized associations under the SLIA umbrella focusing on distinct architectural and management niches.
                                    </p>
                                </div>

                                <div className="rounded-3xl border border-border bg-card p-6 md:p-10 shadow-sm">
                                    <Tabs defaultValue="slapm" className="space-y-8">
                                        <TabsList className="w-full h-auto flex flex-wrap justify-start gap-2 bg-muted/20 p-1 rounded-lg">
                                            <TabsTrigger value="slapm" className="flex-1 sm:flex-none data-[state=active]:bg-background">SLAPM</TabsTrigger>
                                            <TabsTrigger value="slaud" className="flex-1 sm:flex-none data-[state=active]:bg-background">SLAUD</TabsTrigger>
                                            <TabsTrigger value="slaia" className="flex-1 sm:flex-none data-[state=active]:bg-background">SLAIA</TabsTrigger>
                                            <TabsTrigger value="slaac" className="flex-1 sm:flex-none data-[state=active]:bg-background">SLAAC</TabsTrigger>
                                        </TabsList>

                                        {(["slapm", "slaud", "slaia", "slaac"] as const).map(cat => (
                                            <TabsContent key={cat} value={cat} className="mt-0 focus-visible:outline-none">
                                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    <div className="md:col-span-2 lg:col-span-1 py-4">
                                                        <h4 className="text-2xl font-bold uppercase">{cat}</h4>
                                                        <p className="mt-4 text-foreground/70 leading-relaxed">
                                                            {cat === "slapm" && "Sri Lanka Association of Project Managers focus on the management aspect of construction and architectural projects."}
                                                            {cat === "slaud" && "Sri Lanka Association of Urban Designers dedicated to shaping sustainable and livable urban environments."}
                                                            {cat === "slaia" && "Sri Lanka Association of Interior Architects focusing on the intersection of space and functionality."}
                                                            {cat === "slaac" && "Sri Lanka Association of Architects’ Computer Club promoting the use of digital tools."}
                                                        </p>
                                                    </div>
                                                    {content.events
                                                        .filter(e => e.category === cat)
                                                        .map(event => (
                                                            <EventCard
                                                                key={event.id}
                                                                title={event.title}
                                                                description={event.description}
                                                                image={event.image}
                                                                link={event.link}
                                                            />
                                                        ))
                                                    }
                                                    {content.events.filter(e => e.category === cat).length === 0 && (
                                                        <p className="text-muted-foreground py-8 text-center border border-dashed rounded-2xl col-span-2">
                                                            No events currently listed for this association.
                                                        </p>
                                                    )}
                                                </div>
                                            </TabsContent>
                                        ))}
                                    </Tabs>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </section>
        </PageLayout>
    );
};

const BoardOfManagement = () => (
    <BoardOfManagementView breadcrumb="Boards / Board of Management" />
);

export default BoardOfManagement;
