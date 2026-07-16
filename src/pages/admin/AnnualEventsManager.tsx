import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, Image as ImageIcon, Loader2, Pencil, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { annualEventApi, type AnnualEventItem } from "@/lib/api";

type AnnualForm = {
  id?: number;
  year: string;
  event_type: AnnualEventItem["event_type"];
  title: string;
  subtitle: string;
  description: string;
  images: string[];
  sort_order: number;
  is_active: boolean;
};

const annualEventTypes: Array<{ value: AnnualEventItem["event_type"]; label: string; subtitle: string }> = [
  { value: "agm", label: "AGM", subtitle: "Annual General Meeting" },
  { value: "inauguration", label: "Inauguration", subtitle: "SLIA Annual Session Opening" },
  { value: "conference", label: "Conference", subtitle: "Architecture & Built Environment" },
  { value: "exhibition", label: "Exhibition", subtitle: "Architects' Work & Trade Exhibition" },
  { value: "members-night", label: "Members Night", subtitle: "Members Night" },
];

const eventTypeLabels = annualEventTypes.reduce(
  (labels, item) => ({ ...labels, [item.value]: item.label }),
  {} as Record<AnnualEventItem["event_type"], string>
);

const maxImages = 5;
const maxImageDimension = 1400;
const imageQuality = 0.78;

const emptyForm = (): AnnualForm => ({
  year: new Date().getFullYear().toString(),
  event_type: "agm",
  title: "",
  subtitle: "",
  description: "",
  images: [],
  sort_order: 0,
  is_active: true,
});

const getErrorMessage = (err: unknown, fallback: string) =>
  err instanceof Error && err.message ? err.message : fallback;

const fileToCompressedDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Could not read image file."));
    reader.onload = () => {
      const source = reader.result as string;
      const image = new Image();

      image.onerror = () => resolve(source);
      image.onload = () => {
        const scale = Math.min(1, maxImageDimension / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          resolve(source);
          return;
        }

        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", imageQuality));
      };

      image.src = source;
    };

    reader.readAsDataURL(file);
  });

const normalizeAnnualEvent = (item: AnnualEventItem): AnnualForm => ({
  id: item.id,
  year: item.year || item.title.match(/\b(19|20)\d{2}\b/)?.[0] || "",
  event_type: item.event_type || "agm",
  title: item.title,
  subtitle: item.subtitle || "",
  description: item.description || "",
  images: item.images?.length ? item.images : item.image ? [item.image] : [],
  sort_order: item.sort_order || 0,
  is_active: item.is_active,
});

const buildPayload = (form: AnnualForm) => ({
  title: form.title.trim() || `${eventTypeLabels[form.event_type]} ${form.year.trim()}`,
  subtitle: form.subtitle.trim(),
  description: form.description.trim(),
  year: form.year.trim(),
  event_type: form.event_type,
  image: form.images[0] || "",
  images: form.images,
  is_active: form.is_active,
  sort_order: form.sort_order,
});

const AnnualEventsManager = () => {
  const [items, setItems] = useState<AnnualForm[]>([]);
  const [form, setForm] = useState<AnnualForm>(emptyForm());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | AnnualEventItem["event_type"]>("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "visible" | "hidden">("all");

  const isEditing = Boolean(form.id);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const data = await annualEventApi.list();
      setItems(data.map(normalizeAnnualEvent));
    } catch (err) {
      setItems([]);
      toast.error(getErrorMessage(err, "Could not load annual events."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const sortedItems = useMemo(
    () =>
      [...items].sort((a, b) => {
        const byYear = Number(b.year) - Number(a.year);
        if (!Number.isNaN(byYear) && byYear !== 0) return byYear;
        return a.sort_order - b.sort_order || eventTypeLabels[a.event_type].localeCompare(eventTypeLabels[b.event_type]);
      }),
    [items]
  );

  const availableYears = useMemo(
    () => [...new Set(items.map((item) => item.year).filter(Boolean))].sort((a, b) => Number(b) - Number(a)),
    [items]
  );

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return sortedItems
      .filter((item) => typeFilter === "all" || item.event_type === typeFilter)
      .filter((item) => yearFilter === "all" || item.year === yearFilter)
      .filter((item) => {
        if (statusFilter === "visible") return item.is_active;
        if (statusFilter === "hidden") return !item.is_active;
        return true;
      })
      .filter((item) => {
        if (!query) return true;

        return [
          item.year,
          eventTypeLabels[item.event_type],
          item.title,
          item.subtitle,
          item.description,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);
      });
  }, [searchQuery, sortedItems, statusFilter, typeFilter, yearFilter]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, Math.max(0, maxImages - form.images.length));
    if (files.length === 0) return;

    Promise.all(files.map(fileToCompressedDataUrl))
      .then((nextImages) => {
        setForm((current) => ({
          ...current,
          images: [...current.images, ...nextImages].slice(0, maxImages),
        }));
      })
      .catch((err: Error) => toast.error(err.message || "Could not process selected images."));

    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setForm((current) => ({
      ...current,
      images: current.images.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const resetForm = () => setForm(emptyForm());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.year.trim()) {
      toast.error("Year is required.");
      return;
    }

    if (!form.event_type) {
      toast.error("Annual event type is required.");
      return;
    }

    setSaving(true);
    try {
      if (form.id) {
        await annualEventApi.update(form.id, buildPayload(form));
      } else {
        await annualEventApi.create(buildPayload(form));
      }

      await fetchItems();
      toast.success(form.id ? "Annual event updated" : "Annual event added");
      resetForm();
    } catch (err) {
      toast.error(getErrorMessage(err, "Save failed."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: AnnualForm) => {
    if (!item.id || !confirm(`Delete ${eventTypeLabels[item.event_type]} ${item.year}?`)) return;

    setDeletingId(item.id);
    try {
      await annualEventApi.delete(item.id);
      await fetchItems();
      if (form.id === item.id) resetForm();
      toast.success("Annual event deleted");
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
              <CalendarDays className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Annual Sessions</p>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Annual <span className="text-primary">Events</span>
          </h2>
          <p className="mt-2 max-w-2xl text-slate-400">
            Add yearly SLIA Annual Sessions galleries with up to 5 images for each year.
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

      <div className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.35fr)]">
        <Card className="border-white/5 bg-[#0a0a0a] p-4 sm:p-6 xl:sticky xl:top-28 xl:p-8">
          <h3 className="mb-6 flex items-center gap-3 text-lg font-bold text-white">
            {isEditing ? <Pencil className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
            {isEditing ? "Edit Year" : "Add Year"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Year *</Label>
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
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Annual Event Type *</Label>
              <Select
                value={form.event_type}
                onValueChange={(value: AnnualEventItem["event_type"]) =>
                  setForm((current) => ({
                    ...current,
                    event_type: value,
                    title: current.title || `${eventTypeLabels[value]} ${current.year}`,
                  }))
                }
              >
                <SelectTrigger className="h-12 rounded-xl border-white/10 bg-white/5 text-white">
                  <SelectValue placeholder="Select annual event type" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#0a0a0a] text-white">
                  {annualEventTypes.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Title</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))}
                className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
                placeholder={`${eventTypeLabels[form.event_type]} ${form.year || "2026"}`}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Subtitle</Label>
              <Input
                value={form.subtitle}
                onChange={(e) => setForm((current) => ({ ...current, subtitle: e.target.value }))}
                className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
                placeholder={annualEventTypes.find((item) => item.value === form.event_type)?.subtitle || "Annual event subtitle"}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
                className="min-h-[100px] rounded-xl border-white/10 bg-white/5 text-white"
                placeholder="Short public description for this year"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Images ({form.images.length}/{maxImages})
              </Label>
              {form.images.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {form.images.map((image, index) => (
                    <div key={`${image.slice(0, 32)}-${index}`} className="group relative aspect-video overflow-hidden rounded-2xl border border-white/10">
                      <img src={image} alt={`Annual event ${form.year} image ${index + 1}`} className="h-full w-full object-cover" />
                      {index === 0 && (
                        <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase text-white">
                          Cover
                        </span>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button type="button" variant="destructive" size="sm" onClick={() => removeImage(index)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {form.images.length < maxImages && (
                <div className="relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] p-8 text-center transition-all hover:bg-white/[0.05]">
                  <ImageIcon className="mb-2 h-8 w-8 text-slate-600" />
                  <p className="text-xs font-medium text-slate-500">Upload up to 5 images for this year</p>
                  <input type="file" className="absolute inset-0 cursor-pointer opacity-0" accept="image/*" multiple onChange={handleImageChange} />
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 py-2">
              <Switch
                checked={form.is_active}
                onCheckedChange={(value) => setForm((current) => ({ ...current, is_active: value }))}
              />
              <Label className="text-sm text-slate-400">Publicly visible</Label>
            </div>

            <Button type="submit" disabled={saving} className="h-14 w-full rounded-2xl bg-primary font-bold text-white">
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : isEditing ? "Update Year" : "Add Year"}
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
            Year Galleries
            <span className="text-sm font-normal text-slate-500">({filteredItems.length})</span>
          </h3>

          <div className="grid gap-3 border border-white/5 bg-[#0a0a0a] p-4 md:grid-cols-2 xl:grid-cols-[minmax(180px,1fr)_170px_130px_130px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 rounded-xl border-white/10 bg-white/5 pl-9 text-white placeholder:text-slate-600"
                placeholder="Search year, event, title"
              />
            </div>

            <Select value={typeFilter} onValueChange={(value: "all" | AnnualEventItem["event_type"]) => setTypeFilter(value)}>
              <SelectTrigger className="h-10 rounded-xl border-white/10 bg-white/5 text-white">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-[#0a0a0a] text-white">
                <SelectItem value="all">All Types</SelectItem>
                {annualEventTypes.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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
              <p className="text-sm text-slate-500">Loading annual events...</p>
            </div>
          )}

          {!loading && filteredItems.length === 0 && (
            <div className="border-2 border-dashed border-white/5 py-20 text-center">
              <p className="text-slate-600">No annual events match these filters.</p>
            </div>
          )}

          {!loading &&
            filteredItems.map((item) => (
              <div key={item.id || item.year} className="border border-white/5 bg-[#0a0a0a] p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{item.year}</p>
                    <h4 className="mt-2 text-lg font-bold text-white">{item.title || `${eventTypeLabels[item.event_type]} ${item.year}`}</h4>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      {eventTypeLabels[item.event_type]}
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-500">{item.subtitle || item.description || "No description added"}</p>
                    <p className={item.is_active ? "mt-3 text-xs font-bold text-emerald-400" : "mt-3 text-xs font-bold text-red-500/70"}>
                      {item.is_active ? "Visible" : "Hidden"} · {item.images.length} image{item.images.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => setForm(item)}
                      disabled={saving || deletingId === item.id}
                      aria-label={`Edit ${item.year}`}
                      className="p-2 text-slate-500 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      disabled={saving || deletingId === item.id}
                      aria-label={`Delete ${item.year}`}
                      className="p-2 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {deletingId === item.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>

                {item.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
                    {item.images.map((image, index) => (
                      <div key={`${item.id}-${index}`} className="aspect-video overflow-hidden border border-white/5 bg-white/5">
                        <img src={image} alt={`${item.year} preview ${index + 1}`} className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AnnualEventsManager;
