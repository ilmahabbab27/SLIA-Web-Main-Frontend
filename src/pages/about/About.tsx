import PageLayout from "@/components/PageLayout";

const quickFacts = [
  { label: "Inaugural meeting", value: "11 Sep 1957" },
  { label: "Allied with RIBA", value: "1960" },
  { label: "School of Architecture", value: "1961" },
  { label: "Incorporated as SLIA", value: "1976" },
];

const values = [
  {
    title: "Professional excellence",
    description:
      "Advance standards, ethics, and lifelong learning within the architectural profession.",
  },
  {
    title: "Public responsibility",
    description:
      "Serve society by supporting safe, sustainable, and well-designed built environments.",
  },
  {
    title: "Education & training",
    description:
      "Strengthen education and examinations that lead to recognized professional qualifications.",
  },
  {
    title: "Community & culture",
    description:
      "Celebrate architecture as a cultural force and connect professionals, students, and the public.",
  },
];

const objectives = [
  "Promote and advance the study, practice and application on research in architecture and its kindred subjects and the arts and sciences connected therewith;",
  "To organize, supervise and control the admission and professional education and training of persons desiring to qualify as Architects, to prescribe or approve courses of study for the qualifying examinations for membership of the Institute, and to conduct or provide for the conduct of such courses and examinations;",
  "To Prescribe the qualifications and disqualifications for members of the Institute and for Architects and Architectural licentiates who are not members of the Institute, the standards of professional conduct for members of the Institute and to secure the maintenance thereof;",
  "To protect and promote the interest, status, welfare, rights and privileges of the profession of architecture in Sri Lanka, and the interests of the public in relation to the profession, and of persons desiring to qualify as Architects;",
  "To establish, regulate and maintain libraries, pension and provident funds and benefit schemes for the members, officers and servants of the Institute and their dependents, and to grant assistance financial or otherwise to societies, students;",
];

const institutePowers = [
  "To acquire, hold, take or give on lease, hire, mortgage, pledge, sell and exchange or otherwise alienate, encumber or dispose of, any immovable or movable property for the purposes of the Institute;",
  "To enter into and perform or carry out whether directly or through any officer or agent authorized on behalf of the Institute, all such contracts or agreements as may be necessary for the attainment of the objectives or the exercise of the powers of the Institute;",
  "To invest its funds and to maintain current, deposit and savings accounts in any bank or banks;",
  "To advance or lend and to borrow money for the purposes of the Institute in such manner and upon such security as the Institute may think fit;",
  "To levy fees, subscriptions and contributions in respect of membership, admission to membership, and admission to courses and examinations conducted by the Institute;",
  "To prescribe the terms and conditions of, and to supervise, control and regulate the engagement, training, transfer and dismissal of persons desiring to qualify - as Architects.",
  "To appoint investigation committees and disciplinary committee to inquire into complaints of professional misconduct against Architects or Architectural Licentiates registered under this Law, who are not members of the Institute.",
  "To appoint, employ, transfer, dismiss or take other disciplinary action against officers and servants of the Institute and to prescribe their Terms and conditions of service;",
];

const timeline = [
  {
    year: "1948",
    title: "Early initiative",
    body: "The first attempt to form an Institute of Architects was made with architect Herbert Gonsal as a prime mover.",
  },
  {
    year: "1956",
    title: "CIA established",
    body: "The Ceylon Institute of Architects (CIA) was established by a small group of foreign qualified architects following several meetings to work out a constitution.",
  },
  {
    year: "11 Sep 1957",
    title: "Inaugural meeting",
    body: "The inaugural meeting was held at the Tea Propaganda Board, Prince Street, Colombo Fort, with twelve architects in participation.",
  },
  {
    year: "1960",
    title: "Allied with RIBA",
    body: "The CIA achieved allied society status of the Royal Institute of British Architects (RIBA).",
  },
  {
    year: "1961",
    title: "School of Architecture",
    body: "A School of Architecture attached to the Institute of Practical Technology, Katubedda, was established.",
  },
  {
    year: "1976",
    title: "Incorporation as SLIA",
    body: "The Institute was incorporated by an Act of Parliament — Sri Lanka Institute of Architects Law No. 1 of 1976.",
  },
  {
    year: "1996–1997",
    title: "Architects Registration Board",
    body: "The Amendment Law No. 14 of 1996 vested power to form an Architects Registration Board; in February 1997 practitioners were required to register under defined categories.",
  },
];

const boards = [
  { name: "Board of Trustees", href: "/about-trustees" },
  { name: "Board of Management", href: "/about-management" },
  { name: "Board of Architectural Education", href: "/about-bae" },
  { name: "Professional Affairs Board", href: "/about-pab" },
  { name: "Board of Architectural Publications", href: "/about-bap" },
];

const About = () => (
  <PageLayout title="About Us" subtitle="About Us" breadcrumb="About Us / About">
    <section className="py-24 md:py-32">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Hero */}
        <div className="max-w-4xl mx-auto text-center mb-32">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Sri Lanka Institute of Architects
          </h1>
          <div className="w-32 h-1.5 bg-gradient-to-r from-primary/80 via-secondary/60 to-accent/80 mx-auto mt-10 mb-10 rounded-full" />
          <p className="text-xl md:text-2xl text-foreground/70 leading-relaxed">
            The national professional body for architects in Sri Lanka, established by an Act of Parliament to
            advance the profession, education, and public interest in architecture.
          </p>
        </div>

        {/* Quick facts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-32">
          {quickFacts.map((fact, idx) => (
            <div
              key={fact.label}
              className="group relative bg-gradient-to-br from-background to-muted/30 border border-border/60 rounded-2xl p-6 text-center shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div
                className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r ${
                  idx === 0
                    ? "from-primary to-primary/50"
                    : idx === 1
                      ? "from-secondary to-secondary/50"
                      : idx === 2
                        ? "from-accent to-accent/50"
                        : "from-primary/50 via-secondary/50 to-accent/50"
                }`}
              />
              <div className="text-sm uppercase tracking-wider text-foreground/60">{fact.label}</div>
              <div className="text-2xl font-semibold text-foreground mt-2">{fact.value}</div>
            </div>
          ))}
        </div>

        {/* Institute flag & brochure */}
        <div className="grid md:grid-cols-2 gap-8 mb-32">
          <div className="bg-gradient-to-br from-muted/5 to-muted/10 border border-border/60 rounded-3xl p-8 shadow-md hover:shadow-xl transition">
            <h3 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-1.5 h-8 bg-primary rounded-full" />
              Institute Flag
            </h3>
            <div className="overflow-hidden rounded-xl border border-border/60 bg-background/60 p-4 flex justify-center">
              <img
                src="/images/institute-flag.svg"
                alt="Institute flag"
                className="max-w-full h-auto"
                loading="lazy"
              />
            </div>
            <p className="mt-4 text-foreground/70 text-sm leading-relaxed">
              The official flag of the Sri Lanka Institute of Architects, symbolizing the profession&apos;s
              commitment to excellence and service.
            </p>
          </div>

          <div className="bg-gradient-to-br from-muted/5 to-muted/10 border border-border/60 rounded-3xl p-8 shadow-md hover:shadow-xl transition">
            <h3 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-1.5 h-8 bg-secondary rounded-full" />
              Institute Brochure
            </h3>
            <p className="text-foreground/70 leading-relaxed mb-8">
              Download the SLIA brochure for a comprehensive overview of the Institute&apos;s history, mission,
              and activities.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/brochure.pdf"
                download
                className="px-8 py-4 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition rounded-xl shadow-sm"
              >
                Download PDF
              </a>
              <a
                href="/brochure.pdf"
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 border border-border bg-background hover:bg-muted/40 transition rounded-xl"
              >
                Preview
              </a>
            </div>
          </div>
        </div>

        {/* Boards (card-like structure) */}
        <div className="mb-32">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-4xl font-bold text-foreground">Boards</h2>
            <div className="flex-1 h-0.5 bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30 rounded-full" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {boards.map((b, idx) => (
              <a
                key={b.name}
                href={b.href}
                className="rounded-3xl border border-border/70 bg-card p-7 shadow-sm hover:shadow-md transition relative overflow-hidden group"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${
                    idx % 3 === 0
                      ? "from-primary/12 to-transparent"
                      : idx % 3 === 1
                        ? "from-secondary/12 to-transparent"
                        : "from-accent/12 to-transparent"
                  } opacity-0 group-hover:opacity-100 transition-opacity`}
                />
                <div className="relative">
                  <h3 className="text-xl font-semibold text-foreground">{b.name}</h3>
                  <p className="mt-3 text-foreground/70 leading-relaxed">View details</p>
                </div>
              </a>
            ))}
            <a
              href="/boards"
              className="rounded-3xl border border-border/70 bg-card p-7 shadow-sm hover:shadow-md transition relative overflow-hidden group sm:col-span-2 lg:col-span-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <h3 className="text-xl font-semibold text-foreground">All boards</h3>
                <p className="mt-3 text-foreground/70 leading-relaxed">Browse the boards overview</p>
              </div>
            </a>
          </div>
        </div>

        {/* Values */}
        <div className="mb-32">
          <div className="flex items-baseline justify-between mb-12">
            <h2 className="text-4xl md:text-5xl font-light text-foreground">Our values</h2>
            <span className="text-8xl font-black text-foreground/5">01</span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <div key={value.title} className="border-t border-border pt-6">
                <span className="text-6xl font-thin text-primary/20 block mb-4">
                  {(idx + 1).toString().padStart(2, "0")}
                </span>
                <h3 className="text-xl font-medium text-foreground mb-3">{value.title}</h3>
                <p className="text-foreground/70 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Purpose & mandate */}
        <div className="grid lg:grid-cols-2 mb-32">
          <div className="bg-primary/5 p-12 md:p-16">
            <h2 className="text-sm uppercase tracking-widest text-primary/60 mb-8">Objectives</h2>
            <ul className="space-y-6">
              {objectives.map((item) => (
                <li key={item} className="flex gap-4 text-foreground/80">
                  <span className="text-primary font-bold text-lg">—</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-secondary/5 p-12 md:p-16">
            <h2 className="text-sm uppercase tracking-widest text-secondary/60 mb-8">Powers</h2>
            <ul className="space-y-6">
              {institutePowers.map((item) => (
                <li key={item} className="flex gap-4 text-foreground/80">
                  <span className="text-secondary font-bold text-lg">—</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-32">
          <div className="flex items-baseline justify-between mb-12">
            <h2 className="text-4xl md:text-5xl font-light text-foreground">Timeline</h2>
            <span className="text-8xl font-black text-foreground/5">02</span>
          </div>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-16 pl-8">
              {timeline.map((item) => (
                <div key={`${item.year}-${item.title}`} className="relative">
                  <div className="absolute -left-8 top-2 w-4 h-4 rounded-full bg-primary/30 border-2 border-background" />
                  <span className="inline-block text-sm font-mono text-primary mb-2">{item.year}</span>
                  <h3 className="text-xl font-medium text-foreground mb-2">{item.title}</h3>
                  <p className="text-foreground/70 leading-relaxed max-w-2xl">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Explore further */}
        <div className="border-t border-border pt-16 pb-8">
          <h2 className="text-2xl font-light text-foreground mb-8">Explore further</h2>
          <div className="flex flex-wrap gap-6">
            {boards.map((b) => (
              <a key={b.name} href={b.href} className="text-foreground/70 hover:text-primary transition">
                {b.name}
              </a>
            ))}
            <a href="/boards" className="text-foreground/70 hover:text-primary transition">
              All boards
            </a>
          </div>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default About;
