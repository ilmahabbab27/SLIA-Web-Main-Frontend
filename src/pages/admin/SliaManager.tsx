import { useEffect, useMemo, useState } from "react";
import { Loader2, Search, Plus, Pencil, Trash2, PanelLeftClose, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { API_BASE } from "@/lib/api";

type SliaMember = {
  id: number;
  full_name: string;
  name_with_initials?: string;
  yearbook_name?: string;
  nic_number?: string;
  gender?: string;
  date_of_birth?: string;
  photo?: string;
  membership_type?: string;
  membership_number?: string;
  membership_year?: string;
  arb_number?: string;
  academic_qualifications?: string;
  professional_qualifications?: string;
  practice_name?: string;
  practice_description?: string;
  practice_type?: string;
  location_district?: string;
  location_province?: string;
  personal_website?: string;
  office_address?: string;
  office_district?: string;
  office_province?: string;
  office_phone?: string;
  office_fax?: string;
  office_email?: string;
  office_website?: string;
  home_address?: string;
  home_district?: string;
  home_province?: string;
  home_phone?: string;
  home_fax?: string;
  home_email?: string;
  contact_info_1_address?: string;
  contact_info_1_phone?: string;
  contact_info_1_email?: string;
  contact_info_2_address?: string;
  contact_info_2_phone?: string;
  contact_info_2_email?: string;
  positions_held?: string;
  slia_awards?: string;
  other_awards?: string;
  created_at?: string;
  updated_at?: string;
};

const emptyForm = (): SliaMember => ({
  id: 0,
  full_name: "",
});

const SliaManager = () => {
  const [members, setMembers] = useState<SliaMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<SliaMember>(emptyForm());
  const [formPanelOpen, setFormPanelOpen] = useState(false);
  const [error, setError] = useState("");

  const API_URL = API_BASE;

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/slia-members?per_page=1000`);
      if (!response.ok) throw new Error("Failed to fetch members");
      const data = await response.json();
      setMembers(data.data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch members";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return members.filter((member) =>
      !needle ||
      [member.full_name, member.arb_number, member.office_email, member.location_district]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(needle))
    );
  }, [members, search]);

  const saveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim()) {
      setError("Name is required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const method = form.id ? "PUT" : "POST";
      const url = form.id ? `${API_URL}/slia-members/${form.id}` : `${API_URL}/slia-members`;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to save member");
      }

      toast.success(form.id ? "Member updated" : "Member created");
      setForm(emptyForm());
      setFormPanelOpen(false);
      await fetchMembers();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save member";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const deleteMember = async (id: number) => {
    if (!confirm("Delete this member?")) return;

    try {
      const response = await fetch(`${API_URL}/slia-members/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete member");
      toast.success("Member deleted");
      await fetchMembers();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete member";
      setError(message);
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">SLIA Members</h1>
        <p className="mt-1 text-slate-400">Manage registered architects and professionals</p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200/30 bg-red-500/10 p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-500">Error</p>
            <p className="text-sm text-red-400/80">{error}</p>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        {formPanelOpen && (
          <Card className="border-white/10 bg-white/[0.03] p-6">
            <form onSubmit={saveMember} className="space-y-4">
              <div className="mb-6 flex items-center justify-between gap-3">
                <h3 className="flex items-center gap-3 text-lg font-bold text-white">
                  {form.id ? <Pencil className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
                  {form.id ? "Edit Member" : "Add Member"}
                </h3>
                <button
                  type="button"
                  onClick={() => setFormPanelOpen(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition"
                  title="Hide form"
                >
                  <PanelLeftClose className="h-5 w-5" />
                </button>
              </div>

              {/* Personal Details Section */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Personal Details</p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Full Name *</Label>
                <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="h-11 border-white/10 bg-white/5 text-white" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Name With Initials</Label>
                  <Input value={form.name_with_initials || ""} onChange={(e) => setForm({ ...form, name_with_initials: e.target.value })} className="h-11 border-white/10 bg-white/5 text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Yearbook Name</Label>
                  <Input value={form.yearbook_name || ""} onChange={(e) => setForm({ ...form, yearbook_name: e.target.value })} className="h-11 border-white/10 bg-white/5 text-white" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">NIC Number</Label>
                  <Input value={form.nic_number || ""} onChange={(e) => setForm({ ...form, nic_number: e.target.value })} className="h-11 border-white/10 bg-white/5 text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Gender</Label>
                  <Select value={form.gender || ""} onValueChange={(value) => setForm({ ...form, gender: value })}>
                    <SelectTrigger className="h-11 border-white/10 bg-white/5 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-[#0a0a0a] text-white">
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Membership Section */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Membership & Professional</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Membership Type</Label>
                  <Select value={form.membership_type || ""} onValueChange={(value) => setForm({ ...form, membership_type: value })}>
                    <SelectTrigger className="h-11 border-white/10 bg-white/5 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-[#0a0a0a] text-white">
                      <SelectItem value="Student">Student</SelectItem>
                      <SelectItem value="Graduate">Graduate</SelectItem>
                      <SelectItem value="Associate">Associate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Membership Number</Label>
                  <Input value={form.membership_number || ""} onChange={(e) => setForm({ ...form, membership_number: e.target.value })} className="h-11 border-white/10 bg-white/5 text-white" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Membership Year</Label>
                  <Input value={form.membership_year || ""} onChange={(e) => setForm({ ...form, membership_year: e.target.value })} className="h-11 border-white/10 bg-white/5 text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">ARB Number</Label>
                  <Input value={form.arb_number || ""} onChange={(e) => setForm({ ...form, arb_number: e.target.value })} className="h-11 border-white/10 bg-white/5 text-white" />
                </div>
              </div>

              {/* Qualifications */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Qualifications</p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Academic Qualifications</Label>
                <Textarea value={form.academic_qualifications || ""} onChange={(e) => setForm({ ...form, academic_qualifications: e.target.value })} className="min-h-16 border-white/10 bg-white/5 text-white" />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Professional Qualifications</Label>
                <Textarea value={form.professional_qualifications || ""} onChange={(e) => setForm({ ...form, professional_qualifications: e.target.value })} className="min-h-16 border-white/10 bg-white/5 text-white" />
              </div>

              {/* Practice Details */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Practice Details</p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Practice Name</Label>
                <Input value={form.practice_name || ""} onChange={(e) => setForm({ ...form, practice_name: e.target.value })} className="h-11 border-white/10 bg-white/5 text-white" />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Practice Description</Label>
                <Textarea value={form.practice_description || ""} onChange={(e) => setForm({ ...form, practice_description: e.target.value })} className="min-h-16 border-white/10 bg-white/5 text-white" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Practice Type</Label>
                  <Input value={form.practice_type || ""} onChange={(e) => setForm({ ...form, practice_type: e.target.value })} className="h-11 border-white/10 bg-white/5 text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Personal Website</Label>
                  <Input value={form.personal_website || ""} onChange={(e) => setForm({ ...form, personal_website: e.target.value })} className="h-11 border-white/10 bg-white/5 text-white" />
                </div>
              </div>

              {/* Location */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Location</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">District</Label>
                  <Input value={form.location_district || ""} onChange={(e) => setForm({ ...form, location_district: e.target.value })} className="h-11 border-white/10 bg-white/5 text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Province</Label>
                  <Input value={form.location_province || ""} onChange={(e) => setForm({ ...form, location_province: e.target.value })} className="h-11 border-white/10 bg-white/5 text-white" />
                </div>
              </div>

              {/* Office Contact */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Office Contact</p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Office Address</Label>
                <Textarea value={form.office_address || ""} onChange={(e) => setForm({ ...form, office_address: e.target.value })} className="min-h-16 border-white/10 bg-white/5 text-white" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Office District</Label>
                  <Input value={form.office_district || ""} onChange={(e) => setForm({ ...form, office_district: e.target.value })} className="h-11 border-white/10 bg-white/5 text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Office Province</Label>
                  <Input value={form.office_province || ""} onChange={(e) => setForm({ ...form, office_province: e.target.value })} className="h-11 border-white/10 bg-white/5 text-white" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Office Phone</Label>
                  <Input value={form.office_phone || ""} onChange={(e) => setForm({ ...form, office_phone: e.target.value })} className="h-11 border-white/10 bg-white/5 text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Office Email</Label>
                  <Input type="email" value={form.office_email || ""} onChange={(e) => setForm({ ...form, office_email: e.target.value })} className="h-11 border-white/10 bg-white/5 text-white" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Office Fax</Label>
                  <Input value={form.office_fax || ""} onChange={(e) => setForm({ ...form, office_fax: e.target.value })} className="h-11 border-white/10 bg-white/5 text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Office Website</Label>
                  <Input value={form.office_website || ""} onChange={(e) => setForm({ ...form, office_website: e.target.value })} className="h-11 border-white/10 bg-white/5 text-white" />
                </div>
              </div>

              <Button type="submit" disabled={saving} className="h-12 w-full bg-primary font-bold text-white">
                {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : form.id ? "Update Member" : "Add Member"}
              </Button>
              {form.id && (
                <Button type="button" variant="ghost" onClick={() => setForm(emptyForm())} className="w-full text-slate-500">
                  Discard Edits
                </Button>
              )}
            </form>
          </Card>
        )}

        <div className="min-w-0 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-xl font-bold text-white">Members ({filteredMembers.length})</h3>
            <Button onClick={() => { setForm(emptyForm()); setFormPanelOpen(true); }} className="bg-primary">
              <Plus className="h-5 w-5" /> Add Member
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              placeholder="Search by name, ARB number, email, district..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 border-white/10 bg-white/5"
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredMembers.length === 0 ? (
            <Card className="border-white/10 bg-white/[0.03] p-8 text-center">
              <p className="text-slate-400">No members found.</p>
            </Card>
          ) : (
            <div className="space-y-2 max-h-[700px] overflow-y-auto">
              {filteredMembers.map((member) => (
                <div key={member.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.05] transition">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-white">{member.full_name}</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {member.arb_number && `ARB: ${member.arb_number}`}
                        {member.arb_number && member.location_district && " • "}
                        {member.location_district && `${member.location_district}`}
                      </p>
                      {member.office_email && <p className="text-xs text-primary/70">{member.office_email}</p>}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => { setForm(member); setFormPanelOpen(true); }}
                        className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded transition"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteMember(member.id)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SliaManager;
