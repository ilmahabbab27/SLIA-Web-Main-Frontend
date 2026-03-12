import PageLayout from "@/components/PageLayout";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";

const Events = () => (
  <PageLayout
    title="Events"
    subtitle="Updates and information about SLIA events and key annual programs."
    breadcrumb="Home / Events"
  >
    <section className="py-12">
      <div className="container space-y-10">
        <ScrollReveal variant="fadeUp">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            <h2 className="font-heading text-2xl font-semibold text-foreground">About SLIA events</h2>
            <p className="mt-3 text-foreground/70 leading-relaxed">
              SLIA hosts a range of events throughout the year including lectures, exhibitions, award programs, and
              formal sessions. Use the Events menu to view upcoming and past events.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="fadeUp" delay={0.1}>
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            <h3 className="font-heading text-xl font-semibold text-foreground">SLIA Annual Sessions</h3>
            <p className="mt-3 text-foreground/70 leading-relaxed">
              For SLIA Annual Sessions details and registrations, visit the official website.
            </p>
            <div className="mt-6">
              <Button asChild>
                <a href="/slia-annual-sessions">View SLIA Annual Sessions</a>
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  </PageLayout>
);

export default Events;
