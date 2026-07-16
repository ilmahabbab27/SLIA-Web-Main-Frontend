import { useEffect, useMemo, useState } from "react";
import { GraduationCap, Loader2, Search } from "lucide-react";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Input } from "@/components/ui/input";
import { baeMemberApi, type BaeMemberItem } from "@/lib/api";

const BaeGraduateMembers = () => {
  const [members, setMembers] = useState<BaeMemberItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    baeMemberApi
      .list("graduate")
      .then(setMembers)
      .finally(() => setLoading(false));
  }, []);

  const filteredMembers = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return members.filter((member) =>
      !needle ||
      [member.name, member.membership_number, member.academic_qualifications, member.email]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(needle))
    );
  }, [members, search]);

  return (
    <PageLayout title="Graduate Members" subtitle="Board of Architectural Education" breadcrumb="Boards / BAE / Graduate Members">
      <section className="py-16">
        <div className="mx-auto w-full max-w-7xl space-y-8 px-3 sm:px-4 lg:px-6">
          <div className="border border-border bg-card p-6 shadow-sm sm:p-8 md:p-10">
            <div className="mb-6 flex h-16 w-16 items-center justify-center bg-primary/10 text-primary">
              <GraduationCap className="h-8 w-8" />
            </div>
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Members</p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-foreground md:text-4xl">Graduate Members</h2>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-foreground/75">
              Browse graduate members of the Board of Architectural Education.
            </p>
            <div className="mt-8">
              <Link to="/bae" className="text-sm font-semibold text-primary hover:underline">
                Back to Board of Architectural Education
              </Link>
            </div>
          </div>

          <div className="border border-border bg-card p-4 shadow-sm sm:p-5">
            <div className="max-w-md">
              <label htmlFor="graduate-member-search" className="text-sm text-foreground/70">
                Search
              </label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
                <Input id="graduate-member-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search graduate members" className="pl-9" />
              </div>
            </div>
          </div>

          {loading && (
            <div className="border border-border bg-card/70 p-12 text-center">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />
            </div>
          )}

          {!loading && filteredMembers.length === 0 && (
            <div className="border border-dashed border-border bg-card/70 p-12 text-center">
              <p className="font-medium text-foreground/70">No graduate members currently listed.</p>
            </div>
          )}

          {!loading && filteredMembers.length > 0 && (
            <div className="overflow-x-auto border border-border bg-card">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-muted text-xs uppercase tracking-widest text-foreground/60">
                  <tr>
                    <th className="px-4 py-3">No</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Qualifications</th>
                    <th className="px-4 py-3">Year</th>
                    <th className="px-4 py-3">Membership No</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="border-t border-border">
                      <td className="px-4 py-3">{member.serial_no}</td>
                      <td className="px-4 py-3 font-semibold text-foreground">{member.name}</td>
                      <td className="px-4 py-3 text-foreground/70">{member.academic_qualifications}</td>
                      <td className="px-4 py-3">{member.membership_year}</td>
                      <td className="px-4 py-3">{member.membership_number}</td>
                      <td className="px-4 py-3">{member.contact_no}</td>
                      <td className="px-4 py-3">{member.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default BaeGraduateMembers;
