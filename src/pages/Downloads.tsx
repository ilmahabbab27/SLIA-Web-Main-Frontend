import PageLayout from "@/components/PageLayout";

const downloads = [
  { name: "Membership Application Form", format: "PDF", size: "245 KB" },
  { name: "Trainer Practice Registration Form", format: "PDF", size: "180 KB" },
  { name: "Part III Examination Logbook Template", format: "DOCX", size: "320 KB" },
  { name: "Annual Awards Entry Form", format: "PDF", size: "150 KB" },
  { name: "Trade Stall Booking Form", format: "PDF", size: "200 KB" },
  { name: "CPD Points Record Sheet", format: "XLSX", size: "95 KB" },
];

const Downloads = () => (
  <PageLayout title="Downloads" subtitle="Forms, templates, and resources" breadcrumb="Resources / Downloads">
    <section className="py-16">
      <div className="container max-w-4xl">
        <div className="space-y-3">
          {downloads.map((d, i) => (
            <div key={i} className="flex items-center justify-between border border-border p-4 rounded-sm hover:bg-muted transition-colors">
              <div>
                <span className="text-foreground font-medium text-sm">{d.name}</span>
                <span className="text-muted-foreground text-xs ml-2">({d.format} • {d.size})</span>
              </div>
              <a href="#" className="bg-primary text-primary-foreground px-4 py-1.5 text-xs font-semibold hover:bg-primary/90 transition-colors rounded-sm">
                Download
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  </PageLayout>
);

export default Downloads;
