import { useCallback, useEffect, useMemo, useState } from "react";
import { FileText, GraduationCap, Loader2, PanelLeftClose, PanelLeftOpen, Pencil, Plus, RefreshCw, Search, Trash2, Upload, Users, X } from "lucide-react";
import { toast } from "sonner";
import { baeDocumentApi, baeMemberApi, baeSettingApi, type BaeDocumentCategory, type BaeDocumentItem, type BaeMemberItem, type BaeMemberType } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import SliaManager from "@/pages/admin/SliaManager";

const documentCategories: Array<{ value: BaeDocumentCategory; label: string }> = [
  { value: "applications", label: "Applications" },
  { value: "notices", label: "Notices" },
  { value: "references", label: "References" },
];

type DocumentForm = {
  id?: number;
  category: BaeDocumentCategory;
  title: string;
  meta: string;
  file_name: string;
  file_src: string;
  external_url: string;
  uploaded_at: string;
  is_active: boolean;
  sort_order: number;
};

const emptyForm = (): DocumentForm => ({
  category: "applications",
  title: "",
  meta: "",
  file_name: "",
  file_src: "",
  external_url: "",
  uploaded_at: new Date().toISOString().slice(0, 10),
  is_active: true,
  sort_order: 0,
});

const normalizeDocument = (item: BaeDocumentItem): DocumentForm => ({
  id: item.id,
  category: item.category,
  title: item.title || "",
  meta: item.meta || "",
  file_name: item.file_name || "",
  file_src: item.file_src || "",
  external_url: item.external_url || "",
  uploaded_at: item.uploaded_at || item.created_at?.slice(0, 10) || new Date().toISOString().slice(0, 10),
  is_active: item.is_active,
  sort_order: item.sort_order || 0,
});

const buildPayload = (form: DocumentForm): Omit<BaeDocumentItem, "id" | "created_at" | "updated_at"> => ({
  category: form.category,
  title: form.title.trim(),
  meta: form.meta.trim(),
  file_name: form.file_name.trim(),
  file_src: form.file_src,
  external_url: form.external_url.trim(),
  uploaded_at: form.uploaded_at,
  is_active: form.is_active,
  sort_order: form.sort_order,
});

const getErrorMessage = (err: unknown, fallback: string) =>
  err instanceof Error && err.message ? err.message : fallback;

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read selected file."));
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });

type MemberForm = Omit<BaeMemberItem, "id" | "created_at" | "updated_at"> & {
  id?: number;
};

const memberTypeOptions: Array<{ value: BaeMemberType; label: string }> = [
  { value: "student", label: "Student" },
  { value: "graduate", label: "Graduate" },
  { value: "associate", label: "Associate" },
];

const emptyMemberForm = (memberType: BaeMemberType = "student"): MemberForm => ({
  member_type: memberType,
  current_membership_type: memberType,
  serial_no: 0,
  name: "",
  name_with_initials: "",
  gender: "not_specified",
  picture: "",
  nic: "",
  nationality: "",
  date_of_birth: "",
  academic_qualifications: "",
  membership_year: new Date().getFullYear().toString(),
  membership_number: "",
  student_membership_number: "",
  student_membership_year: "",
  graduate_membership_number: "",
  graduate_membership_year: "",
  associate_membership_number: "",
  associate_membership_year: "",
  address: "",
  office_address: "",
  office_phone: "",
  office_email: "",
  residence_address: "",
  residence_phone: "",
  residence_email: "",
  contact_no: "",
  email: "",
  remarks: "",
  is_active: true,
  current_membership_status: "active",
  sort_order: 0,
});

const normalizeMember = (item: BaeMemberItem): MemberForm => ({
  id: item.id,
  member_type: item.member_type,
  current_membership_type: item.current_membership_type || item.member_type,
  serial_no: item.serial_no || 0,
  name: item.name || "",
  name_with_initials: item.name_with_initials || "",
  gender: item.gender || "not_specified",
  picture: item.picture || "",
  nic: item.nic || "",
  nationality: item.nationality || "",
  date_of_birth: item.date_of_birth || "",
  academic_qualifications: item.academic_qualifications || "",
  membership_year: item.membership_year || "",
  membership_number: item.membership_number || "",
  student_membership_number: item.student_membership_number || "",
  student_membership_year: item.student_membership_year || "",
  graduate_membership_number: item.graduate_membership_number || "",
  graduate_membership_year: item.graduate_membership_year || "",
  associate_membership_number: item.associate_membership_number || "",
  associate_membership_year: item.associate_membership_year || "",
  address: item.address || "",
  office_address: item.office_address || "",
  office_phone: item.office_phone || "",
  office_email: item.office_email || "",
  residence_address: item.residence_address || item.address || "",
  residence_phone: item.residence_phone || item.contact_no || "",
  residence_email: item.residence_email || item.email || "",
  contact_no: item.contact_no || "",
  email: item.email || "",
  remarks: item.remarks || "",
  is_active: item.is_active,
  current_membership_status: item.current_membership_status || "active",
  sort_order: item.sort_order || 0,
});

const buildMemberPayload = (form: MemberForm): Omit<BaeMemberItem, "id" | "created_at" | "updated_at"> => ({
  member_type: form.member_type,
  current_membership_type: form.current_membership_type || form.member_type,
  serial_no: Number(form.serial_no) || 0,
  name: form.name.trim(),
  name_with_initials: form.name_with_initials?.trim() || "",
  gender: form.gender || "not_specified",
  picture: form.picture || "",
  nic: form.nic?.trim() || "",
  nationality: form.nationality?.trim() || "",
  date_of_birth: form.date_of_birth || "",
  academic_qualifications: form.academic_qualifications?.trim() || "",
  membership_year: form.membership_year?.trim() || "",
  membership_number: form.membership_number?.trim() || "",
  student_membership_number: form.student_membership_number?.trim() || "",
  student_membership_year: form.student_membership_year?.trim() || "",
  graduate_membership_number: form.graduate_membership_number?.trim() || "",
  graduate_membership_year: form.graduate_membership_year?.trim() || "",
  associate_membership_number: form.associate_membership_number?.trim() || "",
  associate_membership_year: form.associate_membership_year?.trim() || "",
  address: form.residence_address?.trim() || form.address?.trim() || "",
  office_address: form.office_address?.trim() || "",
  office_phone: form.office_phone?.trim() || "",
  office_email: form.office_email?.trim() || "",
  residence_address: form.residence_address?.trim() || "",
  residence_phone: form.residence_phone?.trim() || "",
  residence_email: form.residence_email?.trim() || "",
  contact_no: form.residence_phone?.trim() || form.contact_no?.trim() || "",
  email: form.residence_email?.trim() || form.email?.trim() || "",
  remarks: form.remarks?.trim() || "",
  is_active: form.is_active,
  current_membership_status: form.current_membership_status || "active",
  sort_order: Number(form.sort_order) || 0,
});

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const validateMemberForm = (form: MemberForm) => {
  if (!["student", "graduate", "associate"].includes(form.member_type)) {
    return "Member type is required.";
  }

  if (!form.name.trim()) {
    return "Member name is required.";
  }

  if (form.name.trim().length > 255) {
    return "Member name must be 255 characters or fewer.";
  }

  if ((form.name_with_initials || "").length > 255) {
    return "Name with initials must be 255 characters or fewer.";
  }

  if ((form.nic || "").length > 50) {
    return "NIC must be 50 characters or fewer.";
  }

  if ((form.nationality || "").length > 100) {
    return "Nationality must be 100 characters or fewer.";
  }

  if ((Number(form.serial_no) || 0) < 0) {
    return "Serial number cannot be negative.";
  }

  if ((Number(form.sort_order) || 0) < 0) {
    return "Sort order cannot be negative.";
  }

  if ((form.academic_qualifications || "").length > 255) {
    return "Academic qualifications must be 255 characters or fewer.";
  }

  if ((form.membership_year || "").length > 20) {
    return "Membership year must be 20 characters or fewer.";
  }

  if (!form.membership_number?.trim()) {
    return "Membership number is required.";
  }

  if ((form.membership_number || "").length > 80) {
    return "Membership number must be 80 characters or fewer.";
  }

  if ((form.student_membership_number || "").length > 80) {
    return "Student membership number must be 80 characters or fewer.";
  }

  if ((form.student_membership_year || "").length > 20) {
    return "Student membership year must be 20 characters or fewer.";
  }

  if ((form.graduate_membership_number || "").length > 80) {
    return "Graduate membership number must be 80 characters or fewer.";
  }

  if ((form.graduate_membership_year || "").length > 20) {
    return "Graduate membership year must be 20 characters or fewer.";
  }

  if ((form.associate_membership_number || "").length > 80) {
    return "Associate membership number must be 80 characters or fewer.";
  }

  if ((form.associate_membership_year || "").length > 20) {
    return "Associate membership year must be 20 characters or fewer.";
  }

  if ((form.contact_no || "").length > 80) {
    return "Contact number must be 80 characters or fewer.";
  }

  if ((form.office_phone || "").length > 80 || (form.residence_phone || "").length > 80) {
    return "Phone numbers must be 80 characters or fewer.";
  }

  if ((form.email || "").length > 255 || (form.office_email || "").length > 255 || (form.residence_email || "").length > 255) {
    return "Email addresses must be 255 characters or fewer.";
  }

  if (form.email?.trim() && !isValidEmail(form.email)) {
    return "Enter a valid email address.";
  }

  if (form.office_email?.trim() && !isValidEmail(form.office_email)) {
    return "Enter a valid office email address.";
  }

  if (form.residence_email?.trim() && !isValidEmail(form.residence_email)) {
    return "Enter a valid residence email address.";
  }

  return "";
};

const memberNumberKey = (memberType: BaeMemberType) =>
  `${memberType}_membership_number` as "student_membership_number" | "graduate_membership_number" | "associate_membership_number";

const memberYearKey = (memberType: BaeMemberType) =>
  `${memberType}_membership_year` as "student_membership_year" | "graduate_membership_year" | "associate_membership_year";

const memberTypeLabel = (memberType: BaeMemberType) =>
  memberTypeOptions.find((option) => option.value === memberType)?.label || "Member";

const BaeMemberManager = ({ memberType }: { memberType?: BaeMemberType }) => {
  const [members, setMembers] = useState<MemberForm[]>([]);
  const [form, setForm] = useState<MemberForm>(emptyMemberForm(memberType || "student"));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [replaceImport, setReplaceImport] = useState(false);
  const [formPanelOpen, setFormPanelOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | BaeMemberType>("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "visible" | "hidden">("all");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkMemberType, setBulkMemberType] = useState<BaeMemberType>("student");
  const [bulkSaving, setBulkSaving] = useState(false);
  const isAllMembers = !memberType;
  const currentTypeLabel = memberTypeLabel(form.member_type);
  const currentNumberKey = memberNumberKey(form.member_type);
  const currentYearKey = memberYearKey(form.member_type);
  const title =
    memberType === "student"
      ? "Student Members"
      : memberType === "graduate"
        ? "Graduate Members"
        : memberType === "associate"
          ? "Associate Members"
          : "All Members";

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await baeMemberApi.list(memberType);
      setMembers(data.map(normalizeMember));
    } catch (err) {
      toast.error(getErrorMessage(err, `Could not load ${title.toLowerCase()}.`));
    } finally {
      setLoading(false);
    }
  }, [memberType, title]);

  useEffect(() => {
    fetchMembers();
    setForm(emptyMemberForm(memberType || "student"));
    setSelectedIds([]);
  }, [fetchMembers, memberType]);

  const filteredMembers = useMemo(() => {
    const needle = searchQuery.trim().toLowerCase();
    return members
      .filter((member) => !isAllMembers || typeFilter === "all" || member.member_type === typeFilter)
      .filter((member) => yearFilter === "all" || member.membership_year === yearFilter)
      .filter((member) => {
        if (statusFilter === "visible") return member.is_active;
        if (statusFilter === "hidden") return !member.is_active;
        return true;
      })
      .filter((member) =>
        !needle ||
        [member.name, member.membership_number, member.academic_qualifications, member.email]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(needle))
      )
      .sort((a, b) => a.sort_order - b.sort_order || (a.serial_no || 0) - (b.serial_no || 0));
  }, [isAllMembers, members, searchQuery, statusFilter, typeFilter, yearFilter]);

  const memberYears = useMemo(
    () => Array.from(new Set(members.map((member) => member.membership_year).filter(Boolean))).sort((a, b) => String(b).localeCompare(String(a))),
    [members]
  );

  const visibleSelectedIds = filteredMembers.map((member) => member.id).filter((id): id is number => Boolean(id));
  const allVisibleSelected = visibleSelectedIds.length > 0 && visibleSelectedIds.every((id) => selectedIds.includes(id));

  const toggleAllVisible = () => {
    setSelectedIds((current) =>
      allVisibleSelected
        ? current.filter((id) => !visibleSelectedIds.includes(id))
        : Array.from(new Set([...current, ...visibleSelectedIds]))
    );
  };

  const toggleSelected = (id?: number) => {
    if (!id) return;
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const bulkUpdateMemberType = async () => {
    if (selectedIds.length === 0) {
      toast.error("Select at least one member.");
      return;
    }

    setBulkSaving(true);
    try {
      const result = await baeMemberApi.bulkUpdateType(selectedIds, bulkMemberType);
      await fetchMembers();
      setSelectedIds([]);
      toast.success(`Updated ${result.updated} members`);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not update selected members."));
    } finally {
      setBulkSaving(false);
    }
  };

  const saveMember = async (event: React.FormEvent) => {
    event.preventDefault();

    const validationError = validateMemberForm(form);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSaving(true);
    try {
      if (form.id) {
        await baeMemberApi.update(form.id, buildMemberPayload(form));
      } else {
        await baeMemberApi.create(buildMemberPayload(form));
      }
      await fetchMembers();
      setForm(emptyMemberForm(memberType));
      toast.success(form.id ? "Member updated" : "Member added");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not save member."));
    } finally {
      setSaving(false);
    }
  };

  const deleteMember = async (member: MemberForm) => {
    if (!member.id || !confirm(`Delete ${member.name}?`)) return;

    setDeletingId(member.id);
    try {
      await baeMemberApi.delete(member.id);
      await fetchMembers();
      if (form.id === member.id) setForm(emptyMemberForm(memberType));
      toast.success("Member deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete member."));
    } finally {
      setDeletingId(null);
    }
  };

  const handleExcelImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const isXlsx =
      file.name.toLowerCase().endsWith(".xlsx") ||
      file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    if (!isXlsx) {
      toast.error("Please upload an .xlsx Excel file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Excel file must be 10MB or smaller.");
      return;
    }

    setImporting(true);
    try {
      const result = await baeMemberApi.importExcel(file, { member_type: memberType, replace: replaceImport });
      await fetchMembers();
      toast.success(`Imported ${result.imported} ${title.toLowerCase()}`);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not import Excel file."));
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className={formPanelOpen ? "min-w-0 space-y-4" : "min-w-0 space-y-4"}>
      {formPanelOpen && (
      <Card className="border-white/5 bg-[#0a0a0a] p-4 sm:p-6 xl:sticky xl:top-28 xl:p-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h3 className="flex items-center gap-3 text-lg font-bold text-white">
            {form.id ? <Pencil className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
            {form.id ? `Edit ${title.slice(0, -1)}` : `Add ${title.slice(0, -1)}`}
          </h3>
          <button
            type="button"
            onClick={() => setFormPanelOpen(false)}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition"
            title="Hide form"
          >
            <PanelLeftClose className="h-5 w-5" />
          </button>
        </div>`n        <form onSubmit={saveMember} className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Personal Details</p>
            <p className="mt-1 text-xs text-slate-500">
              This section keeps the core member identity details.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Current Membership Type</Label>
              <Select value={form.current_membership_type || "student"} onValueChange={(value: BaeMemberType) => setForm((current) => ({ ...current, current_membership_type: value }))}>
                <SelectTrigger className="h-11 border-white/10 bg-white/5 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#0a0a0a] text-white">
                  {memberTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                {currentTypeLabel} Member No *
              </Label>
              <Input
                value={form.membership_number || ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    membership_number: event.target.value,
                    [memberNumberKey(current.member_type)]: event.target.value,
                  }))
                }
                className="h-11 border-white/10 bg-white/5 text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Name *</Label>
            <Input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} className="h-11 border-white/10 bg-white/5 text-white" />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Academic Qualifications</Label>
            <Input value={form.academic_qualifications || ""} onChange={(event) => setForm((current) => ({ ...current, academic_qualifications: event.target.value }))} className="h-11 border-white/10 bg-white/5 text-white" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Contact No</Label>
              <Input value={form.contact_no || ""} onChange={(event) => setForm((current) => ({ ...current, contact_no: event.target.value }))} className="h-11 border-white/10 bg-white/5 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Email</Label>
              <Input type="email" value={form.email || ""} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} className="h-11 border-white/10 bg-white/5 text-white" />
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Location</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">District</Label>
              <Input value={form.location_district || ""} onChange={(event) => setForm((current) => ({ ...current, location_district: event.target.value }))} className="h-11 border-white/10 bg-white/5 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Province</Label>
              <Input value={form.location_province || ""} onChange={(event) => setForm((current) => ({ ...current, location_province: event.target.value }))} className="h-11 border-white/10 bg-white/5 text-white" />
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Office Contact</p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Office Address</Label>
            <Textarea value={form.office_address || ""} onChange={(event) => setForm((current) => ({ ...current, office_address: event.target.value }))} className="min-h-16 border-white/10 bg-white/5 text-white" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Office District</Label>
              <Input value={form.office_district || ""} onChange={(event) => setForm((current) => ({ ...current, office_district: event.target.value }))} className="h-11 border-white/10 bg-white/5 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Office Province</Label>
              <Input value={form.office_province || ""} onChange={(event) => setForm((current) => ({ ...current, office_province: event.target.value }))} className="h-11 border-white/10 bg-white/5 text-white" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Office Phone</Label>
              <Input value={form.office_phone || ""} onChange={(event) => setForm((current) => ({ ...current, office_phone: event.target.value }))} className="h-11 border-white/10 bg-white/5 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Office Email</Label>
              <Input type="email" value={form.office_email || ""} onChange={(event) => setForm((current) => ({ ...current, office_email: event.target.value }))} className="h-11 border-white/10 bg-white/5 text-white" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Office Fax</Label>
              <Input value={form.office_fax || ""} onChange={(event) => setForm((current) => ({ ...current, office_fax: event.target.value }))} className="h-11 border-white/10 bg-white/5 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Office Website</Label>
              <Input value={form.office_website || ""} onChange={(event) => setForm((current) => ({ ...current, office_website: event.target.value }))} className="h-11 border-white/10 bg-white/5 text-white" />
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Home Contact</p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Home Address</Label>
            <Textarea value={form.home_address || ""} onChange={(event) => setForm((current) => ({ ...current, home_address: event.target.value }))} className="min-h-16 border-white/10 bg-white/5 text-white" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Home District</Label>
              <Input value={form.home_district || ""} onChange={(event) => setForm((current) => ({ ...current, home_district: event.target.value }))} className="h-11 border-white/10 bg-white/5 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Home Province</Label>
              <Input value={form.home_province || ""} onChange={(event) => setForm((current) => ({ ...current, home_province: event.target.value }))} className="h-11 border-white/10 bg-white/5 text-white" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Home Phone</Label>
              <Input value={form.home_phone || ""} onChange={(event) => setForm((current) => ({ ...current, home_phone: event.target.value }))} className="h-11 border-white/10 bg-white/5 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Home Fax</Label>
              <Input value={form.home_fax || ""} onChange={(event) => setForm((current) => ({ ...current, home_fax: event.target.value }))} className="h-11 border-white/10 bg-white/5 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Home Email</Label>
            <Input type="email" value={form.home_email || ""} onChange={(event) => setForm((current) => ({ ...current, home_email: event.target.value }))} className="h-11 border-white/10 bg-white/5 text-white" />
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Contact Info 1</p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Address</Label>
            <Textarea value={form.contact_info_1_address || ""} onChange={(event) => setForm((current) => ({ ...current, contact_info_1_address: event.target.value }))} className="min-h-16 border-white/10 bg-white/5 text-white" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Phone</Label>
              <Input value={form.contact_info_1_phone || ""} onChange={(event) => setForm((current) => ({ ...current, contact_info_1_phone: event.target.value }))} className="h-11 border-white/10 bg-white/5 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Email</Label>
              <Input type="email" value={form.contact_info_1_email || ""} onChange={(event) => setForm((current) => ({ ...current, contact_info_1_email: event.target.value }))} className="h-11 border-white/10 bg-white/5 text-white" />
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Contact Info 2</p>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Address</Label>
            <Textarea value={form.contact_info_2_address || ""} onChange={(event) => setForm((current) => ({ ...current, contact_info_2_address: event.target.value }))} className="min-h-16 border-white/10 bg-white/5 text-white" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Phone</Label>
              <Input value={form.contact_info_2_phone || ""} onChange={(event) => setForm((current) => ({ ...current, contact_info_2_phone: event.target.value }))} className="h-11 border-white/10 bg-white/5 text-white" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Email</Label>
              <Input type="email" value={form.contact_info_2_email || ""} onChange={(event) => setForm((current) => ({ ...current, contact_info_2_email: event.target.value }))} className="h-11 border-white/10 bg-white/5 text-white" />
            </div>
          </div>

          <Button type="submit" disabled={saving} className="h-12 w-full bg-primary font-bold text-white">
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : form.id ? "Update Member" : "Add Member"}
          </Button>
          {form.id && (
            <Button type="button" variant="ghost" onClick={() => setForm(emptyMemberForm(memberType))} className="w-full text-slate-500">
              Discard Edits
            </Button>
          )}
        </form>
      </Card>
      )}

      <div className="min-w-0 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="flex items-center gap-2 text-xl font-bold text-white">
            <Users className="h-5 w-5 text-primary" />
            {title} ({filteredMembers.length})
          </h3>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormPanelOpen((current) => !current)}
              className="h-10 gap-2 border-white/10 text-slate-400"
            >
              {formPanelOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
              {formPanelOpen ? "Hide Form" : "Show Form"}
            </Button>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
              <Input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search members" className="h-10 border-white/10 bg-white/5 pl-9 text-white" />
            </div>
          </div>
        </div>

        {isAllMembers && (
          <div className="grid gap-3 border border-white/5 bg-[#0a0a0a] p-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Type</Label>
              <Select value={typeFilter} onValueChange={(value: "all" | BaeMemberType) => setTypeFilter(value)}>
                <SelectTrigger className="h-10 border-white/10 bg-white/5 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#0a0a0a] text-white">
                  <SelectItem value="all">All Types</SelectItem>
                  {memberTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Year</Label>
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="h-10 border-white/10 bg-white/5 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#0a0a0a] text-white">
                  <SelectItem value="all">All Years</SelectItem>
                  {memberYears.map((year) => (
                    <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-500">Status</Label>
              <Select value={statusFilter} onValueChange={(value: "all" | "visible" | "hidden") => setStatusFilter(value)}>
                <SelectTrigger className="h-10 border-white/10 bg-white/5 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#0a0a0a] text-white">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="visible">Visible</SelectItem>
                  <SelectItem value="hidden">Hidden</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {loading && (
          <div className="border border-white/5 bg-[#0a0a0a] py-16 text-center">
            <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-primary" />
            <p className="text-sm text-slate-500">Loading {title.toLowerCase()}...</p>
          </div>
        )}

        {!loading && filteredMembers.length === 0 && (
          <div className="border-2 border-dashed border-white/5 py-20 text-center">
            <p className="text-slate-600">No {title.toLowerCase()} found.</p>
          </div>
        )}

        {!loading && filteredMembers.length > 0 && (
          <>
          {isAllMembers && (
            <div className="flex flex-col gap-3 border border-white/5 bg-[#0a0a0a] p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-400">{selectedIds.length} selected</p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Select value={bulkMemberType} onValueChange={(value: BaeMemberType) => setBulkMemberType(value)}>
                  <SelectTrigger className="h-10 w-full border-white/10 bg-white/5 text-white sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-[#0a0a0a] text-white">
                    {memberTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" onClick={bulkUpdateMemberType} disabled={bulkSaving || selectedIds.length === 0} className="h-10 bg-primary font-bold text-white">
                  {bulkSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Selected Type"}
                </Button>
              </div>
            </div>
          )}
          <div className="overflow-x-auto rounded-lg border border-white/10 bg-[#0a0a0a]">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-white/[0.03] text-xs uppercase tracking-[0.18em] text-slate-500">
                <tr>
                  <th className="px-4 py-4">Personal Details</th>
                  <th className="px-4 py-4">Contact</th>
                  <th className="px-4 py-4">Username</th>
                  <th className="px-4 py-4">Password</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id || member.membership_number || member.name} className="border-t border-white/10 bg-white/[0.02] transition hover:bg-white/[0.05]">
                    <td className="px-4 py-4 align-top">
                      <div className="space-y-1">
                        <p className="font-semibold text-white">{member.name || "-"}</p>
                        <p className="text-xs text-slate-400">{member.name_with_initials || "-"}</p>
                        <p className="text-xs text-slate-500">
                          {[member.membership_type, member.membership_number, member.membership_year].filter(Boolean).join(" | ") || "-"}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top text-slate-400">
                      <div className="space-y-1">
                        <p>{member.email || "-"}</p>
                        <p>{member.contact_no || "-"}</p>
                        <p className="text-xs text-slate-500">{member.address || "-"}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top text-white">{member.username || "-"}</td>
                    <td className="px-4 py-4 align-top text-white">{member.password || "-"}</td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setForm(member)} className="rounded p-2 text-slate-400 transition hover:bg-white/10 hover:text-white">
                          <Pencil size={14} />
                        </button>
                        <button type="button" onClick={() => deleteMember(member)} disabled={deletingId === member.id} className="rounded p-2 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40">
                          {deletingId === member.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </>
        )}
      </div>
    </div>
  );
};

const BaeManager = () => {
  const [documents, setDocuments] = useState<DocumentForm[]>([]);
  const [form, setForm] = useState<DocumentForm>(emptyForm());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<"all" | BaeDocumentCategory>("all");
  const [introduction, setIntroduction] = useState("");
  const [savedIntroduction, setSavedIntroduction] = useState("");
  const [introductionEditing, setIntroductionEditing] = useState(false);
  const [savingIntroduction, setSavingIntroduction] = useState(false);

  const isEditing = Boolean(form.id);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await baeDocumentApi.list();
      setDocuments(data.map(normalizeDocument));
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not load BAE documents."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    baeSettingApi
      .show()
      .then((settings) => {
        setIntroduction(settings.introduction || "");
        setSavedIntroduction(settings.introduction || "");
      })
      .catch((err) => toast.error(getErrorMessage(err, "Could not load BAE introduction.")));
  }, []);

  const filteredDocuments = useMemo(
    () =>
      [...documents]
        .filter((item) => categoryFilter === "all" || item.category === categoryFilter)
        .sort((a, b) => a.sort_order - b.sort_order || b.uploaded_at.localeCompare(a.uploaded_at)),
    [categoryFilter, documents]
  );

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      toast.error("Document must be 4MB or smaller.");
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setForm((current) => ({
        ...current,
        file_name: file.name,
        file_src: dataUrl,
      }));
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not upload document."));
    }
  };

  const saveDocument = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.title.trim()) {
      toast.error("Document title is required.");
      return;
    }

    setSaving(true);
    try {
      if (form.id) {
        await baeDocumentApi.update(form.id, buildPayload(form));
      } else {
        await baeDocumentApi.create(buildPayload(form));
      }

      await fetchDocuments();
      setForm(emptyForm());
      toast.success(form.id ? "Document updated" : "Document added");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not save document."));
    } finally {
      setSaving(false);
    }
  };

  const deleteDocument = async (document: DocumentForm) => {
    if (!document.id || !confirm(`Delete ${document.title}?`)) return;

    setDeletingId(document.id);
    try {
      await baeDocumentApi.delete(document.id);
      await fetchDocuments();
      if (form.id === document.id) setForm(emptyForm());
      toast.success("Document deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete document."));
    } finally {
      setDeletingId(null);
    }
  };

  const saveIntroduction = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!introduction.trim()) {
      toast.error("Introduction is required.");
      return;
    }

    setSavingIntroduction(true);
    try {
      const updated = await baeSettingApi.update({ introduction: introduction.trim() });
      setIntroduction(updated.introduction);
      setSavedIntroduction(updated.introduction);
      setIntroductionEditing(false);
      toast.success("Introduction updated");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not update introduction."));
    } finally {
      setSavingIntroduction(false);
    }
  };

  return (
    <div className="min-w-0 space-y-8 pb-20">
      <header className="flex min-w-0 flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
              <GraduationCap className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Board of Architectural Education</p>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            BAE <span className="text-primary">Manager</span>
          </h2>
          <p className="mt-2 max-w-2xl text-slate-400">
            Manage Board of Architectural Education documents, student members, and graduate members.
          </p>
        </div>

        <Button type="button" variant="outline" onClick={fetchDocuments} disabled={loading} className="h-10 gap-2 rounded-xl border-white/10 text-slate-400">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </header>

      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList className="h-auto flex-wrap justify-start gap-2 border border-white/5 bg-[#0a0a0a] p-2">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="all-members">All Members</TabsTrigger>
          <TabsTrigger value="intro">Introduction</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="mt-0">
          <div className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)]">
            <Card className="border-white/5 bg-[#0a0a0a] p-4 sm:p-6 xl:sticky xl:top-28 xl:p-8">
              <h3 className="mb-6 flex items-center gap-3 text-lg font-bold text-white">
                {isEditing ? <Pencil className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
                {isEditing ? "Edit Document" : "Add Document"}
              </h3>

              <form onSubmit={saveDocument} className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Document Category</Label>
                  <Select value={form.category} onValueChange={(value: BaeDocumentCategory) => setForm((current) => ({ ...current, category: value }))}>
                    <SelectTrigger className="h-12 rounded-xl border-white/10 bg-white/5 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-[#0a0a0a] text-white">
                      {documentCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Title *</Label>
                  <Input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="h-12 rounded-xl border-white/10 bg-white/5 text-white" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Meta Label</Label>
                    <Input value={form.meta} onChange={(event) => setForm((current) => ({ ...current, meta: event.target.value }))} className="h-12 rounded-xl border-white/10 bg-white/5 text-white" placeholder="PDF, Notice, Form" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Uploaded Date</Label>
                    <Input type="date" value={form.uploaded_at} onChange={(event) => setForm((current) => ({ ...current, uploaded_at: event.target.value }))} className="h-12 rounded-xl border-white/10 bg-white/5 text-white" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Document File</Label>
                  {form.file_src ? (
                    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <FileText className="h-5 w-5 shrink-0 text-primary" />
                        <p className="truncate text-sm text-slate-300">{form.file_name || "Document file"}</p>
                      </div>
                      <Button type="button" variant="ghost" size="icon" onClick={() => setForm((current) => ({ ...current, file_name: "", file_src: "" }))} className="shrink-0 text-slate-500 hover:text-red-400">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] p-6 text-center transition-all hover:bg-white/[0.05]">
                      <Upload className="mb-2 h-6 w-6 text-slate-600" />
                      <p className="text-xs font-medium text-slate-500">Upload PDF or document up to 4MB</p>
                      <input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleFileChange} className="absolute inset-0 cursor-pointer opacity-0" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">External URL</Label>
                  <Input value={form.external_url} onChange={(event) => setForm((current) => ({ ...current, external_url: event.target.value }))} className="h-12 rounded-xl border-white/10 bg-white/5 text-white" placeholder="Optional external file/link" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Sort Order</Label>
                    <Input type="number" value={form.sort_order} onChange={(event) => setForm((current) => ({ ...current, sort_order: Number(event.target.value) || 0 }))} className="h-12 rounded-xl border-white/10 bg-white/5 text-white" />
                  </div>
                  <div className="flex items-center gap-3 pt-8">
                    <Switch checked={form.is_active} onCheckedChange={(value) => setForm((current) => ({ ...current, is_active: value }))} />
                    <Label className="text-sm text-slate-400">Publicly visible</Label>
                  </div>
                </div>

                <Button type="submit" disabled={saving} className="h-14 w-full rounded-2xl bg-primary font-bold text-white">
                  {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : isEditing ? "Update Document" : "Add Document"}
                </Button>
                {isEditing && (
                  <Button type="button" variant="ghost" onClick={() => setForm(emptyForm())} className="w-full text-slate-500">
                    Discard Edits
                  </Button>
                )}
              </form>
            </Card>

            <div className="min-w-0 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-xl font-bold text-white">Documents ({filteredDocuments.length})</h3>
                <Select value={categoryFilter} onValueChange={(value: "all" | BaeDocumentCategory) => setCategoryFilter(value)}>
                  <SelectTrigger className="h-10 w-full rounded-xl border-white/10 bg-white/5 text-white sm:w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-[#0a0a0a] text-white">
                    <SelectItem value="all">All Documents</SelectItem>
                    {documentCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {loading && (
                <div className="border border-white/5 bg-[#0a0a0a] py-16 text-center">
                  <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-primary" />
                  <p className="text-sm text-slate-500">Loading BAE documents...</p>
                </div>
              )}

              {!loading && filteredDocuments.length === 0 && (
                <div className="border-2 border-dashed border-white/5 py-20 text-center">
                  <p className="text-slate-600">No documents added yet.</p>
                </div>
              )}

              {!loading &&
                filteredDocuments.map((document) => (
                  <div key={document.id || `${document.category}-${document.title}`} className="border border-white/5 bg-[#0a0a0a] p-5">
                    <div className="flex gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                          {documentCategories.find((category) => category.value === document.category)?.label}
                        </p>
                        <h4 className="mt-2 text-lg font-bold text-white">{document.title}</h4>
                        <p className="mt-1 text-sm text-slate-500">{document.meta || "Document"} - {document.uploaded_at || "No date"}</p>
                        <p className={document.is_active ? "mt-3 text-xs font-bold text-emerald-400" : "mt-3 text-xs font-bold text-red-500/70"}>
                          {document.is_active ? "Visible" : "Hidden"} - Order {document.sort_order}
                        </p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <button type="button" onClick={() => setForm(document)} className="p-2 text-slate-500 transition-colors hover:bg-white/5 hover:text-white">
                          <Pencil size={14} />
                        </button>
                        <button type="button" onClick={() => deleteDocument(document)} disabled={deletingId === document.id} className="p-2 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-500 disabled:opacity-40">
                          {deletingId === document.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="all-members" className="mt-0">
          <SliaManager hideExtendedSections />
        </TabsContent>

        <TabsContent value="intro" className="mt-0">
          <Card className="border-white/5 bg-[#0a0a0a] p-4 sm:p-6 xl:p-8">
            <form onSubmit={saveIntroduction} className="space-y-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Introduction</h3>
                  <p className="mt-1 text-sm text-slate-500">This text appears on the public Board of Architectural Education page.</p>
                </div>
                {introductionEditing ? (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIntroduction(savedIntroduction);
                        setIntroductionEditing(false);
                      }}
                      disabled={savingIntroduction}
                      className="border-white/10 text-slate-400"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={savingIntroduction} className="bg-primary font-bold text-white">
                      {savingIntroduction ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                    </Button>
                  </div>
                ) : (
                  <Button type="button" variant="outline" onClick={() => setIntroductionEditing(true)} className="gap-2 border-white/10 text-slate-400">
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                )}
              </div>

              <Textarea
                value={introduction}
                onChange={(event) => setIntroduction(event.target.value)}
                readOnly={!introductionEditing}
                className={`min-h-[220px] border-white/10 ${
                  introductionEditing ? "bg-white/5 text-white" : "cursor-not-allowed bg-white/[0.03] text-slate-400"
                }`}
              />
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BaeManager;


