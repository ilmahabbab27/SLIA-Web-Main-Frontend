import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Filter,
  Image as ImageIcon,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { eventApi, newsApi, type EventItem, type NewsItem } from "@/lib/api";

type EventSection = "latest" | "upcoming" | "past" | "program" | "highlight";

type AdminEventItem = {
  id: string;
  sourceId?: number;
  sections: EventSection[];
  section: EventSection;
  title: string;
  subtitle: string;
  description: string;
  date: string;
  venue: string;
  image: string;
  images: string[];
  link: string;
  sort_order: number;
  is_active: boolean;
  showInHighlights: boolean;
};

const sectionLabels: Record<EventSection, string> = {
  latest: "Latest News",
  upcoming: "Upcoming Events",
  past: "Past Events",
  program: "SLIA Annual Programs",
  highlight: "Key Highlights",
};

const autoLinks: Record<EventSection, string> = {
  latest: "/latest-news",
  upcoming: "/upcoming-events",
  past: "/past-events",
  program: "/slia-annual-sessions",
  highlight: "/events",
};

const eventSections = Object.keys(sectionLabels) as EventSection[];
const apiEventSections: EventSection[] = ["upcoming", "past", "program", "highlight"];
const maxEventImages = 5;
const maxImageDimension = 1400;
const imageQuality = 0.78;

const isApiEventSection = (section: EventSection): section is EventItem["category"] =>
  apiEventSections.includes(section);

const normalizeSection = (section?: string | null): EventSection =>
  eventSections.includes(section as EventSection) ? (section as EventSection) : "highlight";

const eventSectionsFromApi = (item: EventItem): EventSection[] => {
  const sections: EventSection[] = [];
  if (item.show_latest) sections.push("latest");
  if (item.show_upcoming || item.category === "upcoming") sections.push("upcoming");
  if (item.show_past || item.category === "past") sections.push("past");
  if (item.show_program || item.category === "program") sections.push("program");
  if (item.show_highlight || item.category === "highlight") sections.push("highlight");
  return sections.length > 0 ? [...new Set(sections)] : [normalizeSection(item.category)];
};

const primaryEventCategory = (sections: EventSection[]): EventItem["category"] =>
  (sections.find((section) => isApiEventSection(section)) as EventItem["category"] | undefined) || "highlight";

const eventDetailLink = (id: number) => `/events/${id}`;
const pendingEventDetailLabel = "Created after publishing";

const getErrorMessage = (err: unknown, fallback: string) =>
  err instanceof Error && err.message ? err.message : fallback;

const getItemSource = (item: AdminEventItem) => (item.id.startsWith("news-") ? "news" : item.id.startsWith("api-") ? "event" : "new");

const buildEventPayload = (form: AdminEventItem, sections: EventSection[], link: string) => ({
  title: form.title.trim(),
  subtitle: form.subtitle.trim(),
  description: form.description.trim(),
  date: form.date.trim(),
  venue: form.venue.trim(),
  image: form.images[0] || form.image,
  images: form.images,
  link,
  category: primaryEventCategory(sections),
  show_latest: sections.includes("latest"),
  show_upcoming: sections.includes("upcoming"),
  show_past: sections.includes("past"),
  show_program: sections.includes("program"),
  show_highlight: sections.includes("highlight"),
  is_active: form.is_active,
  sort_order: form.sort_order,
});

const buildNewsPayload = (form: AdminEventItem) => ({
  title: form.title.trim(),
  subtitle: form.date.trim() || form.subtitle.trim(),
  description: form.description.trim(),
  image: form.images[0] || form.image,
  link: autoLinks.latest,
  type: "news" as const,
  is_active: form.is_active,
  sort_order: form.sort_order,
});

const emptyForm = (section: EventSection = "latest"): AdminEventItem => ({
  id: crypto.randomUUID(),
  sections: [section],
  section,
  title: "",
  subtitle: "",
  description: "",
  date: "",
  venue: "",
  image: "",
  images: [],
  link: autoLinks[section],
  sort_order: 0,
  is_active: true,
  showInHighlights: false,
});

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

const normalizeApiEvent = (item: EventItem): AdminEventItem => {
  const sections = eventSectionsFromApi(item);

  return {
    id: `api-${item.id}`,
    sourceId: item.id,
    sections,
    section: sections[0],
    title: item.title,
    subtitle: item.subtitle || "",
    description: item.description || "",
    date: item.date || "",
    venue: item.venue || "",
    image: item.image || item.images?.[0] || "",
    images: item.images?.length ? item.images : item.image ? [item.image] : [],
    link: item.link || eventDetailLink(item.id),
    sort_order: item.sort_order || 0,
    is_active: item.is_active,
    showInHighlights: sections.includes("highlight"),
  };
};

const normalizeNewsEvent = (item: NewsItem): AdminEventItem => ({
  id: `news-${item.id}`,
  sourceId: item.id,
  sections: ["latest"],
  section: "latest",
  title: item.title,
  subtitle: "",
  description: item.description || "",
  date: item.subtitle || "",
  venue: "",
  image: item.image || "",
  images: item.image ? [item.image] : [],
  link: item.link || autoLinks.latest,
  sort_order: item.sort_order || 0,
  is_active: item.is_active,
  showInHighlights: false,
});

const EventManager = () => {
  const [events, setEvents] = useState<AdminEventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSource, setEditingSource] = useState<"news" | "event" | "new">("new");
  const [form, setForm] = useState<AdminEventItem>(emptyForm("latest"));
  const [selectedSections, setSelectedSections] = useState<EventSection[]>(["latest"]);
  const [filterType, setFilterType] = useState<"all" | EventSection>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "visible" | "hidden">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const [apiEvents, newsItems] = await Promise.all([
        eventApi.list(),
        newsApi.list("news"),
      ]);
      setEvents([
        ...newsItems.map(normalizeNewsEvent),
        ...apiEvents.map(normalizeApiEvent),
      ]);
    } catch (err) {
      setEvents([]);
      toast.error(getErrorMessage(err, "Could not load events from the backend."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return events
      .filter((event) => filterType === "all" || event.sections.includes(filterType))
      .filter((event) => {
        if (statusFilter === "visible") return event.is_active;
        if (statusFilter === "hidden") return !event.is_active;
        return true;
      })
      .filter((event) => {
        if (!query) return true;

        return [
          event.title,
          event.subtitle,
          event.description,
          event.date,
          event.venue,
          event.sections.map((section) => sectionLabels[section]).join(" "),
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);
      })
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [events, filterType, searchQuery, statusFilter]);

  const sectionCounts = useMemo(
    () =>
      events.reduce((counts, event) => {
        event.sections.forEach((section) => {
          counts[section] += 1;
        });
        return counts;
      }, { latest: 0, upcoming: 0, past: 0, program: 0, highlight: 0 } as Record<EventSection, number>),
    [events]
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, Math.max(0, maxEventImages - form.images.length));
    if (files.length === 0) return;

    Promise.all(files.map(fileToCompressedDataUrl))
      .then((nextImages) => {
        setForm((current) => {
          const images = [...current.images, ...nextImages].slice(0, maxEventImages);
          return { ...current, images, image: images[0] || "" };
        });
      })
      .catch((err: Error) => {
        toast.error(err.message || "Could not process selected images.");
      });

    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setForm((current) => {
      const images = current.images.filter((_, i) => i !== index);
      return { ...current, images, image: images[0] || "" };
    });
  };

  const toggleSection = (section: EventSection, checked: boolean) => {
    if (isEditing) {
      if (!checked && selectedSections.length === 1 && selectedSections.includes(section)) return;

      const next = checked ? [...new Set([...selectedSections, section])] : selectedSections.filter((item) => item !== section);
      setSelectedSections(next);
      setForm((current) => ({ ...current, sections: next, section: next[0], link: autoLinks[next[0]] }));
      return;
    }

    setSelectedSections((current) => {
      const next = checked ? [...new Set([...current, section])] : current.filter((item) => item !== section);
      const fallback = next.length > 0 ? next : [section];

      setForm((formState) => ({
        ...formState,
        sections: fallback,
        section: fallback.includes(formState.section) ? formState.section : fallback[0],
        link: autoLinks[fallback.includes(formState.section) ? formState.section : fallback[0]],
      }));

      return fallback;
    });
  };

  const createHighlightEntry = async (item: AdminEventItem) => {
    if (item.section === "highlight" || !item.showInHighlights) return null;

    const created = await eventApi.create({
      ...buildEventPayload({ ...item, subtitle: item.description || item.date || item.subtitle }, ["highlight"], autoLinks.highlight),
      category: "highlight",
    });

    return normalizeApiEvent(await eventApi.update(created.id, { link: eventDetailLink(created.id) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setSaving(true);
    try {
      const targetSections = isEditing ? selectedSections : selectedSections;
      const uniqueTargetSections = [...new Set(targetSections.length > 0 ? targetSections : form.sections)];
      const finalSections =
        form.showInHighlights && !uniqueTargetSections.includes("highlight")
          ? [...uniqueTargetSections, "highlight" as EventSection]
          : uniqueTargetSections;
      const originalSource = isEditing ? editingSource : "new";

      const nextLink = form.sourceId && originalSource === "event" ? eventDetailLink(form.sourceId) : "#";
      const payload = buildEventPayload({ ...form, sections: finalSections, section: finalSections[0] }, finalSections, nextLink) satisfies Omit<EventItem, "id" | "created_at" | "updated_at">;

      if (isEditing && form.sourceId && originalSource === "event") {
        await eventApi.update(form.sourceId, payload);
      } else {
        const created = await eventApi.create(payload);
        await eventApi.update(created.id, { link: eventDetailLink(created.id) });
        if (isEditing && form.sourceId && originalSource === "news") {
          await newsApi.delete(form.sourceId);
        }
      }

      await fetchEvents();

      toast.success(isEditing ? "Event updated" : `Event published to ${finalSections.length} section${finalSections.length === 1 ? "" : "s"}`);
      resetForm(finalSections[0]);
    } catch (err) {
      toast.error(getErrorMessage(err, "Save failed"));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (event: AdminEventItem) => {
    setForm(event);
    setSelectedSections(event.sections);
    setEditingSource(getItemSource(event));
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (event: AdminEventItem) => {
    if (!confirm("Delete this event?")) return;

    setDeletingId(event.id);
    try {
      if ((event.section === "highlight" || event.section === "program" || event.section === "upcoming" || event.section === "past") && event.sourceId) {
        await eventApi.delete(event.sourceId);
      }
      if (event.section === "latest" && event.sourceId) {
        await newsApi.delete(event.sourceId);
      }

      await fetchEvents();

      toast.success("Event deleted");
      if (form.id === event.id) resetForm(event.section);
    } catch (err) {
      toast.error(getErrorMessage(err, "Delete failed"));
    } finally {
      setDeletingId(null);
    }
  };

  const resetForm = (section: EventSection = form.section) => {
    const safeSection = normalizeSection(section);
    setForm(emptyForm(safeSection));
    setSelectedSections([safeSection]);
    setEditingSource("new");
    setIsEditing(false);
  };

  return (
    <div className="min-w-0 space-y-8 pb-20 md:space-y-12">
      <header className="flex min-w-0 flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Events Nav</p>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Events <span className="text-primary">Manager</span>
          </h2>
          <p className="mt-2 max-w-2xl text-slate-400">
            Manage latest news, upcoming events, past events, annual programs, and homepage key highlights from one place.
          </p>
        </div>

        <div className="grid w-full gap-3 sm:grid-cols-2 xl:w-auto xl:grid-cols-[240px_192px_152px_44px]">
          <div className="relative sm:col-span-2 xl:col-span-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events"
              className="h-10 rounded-xl border-white/10 bg-white/5 pl-9 text-white placeholder:text-slate-600"
            />
          </div>

          <Select value={filterType} onValueChange={(val: "all" | EventSection) => setFilterType(val)}>
            <SelectTrigger className="h-10 w-full rounded-xl border-white/10 bg-white/5 text-white">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-slate-500" />
                <SelectValue placeholder="All Sections" />
              </div>
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#0a0a0a] text-white">
              <SelectItem value="all">All Sections</SelectItem>
              <SelectItem value="latest">Latest News</SelectItem>
              <SelectItem value="upcoming">Upcoming Events</SelectItem>
              <SelectItem value="past">Past Events</SelectItem>
              <SelectItem value="program">SLIA Annual Programs</SelectItem>
              <SelectItem value="highlight">Key Highlights</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(val: "all" | "visible" | "hidden") => setStatusFilter(val)}>
            <SelectTrigger className="h-10 w-full rounded-xl border-white/10 bg-white/5 text-white">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#0a0a0a] text-white">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="visible">Visible</SelectItem>
              <SelectItem value="hidden">Hidden</SelectItem>
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="outline"
            onClick={fetchEvents}
            disabled={loading}
            aria-label="Refresh events"
            className="h-10 w-full gap-2 rounded-xl border-white/10 px-4 text-slate-400"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {(Object.keys(sectionLabels) as EventSection[]).map((section) => (
          <div key={section} className="border border-white/5 bg-[#0a0a0a] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">{sectionLabels[section]}</p>
            <p className="mt-3 text-3xl font-bold text-white">{sectionCounts[section]}</p>
          </div>
        ))}
      </div>

      <div className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] xl:gap-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="border-white/5 bg-[#0a0a0a] p-4 sm:p-6 xl:sticky xl:top-28 xl:rounded-[2rem] xl:p-8">
            <h3 className="mb-6 flex items-center gap-3 text-lg font-bold text-white sm:mb-8 sm:text-xl">
              {isEditing ? <Pencil className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
              {isEditing ? "Edit Event" : "Create Event"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Belongs To</Label>
                  <div className="grid gap-2 rounded-2xl border border-white/10 bg-white/5 p-3">
                    {eventSections.map((section) => (
                      <label key={section} className="flex items-center justify-between gap-3 rounded-xl px-2 py-1.5 text-sm text-slate-300">
                        <span className="min-w-0">{sectionLabels[section]}</span>
                        <Switch
                          className="shrink-0"
                          checked={selectedSections.includes(section)}
                          onCheckedChange={(checked) => toggleSection(section, checked)}
                        />
                      </label>
                    ))}
                  </div>
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
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Title *</Label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm((current) => ({ ...current, title: e.target.value }))}
                  className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
                  placeholder="e.g. Architect 2026 Exhibition"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Date</Label>
                  <Input
                    value={form.date}
                    onChange={(e) => setForm((current) => ({ ...current, date: e.target.value }))}
                    className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
                    placeholder="e.g. June 2026"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Subtitle</Label>
                  <Input
                    value={form.subtitle}
                    onChange={(e) => setForm((current) => ({ ...current, subtitle: e.target.value }))}
                    className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
                    placeholder="Short tagline"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Venue</Label>
                <Input
                  value={form.venue}
                  onChange={(e) => setForm((current) => ({ ...current, venue: e.target.value }))}
                  className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
                  placeholder="e.g. BMICH, Colombo"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Description</Label>
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
                  className="min-h-[96px] rounded-xl border-white/10 bg-white/5 text-white"
                  placeholder="Short summary shown on highlights and event cards"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Dedicated Event Page</Label>
                <div className="space-y-2 border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300">
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-3">
                    <span>Opens</span>
                    <span className="break-all text-slate-500 sm:break-normal">
                      {form.sourceId && editingSource === "event" ? eventDetailLink(form.sourceId) : pendingEventDetailLabel}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-3">
                    <span>Appears under</span>
                    <span className="text-slate-500">{selectedSections.map((section) => sectionLabels[section]).join(", ")}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Event Images ({form.images.length}/5)</Label>
                {form.images.length > 0 && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {form.images.map((image, index) => (
                      <div key={`${image.slice(0, 32)}-${index}`} className="group relative aspect-video overflow-hidden rounded-2xl border border-white/10">
                        <img src={image} alt={`Event preview ${index + 1}`} className="h-full w-full object-cover" />
                        {index === 0 && (
                          <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase text-white">
                            Main
                          </span>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                          <Button type="button" variant="destructive" size="sm" onClick={() => removeImage(index)}>
                            Remove Image
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {form.images.length < 5 && (
                  <div className="relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] p-6 text-center transition-all hover:bg-white/[0.05] sm:p-10">
                    <ImageIcon className="mb-2 h-8 w-8 text-slate-600" />
                    <p className="text-xs font-medium text-slate-500">Click to upload up to 5 event images</p>
                    <input type="file" className="absolute inset-0 cursor-pointer opacity-0" accept="image/*" multiple onChange={handleImageChange} />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 py-2">
                <Switch checked={form.is_active} onCheckedChange={(value) => setForm((current) => ({ ...current, is_active: value }))} />
                <Label className="text-sm text-slate-400">Publicly visible</Label>
              </div>

              {!selectedSections.includes("highlight") && (
                <div className="flex items-center gap-3 py-2">
                  <Switch
                    checked={form.showInHighlights}
                    onCheckedChange={(value) => setForm((current) => ({ ...current, showInHighlights: value }))}
                  />
                  <Label className="text-sm text-slate-400">Also show in Key Highlights carousel</Label>
                </div>
              )}

              <Button type="submit" disabled={saving} className="h-14 w-full rounded-2xl bg-primary font-bold text-white">
                {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : isEditing ? "Update Event" : "Publish Event"}
              </Button>
              {isEditing && (
                <Button type="button" variant="ghost" onClick={() => resetForm()} className="w-full text-slate-500">
                  Discard Edits
                </Button>
              )}
            </form>
          </Card>
        </motion.div>

        <div className="min-w-0 space-y-6">
          <h3 className="flex items-center justify-between px-2 text-xl font-bold text-white">
            Existing Events
            <span className="text-sm font-normal text-slate-500">({filteredEvents.length})</span>
          </h3>

          <div className="space-y-3 lg:hidden">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="border border-white/5 bg-[#0a0a0a] p-4 text-sm text-slate-300"
                >
                  <div className="flex min-w-0 gap-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden border border-white/5 bg-white/5">
                      {event.image ? (
                        <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary/5 text-lg font-bold text-primary/20">
                          {event.title.charAt(0) || "E"}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h4 className="line-clamp-2 font-bold text-white">{event.title}</h4>
                          <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                            {event.date || event.subtitle || event.description || "No description added"}
                          </p>
                        </div>
                        <span className={event.is_active ? "shrink-0 text-xs font-bold text-emerald-400" : "shrink-0 text-xs font-bold text-red-500/70"}>
                          {event.is_active ? "Visible" : "Hidden"}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {event.sections.map((section) => (
                          <span key={section} className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-bold uppercase text-slate-300">
                            {sectionLabels[section]}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 flex justify-end gap-1 border-t border-white/5 pt-3">
                        <button
                          type="button"
                          onClick={() => handleEdit(event)}
                          disabled={saving || deletingId === event.id}
                          aria-label={`Edit ${event.title}`}
                          className="p-2 text-slate-500 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(event)}
                          disabled={saving || deletingId === event.id}
                          aria-label={`Delete ${event.title}`}
                          className="p-2 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {deletingId === event.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <div className="border border-white/5 bg-[#0a0a0a] py-12 text-center">
                <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-primary" />
                <p className="text-sm text-slate-500">Loading events from the backend...</p>
              </div>
            )}

            {!loading && filteredEvents.length === 0 && (
              <div className="border-2 border-dashed border-white/5 py-14 text-center">
                <p className="text-slate-600">No events found in this section.</p>
              </div>
            )}
          </div>

          <div className="hidden overflow-x-auto border border-white/5 bg-[#0a0a0a] lg:block">
            <div className="min-w-[980px]">
              <div className="grid grid-cols-[minmax(240px,1.5fr)_repeat(5,96px)_110px_96px] border-b border-white/5 px-4 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                <span>Item</span>
                <span>Latest</span>
                <span>Upcoming</span>
                <span>Past</span>
                <span>Programs</span>
                <span>Highlights</span>
                <span>Status</span>
                <span>Actions</span>
              </div>

              <AnimatePresence mode="popLayout">
                {filteredEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="grid grid-cols-[minmax(240px,1.5fr)_repeat(5,96px)_110px_96px] items-center border-b border-white/5 px-4 py-4 text-sm text-slate-300 last:border-b-0"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="h-12 w-12 shrink-0 overflow-hidden border border-white/5 bg-white/5">
                        {event.image ? (
                          <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-primary/5 text-lg font-bold text-primary/20">
                            {event.title.charAt(0) || "E"}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="truncate font-bold text-white">{event.title}</h4>
                        <p className="mt-1 truncate text-xs text-slate-500">{event.date || event.subtitle || event.description || "No description added"}</p>
                      </div>
                    </div>

                    {eventSections.map((section) => (
                      <span key={section} className={`font-bold ${event.sections.includes(section) ? "text-emerald-400" : "text-slate-700"}`}>
                        {event.sections.includes(section) ? "Yes" : "No"}
                      </span>
                    ))}

                    <span className={event.is_active ? "font-bold text-emerald-400" : "font-bold text-red-500/70"}>
                      {event.is_active ? "Visible" : "Hidden"}
                    </span>

                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleEdit(event)}
                        disabled={saving || deletingId === event.id}
                        aria-label={`Edit ${event.title}`}
                        className="p-2 text-slate-500 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(event)}
                        disabled={saving || deletingId === event.id}
                        aria-label={`Delete ${event.title}`}
                        className="p-2 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {deletingId === event.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {loading && (
              <div className="border border-white/5 bg-[#0a0a0a] py-16 text-center">
                <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-primary" />
                <p className="text-sm text-slate-500">Loading events from the backend...</p>
              </div>
            )}

            {!loading && filteredEvents.length === 0 && (
              <div className="border-2 border-dashed border-white/5 py-20 text-center">
                <p className="text-slate-600">No events found in this section.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventManager;
