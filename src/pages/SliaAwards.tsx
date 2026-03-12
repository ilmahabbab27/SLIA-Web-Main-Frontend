import PageLayout from "@/components/PageLayout";
import ScrollReveal from "@/components/ScrollReveal";
import { Award, Trophy, Star, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";

const awardCategories = [
    {
        title: "Design Awards",
        description:
            "Recognizing and rewarding built architectural works that address the needs and aspirations of excellence in Sri Lankan design.",
        icon: Trophy,
        color: "from-amber-400 to-orange-500",
    },
    {
        title: "Color Awards",
        description: "Celebrating excellence in the use of color in architecture and the built environment.",
        icon: Star,
        color: "from-blue-400 to-indigo-500",
    },
    {
        title: "Architectural Heritage Conservation",
        description: "Recognizing projects that conserve, restore, and celebrate Sri Lanka’s architectural heritage.",
        icon: Award,
        color: "from-purple-400 to-pink-500",
    },
    {
        title: "Green & Sustainable Architecture",
        description: "Honoring sustainable design approaches that respond to climate, context, and long-term resilience.",
        icon: Medal,
        color: "from-emerald-400 to-teal-500",
    },
    {
        title: "Socially Responsible Architecture",
        description: "Recognizing architecture that delivers meaningful social impact for communities across Sri Lanka.",
        icon: Award,
        color: "from-rose-400 to-red-500",
    },
    {
        title: "Architectural Research",
        description: "Commending research that advances knowledge and practice within Sri Lanka’s built environment.",
        icon: Medal,
        color: "from-cyan-400 to-sky-500",
    },
    {
        title: "Architectural Publication",
        description: "Recognizing publications that strengthen discourse and documentation of Sri Lankan architecture.",
        icon: Trophy,
        color: "from-fuchsia-400 to-violet-500",
    },
    {
        title: "Young Architect of the Year",
        description: "Celebrating promising talent and emerging leadership among the next generation of architects.",
        icon: Star,
        color: "from-lime-400 to-emerald-500",
    },
];

const SliaAwards = () => {
    return (
        <PageLayout title="SLIA Awards">
            <section className="pt-32 pb-24 relative overflow-hidden bg-background">
                {/* Abstract background elements */}
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-secondary/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <div className="container relative z-10 px-4 mx-auto">
                    <ScrollReveal>
                        <div className="max-w-3xl mx-auto text-center mb-20">
                            <p className="text-primary font-bold uppercase tracking-widest text-sm mb-4">
                                Excellence in Architecture
                            </p>
                            <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
                                SLIA Awards
                            </h1>
                            <div className="w-24 h-1.5 bg-gradient-to-r from-primary to-secondary mx-auto mb-8 rounded-full" />
                            <div className="text-foreground/70 text-xl leading-relaxed space-y-5">
                                <p>
                                    Sri Lankan Architecture Awards are the esteemed Sri Lankan awards for Architecture
                                    established by the Sri Lanka Institute of Architects in 1956. SLIA Awards aims to
                                    recognize and reward built architectural works that address the needs and aspirations
                                    of excellence in Sri Lankan Design.
                                </p>
                                <p>
                                    SLIA, as the Institute responsible for the Built Environment in Sri Lanka, strives to
                                    ensure exceptional Architectural works are celebrated to shape our Country’s built
                                    fabric to become the Wonder of Asia. The awards aim to recognize and brand Sri Lankan
                                    Architecture in appropriation to its people, context and construction technology.
                                </p>
                                <p>
                                    The SLIA has been conducting the legendary Awards Cycle for more than 25 years, with
                                    categories recognized on a wider cross section of awards, island wide.
                                </p>
                            </div>
                            <div className="mt-10 flex flex-wrap justify-center gap-4">
                                <Button asChild size="lg">
                                    <a href="https://awards.slia.lk/" target="_blank" rel="noreferrer">
                                        Visit Awards Website
                                    </a>
                                </Button>
                                <Button asChild size="lg" variant="secondary">
                                    <a href="https://awards.slia.lk/" target="_blank" rel="noreferrer">
                                        View Requirements &amp; Guidelines for 2026
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </ScrollReveal>

                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                        {awardCategories.map((category, index) => (
                            <ScrollReveal key={category.title} delay={index * 0.1}>
                                <div className="group relative p-1 rounded-3xl bg-gradient-to-br from-border/50 to-transparent hover:from-primary/20 transition-all duration-500 h-full">
                                    <div className="bg-card h-full rounded-[1.4rem] p-8 lg:p-10 border border-border/40 relative overflow-hidden flex flex-col">
                                        {/* Icon Background Decor */}
                                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${category.color} opacity-[0.03] rounded-bl-full translate-x-8 -translate-y-8 group-hover:opacity-10 transition-opacity duration-500`} />

                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                            <category.icon className="w-7 h-7 text-white" />
                                        </div>

                                        <h3 className="font-heading text-2xl font-bold text-foreground mb-4">
                                            {category.title}
                                        </h3>

                                        <p className="text-foreground/65 leading-relaxed mb-8 flex-1">
                                            {category.description}
                                        </p>

                                        <Button asChild variant="ghost" className="justify-start px-0">
                                            <a href="https://awards.slia.lk/" target="_blank" rel="noreferrer">
                                                <span className="flex items-center gap-2 font-bold">
                                                    <span>View Now</span>
                                                    <span className="text-xl">→</span>
                                                </span>
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>

                    <ScrollReveal delay={0.4}>
                        <div className="mt-24 p-12 rounded-3xl bg-muted/30 border border-border relative overflow-hidden text-center">
                            <div className="relative z-10">
                                <h2 className="font-heading text-3xl font-bold text-foreground mb-6">
                                    Awards Cycle &amp; Evaluation
                                </h2>
                                <p className="text-foreground/70 text-lg mb-8 max-w-2xl mx-auto">
                                    SLIA’s Architectural Awards are the most prominent awards in Sri Lanka because
                                    selection is by a renowned panel of Jurors, a Technical Evaluation Committee, and an
                                    International Juror who recognizes excellence by physically visiting all shortlisted
                                    projects island-wide.
                                </p>
                                <p className="text-foreground/70 text-lg mb-8 max-w-2xl mx-auto">
                                    The scrutiny, strict evaluation, and anonymous marking process ensure a robust
                                    shortlisting phase. Additionally, physical visits to all sites further strengthen the
                                    credibility of recognizing the highest standards in Architecture.
                                </p>
                                <div className="flex flex-wrap justify-center gap-4">
                                    <Button asChild size="lg">
                                        <a href="https://awards.slia.lk/" target="_blank" rel="noreferrer">
                                            Entry Guidelines
                                        </a>
                                    </Button>
                                    <Button asChild size="lg" variant="outline">
                                        <a href="https://awards.slia.lk/" target="_blank" rel="noreferrer">
                                            Past Winners
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>
        </PageLayout>
    );
};

export default SliaAwards;
