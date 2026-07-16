import PageLayout from "@/components/PageLayout";
import ScrollReveal from "@/components/ScrollReveal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useMemo, useState } from "react";
import { Search, Loader2, Mail, Phone } from "lucide-react";
import { API_BASE } from "@/lib/api";

type Architect = {
  id: number;
  full_name: string;
  arb_number: string;
  location_district: string;
  location_province: string;
  practice_type: string;
  office_email: string;
  office_phone: string;
  practice_name: string;
};

const FindAnArchitect = () => {
  const [architects, setArchitects] = useState<Architect[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [districts, setDistricts] = useState<string[]>([]);

  useEffect(() => {
    fetchArchitects();
  }, []);

  const fetchArchitects = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/architects?per_page=1000`);
      const data = await response.json();
      setArchitects(data.data || []);

      const uniqueDistricts = [...new Set(data.data?.map((a: Architect) => a.location_district).filter(Boolean))].sort() as string[];
      setDistricts(uniqueDistricts);
    } catch (error) {
      console.error("Error fetching architects:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let results = architects;

    if (districtFilter && districtFilter !== "all") {
      results = results.filter((a) => a.location_district === districtFilter);
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      results = results.filter((a) =>
        `${a.full_name} ${a.arb_number} ${a.location_district} ${a.practice_type} ${a.office_email} ${a.office_phone}`.toLowerCase().includes(q),
      );
    }

    return results;
  }, [architects, query, districtFilter]);

  return (
    <PageLayout
      title="Find an Architect"
      subtitle="Search and connect with registered architects across Sri Lanka."
      breadcrumb="Home / Architect / Find an Architect"
    >
      <section className="py-12">
        <div className="container space-y-8">
          <ScrollReveal variant="fadeUp">
            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div>
                  <Label className="text-sm text-foreground/70">Search</Label>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Name, registration, location..."
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-foreground/70">District</Label>
                  <Select value={districtFilter} onValueChange={setDistrictFilter}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="All Districts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Districts</SelectItem>
                      {districts.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <p className="text-sm text-foreground/60">{filtered.length} result(s)</p>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="rounded-2xl border border-border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>ARB No</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Practice Type</TableHead>
                        <TableHead>Practice Name</TableHead>
                        <TableHead>Contact</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.length > 0 ? (
                        filtered.map((a) => (
                          <TableRow key={a.id} className="hover:bg-muted/50">
                            <TableCell className="font-medium">{a.full_name}</TableCell>
                            <TableCell className="text-sm text-foreground/70">{a.arb_number || "-"}</TableCell>
                            <TableCell className="text-sm">{a.location_district || "-"}</TableCell>
                            <TableCell className="text-sm">{a.practice_type || "-"}</TableCell>
                            <TableCell className="text-sm">{a.practice_name || "-"}</TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                {a.office_email && (
                                  <a href={`mailto:${a.office_email}`} className="flex items-center gap-1 text-xs text-primary hover:underline">
                                    <Mail className="h-3 w-3" />
                                    {a.office_email}
                                  </a>
                                )}
                                {a.office_phone && (
                                  <a href={`tel:${a.office_phone}`} className="flex items-center gap-1 text-xs text-primary hover:underline">
                                    <Phone className="h-3 w-3" />
                                    {a.office_phone}
                                  </a>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-foreground/60">
                            No architects found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </PageLayout>
  );
};

export default FindAnArchitect;
