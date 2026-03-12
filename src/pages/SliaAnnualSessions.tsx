import PageLayout from "@/components/PageLayout";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import { CalendarDays, ExternalLink, Megaphone, Users, Presentation, GalleryHorizontalEnd, MoonStar } from "lucide-react";

const annualSessionEvents = [
  { id: "agm", title: "AGM", subtitle: "Annual General Meeting", Icon: Users },
  { id: "inauguration", title: "Inauguration", subtitle: "SLIA Annual Session Opening", Icon: Megaphone },
  { id: "conference", title: "Conference", subtitle: "Architecture & Built Environment", Icon: Presentation },
  { id: "exhibition", title: "Exhibition", subtitle: "Architects' Work & Trade Exhibition", Icon: GalleryHorizontalEnd },
  { id: "members-night", title: "Members Night", subtitle: "Members Night", Icon: MoonStar },
];

const SliaAnnualSessions = () => (
  <PageLayout
    title="SLIA Annual Sessions"
    subtitle="A key annual SLIA program bringing together sessions, talks, exhibitions, and community events."
    breadcrumb="Home / Events / SLIA Annual Sessions"
  >
    <section className="py-12">
      <div className="container space-y-10">
        <ScrollReveal variant="fadeUp">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm overflow-hidden relative">
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-foreground/70">
                <CalendarDays className="h-4 w-4 text-primary" />
                Official event hub
              </div>

              <h2 className="mt-4 font-heading text-3xl md:text-4xl font-semibold text-foreground">
                SLIA Annual Sessions
              </h2>
              <p className="mt-3 text-foreground/70 leading-relaxed max-w-3xl">
                SLIA Annual Sessions is a major yearly program of the Sri Lanka Institute of Architects, featuring
                formal sessions, talks, exhibitions, and member-focused events.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button asChild>
                  <a href="https://sliaannualsessions.lk" target="_blank" rel="noreferrer">
                    Visit official website <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="#events">Explore events</a>
                </Button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="fadeUp" delay={0.05}>
          <div id="events" className="scroll-mt-24 rounded-3xl border border-border bg-card p-8 shadow-sm">
            <h3 className="font-heading text-xl font-semibold text-foreground">Events under Annual Sessions</h3>
            <p className="mt-2 text-sm text-foreground/70">
              Quick links to each event category included as part of the Annual Sessions.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {annualSessionEvents.map((e) => (
                <a
                  key={e.id}
                  href={`#${e.id}`}
                  className="group rounded-2xl border border-border/70 bg-background/60 p-5 hover:bg-background/80 hover:shadow-sm transition"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 grid h-10 w-10 place-items-center rounded-xl border border-border bg-muted/40 text-primary">
                      <e.Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors">
                        {e.title}
                      </p>
                      <p className="mt-1 text-sm text-foreground/70">{e.subtitle}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <div className="space-y-4">
          {annualSessionEvents.map((e, idx) => (
            <ScrollReveal key={e.id} variant="fadeUp" delay={0.1 + idx * 0.03}>
              <div id={e.id} className="scroll-mt-24 rounded-3xl border border-border bg-card p-8 shadow-sm">
                <h3 className="font-heading text-xl font-semibold text-foreground">{e.title}</h3>
                <p className="mt-2 text-foreground/70">{e.subtitle}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  </PageLayout>
);

export default SliaAnnualSessions;
