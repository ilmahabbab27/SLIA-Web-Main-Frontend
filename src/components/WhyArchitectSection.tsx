import ScrollReveal from "./ScrollReveal";
import { CheckCircle2 } from "lucide-react";

const WhyArchitectSection = () => {
    return (
        <section className="py-24 bg-background overflow-hidden">
            <div className="container px-4 mx-auto">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    <div className="lg:w-1/2 order-2 lg:order-1">
                        <ScrollReveal variant="fadeRight">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl -z-10 animate-pulse" />
                                <img
                                    src="/images/hero-1.jpg"
                                    alt="Modern Architectural Design"
                                    className="rounded-3xl shadow-2xl w-full object-cover min-h-[400px] lg:min-h-[500px]"
                                />
                                <div className="absolute -bottom-6 -right-6 bg-card border border-border p-6 rounded-2xl shadow-xl max-w-[240px] hidden md:block">
                                    <p className="text-sm font-medium text-foreground italic">
                                        "Architecture for humanity - Promoting the value addition of a Chartered Architect as a social investment."
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>

                    <div className="lg:w-1/2 order-1 lg:order-2">
                        <ScrollReveal variant="fadeUp">
                            <div className="mb-8">
                                <p className="text-primary font-medium uppercase tracking-widest text-sm mb-3">Excellence & Vision</p>
                                <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-6">
                                    Why an Architect?
                                </h2>
                                <div className="w-20 h-px bg-border mb-8" />
                            </div>

                            <div className="space-y-6 text-foreground/80 leading-relaxed text-lg">
                                <p>
                                    It is interesting to note that the Chartered Architect's role had been valued throughout history in many ways.
                                    Architects not only create designs that fulfill client's requirements but also add value to the projects in
                                    terms of social and environmental aspects which, in the long run, is beneficial to both the client and
                                    society at large.
                                </p>
                                <p>
                                    Sri Lanka Institute of Architects (SLIA) promotes the value addition of a Chartered Architect as a social
                                    investment; <span className="text-primary font-semibold">"Architecture for humanity"</span>. In Sri Lanka,
                                    the role of a Chartered Architect is gaining popularity, shaping the built environment in a new era of
                                    peace and prosperity.
                                </p>
                            </div>

                            <div className="mt-10 p-8 rounded-2xl bg-muted/30 border border-primary/20 relative">
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary rounded-l-2xl" />
                                <div className="flex gap-4">
                                    <CheckCircle2 className="text-primary w-6 h-6 shrink-0 mt-1" />
                                    <p className="text-foreground font-medium">
                                        A Professionally Qualified Architect is the only individual who possesses years of education, training
                                        and practice experience to understand client's aspirations and guide them in fulfilling their
                                        sheltering needs. All professional architects are governed by the code of ethics and regulations
                                        stipulated by the Sri Lanka Institute of Architects (SLIA).
                                    </p>
                                </div>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhyArchitectSection;
