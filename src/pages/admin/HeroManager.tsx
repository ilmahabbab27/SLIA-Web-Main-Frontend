import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Pencil,
  Trash2,
  Image as ImageIcon,
  ExternalLink,
  Sparkles,
  Layout,
  RefreshCw,
  Loader2,
  MousePointer2,
  Plus,
  Save,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { heroApi, heroButtonApi, type HeroSlide, type HeroButton } from "@/lib/api";

// ------------------------------------------------------------------ types
type FormSlide = {
  id?: number;
  image: string;
  tag: string;
  title: string;
  description: string;
  link: string;
};

const defaultHeroSlide: FormSlide = {
  tag: "Sri Lanka Institute of Architects",
  title: "Shaping Sri Lanka's Built Environment",
  description: "Explore the institute's latest news, events, professional resources, and architectural initiatives.",
  link: "/about",
  image: "/images/hero-1.jpg",
};

const emptyForm = (): FormSlide => ({
  ...defaultHeroSlide,
});

// ------------------------------------------------------------------ component
const HeroManager = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [buttons, setButtons] = useState<HeroButton[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<FormSlide>(emptyForm());

  // CTA Button State
  const [editingBtnId, setEditingBtnId] = useState<number | null>(null);
  const [btnLoading, setBtnLoading] = useState(false);

  // ---- fetch all data -----------------------------------------------
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [slidesData, buttonsData] = await Promise.all([
        heroApi.list(),
        heroButtonApi.list()
      ]);
      setSlides(slidesData);
      setButtons(buttonsData);
    } catch (err) {
      toast.error("Failed to load data from server.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ---- image file → base64 --------------------------------------------
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm((f) => ({ ...f, image: reader.result as string }));
    reader.readAsDataURL(file);
  };

  // ---- submit slide (create or update) --------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title?.trim()) { toast.error("Title is required"); return; }
    if (!form.image) { toast.error("Image is required"); return; }

    setSaving(true);
    try {
      const payload = {
        image: form.image,
        tag: form.tag,
        title: form.title,
        description: form.description,
        link: form.link,
      };

      if (isEditing && form.id !== undefined) {
        const updated = await heroApi.update(form.id, payload);
        setSlides((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
        toast.success("Hero slide updated ✓");
      } else {
        const created = await heroApi.create(payload);
        setSlides((prev) => [...prev, created]);
        toast.success("Hero slide published ✓");
      }

      resetForm();
    } catch (err: any) {
      toast.error(err.message || "Save failed. Check the server.");
    } finally {
      setSaving(false);
    }
  };

  // ---- add button ----------------------------------------------------
  const handleAddButton = async () => {
    setBtnLoading(true);
    try {
      const created = await heroButtonApi.create({
        label: "New Action",
        link: "#",
        is_active: false,
        sort_order: buttons.length + 1
      });
      setButtons([...buttons, created]);
      setEditingBtnId(created.id);
      toast.success("New CTA button added ✓");
    } catch (err: any) {
      toast.error(err.message || "Failed to add button.");
    } finally {
      setBtnLoading(false);
    }
  };

  // ---- delete button --------------------------------------------------
  const handleDeleteButton = async (id: number) => {
    if (!confirm("Are you sure you want to remove this button?")) return;
    setBtnLoading(true);
    try {
      await heroButtonApi.delete(id);
      setButtons(buttons.filter(b => b.id !== id));
      toast.success("Button removed ✓");
    } catch (err: any) {
      toast.error(err.message || "Delete failed.");
    } finally {
      setBtnLoading(false);
    }
  };

  // ---- update button --------------------------------------------------
  const handleUpdateButton = async (btn: HeroButton) => {
    setBtnLoading(true);
    try {
      const updated = await heroButtonApi.update(btn.id, {
        label: btn.label,
        link: btn.link,
        is_active: btn.is_active,
        sort_order: btn.sort_order
      });
      setButtons((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      setEditingBtnId(null);
      toast.success(`${updated.label} updated ✓`);
    } catch (err: any) {
      toast.error(err.message || "Button update failed.");
    } finally {
      setBtnLoading(false);
    }
  };

  const toggleButtonActive = async (btn: HeroButton) => {
    try {
      const updated = await heroButtonApi.update(btn.id, { is_active: !btn.is_active });
      setButtons((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      toast.success(`${btn.label} is now ${!btn.is_active ? "active" : "inactive"}`);
    } catch (err) {
      toast.error("Failed to toggle button state");
    }
  };

  // ---- edit slide -----------------------------------------------------
  const handleEdit = (slide: HeroSlide) => {
    setForm({
      id: slide.id,
      image: slide.image,
      tag: slide.tag,
      title: slide.title,
      description: slide.description,
      link: slide.link,
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---- delete slide ---------------------------------------------------
  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      await heroApi.delete(id);
      setSlides((prev) => prev.filter((s) => s.id !== id));
      toast.success("Slide removed ✓");
    } catch (err: any) {
      toast.error(err.message || "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  // ---- reset form -----------------------------------------------------
  const resetForm = () => {
    setForm(emptyForm());
    setIsEditing(false);
  };

  // ------------------------------------------------------------------ render
  return (
    <div className="space-y-16 pb-20">

      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Hero Experience</p>
          </div>
          <h2 className="text-4xl font-bold text-white tracking-tight">
            Manage <span className="text-primary">Hero Elements</span>
          </h2>
          <p className="text-slate-400 mt-2 max-w-2xl">
            Control your homepage visual narrative and call-to-action buttons directly from the database.
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={fetchData}
          disabled={loading}
          className="gap-2 text-slate-400 hover:text-white border border-white/10"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </section>

      {/* ---- CTA BUTTONS SECTION ---- */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded bg-emerald-500/20 flex items-center justify-center">
              <MousePointer2 className="h-3 w-3 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold text-white uppercase tracking-wider">CTA Quick Actions</h3>
          </div>
          <Button 
            onClick={handleAddButton} 
            disabled={btnLoading}
            variant="outline" 
            className="gap-2 border-primary/20 text-primary hover:bg-primary/10 rounded-full"
          >
            <Plus className="h-4 w-4" /> Add Button
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            [1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-white/5 rounded-3xl animate-pulse" />)
          ) : (
            <>
              {buttons.map((btn) => (
                <motion.div
                  key={btn.id}
                  layout
                  className={`p-6 rounded-[2rem] border transition-all ${editingBtnId === btn.id
                      ? "bg-white/5 border-primary/50 shadow-lg shadow-primary/5"
                      : "bg-[#0a0a0a] border-white/5 hover:border-white/10"
                    }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={btn.is_active}
                        onCheckedChange={() => toggleButtonActive(btn)}
                      />
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${btn.is_active ? "text-emerald-500" : "text-slate-600"}`}>
                        {btn.is_active ? "Visible" : "Hidden"}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingBtnId(editingBtnId === btn.id ? null : btn.id)}
                        className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors"
                      >
                        {editingBtnId === btn.id ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Pencil className="h-4 w-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteButton(btn.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {editingBtnId === btn.id ? (
                    <div className="space-y-4">
                      <Input
                        value={btn.label}
                        onChange={(e) => setButtons(buttons.map(b => b.id === btn.id ? { ...b, label: e.target.value } : b))}
                        className="bg-black/40 border-white/10 h-9 text-xs"
                        placeholder="Button Label"
                      />
                      <Input
                        value={btn.link}
                        onChange={(e) => setButtons(buttons.map(b => b.id === btn.id ? { ...b, link: e.target.value } : b))}
                        className="bg-black/40 border-white/10 h-9 text-xs"
                        placeholder="Link (e.g. /apply)"
                      />
                      <Button
                        onClick={() => handleUpdateButton(btn)}
                        disabled={btnLoading}
                        className="w-full h-9 text-xs font-bold gap-2"
                      >
                        {btnLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                        Save Changes
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <h4 className={`font-bold text-lg ${btn.is_active ? "text-white" : "text-slate-600"}`}>{btn.label}</h4>
                      <p className="text-xs text-slate-500 mt-1 font-mono truncate">{btn.link}</p>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Add Button Shortcut */}
              <button
                onClick={handleAddButton}
                disabled={btnLoading}
                className="group border-2 border-dashed border-white/5 rounded-[2rem] p-6 flex flex-col items-center justify-center gap-3 hover:border-primary/30 hover:bg-primary/5 transition-all text-slate-500 hover:text-primary"
              >
                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Plus className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">Add Quick Action</span>
              </button>
            </>
          )}
        </div>
      </section>

      <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">

        {/* ---- Slide Form --------------------------------------------------- */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2.5rem] lg:sticky lg:top-28">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Layout className="h-5 w-5 text-primary" />
                {isEditing ? "Update Slide" : "Create New Slide"}
              </h3>
              {isEditing && (
                <Button
                  variant="ghost"
                  onClick={resetForm}
                  className="text-xs text-slate-500 hover:text-white uppercase tracking-widest font-bold"
                >
                  Cancel
                </Button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Heading Title *</Label>
                <Input
                  placeholder="The Future of Architecture"
                  className="bg-white/5 border-white/10 rounded-xl h-12 focus:ring-primary/50 focus:border-primary/50 transition-all text-white"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              {/* Tag + Link */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Tagline</Label>
                  <Input
                    placeholder="News & Events"
                    className="bg-white/5 border-white/10 rounded-xl focus:ring-primary/50 transition-all text-white"
                    value={form.tag}
                    onChange={(e) => setForm({ ...form, tag: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Redirect Link</Label>
                  <Input
                    placeholder="#"
                    className="bg-white/5 border-white/10 rounded-xl focus:ring-primary/50 transition-all text-white"
                    value={form.link}
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Description Copy</Label>
                <Textarea
                  placeholder="Describe the impact of this slide..."
                  className="bg-white/5 border-white/10 rounded-2xl min-h-[120px] focus:ring-primary/50 transition-all text-white"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              {/* Image */}
              <div className="space-y-4">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Slide Visual *</Label>
                {form.image ? (
                  <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 group">
                    <img src={form.image} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="rounded-full px-6"
                        onClick={() => setForm({ ...form, image: "" })}
                      >
                        Change Image
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center gap-4 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/30 transition-all cursor-pointer relative group">
                    <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <ImageIcon className="h-8 w-8 text-slate-500 group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-sm text-slate-500 font-medium tracking-tight">
                      Drop your hero image here or <span className="text-primary">browse</span>
                    </p>
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={saving}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold text-base shadow-lg shadow-primary/20 transition-all active:scale-95"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isEditing ? "Updating…" : "Publishing…"}
                  </span>
                ) : (
                  isEditing ? "Update Hero Slide" : "Publish to Homepage"
                )}
              </Button>
            </form>
          </div>
        </motion.div>

        {/* ---- Slide list -------------------------------------------- */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">
              Live Slides{" "}
              <span className="text-slate-600 text-sm ml-2 font-normal">
                ({loading ? "…" : slides.length})
              </span>
            </h3>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="grid gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="bg-[#0a0a0a] border border-white/5 p-4 rounded-[2rem] animate-pulse">
                  <div className="flex gap-6">
                    <div className="w-40 h-40 shrink-0 rounded-2xl bg-white/5" />
                    <div className="flex-1 space-y-4 py-4">
                      <div className="h-3 bg-white/5 rounded w-1/3" />
                      <div className="h-5 bg-white/5 rounded w-3/4" />
                      <div className="h-3 bg-white/5 rounded w-full" />
                      <div className="h-3 bg-white/5 rounded w-2/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Slides */}
          {!loading && (
            <div className="grid gap-6">
              <AnimatePresence mode="popLayout">
                {slides.map((slide, i) => (
                  <motion.div
                    key={slide.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="bg-[#0a0a0a] border border-white/5 p-4 rounded-[2rem] group hover:border-white/10 transition-all"
                  >
                    <div className="flex gap-6">
                      {/* Thumbnail */}
                      <div className="w-40 h-40 shrink-0 rounded-2xl overflow-hidden border border-white/5 relative">
                        <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[8px] font-bold text-white uppercase tracking-[0.2em]">
                          Slide {i + 1}
                        </div>
                      </div>

                      {/* Details */}
                      <div className="flex-1 py-2 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">{slide.tag}</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleEdit(slide)}
                                className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white"
                                title="Edit slide"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(slide.id)}
                                disabled={deletingId === slide.id}
                                className="p-2 bg-red-500/5 hover:bg-red-500/10 rounded-xl transition-colors text-red-500/50 hover:text-red-500 disabled:opacity-40"
                                title="Delete slide"
                              >
                                {deletingId === slide.id
                                  ? <Loader2 className="h-4 w-4 animate-spin" />
                                  : <Trash2 className="h-4 w-4" />
                                }
                              </button>
                            </div>
                          </div>
                          <h4 className="text-xl font-bold text-white line-clamp-1">{slide.title}</h4>
                          <p className="text-sm text-slate-400 mt-2 line-clamp-2 leading-relaxed">{slide.description}</p>
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                          <a
                            href={slide.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold text-slate-500 hover:text-primary transition-colors flex items-center gap-2 uppercase tracking-widest"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View Target
                          </a>
                          <span className="text-[10px] text-slate-700 ml-auto">ID #{slide.id}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {slides.length === 0 && (
                <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
                  <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="h-8 w-8 text-slate-700" />
                  </div>
                  <p className="text-slate-500 font-medium">No slides yet. Create one to publish to the homepage.</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default HeroManager;
