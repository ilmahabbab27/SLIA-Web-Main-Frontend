import { useCallback, useEffect, useMemo, useState } from "react";
import { BookOpen, FileText, Image as ImageIcon, Loader2, Pencil, Plus, RefreshCw, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { bapPublicationApi, bapSettingApi, type BapPublicationCategory, type BapPublicationItem } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const categories: Array<{ value: BapPublicationCategory; label: string }> = [
  { value: "the-architect", label: "The Architect" },
  { value: "vastu", label: "Vastu" },
  { value: "built-environment", label: "Built Environmental Journal" },
  { value: "now-architecture", label: "Now Architecture" },
  { value: "archive-journal", label: "Archive Journal" },
  { value: "year-book", label: "Architects Year Book" },
];

type PublicationForm = {
  id?: number;
  category: BapPublicationCategory;
  title: string;
  volume: string;
  uploaded_at: string;
  cover_src: string;
  file_name: string;
  file_src: string;
  external_url: string;
  is_active: boolean;
  sort_order: number;
};

const emptyForm = (): PublicationForm => ({
  category: "the-architect",
  title: "",
  volume: "",
  uploaded_at: new Date().toISOString().slice(0, 10),
  cover_src: "",
  file_name: "",
  file_src: "",
  external_url: "",
  is_active: true,
  sort_order: 0,
});

const normalizePublication = (item: BapPublicationItem): PublicationForm => ({
  id: item.id,
  category: item.category,
  title: item.title || "",
  volume: item.volume || "",
  uploaded_at: item.uploaded_at || new Date().toISOString().slice(0, 10),
  cover_src: item.cover_src || "",
  file_name: item.file_name || "",
  file_src: item.file_src || "",
  external_url: item.external_url || "",
  is_active: item.is_active,
  sort_order: item.sort_order || 0,
});

const buildPayload = (form: PublicationForm): Omit<BapPublicationItem, "id" | "created_at" | "updated_at"> => ({
  category: form.category,
  title: form.title.trim(),
  volume: form.volume.trim(),
  uploaded_at: form.uploaded_at,
  cover_src: form.cover_src,
  file_name: form.file_name.trim(),
  file_src: form.file_src,
  external_url: form.external_url.trim(),
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

const BapManager = () => {
  const [introduction, setIntroduction] = useState("");
  const [savedIntroduction, setSavedIntroduction] = useState("");
  const [introductionEditing, setIntroductionEditing] = useState(false);
  const [items, setItems] = useState<PublicationForm[]>([]);
  const [form, setForm] = useState<PublicationForm>(emptyForm());
  const [loading, setLoading] = useState(true);
  const [savingIntro, setSavingIntro] = useState(false);
  const [savingPublication, setSavingPublication] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<"all" | BapPublicationCategory>("all");

  const isEditingPublication = Boolean(form.id);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [settings, publications] = await Promise.all([bapSettingApi.show(), bapPublicationApi.list()]);
      setIntroduction(settings.introduction || "");
      setSavedIntroduction(settings.introduction || "");
      setIntroductionEditing(false);
      setItems(publications.map(normalizePublication));
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not load BAP manager data."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredItems = useMemo(
    () =>
      [...items]
        .filter((item) => categoryFilter === "all" || item.category === categoryFilter)
        .sort((a, b) => a.sort_order - b.sort_order || b.uploaded_at.localeCompare(a.uploaded_at)),
    [categoryFilter, items]
  );

  const saveIntroduction = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!introduction.trim()) {
      toast.error("Introduction is required.");
      return;
    }

    setSavingIntro(true);
    try {
      const updated = await bapSettingApi.update({ introduction: introduction.trim() });
      setIntroduction(updated.introduction);
      setSavedIntroduction(updated.introduction);
      setIntroductionEditing(false);
      toast.success("BAP introduction updated");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not update introduction."));
    } finally {
      setSavingIntro(false);
    }
  };

  const cancelIntroductionEdit = () => {
    setIntroduction(savedIntroduction);
    setIntroductionEditing(false);
  };

  const handleCoverChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Cover image must be 2MB or smaller.");
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setForm((current) => ({ ...current, cover_src: dataUrl }));
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not upload cover image."));
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      toast.error("Publication file must be 4MB or smaller.");
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setForm((current) => ({ ...current, file_name: file.name, file_src: dataUrl }));
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not upload publication file."));
    }
  };

  const savePublication = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Publication title is required.");
      return;
    }

    setSavingPublication(true);
    try {
      if (form.id) {
        await bapPublicationApi.update(form.id, buildPayload(form));
      } else {
        await bapPublicationApi.create(buildPayload(form));
      }

      await fetchData();
      setForm(emptyForm());
      toast.success(form.id ? "Publication updated" : "Publication added");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not save publication."));
    } finally {
      setSavingPublication(false);
    }
  };

  const editPublication = (item: PublicationForm) => {
    setForm(item);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deletePublication = async (item: PublicationForm) => {
    if (!item.id || !confirm(`Delete ${item.title}?`)) return;

    setDeletingId(item.id);
    try {
      await bapPublicationApi.delete(item.id);
      await fetchData();
      if (form.id === item.id) setForm(emptyForm());
      toast.success("Publication deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete publication."));
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
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Board of Architectural Publications</p>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            BAP <span className="text-primary">Manager</span>
          </h2>
          <p className="mt-2 max-w-2xl text-slate-400">
            Manage the BAP introduction and publication downloads shown on the Publications and BAP pages.
          </p>
        </div>

        <Button type="button" variant="outline" onClick={fetchData} disabled={loading} className="h-10 gap-2 rounded-xl border-white/10 text-slate-400">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </header>

      <Card className="border-white/5 bg-[#0a0a0a] p-4 sm:p-6 xl:p-8">
        <form onSubmit={saveIntroduction} className="space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Introduction</h3>
              <p className="mt-1 text-sm text-slate-500">Locked by default. Click Edit to update the public introduction.</p>
            </div>
            <div className="flex gap-2">
              {introductionEditing ? (
                <>
                  <Button type="button" variant="outline" onClick={cancelIntroductionEdit} disabled={savingIntro} className="rounded-xl border-white/10 text-slate-400">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={savingIntro} className="rounded-xl bg-primary font-bold text-white">
                    {savingIntro ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                  </Button>
                </>
              ) : (
                <Button type="button" variant="outline" onClick={() => setIntroductionEditing(true)} className="gap-2 rounded-xl border-white/10 text-slate-400">
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>
          </div>
          <Textarea
            value={introduction}
            onChange={(event) => setIntroduction(event.target.value)}
            readOnly={!introductionEditing}
            className={`min-h-[140px] rounded-xl border-white/10 ${
              introductionEditing ? "bg-white/5 text-white" : "cursor-not-allowed bg-white/[0.03] text-slate-400"
            }`}
          />
        </form>
      </Card>

      <div className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)]">
        <Card className="border-white/5 bg-[#0a0a0a] p-4 sm:p-6 xl:sticky xl:top-28 xl:p-8">
          <h3 className="mb-6 flex items-center gap-3 text-lg font-bold text-white">
            {isEditingPublication ? <Pencil className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
            {isEditingPublication ? "Edit Publication" : "Add Publication"}
          </h3>

          <form onSubmit={savePublication} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Category</Label>
              <Select value={form.category} onValueChange={(value: BapPublicationCategory) => setForm((current) => ({ ...current, category: value }))}>
                <SelectTrigger className="h-12 rounded-xl border-white/10 bg-white/5 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#0a0a0a] text-white">
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Title *</Label>
                <Input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="h-12 rounded-xl border-white/10 bg-white/5 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Volume</Label>
                <Input value={form.volume} onChange={(event) => setForm((current) => ({ ...current, volume: event.target.value }))} className="h-12 rounded-xl border-white/10 bg-white/5 text-white" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Uploaded Date</Label>
                <Input type="date" value={form.uploaded_at} onChange={(event) => setForm((current) => ({ ...current, uploaded_at: event.target.value }))} className="h-12 rounded-xl border-white/10 bg-white/5 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Sort Order</Label>
                <Input type="number" value={form.sort_order} onChange={(event) => setForm((current) => ({ ...current, sort_order: Number(event.target.value) || 0 }))} className="h-12 rounded-xl border-white/10 bg-white/5 text-white" />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Cover Image</Label>
              <div className="flex items-center gap-4">
                <div className="flex h-28 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
                  {form.cover_src ? <img src={form.cover_src} alt="Cover preview" className="h-full w-full object-cover" /> : <ImageIcon className="h-7 w-7 text-slate-600" />}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" className="relative gap-2 overflow-hidden rounded-xl border-white/10 text-slate-400">
                    <Upload className="h-4 w-4" />
                    Upload Cover
                    <input type="file" accept="image/*" onChange={handleCoverChange} className="absolute inset-0 cursor-pointer opacity-0" />
                  </Button>
                  {form.cover_src && (
                    <Button type="button" variant="ghost" onClick={() => setForm((current) => ({ ...current, cover_src: "" }))} className="gap-2 rounded-xl text-red-400">
                      <X className="h-4 w-4" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Publication File</Label>
              {form.file_src ? (
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <FileText className="h-5 w-5 shrink-0 text-primary" />
                    <p className="truncate text-sm text-slate-300">{form.file_name || "Publication file"}</p>
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
              <Input value={form.external_url} onChange={(event) => setForm((current) => ({ ...current, external_url: event.target.value }))} className="h-12 rounded-xl border-white/10 bg-white/5 text-white" placeholder="Optional link if no file is uploaded" />
            </div>

            <div className="flex items-center gap-3 py-2">
              <Switch checked={form.is_active} onCheckedChange={(value) => setForm((current) => ({ ...current, is_active: value }))} />
              <Label className="text-sm text-slate-400">Publicly visible</Label>
            </div>

            <Button type="submit" disabled={savingPublication} className="h-14 w-full rounded-2xl bg-primary font-bold text-white">
              {savingPublication ? <Loader2 className="h-5 w-5 animate-spin" /> : isEditingPublication ? "Update Publication" : "Add Publication"}
            </Button>
            {isEditingPublication && (
              <Button type="button" variant="ghost" onClick={() => setForm(emptyForm())} className="w-full text-slate-500">
                Discard Edits
              </Button>
            )}
          </form>
        </Card>

        <div className="min-w-0 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-xl font-bold text-white">Publications ({filteredItems.length})</h3>
            <Select value={categoryFilter} onValueChange={(value: "all" | BapPublicationCategory) => setCategoryFilter(value)}>
              <SelectTrigger className="h-10 w-full rounded-xl border-white/10 bg-white/5 text-white sm:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-[#0a0a0a] text-white">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
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
              <p className="text-sm text-slate-500">Loading BAP publications...</p>
            </div>
          )}

          {!loading && filteredItems.length === 0 && (
            <div className="border-2 border-dashed border-white/5 py-20 text-center">
              <p className="text-slate-600">No publications added yet.</p>
            </div>
          )}

          {!loading &&
            filteredItems.map((item) => (
              <div key={item.id || `${item.category}-${item.title}`} className="border border-white/5 bg-[#0a0a0a] p-5">
                <div className="flex gap-4">
                  <div className="flex h-24 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
                    {item.cover_src ? <img src={item.cover_src} alt={`${item.title} cover`} className="h-full w-full object-cover" /> : <ImageIcon className="h-6 w-6 text-slate-600" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                      {categories.find((category) => category.value === item.category)?.label}
                    </p>
                    <h4 className="mt-2 text-lg font-bold text-white">{item.title}</h4>
                    <p className="mt-1 text-sm text-slate-500">{item.volume || "No volume"} · {item.uploaded_at || "No date"}</p>
                    <p className={item.is_active ? "mt-3 text-xs font-bold text-emerald-400" : "mt-3 text-xs font-bold text-red-500/70"}>
                      {item.is_active ? "Visible" : "Hidden"} · Order {item.sort_order}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button type="button" onClick={() => editPublication(item)} className="p-2 text-slate-500 transition-colors hover:bg-white/5 hover:text-white">
                      <Pencil size={14} />
                    </button>
                    <button type="button" onClick={() => deletePublication(item)} disabled={deletingId === item.id} className="p-2 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-500 disabled:opacity-40">
                      {deletingId === item.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default BapManager;
