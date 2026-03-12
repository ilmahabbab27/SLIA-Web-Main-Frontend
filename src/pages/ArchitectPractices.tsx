import PageLayout from "@/components/PageLayout";
import ScrollReveal from "@/components/ScrollReveal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMemo, useState } from "react";

type PracticeRow = {
  name: string;
  location: string;
  services: string;
  contact: string;
};

const practices: PracticeRow[] = [
  {
    name: "Sample Practice",
    location: "Colombo",
    services: "Architecture, Interior Design",
    contact: "practice@example.com",
  },
];

const ArchitectPractices = () => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return practices;
    return practices.filter((p) => `${p.name} ${p.location} ${p.services} ${p.contact}`.toLowerCase().includes(q));
  }, [query]);

  return (
    <PageLayout
      title="Architect Practices"
      subtitle="Browse architectural practices and their services."
      breadcrumb="Home / Architect / Architect Practices"
    >
      <section className="py-12">
        <div className="container space-y-8">
          <ScrollReveal variant="fadeUp">
            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
              <p className="text-foreground/70 leading-relaxed">
                Search practices by name, location, services, or contact. Replace the sample row with your real data.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="fadeUp" delay={0.05}>
            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="w-full md:w-[380px]">
                  <Label htmlFor="practice-search" className="text-sm text-foreground/70">
                    Search
                  </Label>
                  <Input
                    id="practice-search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name, location, services..."
                    className="mt-2"
                  />
                </div>
                <p className="text-sm text-foreground/60">{filtered.length} result(s)</p>
              </div>

              <div className="mt-6 rounded-2xl border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Practice</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Services</TableHead>
                      <TableHead>Contact</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((p) => (
                      <TableRow key={`${p.name}-${p.contact}`}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell>{p.location}</TableCell>
                        <TableCell>{p.services}</TableCell>
                        <TableCell>{p.contact}</TableCell>
                      </TableRow>
                    ))}
                    {filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-foreground/60">
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageLayout>
  );
};

export default ArchitectPractices;
