import { useEffect, useMemo, useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Mail, Phone, MapPin, Globe, User, BriefcaseBusiness } from "lucide-react";
import { contactApi, type ContactEntryItem } from "@/lib/api";
import ComplaintForm from "@/components/ComplaintForm";

const iconMap = {
  address: MapPin,
  phone: Phone,
  email: Mail,
  web: Globe,
  person: User,
  role: BriefcaseBusiness,
};

const Contact = () => {
  const [entries, setEntries] = useState<ContactEntryItem[]>([]);

  useEffect(() => {
    contactApi
      .list()
      .then((items) => setEntries(items.filter((item) => item.is_active).sort((a, b) => a.sort_order - b.sort_order)))
      .catch(() => setEntries([]));
  }, []);

  const categories = useMemo(() => {
    const grouped = new Map<string, Map<string, ContactEntryItem[]>>();

    entries.filter((entry) => entry.label !== "Location Map").forEach((entry) => {
      if (!grouped.has(entry.category)) grouped.set(entry.category, new Map());
      const category = grouped.get(entry.category);
      if (!category) return;
      if (!category.has(entry.label)) category.set(entry.label, []);
      category.get(entry.label)?.push(entry);
    });

    return Array.from(grouped.entries()).map(([category, entryGroups]) => ({
      category,
      entries: Array.from(entryGroups.entries()).map(([label, details]) => ({
        label,
        details,
      })),
    }));
  }, [entries]);

  const mapEntry = entries.find((entry) => entry.label === "Location Map");
  const addressEntry = entries.find((entry) => entry.icon === "address" && entry.label === "Secretariat");
  const mapQuery = encodeURIComponent(addressEntry?.text || "Sri Lanka Institute of Architects, 120/7, Vidya Mawatha, Colombo 07");

  return (
    <PageLayout title="Contact Us" subtitle="Contact details for each section and board" breadcrumb="Contact Us">
      <section className="py-16">
        <div className="container max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
            <div className="space-y-12">
              {categories.map((cat) => (
                <div key={cat.category}>
                  <h2 className="mb-1 font-heading text-2xl font-bold text-foreground">{cat.category}</h2>
                  <div className="mb-6 h-px w-12 bg-primary" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    {cat.entries.map((entry) => (
                      <div key={entry.label} className="border border-border bg-background p-6">
                        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">{entry.label}</h3>
                        <ul className="space-y-2.5">
                          {entry.details.map((detail) => {
                            const Icon = iconMap[detail.icon];
                            return (
                              <li key={detail.id} className="flex items-start gap-3">
                                <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                                {detail.href ? (
                                  <a href={detail.href} className="text-sm text-foreground/80 transition-colors hover:text-primary">
                                    {detail.text}
                                  </a>
                                ) : (
                                  <span className="text-sm text-foreground/80">{detail.text}</span>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {categories.length === 0 && (
                <div className="border border-dashed border-border p-10 text-center text-sm text-foreground/60">
                  Contact details will be displayed here once they are added from the admin panel.
                </div>
              )}
            </div>

            <aside className="border border-border bg-background p-4 lg:sticky lg:top-28">
              <div className="aspect-[4/5] overflow-hidden bg-muted">
                <iframe
                  title="Sri Lanka Institute of Architects location"
                  src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="p-3">
                <h2 className="font-heading text-xl font-bold text-foreground">Visit SLIA</h2>
                {addressEntry && <p className="mt-2 text-sm leading-6 text-foreground/70">{addressEntry.text}</p>}
                {mapEntry?.href && (
                  <a
                    href={mapEntry.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex border border-primary bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                  >
                    Open in Google Maps
                  </a>
                )}
              </div>
            </aside>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
            <div>
              <h2 className="mb-1 font-heading text-2xl font-bold text-foreground">Submit a Complaint or Inquiry</h2>
              <div className="mb-3 h-px w-12 bg-primary" />
              <p className="mb-6 max-w-2xl text-sm leading-6 text-foreground/70">
                Use the form below to contact the appropriate SLIA section or board. Include relevant details and supporting documents where available.
              </p>
              <ComplaintForm />
            </div>
            <div className="border border-border bg-muted/30 p-6 text-sm text-muted-foreground">
              <h3 className="mb-4 text-lg font-semibold text-foreground">What to include</h3>
              <ul className="space-y-3">
                <li>- Date and time of the issue.</li>
                <li>- The correct category.</li>
                <li>- Board or member details when relevant.</li>
                <li>- Any documents, screenshots, or references.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Contact;
