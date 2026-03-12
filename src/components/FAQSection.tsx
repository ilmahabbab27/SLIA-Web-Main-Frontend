import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import ScrollReveal from "./ScrollReveal";

const faqData = [
    {
        question: "WHAT ARE THE SLIA & THE ARB",
        answer: (
            <div className="space-y-4">
                <div>
                    <h4 className="font-bold text-foreground mb-1">Sri Lanka Institute of Architects (SLIA)</h4>
                    <p>
                        Sri Lanka Institute of Architects (SLIA) is an organization incorporated by an Act of Parliament titled
                        "Sri Lanka Institute of Architects law no 01 of 1976". The institute is dedicated to continuous promotion
                        and updating the knowledge and proficiency of its members, in order that the public interest is served and protected.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold text-foreground mb-1">Architects Registration Board (ARB)</h4>
                    <p>
                        Architects Registration Board (ARB) was established with the powers vested upon SLIA by Law No. 1 of 1976 as
                        amended by SLIA (Amendment) Act No. 14 of 1996. ARB registers qualified persons under three categories namely
                        Chartered Architects, Architects and Architectural Licentiates.
                    </p>
                </div>
            </div>
        ),
    },
    {
        question: "WHO DRAW PLANS",
        answer: (
            <div className="space-y-4">
                <div>
                    <h4 className="font-bold text-foreground mb-1">To draw plans Architects</h4>
                    <p>
                        All who claim that they could draw plans cannot be called Architects. Architects' exclusive function is to
                        design meaningful, functional and aesthetic spaces which cannot be done by any other person with only a
                        technical background. Therefore, you should be careful in identifying the qualified professionals to ensure
                        that hard earned money is utilized to its best in the project.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold text-foreground mb-1">To verify the authenticity of your Architect you may check:</h4>
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                        <li>Whether they are registered with Architects Registration Board (ARB).</li>
                        <li>Whether they are Members of the SLIA, who eligible to use such titles as AIA or FIA as their professional qualifications.</li>
                        <li>Whether they possess a certificate of practice issued by the SLIA.</li>
                        <li>Whether they possess an identity card issued by the SLIA.</li>
                    </ul>
                </div>
            </div>
        ),
    },
    {
        question: "How can I select my Architect",
        answer: (
            <div className="space-y-2">
                <p>You may select your Architect by:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Visiting the Website <a href="https://www.slia.lk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.slia.lk</a> or emailing <a href="mailto:secretariat@architects.lk" className="text-primary hover:underline">secretariat@architects.lk</a></li>
                    <li>Personally visiting SLIA at no. 120/7, Vidya Mw., Colombo 07</li>
                    <li>Calling SLIA on 011 2697109</li>
                    <li>Referring Architects Directory of SLIA</li>
                    <li>Conducting a Design competition through SLIA</li>
                </ul>
            </div>
        ),
    },
    {
        question: "What are the services offered by Architects",
        answer: (
            <div>
                <p>
                    Architects will assist and guide from initial conception to completion of the project. This includes:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>Selecting a site.</li>
                    <li>Arriving at comprehensive design brief after analysing the requirement.</li>
                    <li>Designing and Planning your building according to the design brief.</li>
                    <li>Assisting to select a good builder.</li>
                    <li>Managing the construction process and the team.</li>
                    <li>Involvement in the maintenance period.</li>
                </ul>
            </div>
        ),
    },
];

const FAQSection = () => {
    return (
        <section className="py-24 bg-muted/30 relative overflow-hidden">
            <div className="container relative z-10">
                <ScrollReveal>
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <p className="text-primary font-medium uppercase tracking-widest text-sm mb-3">Questions & Answers</p>
                        <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
                            Frequently Asked Questions
                        </h2>
                        <div className="w-20 h-1 rounded-full bg-gradient-to-r from-primary/70 via-secondary/60 to-accent/50 mx-auto mb-6" />
                        <p className="text-foreground/70 text-lg leading-relaxed">
                            Find answers to common questions about the Sri Lanka Institute of Architects and the architectural profession.
                        </p>
                    </div>
                </ScrollReveal>

                <div className="max-w-3xl mx-auto">
                    <ScrollReveal delay={0.2}>
                        <Accordion type="single" collapsible className="w-full space-y-4">
                            {faqData.map((faq, index) => (
                                <AccordionItem
                                    key={index}
                                    value={`item-${index}`}
                                    className="bg-card border border-border/60 rounded-2xl px-6 transition-all duration-300 hover:border-primary/30 shadow-sm"
                                >
                                    <AccordionTrigger className="text-left font-bold text-lg hover:no-underline hover:text-primary transition-colors py-6">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="text-foreground/70 text-base pb-6 leading-relaxed">
                                        {faq.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </ScrollReveal>
                </div>
            </div>

            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />
        </section>
    );
};

export default FAQSection;
