import PageLayout from "@/components/PageLayout";
import ScrollReveal from "@/components/ScrollReveal";
import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  Compass,
  DraftingCompass,
  GraduationCap,
  HeartHandshake,
  Leaf,
  Lightbulb,
  Map,
  Users,
} from "lucide-react";

const responsibilities = [
  "Designing buildings and spaces",
  "Preparing plans, drawings, models, and design documentation",
  "Coordinating with engineers, quantity surveyors, contractors, and specialist consultants",
  "Managing project stages, budgets, approvals, and construction progress",
  "Ensuring compliance with planning, building, safety, accessibility, and professional regulations",
  "Promoting sustainable design practices through climate-responsive and resource-conscious decisions",
];

const architectureMatters = [
  "Create healthier communities",
  "Improve quality of life",
  "Preserve cultural heritage",
  "Support environmental sustainability",
  "Design resilient and inclusive spaces",
  "Shape the identity of cities and towns",
];

const benefits = [
  {
    title: "Creative Expression",
    description: "Turn ideas into real-world spaces, structures, and experiences that people use every day.",
    icon: Lightbulb,
  },
  {
    title: "Meaningful Impact",
    description: "Design environments that positively affect people's lives, wellbeing, safety, and opportunity.",
    icon: HeartHandshake,
  },
  {
    title: "Diverse Career Opportunities",
    description: "Work in design, planning, conservation, research, digital technology, project delivery, and more.",
    icon: BriefcaseBusiness,
  },
  {
    title: "Lifelong Learning",
    description: "Stay engaged with evolving technologies, materials, construction methods, and design trends.",
    icon: GraduationCap,
  },
  {
    title: "Global Opportunities",
    description: "Architecture skills are valued around the world across private practice, public work, and academia.",
    icon: Map,
  },
];

const skills = [
  "Creativity and innovation",
  "Problem-solving abilities",
  "Communication skills",
  "Technical and digital proficiency",
  "Attention to detail",
  "Teamwork and collaboration",
  "Leadership and project management",
  "Understanding of context, culture, climate, and users",
  "Professional ethics and responsibility",
];

const pathways = [
  "Architectural Designer",
  "Registered Architect",
  "Urban Planner",
  "Interior Architect",
  "Landscape Architect",
  "Sustainable Design Consultant",
  "Project Manager",
  "Heritage Conservation Specialist",
  "Academic and Research Professional",
  "Building Information Modelling Specialist",
  "Design Technology Consultant",
  "Public Sector Built Environment Professional",
];

const journeySteps = [
  {
    title: "Education",
    description: "Build a foundation in design, history, technology, communication, structures, and environmental design.",
  },
  {
    title: "Training",
    description: "Gain practical experience through studio work, office practice, construction exposure, and mentorship.",
  },
  {
    title: "Professional Practice",
    description: "Develop judgement in client service, contracts, approvals, ethics, coordination, and project delivery.",
  },
  {
    title: "Continuous Development",
    description: "Keep learning as design tools, regulations, materials, and social needs continue to evolve.",
  },
];

const WhyBeAnArchitect = () => (
  <PageLayout
    title="Why Be an Architect"
    subtitle="Architecture combines creativity, technical skill, public responsibility, and lifelong learning."
    breadcrumb="Home / Architect / Why Be an Architect"
  >
    <section className="py-16">
      <div className="container space-y-16">
        <ScrollReveal variant="fadeUp">
          <div className="grid gap-10 lg:grid-cols-1 lg:items-center">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-primary">
                The Profession
              </p>
              <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-5xl">
                What Does an Architect Do?
              </h2>
              <div className="my-7 h-1 w-20 rounded-full bg-primary" />
              <div className="space-y-5 text-lg leading-relaxed text-foreground/75">
                <p>
                  Architects plan, design, and oversee the construction of buildings and environments. They combine
                  creativity, technical expertise, research, communication, and problem-solving skills to create spaces
                  that are functional, safe, sustainable, inclusive, and visually appealing.
                </p>
                <p>
                  The architect's role begins long before construction starts. It includes understanding the client's
                  needs, studying the site and context, developing design ideas, coordinating professional input,
                  preparing documentation, supporting approvals, and helping guide the project through construction.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid gap-8 lg:grid-cols-2">
          <ScrollReveal variant="fadeUp">
            <div className="h-full rounded-3xl border border-border bg-card p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white">
                  <DraftingCompass className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground">Key Responsibilities</h3>
              </div>
              <div className="grid gap-3">
                {responsibilities.map((item) => (
                  <div key={item} className="flex gap-3 text-foreground/75">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fadeUp" delay={0.1}>
            <div className="h-full rounded-3xl border border-border bg-muted/30 p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground">Why Architecture Matters</h3>
              </div>
              <p className="mb-6 text-foreground/75">
                Architecture influences how people live, work, learn, gather, heal, and interact. Good architecture
                responds to people, place, culture, climate, technology, and future change.
              </p>
              <div className="grid gap-3">
                {architectureMatters.map((item) => (
                  <div key={item} className="flex gap-3 text-foreground/75">
                    <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal variant="fadeUp" className="hidden">
          <div>
            <div className="mb-8 max-w-3xl">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-primary">
                Professional Value
              </p>
              <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
                Benefits of Becoming an Architect
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-foreground/70">
                A career in architecture offers a rare combination of imagination, technical discipline, social
                contribution, and professional responsibility.
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <div key={benefit.title} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mb-3 font-heading text-xl font-bold text-foreground">{benefit.title}</h3>
                    <p className="text-sm leading-relaxed text-foreground/65">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>

        <div className="hidden grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <ScrollReveal variant="fadeUp">
            <div className="h-full rounded-3xl border border-border bg-card p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white">
                  <Compass className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground">Skills of a Successful Architect</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {skills.map((item) => (
                  <div key={item} className="flex gap-3 text-sm text-foreground/75">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fadeUp" delay={0.1}>
            <div className="h-full rounded-3xl border border-border bg-muted/30 p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white">
                  <Building2 className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground">Career Pathways</h3>
              </div>
              <p className="mb-6 text-foreground/75">
                Architecture opens a wide range of professional directions across design practice, construction,
                policy, research, conservation, technology, and environmental leadership.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {pathways.map((item) => (
                  <div key={item} className="rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm font-medium text-foreground/75">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal variant="fadeUp" className="hidden">
          <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8 md:p-10">
            <div className="mb-8 max-w-3xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white">
                <Leaf className="h-6 w-6" />
              </div>
              <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
                A Profession with Responsibility
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-foreground/75">
                Architects make decisions that affect communities, resources, public safety, and cultural identity.
                Their work must balance imagination with ethics, practicality, climate awareness, accessibility,
                durability, and respect for local context.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              {journeySteps.map((step, index) => (
                <div key={step.title} className="rounded-2xl border border-border bg-card p-5">
                  <div className="mb-4 text-sm font-bold text-primary">0{index + 1}</div>
                  <h3 className="mb-2 font-heading text-lg font-bold text-foreground">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-foreground/65">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  </PageLayout>
);

export default WhyBeAnArchitect;
