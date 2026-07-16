import PageLayout from "@/components/PageLayout";
import { BookOpen, Building2, FileText, GraduationCap, Landmark, Library, ShieldCheck } from "lucide-react";

const facts = [
  { label: "First attempt", value: "1948" },
  { label: "CIA established", value: "1956" },
  { label: "Inaugural meeting", value: "11th September 1957" },
  { label: "SLIA incorporated", value: "Law No. 1 of 1976" },
];

const introParagraphs = [
  "The Sri Lanka Institute of Architects is one of the foremost professional organisations in Sri Lanka as well as the Asian region. The institute has been working on the professional practices of architecture in the country as well as education, which have been the primary focuses over the years. we are proud to note that we have seen a lot of improvements in the industry and have played a great role in contributing to the development of architecture as well as the raising of the standards in the country.",
  "The Ceylon Institute of Architects (CIA) was established in 1956 by a small group of foreign qualified Architects following several meetings to work out a constitution. This original group also had membership of the Royal Institute of British Architects (RIBA).The Inaugural meeting of the institute was held on 11th September 1957 at the Tea Propaganda Board on Prince Street in the Colombo Fort with the - participation of twelve Architects.",
  "Having adopted a constitution, which followed that of the British Institute of Architects, the intention of the CIA was to obtain the status of an allied society of the RIBA. They achieved this in 1960, by which time the membership of The Ceylon Institute of Architects had risen to 30. The CIA received the encouragement of the then President of the RIBA, Sir Basil Spence and the considerable assistance of C.D.Spragg the then Secretary of the RIBA. In recognition of this assistance Mr. Spragg was later elected by the CIA as its first Honorary Fellow. Due to the hard work of these founder members of the Institute, a School of Architecture attached to the Institute of Practical Technology, Katubedda was established in 1961.",
  "In 1976, through a private member's motion by the then Minister of Housing and Construction, the Hon. Pieter Keuneman, the Ceylon Institute of Architects was incorporated as the Sri Lanka Institute of Architects (SLIA) by an Act of Parliament, called the Sri Lanka Institute of Architects Law No.1 of 1976.",
];

const earlyYearsParagraphs = [
  "The first attempt to form an Institute of Architects was made in 1948 with architect Herbert Gonsal as the prime mover. Due to disagreement on some issues, the matter was not pursued at that time. Further attempts were made in 1951 and 1954 by architect Wynne-Jones with architect Herbert Gonsal as the chief proponent. The Ceylon Institute of Architects (CIA) established in 1956 by a small group of foreign qualified architects following several meetings to work out a constitution. This original group also had membership of the Royal Institute of British Architects (RIBA). The inaugural meeting of the institute was held on 11th September 1957 at the Tea Propaganda Board on Prince Street in the Colombo Fort with the participation of twelve architects. Oliver Weerasinghe, T. N. Wynne-Jones, Herbert E. Gonsal and G. B. Altham were elected as the first Fellow Members of the CIA. Others who participated at the inaugural meeting were elected as the first Associate Members of the CIA, namely, H. J. Billimoria, Ronald de Krester, S. A. David, Justin Samarasekera, Visva Selvaratnam, O. S. Candaval, P. N. Wijesinghe and Wilson Peiris. The signatures of those who attended this inaugural meeting can still be seen in the attendance register. W. B. Claessen, Neville Gunaratne, J. C. Nilgiria, A. Panditharatne and S. H. Peiris did not attend the inaugural meeting even though they had obtained membership of the institute. As architect Oliver Weerasinghe was due to take up an assignment in the United Nations in a few months, Wynne-Jones requested him to take the Chair and he became the first President of the CIA.",
  "The dedicated founder members, all of whom were senior members of the Architectural profession in Ceylon, were later elected as Fellows of the Ceylon Institute of Architects. They were Messrs. Oliver Weerasinghe, T. N. Wynne-Jones, G. B. Altham, H. J. Billimoria, W. B. Claessen, Herbert E. Gonsal, Neville Gunaratne, J. C. Nilgiria, A. Panditharatne, P. H. Wilson Peiris, S. H. Peiris and Justin Samarasekera. Having adopted a constitution, which followed that of the British Institute of Architects, the intention of the CIA was to obtain the status of an allied society of the RIBA. They achieved this in 1960, by which time the membership of the Ceylon Institute of Architects had risen to 30. The CIA received the encouragement of the then President of the RIBA, Sir Basil Spence and the considerable assistance of C. D. Spragg the then Secretary of the RIBA. In recognition of this assistance, architect Spragg was later elected by the CIA as its first Honorary Fellow. Due to the hard work of these founder members of the institute, a School of Architecture attached to the Institute of Practical Technology, Katubedda was established in 1961.",
  "Having inaugurated the CIA on 1957, it published its first document on 'Condition of Engagement and Scale of Professional fees' in 1966. The position of architect was accepted by the Government with significance by mid 1970's and architects were engaged in many Government projects.",
];

const incorporationParagraphs = [
  "In 1976, through a private member's motion by the then Minister of Housing and Construction, the Hon. Pieter Keuneman, the Ceylon Institute of Architects was incorporated as the Sri Lanka Institute of Architects (SLIA) by an Act of Parliament, called the Sri Lanka Institute of Architects Law No. 1 of 1976.",
  "After incorporation, the Institute was called upon to perform important public duties and to take responsibility for the education and examination of Architects for the purpose of providing a professional qualification. In order to improve the services offered to the members and the general public, the Institute established a permanent office at the premises of the Sri Lanka Association for Advancement of Science (SLAAS) building in April 1978. Since then the Institute has adopted Standing Orders, and a Code of Conduct, and has established a Board of Architectural Education to serve its members and the general public and the construction industry of Sri Lanka. A long overdue amendment to the SLIA Law was presented to Parliament in 1996 by the then Minister of Urban Development, Housing and Public Utilities, Hon. Nimal Siripala De Silva. The Sri Lanka Institute of Architects (Amendment) Law No. 14 of 1996 vested power in the Institute to form an \"Architects Registration Board\". With the formation of this Board in February 1997 all those who practice the profession of architecture in Sri Lanka are required to register under three categories namely \"Chartered Architect\", \"Architect\" and \"Architectural Licentiate'. The SLIA is grateful to the late Hon. Pieter Keuneman and Hon. Nimal Siripala De Silva for the kind assistance extended to further the Architectural Profession in Sri Lanka.",
  "The CIA office and SLIA office carried on its operations from the private office or residence of the Hony. Secretary until April 1978 when the SLIA office was shifted to a small room in the SLAAS building at 120/10, Vidya Mawatha, Off Wijerama Mawatha, Colombo 07. This was due to the fact that, a twenty perch land adjoining SLAAS, was given on lease by the Government to the SLIA. In 1982, the SLIA Council decided to have their own building. A competition was conducted for the design of the building on a site in Kotte in 1984. Prof. Lakshman Alwis won the competition. However, after carrying out the soil testing, this site was abandoned and Prof. Lakshman Alwis was requested to do another design for the new site at 120/7, Vidya Mawatha, Colombo 07, where the present SLIA head Office is located. Prof. Alwis provided professional services in this regard free of charge through his office - M/S Design Consortium Limited. The construction of the building was commenced when Archt. Mihindu Keerthiratne was President SLIA during the 1991/92. However, construction work of the building went at a slow pace from 1993-1996. In March 1997, then the President of SLIA, Archt. V. N. C. Gunasekera shifted the SLIA office to this new semi-finished building and completed all works by 1998. The SLIA premises now consists of the following facilities: Council Chamber, Committee Rooms, SLIA Secretariat, Library, Members Lounge, Offices of BAE, PAB, BAP, Auditorium and Office of ARB.",
  "In 1982, which was the Silver jubilee year of SLIA, the 1st annual sessions was organized and implemented by Archt./Plnr. Desamanya Dr. Surath Wickremasinghe - Vice president during the presidency of Archt. Lala Adithiya. The annual sessions served as a public affairs forum to discuss construction industry issues, an opportunity to display members work, building products and the trade exhibition. The inauguration of this event by the president of Sri Lanka his Excellency J R Jayawardena, was the first occasions of SLIA that a head of state participated.",
  "In 1982, which was the Silver jubilee year of SLIA, the 1st annual sessions was organized and implemented by Archt./Plnr. Desamanya Dr. Surath Wickremasinghe - Vice president during the presidency of Archt. Lala Adithiya. The annual sessions served as a public affairs forum to discuss construction industry issues, an opportunity to display members work, building products and the trade exhibition. The inauguration of this event by the president of Sri Lanka his Excellency J R Jayawardena, was the first occasions of SLIA that a head of state participated. Simultaneously the 3rd ARCASIA meeting was held in Sri Lanka. Archt. Lala Adithiya, the new elected Chairman, ARCASIA was the first Sri Lankan elected to this post. The event concluded with the \"Architects ball\" which was also introduced for the first time.",
  "The success of this mammoth task was backed by the steering committee comprising of Late Prof. Archt. Gemunu Fernando, Archt. Lalith de Silva, Prof. Archt. Lakshman Alwis and several others under the leadership of Archt./Plnr. Desamanya Dr. Surath Wickremasinghe.",
  "A significant development in the history of the Institute was the expansion of the Annual Sessions to include a trade and members' work exhibition. The first such event was organized by Archt. Gemunu Fernando in 1983 when Archt./Plnr. Desamanya Dr. Surath Wickremasinghe was the President.",
  "The annual sessions which is now an annual National Conference in Architecture together with the other activities & public affairs forum has broadened up providing opportunity for the students of Architecture to exhibit their work. In addition to becoming a huge boost to architects, the above events have played a major role in exposing the public to recent work of architects, new materials and products displayed at the building and trade exhibition. The success of these events has made SLIA one of the financially strongest professional institutes in Sri Lanka enabling SLIA to provide members welfare, carrier development opportunities and render service to the society. It has grown over the years to be a much looked-forward to event at a national scale.",
];

const objectives = [
  "Promote and advance the study, practice and application on research in architecture and its kindred subjects and the arts and sciences connected therewith;",
  "To organize, supervise and control the admission and professional education and training of persons desiring to qualify as Architects, to prescribe or approve courses of study for the qualifying examinations for membership of the Institute, and to conduct or provide for the conduct of such courses and examinations;",
  "To Prescribe the qualifications and disqualifications for members of the Institute and for Architects and Architectural licentiates who are not members of the Institute, the standards of professional conduct for members of the Institute and to secure the maintenance thereof;",
  "To protect and promote the interest, status, welfare, rights and privileges of the profession of architecture in Sri Lanka, and the interests of the public in relation to the profession, and of persons desiring to qualify as Architects;",
  "To establish, regulate and maintain libraries, pension and provident funds and benefit schemes for the members, officers and servants of the Institute and their dependents, and to grant assistance financial or otherwise to societies, students;",
];

const powers = [
  "To acquire, hold, take or give on lease, hire, mortgage, pledge, sell and exchange or otherwise alienate, encumber or dispose of, any immovable or movable property for the purposes of the Institute;",
  "To enter into and perform or carry out whether directly or through any officer or agent authorized on behalf of the Institute, all such contracts or agreements as may be necessary for the attainment of the objectives or the exercise of the powers of the Institute;",
  "To invest its funds and to maintain current, deposit and savings accounts in any bank or banks;",
  "To advance or lend and to borrow money for the purposes of the Institute in such manner and upon such security as the Institute may think fit;",
  "To levy fees, subscriptions and contributions in respect of membership, admission to membership, and admission to courses and examinations conducted by the Institute;",
  "To prescribe the terms and conditions of, and to supervise, control and regulate the engagement, training, transfer and dismissal of persons desiring to qualify - as Architects.",
  "To appoint investigation committees and disciplinary committee to inquire into complaints of professional misconduct against Architects or Architectural Licentiates registered under this Law, who are not members of the Institute.",
  "To appoint, employ, transfer, dismiss or take other disciplinary action against officers and servants of the Institute and to prescribe their Terms and conditions of service;",
  "Generally, to do all such acts and things as are necessary for, or incidental or conducive to, the carrying out or the attainment of the objectives of the Institute.",
  "The act also specifies that, no person shall take and use the title Chartered Architect, Architect or Architectural licentiate unless he is duly registered as a Chartered Architect, Architect or Architectural Licentiate respectively with the ARB.",
  "A person who is not registered as a Chartered Architect, Architect or Architectural Licentiate shall not be entitled to Institute, or maintain any action in a court of law for the recovery of any fees for professional services rendered by him as a Chartered Architect, Architect or Architectural Licentiate.",
];

const boards = [
  { name: "Board of Trustees", href: "/about-trustees" },
  { name: "Board of Management", href: "/about-management" },
  { name: "Board of Architectural Education", href: "/about-bae" },
  { name: "Professional Affairs Board", href: "/about-pab" },
  { name: "Board of Architectural Publications", href: "/about-bap" },
];

const Section = ({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section className="scroll-mt-24 border-t border-border pt-12">
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">{eyebrow}</p>
        <h2 className="mt-3 font-heading text-3xl font-semibold text-foreground">{title}</h2>
      </div>
      <div className="space-y-5 text-sm leading-7 text-foreground/75 md:text-base md:leading-8">{children}</div>
    </div>
  </section>
);

const About = () => (
  <PageLayout title="About Us" subtitle="Sri Lanka Institute of Architects" breadcrumb="About Us / About">
    <section className="bg-background py-12 md:py-16">
      <div className="container space-y-14">
        <div className="grid overflow-hidden border border-border bg-card shadow-sm lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:grid-rows-[auto_auto]">
          <div className="min-w-0 p-6 md:p-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">History</p>
              <h1 className="mt-4 max-w-5xl break-words font-heading text-4xl font-semibold leading-tight text-foreground md:text-5xl xl:text-6xl">
                Sri Lanka Institute of Architects
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-foreground/70">
                The national professional body for architects in Sri Lanka, shaped by professional practice,
                education, public responsibility, and statutory duties under the Sri Lanka Institute of Architects Law.
              </p>
              <a
                href="/images/history.pdf"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-2 border border-primary bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                <FileText className="h-4 w-4" />
                Read More Brochure
              </a>
            </div>
          </div>

          <div className="relative min-h-[360px] bg-muted lg:col-start-2 lg:row-start-1">
            <img src="/images/hero-2.jpg" alt="Sri Lankan architecture" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-black/30" />
          </div>

          <div className="grid gap-3 border-t border-border bg-background/40 p-4 sm:grid-cols-2 lg:col-span-2 lg:row-start-2 xl:grid-cols-4">
            {facts.map((fact) => (
              <div key={fact.label} className="border border-border bg-card p-5">
                <p className="text-xs uppercase tracking-widest text-foreground/50">{fact.label}</p>
                <p className="mt-2 font-heading text-xl font-semibold text-foreground">{fact.value}</p>
              </div>
            ))}
          </div>
        </div>

        <nav className="flex flex-wrap gap-2">
          {[
            ["History", "#history"],
            ["Early Years", "#early-years"],
            ["Incorporation", "#incorporation"],
            ["Objectives", "#objectives"],
            ["Flag", "#flag"],
            ["Boards", "#boards"],
          ].map(([label, href]) => (
            <a key={href} href={href} className="border border-border bg-card px-4 py-2 text-sm font-medium text-foreground/70 transition hover:border-primary hover:text-primary">
              {label}
            </a>
          ))}
        </nav>

        <Section eyebrow="History" title="Sri Lanka Institute of Architects">
          {introParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Section>

        <Section eyebrow="About Us" title="About Us">
          <p>{introParagraphs[0]}</p>
        </Section>

        <Section eyebrow="Education" title="The Role Of The SLIA In Architectural Education">
          <p>
            Sri Lanka Institute of Architects Law No. 1 of 1976 enacted by the National State Assembly vested statutory powers with the SLIA. One of the main objectives of the SLIA is to promote and advance the study, practice and application of and Research in Architecture and kindred subjects and the arts and sciences connected therewith.
          </p>
        </Section>

        <section id="objectives" className="scroll-mt-24 grid gap-6 md:grid-cols-3">
          {[
            { title: "Study and practice", icon: BookOpen, body: "Promote research, study, practice, and application in architecture and connected arts and sciences." },
            { title: "Professional training", icon: GraduationCap, body: "Organize, supervise, and control admission, education, training, courses, and qualifying examinations." },
            { title: "Public interest", icon: ShieldCheck, body: "Protect the profession and the public through standards, registration, rights, and professional conduct." },
          ].map((item) => (
            <div key={item.title} className="border border-border bg-card p-6 shadow-sm">
              <item.icon className="h-7 w-7 text-primary" />
              <h3 className="mt-5 font-heading text-xl font-semibold text-foreground">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-foreground/70">{item.body}</p>
            </div>
          ))}
        </section>

        <Section eyebrow="Objectves Of The Institute" title="Objectives And Powers Of The SLIA">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="border border-border bg-card p-6">
              <h3 className="font-heading text-xl font-semibold text-foreground">General Objectives Of The Institute</h3>
              <ol className="mt-5 space-y-4">
                {objectives.map((item, index) => (
                  <li key={item} className="flex gap-4">
                    <span className="font-heading text-xl text-primary">{String.fromCharCode(65 + index)}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="border border-border bg-card p-6">
              <h3 className="font-heading text-xl font-semibold text-foreground">Powers Of The Institute</h3>
              <ol className="mt-5 space-y-4">
                {powers.map((item, index) => (
                  <li key={item} className="flex gap-4">
                    <span className="font-heading text-xl text-primary">{index < 8 ? String.fromCharCode(65 + index) : ""}</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Section>

        <section id="flag" className="scroll-mt-24 grid gap-8 border-t border-border pt-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">The Flag</p>
            <h2 className="mt-3 font-heading text-3xl font-semibold text-foreground">The Flag Of The Sri Lanka Institute Of Architects</h2>
            <p className="mt-5 text-sm leading-7 text-foreground/70">
              The official flag is preserved here as part of the Institute identity and institutional record.
            </p>
          </div>
          <div className="border border-border bg-card p-8 shadow-sm">
            <img src="/images/sliaflag.png" alt="The flag of the Sri Lanka Institute of Architects" className="mx-auto max-h-[320px] w-full object-contain" />
          </div>
        </section>

        <Section eyebrow="History" title="Early Years">
          {earlyYearsParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Section>

        <Section eyebrow="History" title="Incorporation And New Responsibilities">
          {incorporationParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Section>

        <section className="border border-border bg-card p-6 text-center shadow-sm md:p-8">
          <Landmark className="mx-auto h-8 w-8 text-primary" />
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-foreground/75">
            The Ceylon Institute of Architects was incorporated as the Sri Lanka Institute of Architects (SLIA) by an Act of Parliament, called the Sri Lanka Institute of Architects Law No. 1 of 1976
          </p>
        </section>

        <section id="boards" className="scroll-mt-24 border-t border-border pt-12">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">Governance</p>
              <h2 className="mt-3 font-heading text-3xl font-semibold text-foreground">Explore Boards</h2>
            </div>
            <Library className="hidden h-10 w-10 text-primary md:block" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {boards.map((board) => (
              <a key={board.href} href={board.href} className="group border border-border bg-card p-6 shadow-sm transition hover:border-primary/50 hover:shadow-md">
                <Building2 className="h-6 w-6 text-primary" />
                <h3 className="mt-5 font-heading text-xl font-semibold text-foreground transition group-hover:text-primary">{board.name}</h3>
                <p className="mt-2 text-sm text-foreground/60">View details</p>
              </a>
            ))}
            <a href="/boards" className="group border border-border bg-card p-6 shadow-sm transition hover:border-primary/50 hover:shadow-md">
              <Building2 className="h-6 w-6 text-primary" />
              <h3 className="mt-5 font-heading text-xl font-semibold text-foreground transition group-hover:text-primary">All boards</h3>
              <p className="mt-2 text-sm text-foreground/60">Browse the boards overview</p>
            </a>
          </div>
        </section>
      </div>
    </section>
  </PageLayout>
);

export default About;
