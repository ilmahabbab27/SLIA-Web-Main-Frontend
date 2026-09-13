import { useEffect, useMemo, useState } from "react";
import { Loader2, Search, Plus, Pencil, Trash2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { API_BASE } from "@/lib/api";
import { ChevronDown, ChevronUp } from "lucide-react";

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
  username?: string;
  password?: string;
  created_at?: string;
  updated_at?: string;
};

const emptyForm = (): SliaMember => ({
  id: 0,
  full_name: "",
});

const practiceTypes = [
  "Individual Practice",
  "Sole Proprietorship Practice",
  "Partnership Practice",
  "Private Practice",
  "Limited Practice",
  "Government Sanctuary Body Practice",
] as const;

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the selected photo."));
    reader.onload = () => resolve(String(reader.result || ""));
    reader.readAsDataURL(file);
  });

const normalizeText = (value: string) => value.replace(/\s+/g, " ").trim();
const normalizeUpper = (value: string) => normalizeText(value).toUpperCase();
const normalizeEmail = (value: string) => normalizeText(value).toLowerCase();
const removeEmptyText = <T extends Record<string, unknown>>(item: T): T =>
  Object.fromEntries(
    Object.entries(item).map(([key, value]) => [
      key,
      typeof value === "string" && ["null", "undefined", "n/a", "na"].includes(value.trim().toLowerCase()) ? "" : value,
    ])
  ) as T;
const normalizeDate = (value?: string | null) => {
  if (!value) return "";
  const match = String(value).match(/^\d{4}-\d{2}-\d{2}/);
  if (match) return match[0];
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toISOString().slice(0, 10);
};

const isValidEmail = (value?: string) =>
  !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const validateForm = (form: SliaMember) => {
  if (!form.full_name.trim()) return "Full name is required.";
  if (form.full_name.trim().length > 255) return "Full name must be 255 characters or fewer.";
  if (form.membership_type && !["Student", "Graduate", "Associate", "Fellow", "Honorary Fellow"].includes(form.membership_type)) {
    return "Membership type is invalid.";
  }
  if (!isValidEmail(form.office_email)) return "Office email is invalid.";
  if (!isValidEmail(form.home_email)) return "Home email is invalid.";
  if (!isValidEmail(form.contact_info_1_email)) return "Contact Info 1 email is invalid.";
  if (!isValidEmail(form.contact_info_2_email)) return "Contact Info 2 email is invalid.";
  if (form.photo && form.photo.length > 5_000_000) return "Photo is too large.";
  return "";
};

const normalizePayload = (form: SliaMember): SliaMember => ({
  ...form,
  full_name: normalizeText(form.full_name),
  name_with_initials: form.name_with_initials ? normalizeText(form.name_with_initials) : form.name_with_initials,
  yearbook_name: form.yearbook_name ? normalizeText(form.yearbook_name) : form.yearbook_name,
  nic_number: form.nic_number ? normalizeUpper(form.nic_number) : form.nic_number,
  membership_number: form.membership_number ? normalizeUpper(form.membership_number) : form.membership_number,
  membership_year: form.membership_year ? normalizeUpper(form.membership_year) : form.membership_year,
  arb_number: form.arb_number ? normalizeUpper(form.arb_number) : form.arb_number,
  practice_name: form.practice_name ? normalizeText(form.practice_name) : form.practice_name,
  practice_description: form.practice_description ? normalizeText(form.practice_description) : form.practice_description,
  practice_type: form.practice_type ? normalizeText(form.practice_type) : form.practice_type,
  location_district: form.location_district ? normalizeText(form.location_district) : form.location_district,
  location_province: form.location_province ? normalizeText(form.location_province) : form.location_province,
  personal_website: form.personal_website ? normalizeText(form.personal_website) : form.personal_website,
  office_address: form.office_address ? normalizeText(form.office_address) : form.office_address,
  office_district: form.office_district ? normalizeText(form.office_district) : form.office_district,
  office_province: form.office_province ? normalizeText(form.office_province) : form.office_province,
  office_phone: form.office_phone ? normalizeText(form.office_phone) : form.office_phone,
  office_email: form.office_email ? normalizeEmail(form.office_email) : form.office_email,
  office_website: form.office_website ? normalizeText(form.office_website) : form.office_website,
  home_address: form.home_address ? normalizeText(form.home_address) : form.home_address,
  home_district: form.home_district ? normalizeText(form.home_district) : form.home_district,
  home_province: form.home_province ? normalizeText(form.home_province) : form.home_province,
  home_phone: form.home_phone ? normalizeText(form.home_phone) : form.home_phone,
  home_fax: form.home_fax ? normalizeText(form.home_fax) : form.home_fax,
  home_email: form.home_email ? normalizeEmail(form.home_email) : form.home_email,
  contact_info_1_address: form.contact_info_1_address ? normalizeText(form.contact_info_1_address) : form.contact_info_1_address,
  contact_info_1_phone: form.contact_info_1_phone ? normalizeText(form.contact_info_1_phone) : form.contact_info_1_phone,
  contact_info_1_email: form.contact_info_1_email ? normalizeEmail(form.contact_info_1_email) : form.contact_info_1_email,
  contact_info_2_address: form.contact_info_2_address ? normalizeText(form.contact_info_2_address) : form.contact_info_2_address,
  contact_info_2_phone: form.contact_info_2_phone ? normalizeText(form.contact_info_2_phone) : form.contact_info_2_phone,
  contact_info_2_email: form.contact_info_2_email ? normalizeEmail(form.contact_info_2_email) : form.contact_info_2_email,
  positions_held: form.positions_held ? normalizeText(form.positions_held) : form.positions_held,
  slia_awards: form.slia_awards ? normalizeText(form.slia_awards) : form.slia_awards,
  other_awards: form.other_awards ? normalizeText(form.other_awards) : form.other_awards,
  username: form.username ? normalizeText(form.username) : form.username,
});

const readErrorMessage = async (response: Response, fallback: string) => {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const data = await response.json().catch(() => ({}));
    return data?.message || fallback;
  }

  const text = await response.text().catch(() => "");
  return text ? `${fallback}: ${text.slice(0, 180)}` : fallback;
};

type SliaManagerProps = {
  hideExtendedSections?: boolean;
};

const SliaManager = ({ hideExtendedSections = false }: SliaManagerProps) => {
  const [members, setMembers] = useState<SliaMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<SliaMember>(emptyForm());
  const [formOpen, setFormOpen] = useState(true);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [importing, setImporting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedImportFile, setSelectedImportFile] = useState<File | null>(null);

  const API_URL = API_BASE;

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/slia-members?per_page=1000`, {
        headers: {
          Accept: "application/json",
        },
      });
      if (!response.ok) throw new Error(await readErrorMessage(response, "Failed to fetch members"));
      const data = await response.json();
      setMembers((data.data || []).map((member: SliaMember) => removeEmptyText(member)));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch members";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const refreshMembers = async () => {
    try {
      setRefreshing(true);
      await fetchMembers();
    } finally {
      setRefreshing(false);
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

  const handlePhotoUpload = async (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      const message = "Please select an image file.";
      setError(message);
      toast.error(message);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      const message = "Photo must be 5 MB or smaller.";
      setError(message);
      toast.error(message);
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      setForm((current) => ({ ...current, photo: dataUrl }));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not read the selected photo.";
      setError(message);
      toast.error(message);
    }
  };

  const saveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm(form);
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    try {
      setSaving(true);
      setError("");

      const method = form.id ? "PUT" : "POST";
      const url = form.id ? `${API_URL}/slia-members/${form.id}` : `${API_URL}/slia-members`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(normalizePayload(form)),
      });

      if (!response.ok) {
        throw new Error(await readErrorMessage(response, "Failed to save member"));
      }

      toast.success(form.id ? "Member updated" : "Member created");
      setForm(emptyForm());
      setFormOpen(false);
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
        headers: {
          Accept: "application/json",
        },
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

  const downloadTemplate = () => {
    const rows = [
      [
        "full_name",
        "name_with_initials",
        "yearbook_name",
        "nic_number",
        "gender",
        "date_of_birth",
        "membership_type",
        "membership_number",
        "membership_year",
        "arb_number",
        "academic_qualifications",
        "professional_qualifications",
        "practice_name",
        "practice_description",
        "practice_type",
        "location_district",
        "location_province",
        "personal_website",
        "office_address",
        "office_district",
        "office_province",
        "office_phone",
        "office_fax",
        "office_email",
        "office_website",
        "home_address",
        "home_district",
        "home_province",
        "home_phone",
        "home_fax",
        "home_email",
        "contact_info_1_address",
        "contact_info_1_phone",
        "contact_info_1_email",
        "contact_info_2_address",
        "contact_info_2_phone",
        "contact_info_2_email",
        "positions_held",
        "slia_awards",
        "other_awards",
        "username",
        "password",
      ],
      [
        "Jane Doe",
        "J. Doe",
        "",
        "901234567V",
        "Female",
        "1990-01-15",
        "Associate",
        "AS123",
        "2026",
        "ARB-001",
        "B.Arch",
        "",
        "Doe Architects",
        "Example practice description",
        "Private Practice",
        "Colombo",
        "Western",
        "https://example.com",
        "No. 1 Example Street",
        "Colombo",
        "Western",
        "0112345678",
        "",
        "office@example.com",
        "https://example.com",
        "No. 2 Home Lane",
        "Colombo",
        "Western",
        "0771234567",
        "",
        "home@example.com",
        "",
        "",
        "",
        "",
        "",
        "",
        "Council Member",
        "",
        "",
        "jane.admin",
        "TempPass@2026",
      ],
    ];

    const escapeCsv = (value: string) => {
      if (/[",\n\r]/.test(value)) {
        return `"${value.replaceAll('"', '""')}"`;
      }
      return value;
    };

    const csv = rows.map((row) => row.map((value) => escapeCsv(value)).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "slia-members-import-template.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importMembers = async (file: File | null) => {
    if (!file) return;

    try {
      setImporting(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/slia-members/import`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      if (!response.ok) throw new Error(await readErrorMessage(response, "Failed to import members"));

      const data = await response.json();
      toast.success(`Parsed ${data.parsed || 0} rows, imported ${data.imported || 0} members`);
      await refreshMembers();
      toast.success("Member list refreshed after import");
      setSelectedImportFile(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to import members";
      setError(message);
      toast.error(message);
    } finally {
      setImporting(false);
    }
  };

  const fetchData = async () => {
    await refreshMembers();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">SLIA Members</h1>
        <p className="mt-1 text-slate-400">Manage registered architects and professionals</p>
      </div>

      <Card className="border-white/10 bg-white/[0.03] p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">Excel Import</p>
              <p className="text-sm text-slate-400">Download the full template with all supported SLIA member fields, fill it in, then upload the CSV or XLSX here.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button type="button" variant="outline" onClick={downloadTemplate} className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                Download Template
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => importMembers(selectedImportFile)}
                disabled={importing || !selectedImportFile}
                className="border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                {importing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload CSV"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={fetchData}
                disabled={refreshing}
                className="border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                {refreshing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  "Fetch Data"
                )}
              </Button>
              <Input
                type="file"
                accept=".csv,.xlsx"
                disabled={importing}
                onChange={(e) => setSelectedImportFile(e.target.files?.[0] || null)}
                className="h-11 border-white/10 bg-white/5 text-white file:mr-4 file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              />
              {selectedImportFile && (
                <p className="text-xs text-slate-500">
                  Selected file: {selectedImportFile.name}
                </p>
              )}
          </div>
        </div>
      </Card>

      {error && (
        <div className="rounded-lg border border-red-200/30 bg-red-500/10 p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-500">Error</p>
            <p className="text-sm text-red-400/80">{error}</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-bold text-white">{formOpen ? "Member Form" : "Member Form Closed"}</h3>
        <Button
          type="button"
          variant="outline"
          className="border-white/10 bg-white/5 text-white hover:bg-white/10"
          onClick={() => setFormOpen((current) => !current)}
        >
          {formOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {formOpen ? "Close Form" : "Open Form"}
        </Button>
      </div>

      {formOpen && (
      <Card className="border-white/10 bg-white/[0.03] p-6">
        <form onSubmit={saveMember} className="space-y-4">
          <div className="mb-6 flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-3 text-lg font-bold text-white">
              {form.id ? <Pencil className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
              {form.id ? "Edit Member" : "Add Member"}
            </h3>
            <Button type="button" variant="outline" onClick={() => { setForm(emptyForm()); setFormOpen(true); }} className="border-white/10 bg-white/5 text-white hover:bg-white/10">
              New Form
            </Button>
          </div>

              {/* Personal Details Section */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Personal Details</p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Full Name *</Label>
                <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} onBlur={(e) => setForm((current) => ({ ...current, full_name: normalizeText(e.target.value) }))} className="h-11 border-white/10 bg-white/5 text-white" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Name With Initials</Label>
                  <Input value={form.name_with_initials || ""} onChange={(e) => setForm({ ...form, name_with_initials: e.target.value })} onBlur={(e) => setForm((current) => ({ ...current, name_with_initials: normalizeText(e.target.value) }))} className="h-11 border-white/10 bg-white/5 text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Yearbook Name</Label>
                  <Input value={form.yearbook_name || ""} onChange={(e) => setForm({ ...form, yearbook_name: e.target.value })} onBlur={(e) => setForm((current) => ({ ...current, yearbook_name: normalizeText(e.target.value) }))} className="h-11 border-white/10 bg-white/5 text-white" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Photo</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoUpload(e.target.files?.[0] || null)}
                  className="h-11 border-white/10 bg-white/5 text-white file:mr-4 file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
                {form.photo && (
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500">Photo selected</p>
                    <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
                      <img
                        src={form.photo}
                        alt="Selected member photo preview"
                        className="max-h-40 w-auto max-w-full object-contain mx-auto p-2"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">NIC Number</Label>
                  <Input value={form.nic_number || ""} onChange={(e) => setForm({ ...form, nic_number: e.target.value })} onBlur={(e) => setForm((current) => ({ ...current, nic_number: normalizeUpper(e.target.value) }))} className="h-11 border-white/10 bg-white/5 text-white" />
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

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Date of Birth</Label>
                  <Input type="date" value={form.date_of_birth || ""} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} className="h-11 border-white/10 bg-white/5 text-white" />
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
                      <SelectItem value="Fellow">Fellow</SelectItem>
                      <SelectItem value="Honorary Fellow">Honorary Fellow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Membership Number</Label>
                  <Input value={form.membership_number || ""} onChange={(e) => setForm({ ...form, membership_number: e.target.value })} onBlur={(e) => setForm((current) => ({ ...current, membership_number: normalizeUpper(e.target.value) }))} className="h-11 border-white/10 bg-white/5 text-white" />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Membership Year</Label>
                  <Input value={form.membership_year || ""} onChange={(e) => setForm({ ...form, membership_year: e.target.value })} onBlur={(e) => setForm((current) => ({ ...current, membership_year: normalizeUpper(e.target.value) }))} className="h-11 border-white/10 bg-white/5 text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">ARB Number</Label>
                  <Input value={form.arb_number || ""} onChange={(e) => setForm({ ...form, arb_number: e.target.value })} onBlur={(e) => setForm((current) => ({ ...current, arb_number: normalizeUpper(e.target.value) }))} className="h-11 border-white/10 bg-white/5 text-white" />
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

              {!hideExtendedSections && (
                <>
                  {/* Practice Details */}
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">Practice Details</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Practice Name</Label>
                    <Input value={form.practice_name || ""} onChange={(e) => setForm({ ...form, practice_name: e.target.value })} onBlur={(e) => setForm((current) => ({ ...current, practice_name: normalizeText(e.target.value) }))} className="h-11 border-white/10 bg-white/5 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Practice Description</Label>
                    <Textarea value={form.practice_description || ""} onChange={(e) => setForm({ ...form, practice_description: e.target.value })} className="min-h-16 border-white/10 bg-white/5 text-white" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Practice Type</Label>
                      <Select value={form.practice_type || ""} onValueChange={(value) => setForm({ ...form, practice_type: value })}>
                        <SelectTrigger className="h-11 border-white/10 bg-white/5 text-white">
                          <SelectValue placeholder="Select practice type" />
                        </SelectTrigger>
                        <SelectContent className="border-white/10 bg-[#0a0a0a] text-white">
                          {practiceTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Personal Website</Label>
                      <Input value={form.personal_website || ""} onChange={(e) => setForm({ ...form, personal_website: e.target.value })} onBlur={(e) => setForm((current) => ({ ...current, personal_website: normalizeText(e.target.value) }))} className="h-11 border-white/10 bg-white/5 text-white" />
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
                    <Textarea value={form.office_address || ""} onChange={(e) => setForm({ ...form, office_address: e.target.value })} onBlur={(e) => setForm((current) => ({ ...current, office_address: normalizeText(e.target.value) }))} className="min-h-16 border-white/10 bg-white/5 text-white" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Office District</Label>
                      <Input value={form.office_district || ""} onChange={(e) => setForm({ ...form, office_district: e.target.value })} onBlur={(e) => setForm((current) => ({ ...current, office_district: normalizeText(e.target.value) }))} className="h-11 border-white/10 bg-white/5 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Office Province</Label>
                      <Input value={form.office_province || ""} onChange={(e) => setForm({ ...form, office_province: e.target.value })} onBlur={(e) => setForm((current) => ({ ...current, office_province: normalizeText(e.target.value) }))} className="h-11 border-white/10 bg-white/5 text-white" />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Office Phone</Label>
                      <Input value={form.office_phone || ""} onChange={(e) => setForm({ ...form, office_phone: e.target.value })} onBlur={(e) => setForm((current) => ({ ...current, office_phone: normalizeText(e.target.value) }))} className="h-11 border-white/10 bg-white/5 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Office Email</Label>
                      <Input type="email" value={form.office_email || ""} onChange={(e) => setForm({ ...form, office_email: e.target.value })} onBlur={(e) => setForm((current) => ({ ...current, office_email: normalizeEmail(e.target.value) }))} className="h-11 border-white/10 bg-white/5 text-white" />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Office Fax</Label>
                      <Input value={form.office_fax || ""} onChange={(e) => setForm({ ...form, office_fax: e.target.value })} onBlur={(e) => setForm((current) => ({ ...current, office_fax: normalizeText(e.target.value) }))} className="h-11 border-white/10 bg-white/5 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Office Website</Label>
                      <Input value={form.office_website || ""} onChange={(e) => setForm({ ...form, office_website: e.target.value })} onBlur={(e) => setForm((current) => ({ ...current, office_website: normalizeText(e.target.value) }))} className="h-11 border-white/10 bg-white/5 text-white" />
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">Home Contact</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Home Address</Label>
                    <Textarea value={form.home_address || ""} onChange={(e) => setForm({ ...form, home_address: e.target.value })} onBlur={(e) => setForm((current) => ({ ...current, home_address: normalizeText(e.target.value) }))} className="min-h-16 border-white/10 bg-white/5 text-white" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Home District</Label>
                      <Input value={form.home_district || ""} onChange={(e) => setForm({ ...form, home_district: e.target.value })} onBlur={(e) => setForm((current) => ({ ...current, home_district: normalizeText(e.target.value) }))} className="h-11 border-white/10 bg-white/5 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Home Province</Label>
                      <Input value={form.home_province || ""} onChange={(e) => setForm({ ...form, home_province: e.target.value })} onBlur={(e) => setForm((current) => ({ ...current, home_province: normalizeText(e.target.value) }))} className="h-11 border-white/10 bg-white/5 text-white" />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Home Phone</Label>
                      <Input value={form.home_phone || ""} onChange={(e) => setForm({ ...form, home_phone: e.target.value })} onBlur={(e) => setForm((current) => ({ ...current, home_phone: normalizeText(e.target.value) }))} className="h-11 border-white/10 bg-white/5 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Home Fax</Label>
                      <Input value={form.home_fax || ""} onChange={(e) => setForm({ ...form, home_fax: e.target.value })} onBlur={(e) => setForm((current) => ({ ...current, home_fax: normalizeText(e.target.value) }))} className="h-11 border-white/10 bg-white/5 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Home Email</Label>
                    <Input type="email" value={form.home_email || ""} onChange={(e) => setForm({ ...form, home_email: e.target.value })} onBlur={(e) => setForm((current) => ({ ...current, home_email: normalizeEmail(e.target.value) }))} className="h-11 border-white/10 bg-white/5 text-white" />
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">Contact Info 1</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Address</Label>
                    <Textarea value={form.contact_info_1_address || ""} onChange={(e) => setForm({ ...form, contact_info_1_address: e.target.value })} onBlur={(e) => setForm((current) => ({ ...current, contact_info_1_address: normalizeText(e.target.value) }))} className="min-h-16 border-white/10 bg-white/5 text-white" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Phone</Label>
                      <Input value={form.contact_info_1_phone || ""} onChange={(e) => setForm({ ...form, contact_info_1_phone: e.target.value })} onBlur={(e) => setForm((current) => ({ ...current, contact_info_1_phone: normalizeText(e.target.value) }))} className="h-11 border-white/10 bg-white/5 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Email</Label>
                      <Input type="email" value={form.contact_info_1_email || ""} onChange={(e) => setForm({ ...form, contact_info_1_email: e.target.value })} onBlur={(e) => setForm((current) => ({ ...current, contact_info_1_email: normalizeEmail(e.target.value) }))} className="h-11 border-white/10 bg-white/5 text-white" />
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-primary">Contact Info 2</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Address</Label>
                    <Textarea value={form.contact_info_2_address || ""} onChange={(e) => setForm({ ...form, contact_info_2_address: e.target.value })} onBlur={(e) => setForm((current) => ({ ...current, contact_info_2_address: normalizeText(e.target.value) }))} className="min-h-16 border-white/10 bg-white/5 text-white" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Phone</Label>
                      <Input value={form.contact_info_2_phone || ""} onChange={(e) => setForm({ ...form, contact_info_2_phone: e.target.value })} onBlur={(e) => setForm((current) => ({ ...current, contact_info_2_phone: normalizeText(e.target.value) }))} className="h-11 border-white/10 bg-white/5 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Email</Label>
                      <Input type="email" value={form.contact_info_2_email || ""} onChange={(e) => setForm({ ...form, contact_info_2_email: e.target.value })} onBlur={(e) => setForm((current) => ({ ...current, contact_info_2_email: normalizeEmail(e.target.value) }))} className="h-11 border-white/10 bg-white/5 text-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Positions Held</Label>
                    <Textarea value={form.positions_held || ""} onChange={(e) => setForm({ ...form, positions_held: e.target.value })} className="min-h-16 border-white/10 bg-white/5 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">SLIA Awards</Label>
                    <Textarea value={form.slia_awards || ""} onChange={(e) => setForm({ ...form, slia_awards: e.target.value })} className="min-h-16 border-white/10 bg-white/5 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Other Awards</Label>
                    <Textarea value={form.other_awards || ""} onChange={(e) => setForm({ ...form, other_awards: e.target.value })} className="min-h-16 border-white/10 bg-white/5 text-white" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Username</Label>
                      <Input value={form.username || ""} onChange={(e) => setForm({ ...form, username: e.target.value })} className="h-11 border-white/10 bg-white/5 text-white" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Password</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPassword((current) => !current)}
                          className="h-7 px-2 text-xs text-slate-400 hover:bg-white/5 hover:text-white"
                        >
                          {showPassword ? (
                            <>
                              <EyeOff className="mr-1 h-4 w-4" />
                              Hide
                            </>
                          ) : (
                            <>
                              <Eye className="mr-1 h-4 w-4" />
                              Show
                            </>
                          )}
                        </Button>
                      </div>
                      <Input type={showPassword ? "text" : "password"} value={form.password || ""} onChange={(e) => setForm({ ...form, password: e.target.value })} className="h-11 border-white/10 bg-white/5 text-white" />
                      <p className="text-xs text-slate-500">Leave blank to keep the current password.</p>
                    </div>
                  </div>
                </>
              )}

              <Button type="submit" disabled={saving} className="h-12 w-full bg-primary font-bold text-white">
                {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : form.id ? "Update Member" : "Add Member"}
              </Button>
              {form.id && (
                <Button type="button" variant="ghost" onClick={() => { setForm(emptyForm()); setFormOpen(false); }} className="w-full text-slate-500">
                  Close Form
                </Button>
              )}
            </form>
          </Card>
      )}

        <div className="min-w-0 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-xl font-bold text-white">Members ({filteredMembers.length})</h3>
            <Button onClick={() => { setForm(emptyForm()); setFormOpen(true); }} className="bg-primary">
              <Plus className="h-5 w-5" /> Open Form
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
          ) : (
            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="min-w-[980px] w-full text-left text-sm">
                <thead className="bg-white/[0.03] text-xs uppercase tracking-[0.18em] text-slate-500">
                  <tr>
                    <th className="px-4 py-4">Personal Details</th>
                    <th className="px-4 py-4">Contact</th>
                    <th className="px-4 py-4">Username</th>
                    <th className="px-4 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="border-t border-white/10 bg-white/[0.02] transition hover:bg-white/[0.05]">
                      <td className="px-4 py-4 align-top">
                        <div className="space-y-1">
                          <p className="font-semibold text-white">{member.full_name || "-"}</p>
                          <p className="text-xs text-slate-400">{member.name_with_initials || "-"}</p>
                          <p className="text-xs text-slate-500">
                            {[member.nic_number, member.date_of_birth, member.membership_type, member.membership_number]
                              .filter(Boolean)
                              .join(" | ") || "-"}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top text-slate-400">
                        <div className="space-y-1">
                          <p>{member.office_email || member.home_email || "-"}</p>
                          <p>{member.office_phone || member.home_phone || "-"}</p>
                          <p className="text-xs text-slate-500">{member.office_address || member.home_address || "-"}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top text-white">{member.username || "-"}</td>
                      <td className="px-4 py-4 align-top">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => { setForm({ ...member, date_of_birth: normalizeDate(member.date_of_birth) }); setFormOpen(true); }}
                            className="rounded p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteMember(member.id)}
                            className="rounded p-2 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
    </div>
  );
};

export default SliaManager;

