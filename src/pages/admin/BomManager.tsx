import { useCallback, useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, Image as ImageIcon, Loader2, Pencil, Plus, RefreshCw, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { bomItemApi, bomSettingApi, type BomItem, type BomItemCategory } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const categories: Array<{ value: BomItemCategory; label: string }> = [
  { value: "programs", label: "Programs & Workshops" },
  { value: "slapm", label: "SLAPM" },
  { value: "slaud", label: "SLAUD" },
  { value: "slaia", label: "SLAIA" },
  { value: "slaac", label: "SLAAC" },
];

type BomForm = {
  id?: number;
  category: BomItemCategory;
  title: string;
  description: string;
  event_date: string;
  image: string;
  link: string;
  is_active: boolean;
  sort_order: number;
};

const emptyForm = (): BomForm => ({
  category: "programs",
  title: "",
  description: "",
  event_date: "",
  image: "",
  link: "",
  is_active: true,
  sort_order: 0,
});

const normalizeItem = (item: BomItem): BomForm => ({
  id: item.id,
  category: item.category,
  title: item.title || "",
  description: item.description || "",
  event_date: item.event_date || "",
  image: item.image || "",
  link: item.link || "",
  is_active: item.is_active,
  sort_order: item.sort_order || 0,
});

const buildPayload = (form: BomForm): Omit<BomItem, "id" | "created_at" | "updated_at"> => ({
  category: form.category,
  title: form.title.trim(),
  description: form.description.trim(),
  event_date: form.event_date,
  image: form.image,
  link: form.link.trim(),
  is_active: form.is_active,
  sort_order: form.sort_order,
});

const getErrorMessage = (err: unknown, fallback: string) =>
  err instanceof Error && err.message ? err.message : fallback;

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read selected image."));
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });

const BomManager = () => {
  const [intro, setIntro] = useState({
    introduction_title: "Board of Management",
    introduction: "The Board of Management oversees strategic direction, programs, and professional associations.",
    focus_points: [
      "Governance and institutional strategy",
      "Professional development programs",
      "Collaboration with associations",
      "Operational oversight and planning",
    ],
  });
  const [savedIntro, setSavedIntro] = useState(intro);
  const [introEditing, setIntroEditing] = useState(false);
  const [items, setItems] = useState<BomForm[]>([]);
  const [form, setForm] = useState<BomForm>(emptyForm());
  const [loading, setLoading] = useState(true);
  const [savingIntro, setSavingIntro] = useState(false);
  const [savingItem, setSavingItem] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<"all" | BomItemCategory>("all");

  const isEditingItem = Boolean(form.id);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [settings, bomItems] = await Promise.all([bomSettingApi.show(), bomItemApi.list()]);
      const nextIntro = {
        introduction_title: settings.introduction_title || "Board of Management",
        introduction: settings.introduction || "",
        focus_points: settings.focus_points?.length ? settings.focus_points : [],
      };
      setIntro(nextIntro);
      setSavedIntro(nextIntro);
      setIntroEditing(false);
      setItems(bomItems.map(normalizeItem));
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not load BOM manager data."));
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
        .sort((a, b) => a.sort_order - b.sort_order || a.title.localeCompare(b.title)),
    [categoryFilter, items]
  );

  const saveIntroduction = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!intro.introduction_title.trim() || !intro.introduction.trim()) {
      toast.error("Introduction title and description are required.");
      return;
    }

    setSavingIntro(true);
    try {
      const updated = await bomSettingApi.update({
        introduction_title: intro.introduction_title.trim(),
        introduction: intro.introduction.trim(),
        focus_points: intro.focus_points.map((point) => point.trim()).filter(Boolean),
      });
      const nextIntro = {
        introduction_title: updated.introduction_title,
        introduction: updated.introduction,
        focus_points: updated.focus_points || [],
      };
      setIntro(nextIntro);
      setSavedIntro(nextIntro);
      setIntroEditing(false);
      toast.success("BOM introduction updated");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not update introduction."));
    } finally {
      setSavingIntro(false);
    }
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be 2MB or smaller.");
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setForm((current) => ({ ...current, image: dataUrl }));
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not upload image."));
    }
  };

  const saveItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim()) {
      toast.error("Title is required.");
      return;
    }

    setSavingItem(true);
    try {
      if (form.id) {
        await bomItemApi.update(form.id, buildPayload(form));
      } else {
        await bomItemApi.create(buildPayload(form));
      }

      await fetchData();
      setForm(emptyForm());
      toast.success(form.id ? "BOM item updated" : "BOM item added");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not save BOM item."));
    } finally {
      setSavingItem(false);
    }
  };

  const deleteItem = async (item: BomForm) => {
    if (!item.id || !confirm(`Delete ${item.title}?`)) return;

    setDeletingId(item.id);
    try {
      await bomItemApi.delete(item.id);
      await fetchData();
      if (form.id === item.id) setForm(emptyForm());
      toast.success("BOM item deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete BOM item."));
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
              <BriefcaseBusiness className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Board of Management</p>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            BOM <span className="text-primary">Manager</span>
          </h2>
          <p className="mt-2 max-w-2xl text-slate-400">
            Manage the Board of Management introduction, programs, and professional association entries.
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
              {introEditing ? (
                <>
                  <Button type="button" variant="outline" onClick={() => { setIntro(savedIntro); setIntroEditing(false); }} disabled={savingIntro} className="rounded-xl border-white/10 text-slate-400">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={savingIntro} className="rounded-xl bg-primary font-bold text-white">
                    {savingIntro ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                  </Button>
                </>
              ) : (
                <Button type="button" variant="outline" onClick={() => setIntroEditing(true)} className="gap-2 rounded-xl border-white/10 text-slate-400">
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Title</Label>
              <Input
                value={intro.introduction_title}
                onChange={(event) => setIntro((current) => ({ ...current, introduction_title: event.target.value }))}
                readOnly={!introEditing}
                className={`h-12 rounded-xl border-white/10 ${introEditing ? "bg-white/5 text-white" : "cursor-not-allowed bg-white/[0.03] text-slate-400"}`}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Description</Label>
              <Textarea
                value={intro.introduction}
                onChange={(event) => setIntro((current) => ({ ...current, introduction: event.target.value }))}
                readOnly={!introEditing}
                className={`min-h-[120px] rounded-xl border-white/10 ${introEditing ? "bg-white/5 text-white" : "cursor-not-allowed bg-white/[0.03] text-slate-400"}`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Focus Points</Label>
            <Textarea
              value={intro.focus_points.join("\n")}
              onChange={(event) => setIntro((current) => ({ ...current, focus_points: event.target.value.split("\n") }))}
              readOnly={!introEditing}
              className={`min-h-[120px] rounded-xl border-white/10 ${introEditing ? "bg-white/5 text-white" : "cursor-not-allowed bg-white/[0.03] text-slate-400"}`}
              placeholder="One focus point per line"
            />
          </div>
        </form>
      </Card>

      <div className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)]">
        <Card className="border-white/5 bg-[#0a0a0a] p-4 sm:p-6 xl:sticky xl:top-28 xl:p-8">
          <h3 className="mb-6 flex items-center gap-3 text-lg font-bold text-white">
            {form.id ? <Pencil className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
            {form.id ? "Edit Entry" : "Add Entry"}
          </h3>

          <form onSubmit={saveItem} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Category</Label>
              <Select value={form.category} onValueChange={(value: BomItemCategory) => setForm((current) => ({ ...current, category: value }))}>
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

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Title *</Label>
              <Input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} className="h-12 rounded-xl border-white/10 bg-white/5 text-white" />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Description</Label>
              <Textarea value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} className="min-h-[120px] rounded-xl border-white/10 bg-white/5 text-white" />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Date</Label>
              <Input
                type="date"
                value={form.event_date}
                onChange={(event) => setForm((current) => ({ ...current, event_date: event.target.value }))}
                className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Image</Label>
              <div className="flex items-center gap-4">
                <div className="flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
                  {form.image ? <img src={form.image} alt="Entry preview" className="h-full w-full object-cover" /> : <ImageIcon className="h-7 w-7 text-slate-600" />}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" className="relative gap-2 overflow-hidden rounded-xl border-white/10 text-slate-400">
                    <Upload className="h-4 w-4" />
                    Upload Image
                    <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 cursor-pointer opacity-0" />
                  </Button>
                  {form.image && (
                    <Button type="button" variant="ghost" onClick={() => setForm((current) => ({ ...current, image: "" }))} className="gap-2 rounded-xl text-red-400">
                      <X className="h-4 w-4" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">External Link</Label>
                <Input
                  value={form.link}
                  onChange={(event) => setForm((current) => ({ ...current, link: event.target.value }))}
                  className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
                  placeholder="https://example.com"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Sort Order</Label>
                <Input type="number" value={form.sort_order} onChange={(event) => setForm((current) => ({ ...current, sort_order: Number(event.target.value) || 0 }))} className="h-12 rounded-xl border-white/10 bg-white/5 text-white" />
              </div>
            </div>

            <div className="flex items-center gap-3 py-2">
              <Switch checked={form.is_active} onCheckedChange={(value) => setForm((current) => ({ ...current, is_active: value }))} />
              <Label className="text-sm text-slate-400">Publicly visible</Label>
            </div>

            <Button type="submit" disabled={savingItem} className="h-14 w-full rounded-2xl bg-primary font-bold text-white">
              {savingItem ? <Loader2 className="h-5 w-5 animate-spin" /> : form.id ? "Update Entry" : "Add Entry"}
            </Button>
            {form.id && (
              <Button type="button" variant="ghost" onClick={() => setForm(emptyForm())} className="w-full text-slate-500">
                Discard Edits
              </Button>
            )}
          </form>
        </Card>

        <div className="min-w-0 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-xl font-bold text-white">Entries ({filteredItems.length})</h3>
            <Select value={categoryFilter} onValueChange={(value: "all" | BomItemCategory) => setCategoryFilter(value)}>
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
              <p className="text-sm text-slate-500">Loading BOM entries...</p>
            </div>
          )}

          {!loading && filteredItems.length === 0 && (
            <div className="border-2 border-dashed border-white/5 py-20 text-center">
              <p className="text-slate-600">No BOM entries added yet.</p>
            </div>
          )}

          {!loading &&
            filteredItems.map((item) => (
              <div key={item.id || `${item.category}-${item.title}`} className="border border-white/5 bg-[#0a0a0a] p-5">
                <div className="flex gap-4">
                  <div className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
                    {item.image ? <img src={item.image} alt={item.title} className="h-full w-full object-cover" /> : <ImageIcon className="h-6 w-6 text-slate-600" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                      {categories.find((category) => category.value === item.category)?.label}
                    </p>
                    <h4 className="mt-2 text-lg font-bold text-white">{item.title}</h4>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-600">
                      {item.event_date || "No date"}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">{item.description || "No description"}</p>
                    <p className={item.is_active ? "mt-3 text-xs font-bold text-emerald-400" : "mt-3 text-xs font-bold text-red-500/70"}>
                      {item.is_active ? "Visible" : "Hidden"} · Order {item.sort_order}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button type="button" onClick={() => setForm(item)} className="p-2 text-slate-500 transition-colors hover:bg-white/5 hover:text-white">
                      <Pencil size={14} />
                    </button>
                    <button type="button" onClick={() => deleteItem(item)} disabled={deletingId === item.id} className="p-2 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-500 disabled:opacity-40">
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

export default BomManager;
