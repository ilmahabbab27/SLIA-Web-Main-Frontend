import PageLayout from "@/components/PageLayout";

const notices = [
  { title: "Periodical Assessment — March 2025", desc: "Applications for exemption from Parts I & II Examinations. Deadline: 15th February 2025." },
  { title: "Trainer Practice Registration", desc: "All members interested in registering their practices as a Trainer Practice must submit applications before the deadline." },
  { title: "Part III Examination Logbook Submission", desc: "Candidates appearing for the Part III Examination must submit their logbooks at least 3 months prior." },
  { title: "Recognition of Foreign Qualifications", desc: "Architects with foreign qualifications seeking registration in Sri Lanka should apply through the BAE." },
];

const BAENotices = () => (
  <PageLayout title="BAE Notices" subtitle="Board of Architectural Education announcements" breadcrumb="Education / BAE Notices">
    <section className="py-16">
      <div className="container max-w-4xl">
        <div className="space-y-4">
          {notices.map((n, i) => (
            <div key={i} className="border-l-4 border-primary bg-muted p-6 rounded-r-sm">
              <h3 className="font-heading text-lg font-bold text-foreground mb-1">{n.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{n.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </PageLayout>
);

export default BAENotices;
