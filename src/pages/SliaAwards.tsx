import { useEffect, useMemo, useState } from "react";
import PageLayout from "@/components/PageLayout";
import ScrollReveal from "@/components/ScrollReveal";
import { awardCategoryApi, awardSettingApi, type AwardCategoryItem } from "@/lib/api";
import { Award, Trophy, Star, Medal, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const generalGuideline =
    "SLIA's Architectural Awards are the most prominent Awards in Sri Lanka simply because selection is by a renowned panel of Jurors, a Technical Evaluation Committee and an International Juror who is familiar with local Architecture and who recognizes and acknowledges excellence in Architecture by physically visiting all shortlisted projects island-wide is the key feature of this most outstanding award scheme.\n\nThe scrutiny and strict contingent evaluation and anonymous marking process ensure a very contingent selection process to recognize Architecture during the short listing phase. Additionally, the subsequent physical visits to all sites further enhances credentials and credibility to recognize the high standards in Architecture and is the pride of SLIA's legendary Awards Scheme.";

const fallbackAwardCategories: AwardCategoryItem[] = [
    {
        id: 1,
        year: "2026",
        name: "Design Awards",
        description:
            "Recognizing and rewarding built architectural works that address the needs and aspirations of excellence in Sri Lankan design.",
        guideline:
            "Submit completed built work with project documentation, drawings, photographs, and consent for jury site visits where shortlisted.",
        guideline_attachment_name: "",
        guideline_attachment: "",
        general_guideline: generalGuideline,
        is_active: true,
        sort_order: 1,
    },
    {
        id: 2,
        year: "2026",
        name: "Architectural Heritage Conservation",
        description: "Recognizing projects that conserve, restore, and celebrate Sri Lanka's architectural heritage.",
        guideline:
            "Include conservation approach, historical research, intervention details, and evidence of completed or implemented work.",
        guideline_attachment_name: "",
        guideline_attachment: "",
        general_guideline: generalGuideline,
        is_active: true,
        sort_order: 2,
    },
    {
        id: 3,
        year: "2026",
        name: "Green & Sustainable Architecture",
        description: "Honoring sustainable design approaches that respond to climate, context, and long-term resilience.",
        guideline:
            "Provide sustainability objectives, measured or expected environmental performance, and supporting design documentation.",
        guideline_attachment_name: "",
        guideline_attachment: "",
        general_guideline: generalGuideline,
        is_active: true,
        sort_order: 3,
    },
    {
        id: 4,
        year: "2026",
        name: "Socially Responsible Architecture",
        description: "Recognizing architecture that delivers meaningful social impact for communities across Sri Lanka.",
        guideline:
            "Provide evidence of community benefit, stakeholder engagement, and the built outcome's contribution to social needs.",
        guideline_attachment_name: "",
        guideline_attachment: "",
        general_guideline: generalGuideline,
        is_active: true,
        sort_order: 4,
    },
];

const iconMap = [Trophy, Star, Award, Medal];

const SliaAwards = () => {
    const [awardCategories, setAwardCategories] = useState<AwardCategoryItem[]>(fallbackAwardCategories);
    const [awardSettings, setAwardSettings] = useState({
        year: "2026",
        general_guideline: generalGuideline,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        Promise.all([awardCategoryApi.list(), awardSettingApi.show()])
            .then(([data, settings]) => {
                const activeItems = data.filter((item) => item.is_active);
                if (mounted && activeItems.length > 0) setAwardCategories(activeItems);
                if (mounted) {
                    setAwardSettings({
                        year: settings.year || "2026",
                        general_guideline: settings.general_guideline || generalGuideline,
                    });
                }
            })
            .catch(() => {
                if (mounted) setAwardCategories(fallbackAwardCategories);
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, []);

    const displayYear = awardSettings.year || "2026";

    const categoryYear = useMemo(() => {
        const hasDisplayYearCategories = awardCategories.some((category) => category.year === displayYear);
        if (hasDisplayYearCategories) return displayYear;

        return [...awardCategories].sort((a, b) => Number(b.year) - Number(a.year))[0]?.year || displayYear;
    }, [awardCategories, displayYear]);

    const currentYearCategories = useMemo(
        () =>
            awardCategories
                .filter((category) => category.year === categoryYear)
                .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name)),
        [awardCategories, categoryYear]
    );

    const pageGuideline = awardSettings.general_guideline || generalGuideline;

    return (
        <PageLayout title="SLIA Awards">
            <section className="pt-32 pb-24 relative overflow-hidden bg-background">
                <div className="container relative z-10 px-4 mx-auto">
                    <ScrollReveal>
                        <div className="max-w-3xl mx-auto text-center mb-20">
                            <p className="text-primary font-bold uppercase tracking-widest text-sm mb-4">
                                Excellence in Architecture
                            </p>
                            <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground mb-6 tracking-tight">
                                SLIA Awards {displayYear}
                            </h1>
                            <div className="w-24 h-1.5 bg-primary mx-auto mb-8 rounded-full" />
                            <div className="text-foreground/70 text-xl leading-relaxed space-y-5">
                                {pageGuideline.split("\n\n").map((paragraph) => (
                                    <p key={paragraph}>{paragraph}</p>
                                ))}
                            </div>
                            <div className="mt-10 flex flex-wrap justify-center gap-4">
                                <Button asChild size="lg">
                                    <a href="https://awards.slia.lk/" target="_blank" rel="noreferrer">
                                        Visit Awards Website
                                    </a>
                                </Button>
                                <Button asChild size="lg" variant="secondary">
                                    <a href="https://awards.slia.lk/" target="_blank" rel="noreferrer">
                                        View Requirements &amp; Guidelines for {displayYear}
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </ScrollReveal>

                    {loading && (
                        <div className="mb-8 flex items-center justify-center gap-2 text-sm text-foreground/50">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading award categories...
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                        {currentYearCategories.map((category, index) => {
                            const Icon = iconMap[index % iconMap.length];

                            return (
                                <ScrollReveal key={category.id} delay={index * 0.1}>
                                    <div className="group relative p-1 rounded-3xl border border-border/50 hover:border-primary/30 bg-transparent transition-all duration-500 h-full">
                                        <div className="bg-card h-full rounded-[1.4rem] p-8 lg:p-10 border border-border/40 relative overflow-hidden flex flex-col">
                                            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500">
                                                <Icon className="w-7 h-7 text-white" />
                                            </div>

                                            <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                                                {category.year}
                                            </div>
                                            <h3 className="font-heading text-2xl font-bold text-foreground mb-4">
                                                {category.name}
                                            </h3>

                                            <p className="text-foreground/65 leading-relaxed mb-6 flex-1">
                                                {category.description || "Award category details will be updated soon."}
                                            </p>

                                            {category.guideline && (
                                                <div className="mb-8 rounded-2xl bg-muted/40 p-5 text-left">
                                                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                                                        Guideline
                                                    </p>
                                                    <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/65">
                                                        {category.guideline}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                                                {category.guideline_attachment && (
                                                    <Button asChild variant="secondary" className="justify-start gap-2">
                                                        <a
                                                            href={category.guideline_attachment}
                                                            download={category.guideline_attachment_name || `${category.name}-guideline`}
                                                        >
                                                            <FileText className="h-4 w-4" />
                                                            Download Guideline
                                                        </a>
                                                    </Button>
                                                )}
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
                                    </div>
                                </ScrollReveal>
                            );
                        })}
                    </div>

                    <ScrollReveal delay={0.4}>
                        <div className="mt-24 p-12 rounded-3xl bg-muted/30 border border-border relative overflow-hidden text-center">
                            <div className="relative z-10">
                                <h2 className="font-heading text-3xl font-bold text-foreground mb-6">
                                    Awards Cycle &amp; Evaluation
                                </h2>
                                <div className="text-foreground/70 text-lg mb-8 max-w-2xl mx-auto space-y-5">
                                    {pageGuideline.split("\n\n").map((paragraph) => (
                                        <p key={`cycle-${paragraph}`}>{paragraph}</p>
                                    ))}
                                </div>
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
