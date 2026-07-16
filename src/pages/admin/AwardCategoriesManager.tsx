import { useCallback, useEffect, useMemo, useState } from "react";
import { Award, FileText, Loader2, Pencil, Plus, RefreshCw, Search, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { awardCategoryApi, awardSettingApi, type AwardCategoryItem } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type AwardCategoryForm = {
  id?: number;
  year: string;
  name: string;
  description: string;
  guideline: string;
  guideline_attachment_name: string;
  guideline_attachment: string;
  general_guideline: string;
  sort_order: number;
  is_active: boolean;
};

const defaultGeneralGuideline =
  "SLIA's Architectural Awards are the most prominent Awards in Sri Lanka simply because selection is by a renowned panel of Jurors, a Technical Evaluation Committee and an International Juror who is familiar with local Architecture and who recognizes and acknowledges excellence in Architecture by physically visiting all shortlisted projects island-wide is the key feature of this most outstanding award scheme.\n\nThe scrutiny and strict contingent evaluation and anonymous marking process ensure a very contingent selection process to recognize Architecture during the short listing phase. Additionally, the subsequent physical visits to all sites further enhances credentials and credibility to recognize the high standards in Architecture and is the pride of SLIA's legendary Awards Scheme.";

const emptyForm = (): AwardCategoryForm => ({
  year: new Date().getFullYear().toString(),
  name: "",
  description: "",
  guideline: "",
  guideline_attachment_name: "",
  guideline_attachment: "",
  general_guideline: defaultGeneralGuideline,
  sort_order: 0,
  is_active: true,
});

const emptyFormForYear = (year: string): AwardCategoryForm => ({
  ...emptyForm(),
  year: year || new Date().getFullYear().toString(),
});

const normalizeAwardCategory = (item: AwardCategoryItem): AwardCategoryForm => ({
  id: item.id,
  year: item.year || new Date().getFullYear().toString(),
  name: item.name || "",
  description: item.description || "",
  guideline: item.guideline || "",
  guideline_attachment_name: item.guideline_attachment_name || "",
  guideline_attachment: item.guideline_attachment || "",
  general_guideline: item.general_guideline || "",
  sort_order: item.sort_order || 0,
  is_active: item.is_active,
});

const buildPayload = (form: AwardCategoryForm): Omit<AwardCategoryItem, "id" | "created_at" | "updated_at"> => ({
  year: form.year.trim(),
  name: form.name.trim(),
  description: form.description.trim(),
  guideline: form.guideline.trim(),
  guideline_attachment_name: form.guideline_attachment_name.trim(),
  guideline_attachment: form.guideline_attachment,
  general_guideline: form.general_guideline.trim(),
  sort_order: form.sort_order,
  is_active: form.is_active,
});

const getErrorMessage = (err: unknown, fallback: string) =>
  err instanceof Error && err.message ? err.message : fallback;

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read attachment."));
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });

const AwardCategoriesManager = () => {
  const [items, setItems] = useState<AwardCategoryForm[]>([]);
  const [form, setForm] = useState<AwardCategoryForm>(emptyForm());
  const [settings, setSettings] = useState({
    year: new Date().getFullYear().toString(),
    general_guideline: defaultGeneralGuideline,
  });
  const [savedSettings, setSavedSettings] = useState({
    year: new Date().getFullYear().toString(),
    general_guideline: defaultGeneralGuideline,
  });
  const [settingsEditing, setSettingsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "visible" | "hidden">("all");

  const isEditing = Boolean(form.id);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const [data, awardSettings] = await Promise.all([
        awardCategoryApi.list(),
        awardSettingApi.show(),
      ]);
      const nextSettings = {
        year: awardSettings.year || new Date().getFullYear().toString(),
        general_guideline: awardSettings.general_guideline || defaultGeneralGuideline,
      };
      setItems(data.map(normalizeAwardCategory));
      setSettings(nextSettings);
      setSavedSettings(nextSettings);
      setSettingsEditing(false);
      setForm((current) =>
        current.id || current.name || current.description || current.guideline
          ? current
          : emptyFormForYear(nextSettings.year)
      );
    } catch (err) {
      setItems([]);
      toast.error(getErrorMessage(err, "Could not load award categories."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const availableYears = useMemo(
    () => [...new Set(items.map((item) => item.year).filter(Boolean))].sort((a, b) => Number(b) - Number(a)),
    [items]
  );

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return [...items]
      .sort((a, b) => Number(b.year) - Number(a.year) || a.sort_order - b.sort_order || a.name.localeCompare(b.name))
      .filter((item) => yearFilter === "all" || item.year === yearFilter)
      .filter((item) => {
        if (statusFilter === "visible") return item.is_active;
        if (statusFilter === "hidden") return !item.is_active;
        return true;
      })
      .filter((item) => {
        if (!query) return true;
        return [item.year, item.name, item.description, item.guideline, item.general_guideline]
          .join(" ")
          .toLowerCase()
          .includes(query);
      });
  }, [items, searchQuery, statusFilter, yearFilter]);

  const resetForm = () => setForm(emptyFormForYear(settings.year));

  const handleAttachmentChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const maxSize = 6 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Attachment must be 6MB or smaller.");
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setForm((current) => ({
        ...current,
        guideline_attachment_name: file.name,
        guideline_attachment: dataUrl,
      }));
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not attach guideline file."));
    }
  };

  const removeAttachment = () => {
    setForm((current) => ({
      ...current,
      guideline_attachment_name: "",
      guideline_attachment: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.year.trim()) {
      toast.error("Award year is required.");
      return;
    }

    if (!form.name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    setSaving(true);
    try {
      if (form.id) {
        await awardCategoryApi.update(form.id, buildPayload(form));
      } else {
        await awardCategoryApi.create(buildPayload(form));
      }

      await fetchItems();
      toast.success(form.id ? "Award category updated" : "Award category added");
      resetForm();
    } catch (err) {
      toast.error(getErrorMessage(err, "Save failed."));
    } finally {
      setSaving(false);
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!settings.year.trim()) {
      toast.error("General award year is required.");
      return;
    }

    if (!settings.general_guideline.trim()) {
      toast.error("General guideline is required.");
      return;
    }

    setSavingSettings(true);
    try {
      const updated = await awardSettingApi.update({
        year: settings.year.trim(),
        general_guideline: settings.general_guideline.trim(),
      });
      const nextSettings = {
        year: updated.year,
        general_guideline: updated.general_guideline,
      };
      setSettings(nextSettings);
      setSavedSettings(nextSettings);
      setSettingsEditing(false);
      setForm((current) =>
        current.id || current.name || current.description || current.guideline
          ? current
          : emptyFormForYear(nextSettings.year)
      );
      toast.success("General awards settings updated");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not update award settings."));
    } finally {
      setSavingSettings(false);
    }
  };

  const cancelSettingsEdit = () => {
    setSettings(savedSettings);
    setSettingsEditing(false);
  };

  const handleEdit = (item: AwardCategoryForm) => {
    setForm(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (item: AwardCategoryForm) => {
    if (!item.id || !confirm(`Delete ${item.name}?`)) return;

    setDeletingId(item.id);
    try {
      await awardCategoryApi.delete(item.id);
      await fetchItems();
      if (form.id === item.id) resetForm();
      toast.success("Award category deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Delete failed."));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-w-0 space-y-8 pb-20">
      <header className="flex min-w-0 flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
              <Award className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Awards Scheme</p>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Award <span className="text-primary">Categories</span>
          </h2>
          <p className="mt-2 max-w-2xl text-slate-400">
            Manage award years, category descriptions, category guidelines, and the general awards guideline.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={fetchItems}
          disabled={loading}
          className="h-10 w-full gap-2 rounded-xl border-white/10 px-4 text-slate-400 sm:w-auto"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </header>

      <Card className="border-white/5 bg-[#0a0a0a] p-4 sm:p-6 xl:p-8">
        <form onSubmit={handleSettingsSubmit} className="space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">General Awards Settings</h3>
              <p className="mt-1 text-sm text-slate-500">
                These values stay locked until you click Edit.
              </p>
            </div>
            <div className="flex gap-2">
              {settingsEditing ? (
                <>
                  <Button type="button" variant="outline" onClick={cancelSettingsEdit} disabled={savingSettings} className="rounded-xl border-white/10 text-slate-400">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={savingSettings} className="rounded-xl bg-primary font-bold text-white">
                    {savingSettings ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                  </Button>
                </>
              ) : (
                <Button type="button" variant="outline" onClick={() => setSettingsEditing(true)} className="gap-2 rounded-xl border-white/10 text-slate-400">
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-[220px_minmax(0,1fr)]">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">General Award Year</Label>
            <Input
              value={settings.year}
              readOnly={!settingsEditing}
              onChange={(e) => setSettings((current) => ({ ...current, year: e.target.value }))}
              className={`h-12 rounded-xl border-white/10 ${
                settingsEditing ? "bg-white/5 text-white" : "cursor-not-allowed bg-white/[0.03] text-slate-400"
              }`}
              placeholder="2026"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">General Guideline / Page Description</Label>
            <Textarea
              value={settings.general_guideline}
              readOnly={!settingsEditing}
              onChange={(e) => setSettings((current) => ({ ...current, general_guideline: e.target.value }))}
              className={`min-h-[120px] rounded-xl border-white/10 ${
                settingsEditing ? "bg-white/5 text-white" : "cursor-not-allowed bg-white/[0.03] text-slate-400"
              }`}
              placeholder="Main awards description shown at the top of the awards page"
            />
          </div>
          </div>
        </form>
      </Card>

      <div className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)]">
        <Card className="border-white/5 bg-[#0a0a0a] p-4 sm:p-6 xl:sticky xl:top-28 xl:p-8">
          <h3 className="mb-6 flex items-center gap-3 text-lg font-bold text-white">
            {isEditing ? <Pencil className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
            {isEditing ? "Edit Category" : "Add Category"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Award Year *</Label>
                <Input
                  value={form.year}
                  onChange={(e) => setForm((current) => ({ ...current, year: e.target.value }))}
                  className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
                  placeholder="2026"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Sort Order</Label>
                <Input
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => setForm((current) => ({ ...current, sort_order: Number(e.target.value) || 0 }))}
                  className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Category Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))}
                className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
                placeholder="Design Awards"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
                className="min-h-[95px] rounded-xl border-white/10 bg-white/5 text-white"
                placeholder="Short category description shown on the awards page"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Category Guideline</Label>
              <Textarea
                value={form.guideline}
                onChange={(e) => setForm((current) => ({ ...current, guideline: e.target.value }))}
                className="min-h-[120px] rounded-xl border-white/10 bg-white/5 text-white"
                placeholder="Eligibility, required documents, or judging notes for this category"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Guideline Attachment</Label>
              {form.guideline_attachment ? (
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <FileText className="h-5 w-5 shrink-0 text-primary" />
                    <p className="truncate text-sm font-medium text-slate-300">
                      {form.guideline_attachment_name || "Guideline attachment"}
                    </p>
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={removeAttachment} className="shrink-0 text-slate-500 hover:text-red-400">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] p-6 text-center transition-all hover:bg-white/[0.05]">
                  <Upload className="mb-2 h-6 w-6 text-slate-600" />
                  <p className="text-xs font-medium text-slate-500">Attach PDF, DOC, DOCX, or image up to 6MB</p>
                  <input
                    type="file"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleAttachmentChange}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">General Guideline</Label>
              <Textarea
                value={form.general_guideline}
                onChange={(e) => setForm((current) => ({ ...current, general_guideline: e.target.value }))}
                className="min-h-[170px] rounded-xl border-white/10 bg-white/5 text-white"
                placeholder="General awards guideline for this award year"
              />
            </div>

            <div className="flex items-center gap-3 py-2">
              <Switch
                checked={form.is_active}
                onCheckedChange={(value) => setForm((current) => ({ ...current, is_active: value }))}
              />
              <Label className="text-sm text-slate-400">Publicly visible</Label>
            </div>

            <Button type="submit" disabled={saving} className="h-14 w-full rounded-2xl bg-primary font-bold text-white">
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : isEditing ? "Update Category" : "Add Category"}
            </Button>
            {isEditing && (
              <Button type="button" variant="ghost" onClick={resetForm} className="w-full text-slate-500">
                Discard Edits
              </Button>
            )}
          </form>
        </Card>

        <div className="min-w-0 space-y-4">
          <h3 className="flex items-center justify-between px-1 text-xl font-bold text-white">
            Categories
            <span className="text-sm font-normal text-slate-500">({filteredItems.length})</span>
          </h3>

          <div className="grid gap-3 border border-white/5 bg-[#0a0a0a] p-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 rounded-xl border-white/10 bg-white/5 pl-9 text-white placeholder:text-slate-600"
                placeholder="Search categories"
              />
            </div>

            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="h-10 rounded-xl border-white/10 bg-white/5 text-white">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-[#0a0a0a] text-white">
                <SelectItem value="all">All Years</SelectItem>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(value: "all" | "visible" | "hidden") => setStatusFilter(value)}>
              <SelectTrigger className="h-10 rounded-xl border-white/10 bg-white/5 text-white">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-[#0a0a0a] text-white">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="visible">Visible</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading && (
            <div className="border border-white/5 bg-[#0a0a0a] py-16 text-center">
              <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-primary" />
              <p className="text-sm text-slate-500">Loading award categories...</p>
            </div>
          )}

          {!loading && filteredItems.length === 0 && (
            <div className="border-2 border-dashed border-white/5 py-20 text-center">
              <p className="text-slate-600">No award categories match these filters.</p>
            </div>
          )}

          {!loading &&
            filteredItems.map((item) => (
              <div key={item.id || `${item.year}-${item.name}`} className="border border-white/5 bg-[#0a0a0a] p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{item.year}</p>
                    <h4 className="mt-2 text-lg font-bold text-white">{item.name}</h4>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-500">{item.description || "No description added"}</p>
                    <p className={item.is_active ? "mt-3 text-xs font-bold text-emerald-400" : "mt-3 text-xs font-bold text-red-500/70"}>
                      {item.is_active ? "Visible" : "Hidden"} · Order {item.sort_order}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      disabled={saving || deletingId === item.id}
                      aria-label={`Edit ${item.name}`}
                      className="p-2 text-slate-500 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      disabled={saving || deletingId === item.id}
                      aria-label={`Delete ${item.name}`}
                      className="p-2 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {deletingId === item.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>

                {item.guideline && (
                  <div className="mt-4 border-t border-white/5 pt-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Guideline</p>
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-400">{item.guideline}</p>
                  </div>
                )}

                {item.guideline_attachment && (
                  <div className="mt-4 flex items-center gap-2 border-t border-white/5 pt-4 text-sm text-slate-400">
                    <FileText className="h-4 w-4 text-primary" />
                    <span className="truncate">{item.guideline_attachment_name || "Guideline attachment"}</span>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AwardCategoriesManager;
