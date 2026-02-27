import PageLayout from "@/components/PageLayout";

const pastEvents = [
  { title: "Architect 2023", date: "February 2023", img: "/images/event-1.jpg" },
  { title: "Launching of Regional Exhibition, Kandy", date: "March 2023", img: "/images/event-2.jpg" },
  { title: "Launching of Specification Writing", date: "May 2023", img: "/images/event-3.jpg" },
  { title: "Inauguration Session 2023/24", date: "June 2023", img: "/images/event-4.jpg" },
  { title: "National Conference 2022", date: "November 2022", img: "/images/event-1.jpg" },
  { title: "World Habitat Day 2022", date: "October 2022", img: "/images/event-3.jpg" },
];

const PastEvents = () => (
  <PageLayout title="Past Events" subtitle="A look back at our recent events and activities" breadcrumb="News & Events / Past Events">
    <section className="py-16">
      <div className="container">
        <div className="grid md:grid-cols-3 gap-6">
          {pastEvents.map((e, i) => (
            <div key={i} className="group cursor-pointer">
              <div className="overflow-hidden rounded-sm">
                <img src={e.img} alt={e.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <span className="text-muted-foreground text-xs mt-2 block">{e.date}</span>
              <h3 className="font-heading text-base font-semibold text-foreground mt-1 group-hover:text-primary transition-colors">{e.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  </PageLayout>
);

export default PastEvents;
