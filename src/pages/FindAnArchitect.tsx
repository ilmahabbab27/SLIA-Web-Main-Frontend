import PageLayout from "@/components/PageLayout";
import ScrollReveal from "@/components/ScrollReveal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMemo, useState } from "react";

type ArchitectRow = {
  name: string;
  registrationNo: string;
  location: string;
  specialization: string;
  contact: string;
};

const architects: ArchitectRow[] = [
  {
    name: "Sample Architect",
    registrationNo: "SLIA-0000",
    location: "Colombo",
    specialization: "Residential",
    contact: "contact@example.com",
  },
];

const FindAnArchitect = () => {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return architects;
    return architects.filter((a) =>
      `${a.name} ${a.registrationNo} ${a.location} ${a.specialization} ${a.contact}`.toLowerCase().includes(q),
    );
  }, [query]);

  return (
  <PageLayout
    title="Find an Architect"
    subtitle="Guidance for finding a suitable architect for your project."
    breadcrumb="Home / Architect / Find an Architect"
  >
    <section className="py-12">
      <div className="container space-y-8">
        <ScrollReveal variant="fadeUp">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            <p className="text-foreground/70 leading-relaxed">
              Search and browse registered architects. Replace the sample row with your real directory data (name,
              registration number, location, specialization, and contact).
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="fadeUp" delay={0.05}>
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="w-full md:w-[380px]">
                <Label htmlFor="architect-search" className="text-sm text-foreground/70">
                  Search
                </Label>
                <Input
                  id="architect-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, registration no, location..."
                  className="mt-2"
                />
              </div>
              <p className="text-sm text-foreground/60">{filtered.length} result(s)</p>
            </div>

            <div className="mt-6 rounded-2xl border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Registration No</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Contact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((a) => (
                    <TableRow key={`${a.registrationNo}-${a.name}`}>
                      <TableCell className="font-medium">{a.name}</TableCell>
                      <TableCell>{a.registrationNo}</TableCell>
                      <TableCell>{a.location}</TableCell>
                      <TableCell>{a.specialization}</TableCell>
                      <TableCell>{a.contact}</TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-foreground/60">
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

export default FindAnArchitect;
