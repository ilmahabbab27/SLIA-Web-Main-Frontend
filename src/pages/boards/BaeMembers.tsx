import { useEffect, useMemo, useState } from "react";
import { GraduationCap, Loader2, Search } from "lucide-react";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { baeMemberApi, type BaeMemberItem, type BaeMemberType } from "@/lib/api";

const BaeMembers = () => {
  const [members, setMembers] = useState<BaeMemberItem[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | BaeMemberType>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    baeMemberApi
      .list()
      .then(setMembers)
      .finally(() => setLoading(false));
  }, []);

  const filteredMembers = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return members
      .filter((member) => typeFilter === "all" || member.current_membership_type === typeFilter)
      .filter((member) =>
        !needle ||
        [member.name, member.membership_number, member.academic_qualifications, member.email]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(needle))
      )
      .sort((a, b) => (a.serial_no || 0) - (b.serial_no || 0));
  }, [members, search, typeFilter]);

  return (
    <PageLayout
      title="Member Management"
      subtitle="Board of Architectural Education"
      breadcrumb="Boards / BAE / Members"
    >
      <section className="py-16">
        <div className="mx-auto w-full max-w-7xl space-y-8 px-3 sm:px-4 lg:px-6">
          <div className="border border-border bg-card p-6 shadow-sm sm:p-8 md:p-10">
            <div className="mb-6 flex h-16 w-16 items-center justify-center bg-primary/10 text-primary">
              <GraduationCap className="h-8 w-8" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Members</p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-foreground md:text-4xl">Member Management</h2>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-foreground/75">
              Browse all members of the Board of Architectural Education including Student, Graduate, and Associate members.
            </p>
            <div className="mt-8">
              <Link to="/bae" className="text-sm font-semibold text-primary hover:underline">
                Back to Board of Architectural Education
              </Link>
            </div>
          </div>

          <div className="grid gap-4 border border-border bg-card p-4 shadow-sm sm:grid-cols-3 sm:p-5">
            <div className="sm:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                <Input
                  placeholder="Search by name, membership number, qualifications, or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as "all" | BaeMemberType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="student">Student Members</SelectItem>
                  <SelectItem value="graduate">Graduate Members</SelectItem>
                  <SelectItem value="associate">Associate Members</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {loading && (
            <div className="flex items-center justify-center rounded-2xl border border-border bg-card py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {!loading && filteredMembers.length === 0 && (
            <div className="rounded-2xl border-2 border-dashed border-border bg-card/60 py-20 text-center">
              <p className="text-foreground/70">No members found.</p>
            </div>
          )}

          {!loading && filteredMembers.length > 0 && (
            <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="border-b border-border bg-muted">
                  <tr>
                    <th className="px-6 py-4 font-bold text-foreground">No</th>
                    <th className="px-6 py-4 font-bold text-foreground">Name</th>
                    <th className="px-6 py-4 font-bold text-foreground">Type</th>
                    <th className="px-6 py-4 font-bold text-foreground">Membership No</th>
                    <th className="px-6 py-4 font-bold text-foreground">Year</th>
                    <th className="px-6 py-4 font-bold text-foreground">Qualifications</th>
                    <th className="px-6 py-4 font-bold text-foreground">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="border-b border-border last:border-b-0 hover:bg-muted/50">
                      <td className="px-6 py-4 font-bold text-primary">{member.serial_no || "-"}</td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-foreground">{member.name}</p>
                        {member.name_with_initials && (
                          <p className="text-xs text-foreground/60">{member.name_with_initials}</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                          {member.current_membership_type || member.member_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground/80">{member.membership_number || "-"}</td>
                      <td className="px-6 py-4 text-sm text-foreground/80">{member.membership_year || "-"}</td>
                      <td className="px-6 py-4 max-w-xs truncate text-sm text-foreground/80">
                        {member.academic_qualifications || "-"}
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate text-sm text-foreground/80">{member.email || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="text-center text-sm text-foreground/60">
            Showing {filteredMembers.length} of {members.length} members
          </p>
        </div>
      </section>
    </PageLayout>
  );
};

export default BaeMembers;
