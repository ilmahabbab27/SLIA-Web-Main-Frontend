import { useEffect, useMemo, useState } from "react";
import { Loader2, Search, UserRound } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { baeMemberApi, type BaeMemberItem } from "@/lib/api";

const BaeStudentMembers = () => {
  const [members, setMembers] = useState<BaeMemberItem[]>([]);
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<BaeMemberItem | null>(null);

  useEffect(() => {
    baeMemberApi.list("student").then(setMembers).finally(() => setLoading(false));
  }, []);

  const years = useMemo(
    () => Array.from(new Set(members.map((member) => member.membership_year).filter(Boolean))).sort((a, b) => String(b).localeCompare(String(a))),
    [members],
  );

  const filteredMembers = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return members.filter((member) => {
      const matchesYear = year === "all" || member.membership_year === year;
      const matchesSearch =
        !needle ||
        [member.name, member.membership_number, member.academic_qualifications, member.email, member.contact_no]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(needle));

      return matchesYear && matchesSearch;
    });
  }, [members, search, year]);

  return (
    <PageLayout title="Student Members" subtitle="Board of Architectural Education" breadcrumb="Boards / BAE / Student Members">
      <section className="py-16">
        <div className="mx-auto w-full max-w-7xl space-y-8 px-3 sm:px-4 lg:px-6">
          <div className="grid gap-4 border border-border bg-card p-4 shadow-sm sm:p-5 md:grid-cols-[minmax(0,1fr)_220px]">
            <div>
              <label htmlFor="student-member-search" className="text-sm text-foreground/70">
                Search
              </label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                <Input
                  id="student-member-search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search student members"
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-foreground/70">Year</label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {years.map((item) => (
                    <SelectItem key={item} value={String(item)}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading && (
            <div className="border border-border bg-card/70 p-12 text-center">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {!loading && filteredMembers.length === 0 && (
            <div className="border border-dashed border-border bg-card/70 p-12 text-center">
              <p className="font-medium text-foreground/70">No student members currently listed.</p>
            </div>
          )}

          {!loading && filteredMembers.length > 0 && (
            <div className="overflow-x-auto border border-border bg-card">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="bg-muted text-xs uppercase tracking-widest text-foreground/60">
                  <tr>
                    <th className="px-4 py-3">Member</th>
                    <th className="px-4 py-3">Membership No</th>
                    <th className="px-4 py-3">Qualifications</th>
                    <th className="px-4 py-3">Year</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="border-t border-border">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-muted">
                            {member.photo ? <img src={member.photo} alt={member.name} className="h-full w-full object-cover" /> : <UserRound className="h-5 w-5 text-foreground/40" />}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{member.name}</p>
                            <p className="text-xs text-foreground/60">{member.name_with_initials || member.yearbook_name || "-"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 font-semibold">{member.membership_number}</td>
                      <td className="px-4 py-4 text-foreground/70">{member.academic_qualifications || "-"}</td>
                      <td className="px-4 py-4">{member.membership_year || "-"}</td>
                      <td className="px-4 py-4">{member.contact_no || "-"}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-between gap-3">
                          <span>{member.email || "-"}</span>
                          <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedMember(member)} className="text-primary hover:bg-primary/10">
                            See More
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <Dialog open={Boolean(selectedMember)} onOpenChange={(open) => !open && setSelectedMember(null)}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto border-border bg-background p-0">
          {selectedMember && (
            <div>
              <div className="border-b border-border bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:p-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
                  <Avatar className="h-40 w-40 rounded-3xl border-4 border-background bg-muted shadow-lg">
                    <AvatarImage src={selectedMember.photo || ""} alt={selectedMember.name} />
                    <AvatarFallback className="rounded-3xl bg-primary/10 text-3xl text-primary">
                      {selectedMember.name?.charAt(0) || <UserRound className="h-12 w-12" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <DialogHeader className="text-left">
                      <DialogTitle className="text-2xl">{selectedMember.name}</DialogTitle>
                      <DialogDescription className="text-sm text-foreground/70">
                        {selectedMember.name_with_initials || selectedMember.yearbook_name || "BAE Member"}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedMember.membership_type && <Badge variant="secondary">{selectedMember.membership_type}</Badge>}
                      {selectedMember.membership_number && <Badge variant="outline">{selectedMember.membership_number}</Badge>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-2">
                <section className="space-y-3">
                  <h4 className="text-sm font-semibold uppercase tracking-widest text-foreground/50">Core Details</h4>
                  <div className="grid gap-3 rounded-2xl border border-border bg-muted/20 p-4 text-sm">
                    <p><span className="font-medium text-foreground">Membership No:</span> {selectedMember.membership_number || "-"}</p>
                    <p><span className="font-medium text-foreground">Year:</span> {selectedMember.membership_year || "-"}</p>
                    <p><span className="font-medium text-foreground">NIC:</span> {selectedMember.nic || "-"}</p>
                    <p><span className="font-medium text-foreground">Gender:</span> {selectedMember.gender || "-"}</p>
                    <p><span className="font-medium text-foreground">Date of Birth:</span> {selectedMember.date_of_birth || "-"}</p>
                    <p><span className="font-medium text-foreground">Qualifications:</span> {selectedMember.academic_qualifications || "-"}</p>
                  </div>
                </section>

                <section className="space-y-3">
                  <h4 className="text-sm font-semibold uppercase tracking-widest text-foreground/50">Contact</h4>
                  <div className="grid gap-3 rounded-2xl border border-border bg-muted/20 p-4 text-sm">
                    <p><span className="font-medium text-foreground">Contact No:</span> {selectedMember.contact_no || "-"}</p>
                    <p><span className="font-medium text-foreground">Email:</span> {selectedMember.email || "-"}</p>
                    <p><span className="font-medium text-foreground">Address:</span> {selectedMember.address || "-"}</p>
                    <p><span className="font-medium text-foreground">Office Address:</span> {selectedMember.office_address || "-"}</p>
                    <p><span className="font-medium text-foreground">Home Address:</span> {selectedMember.residence_address || "-"}</p>
                  </div>
                </section>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default BaeStudentMembers;
