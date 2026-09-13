import PageLayout from "@/components/PageLayout";
import ScrollReveal from "@/components/ScrollReveal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useMemo, useState } from "react";
import { Loader2, Mail, Phone, Search, UserRound } from "lucide-react";
import { API_BASE } from "@/lib/api";

type Architect = {
  id: number;
  full_name: string;
  photo?: string;
  arb_number?: string;
  location_district?: string;
  location_province?: string;
  practice_type?: string;
  office_email?: string;
  office_phone?: string;
  practice_name?: string;
  practice_description?: string;
  personal_website?: string;
  membership_type?: string;
  membership_number?: string;
  membership_year?: string;
  username?: string;
  home_email?: string;
  home_phone?: string;
  home_address?: string;
  office_address?: string;
  academic_qualifications?: string;
  professional_qualifications?: string;
  yearbook_name?: string;
  nic_number?: string;
  gender?: string;
  date_of_birth?: string;
  contact_info_1_address?: string;
  contact_info_1_phone?: string;
  contact_info_1_email?: string;
  contact_info_2_address?: string;
  contact_info_2_phone?: string;
  contact_info_2_email?: string;
  positions_held?: string;
  slia_awards?: string;
  other_awards?: string;
};

const initialsFor = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const removeEmptyText = <T extends Record<string, unknown>>(item: T): T =>
  Object.fromEntries(
    Object.entries(item).map(([key, value]) => [
      key,
      typeof value === "string" && ["null", "undefined", "n/a", "na"].includes(value.trim().toLowerCase()) ? "" : value,
    ])
  ) as T;

const formatDisplayDate = (value?: string | null) => {
  if (!value || !value.trim()) {
    return "";
  }

  const normalized = value.includes("T") ? value.split("T")[0] : value;
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) {
    return normalized;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed);
};

const FindAnArchitect = () => {
  const allowedMembershipTypes = ["Associate", "Fellow", "Honorary Fellow"];
  const [architects, setArchitects] = useState<Architect[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [districts, setDistricts] = useState<string[]>([]);
  const [membershipFilter, setMembershipFilter] = useState("all");
  const [membershipTypes, setMembershipTypes] = useState<string[]>([]);
  const [selectedArchitect, setSelectedArchitect] = useState<Architect | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  useEffect(() => {
    fetchArchitects();
  }, []);

  const fetchArchitects = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/slia-members?per_page=1000`, {
        headers: { Accept: "application/json" },
      });
      const data = await response.json();
      const visibleArchitects = (data.data || [])
        .map((a: Architect) => removeEmptyText(a))
        .filter((a: Architect) => allowedMembershipTypes.includes(a.membership_type || ""));
      setArchitects(visibleArchitects);
      setDistricts([...new Set(visibleArchitects.map((a: Architect) => a.location_district).filter(Boolean))].sort());
      setMembershipTypes([...new Set(visibleArchitects.map((a: Architect) => a.membership_type).filter(Boolean))].sort());
    } catch (error) {
      console.error("Error fetching architects:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let results = architects.filter((architect) => allowedMembershipTypes.includes(architect.membership_type || ""));

    if (districtFilter !== "all") {
      results = results.filter((a) => a.location_district === districtFilter);
    }

    if (membershipFilter !== "all") {
      results = results.filter((a) => a.membership_type === membershipFilter);
    }

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      results = results.filter((a) =>
        [
          a.full_name,
          a.arb_number,
          a.location_district,
          a.practice_type,
          a.office_email,
          a.office_phone,
          a.practice_name,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(q),
      );
    }

    return results;
  }, [architects, query, districtFilter, membershipFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, districtFilter, membershipFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginatedArchitects = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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

                <div>
                  <Label className="text-sm text-foreground/70">Membership Type</Label>
                  <Select value={membershipFilter} onValueChange={setMembershipFilter}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="All Membership Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Membership Types</SelectItem>
                      {membershipTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <p className="text-sm text-foreground/60">
                    {filtered.length} result(s) · Page {currentPage} of {totalPages}
                  </p>
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
                        <TableHead>Photo</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Membership No</TableHead>
                        <TableHead>ARB No</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Practice</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedArchitects.length > 0 ? (
                        paginatedArchitects.map((a) => (
                          <TableRow key={a.id} className="hover:bg-muted/50">
                            <TableCell>
                              <Avatar className="h-12 w-12 rounded-xl border border-border bg-muted">
                                <AvatarImage src={a.photo || ""} alt={a.full_name} />
                                <AvatarFallback className="rounded-xl bg-primary/10 text-primary">
                                  {initialsFor(a.full_name) || <UserRound className="h-4 w-4" />}
                                </AvatarFallback>
                              </Avatar>
                            </TableCell>
                            <TableCell className="font-medium">
                              <div className="flex flex-col">
                                <span>{a.full_name}</span>
                                {a.membership_type && <span className="text-xs text-foreground/60">{a.membership_type}</span>}
                              </div>
                            </TableCell>
                            <TableCell className="text-sm text-foreground/70">{a.membership_number || ""}</TableCell>
                            <TableCell className="text-sm text-foreground/70">{a.arb_number || ""}</TableCell>
                            <TableCell className="text-sm">{[a.location_district, a.location_province].filter(Boolean).join(", ") || ""}</TableCell>
                            <TableCell className="text-sm">{a.practice_name || ""}</TableCell>
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
                            <TableCell>
                              <Button type="button" variant="outline" size="sm" onClick={() => setSelectedArchitect(a)} className="border-border bg-background">
                                View More
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="py-8 text-center text-foreground/60">
                            No architects found.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}

              {!loading && filtered.length > 0 && (
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm text-foreground/60">
                    Showing {Math.min((currentPage - 1) * pageSize + 1, filtered.length)} to{" "}
                    {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-border bg-background"
                      onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-border bg-background"
                      onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Dialog open={!!selectedArchitect} onOpenChange={(open) => !open && setSelectedArchitect(null)}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto border-border bg-background p-0">
          {selectedArchitect && (
            <div>
              <div className="border-b border-border bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
                  <Avatar className="h-56 w-56 rounded-3xl border-4 border-background bg-muted shadow-lg">
                    <AvatarImage src={selectedArchitect.photo || ""} alt={selectedArchitect.full_name} />
                    <AvatarFallback className="rounded-3xl bg-primary/10 text-4xl text-primary">
                      {initialsFor(selectedArchitect.full_name) || <UserRound className="h-20 w-20" />}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <DialogHeader className="text-left">
                      <DialogTitle className="text-2xl">{selectedArchitect.full_name}</DialogTitle>
                      <DialogDescription className="text-sm text-foreground/70">
                        {selectedArchitect.practice_name || "Practice not set"}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedArchitect.membership_type && <Badge variant="secondary">{selectedArchitect.membership_type}</Badge>}
                      {selectedArchitect.arb_number && <Badge variant="outline">ARB {selectedArchitect.arb_number}</Badge>}
                      {selectedArchitect.membership_number && <Badge variant="outline">Member {selectedArchitect.membership_number}</Badge>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-2">
                <div className="space-y-5">
                  <section className="space-y-3">
                    <h4 className="text-sm font-semibold uppercase tracking-widest text-foreground/50">Core Details</h4>
                    <div className="grid gap-3 rounded-2xl border border-border bg-muted/20 p-4 text-sm">
                      <p><span className="font-medium text-foreground">Yearbook:</span> {selectedArchitect.yearbook_name || "-"}</p>
                      <p><span className="font-medium text-foreground">NIC:</span> {selectedArchitect.nic_number || "-"}</p>
                      <p><span className="font-medium text-foreground">Gender:</span> {selectedArchitect.gender || "-"}</p>
                      <p><span className="font-medium text-foreground">Date of Birth:</span> {formatDisplayDate(selectedArchitect.date_of_birth)}</p>
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h4 className="text-sm font-semibold uppercase tracking-widest text-foreground/50">Qualifications</h4>
                    <div className="grid gap-3 rounded-2xl border border-border bg-muted/20 p-4 text-sm">
                      <p><span className="font-medium text-foreground">Academic:</span> {selectedArchitect.academic_qualifications || "-"}</p>
                      <p><span className="font-medium text-foreground">Professional:</span> {selectedArchitect.professional_qualifications || "-"}</p>
                      <p><span className="font-medium text-foreground">Practice Type:</span> {selectedArchitect.practice_type || "-"}</p>
                      <p><span className="font-medium text-foreground">Positions Held:</span> {selectedArchitect.positions_held || "-"}</p>
                      <p><span className="font-medium text-foreground">Awards:</span> {[selectedArchitect.slia_awards, selectedArchitect.other_awards].filter(Boolean).join(" | ") || "-"}</p>
                    </div>
                  </section>
                </div>

                <div className="space-y-5">
                  <section className="space-y-3">
                    <h4 className="text-sm font-semibold uppercase tracking-widest text-foreground/50">Practice & Location</h4>
                    <div className="grid gap-3 rounded-2xl border border-border bg-muted/20 p-4 text-sm">
                      <p><span className="font-medium text-foreground">Practice:</span> {selectedArchitect.practice_name || "-"}</p>
                      <p><span className="font-medium text-foreground">Description:</span> {selectedArchitect.practice_description || "-"}</p>
                      <p><span className="font-medium text-foreground">District:</span> {selectedArchitect.location_district || "-"}</p>
                      <p><span className="font-medium text-foreground">Province:</span> {selectedArchitect.location_province || "-"}</p>
                      <p><span className="font-medium text-foreground">Website:</span> {selectedArchitect.personal_website || "-"}</p>
                    </div>
                  </section>

                  <section className="space-y-3">
                    <h4 className="text-sm font-semibold uppercase tracking-widest text-foreground/50">Contacts</h4>
                    <div className="grid gap-3 rounded-2xl border border-border bg-muted/20 p-4 text-sm">
                      <p><span className="font-medium text-foreground">Office Address:</span> {selectedArchitect.office_address || "-"}</p>
                      <p><span className="font-medium text-foreground">Office Email:</span> {selectedArchitect.office_email || "-"}</p>
                      <p><span className="font-medium text-foreground">Office Phone:</span> {selectedArchitect.office_phone || "-"}</p>
                      <p><span className="font-medium text-foreground">Home Address:</span> {selectedArchitect.home_address || "-"}</p>
                      <p><span className="font-medium text-foreground">Home Email:</span> {selectedArchitect.home_email || "-"}</p>
                      <p><span className="font-medium text-foreground">Home Phone:</span> {selectedArchitect.home_phone || "-"}</p>
                      <p><span className="font-medium text-foreground">Contact 1:</span> {selectedArchitect.contact_info_1_phone || selectedArchitect.contact_info_1_email || "-"}</p>
                      <p><span className="font-medium text-foreground">Contact 2:</span> {selectedArchitect.contact_info_2_phone || selectedArchitect.contact_info_2_email || "-"}</p>
                    </div>
                  </section>

                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default FindAnArchitect;
