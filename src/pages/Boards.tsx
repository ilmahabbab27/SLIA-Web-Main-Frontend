import PageLayout from "@/components/PageLayout";

const boards = [
  {
    title: "Board of Architectural Education",
    description: "Documents, members, and student representation for education and examinations.",
    href: "/bae",
    accent: "from-accent/25 to-transparent",
  },
  {
    title: "Board of Architectural Publications",
    description: "Browse and download Institute publications, journals, archives, and year books.",
    href: "/bap",
    accent: "from-secondary/25 to-transparent",
  },
  {
    title: "Board of Management",
    description: "Overseeing administrative strategic directions, programs, and professional associations.",
    href: "/management",
    accent: "from-primary/25 to-transparent",
  },
  {
    title: "Professional Affairs Board",
    description: "Ensuring ethical and professional practice, managing registrations and CPD events.",
    href: "/pab",
    accent: "from-accent/25 to-transparent",
  },
];

const Boards = () => (
  <PageLayout title="Boards" subtitle="Boards and committees" breadcrumb="Boards / Overview">
    <section className="py-16">
      <div className="container max-w-6xl mx-auto">
        <div className="rounded-3xl border border-border bg-card p-8 md:p-10 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(800px_circle_at_20%_0%,hsl(var(--primary)/0.14),transparent_55%),radial-gradient(700px_circle_at_80%_20%,hsl(var(--secondary)/0.12),transparent_55%)]" />
          <div className="relative">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground tracking-tight">Institute boards</h2>
            <div className="w-16 h-1 rounded-full bg-gradient-to-r from-primary/70 via-secondary/60 to-accent/50 mt-4" />
            <p className="mt-5 text-foreground/75 leading-relaxed max-w-3xl text-lg">
              Browse the Institute’s boards and explore their roles, documents, and member listings.
            </p>
          </div>
        </div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((b) => (
            <a
              key={b.title}
              href={b.href}
              className="rounded-3xl border border-border bg-card p-7 shadow-sm hover:shadow-md transition relative overflow-hidden group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${b.accent} opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative">
                <h3 className="text-xl font-semibold text-foreground">{b.title}</h3>
                <p className="mt-3 text-foreground/70 leading-relaxed">{b.description}</p>
                <div className="mt-6 inline-flex items-center text-sm font-semibold text-primary">View page</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Boards;

