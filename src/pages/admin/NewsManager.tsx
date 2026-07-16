import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Pencil, 
  Trash2, 
  Image as ImageIcon, 
  Newspaper, 
  RefreshCw, 
  Loader2, 
  Plus, 
  Search,
  CheckCircle2,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { newsApi, type NewsItem } from "@/lib/api";

const emptyForm = (): Omit<NewsItem, "id" | "created_at" | "updated_at"> => ({
  title: "",
  subtitle: "",
  description: "",
  link: "#",
  type: "news",
  is_active: true,
  sort_order: 0,
});

type NewsForm = Omit<NewsItem, "created_at" | "updated_at"> & { id?: number };
type FilterType = "all" | NewsItem["type"];

const getErrorMessage = (err: unknown, fallback: string) =>
  err instanceof Error && err.message ? err.message : fallback;

const NewsManager = () => {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<NewsForm>(emptyForm());
  const [filterType, setFilterType] = useState<FilterType>("all");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await newsApi.list();
      setItems(data);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load news items"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { toast.error("Title is required"); return; }

    setSaving(true);
    try {
      if (isEditing && form.id) {
        const updated = await newsApi.update(form.id, form);
        setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
        toast.success("Item updated ✓");
      } else {
        const created = await newsApi.create(form);
        setItems(prev => [...prev, created]);
        toast.success("Item created ✓");
      }
      resetForm();
    } catch (err) {
      toast.error(getErrorMessage(err, "Save failed"));
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: NewsItem) => {
    setForm(item);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    setDeletingId(id);
    try {
      await newsApi.delete(id);
      setItems(prev => prev.filter(i => i.id !== id));
      toast.success("Deleted ✓");
    } catch (err) {
      toast.error(getErrorMessage(err, "Delete failed"));
    } finally {
      setDeletingId(null);
    }
  };

  const resetForm = () => {
    setForm(emptyForm());
    setIsEditing(false);
  };

  const filteredItems = filterType === "all" ? items : items.filter(i => i.type === filterType);

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Newspaper className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Content Hub</p>
          </div>
          <h2 className="text-4xl font-bold text-white tracking-tight">News & <span className="text-primary">Highlights</span></h2>
          <p className="text-slate-400 mt-2">Manage both homepage highlights and the latest news feed.</p>
        </div>
        <div className="flex gap-4">
          <Select value={filterType} onValueChange={(val) => setFilterType(val as FilterType)}>
            <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white rounded-xl">
              <SelectValue placeholder="Filter type" />
            </SelectTrigger>
            <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="news">Latest News</SelectItem>
              <SelectItem value="highlight">Key Highlights</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={fetchData} disabled={loading} className="gap-2 border-white/10 text-slate-400">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </header>

      <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="bg-[#0a0a0a] border-white/5 p-8 rounded-[2.5rem] lg:sticky lg:top-28">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              {isEditing ? <Pencil className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
              {isEditing ? "Update Item" : "Create New Item"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Type *</Label>
                  <Select value={form.type} onValueChange={(val) => setForm({ ...form, type: val as NewsItem["type"] })}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white h-12 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0a0a] border-white/10 text-white">
                      <SelectItem value="news">Latest News</SelectItem>
                      <SelectItem value="highlight">Key Highlight</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Sort Order</Label>
                  <Input 
                    type="number"
                    value={form.sort_order}
                    onChange={e => setForm({...form, sort_order: parseInt(e.target.value)})}
                    className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Title *</Label>
                <Input 
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                  placeholder="News title"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Subtitle / Date</Label>
                <Input 
                  value={form.subtitle}
                  onChange={e => setForm({...form, subtitle: e.target.value})}
                  className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                  placeholder="e.g. December 2024"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Description</Label>
                <Textarea 
                  value={form.description}
                  onChange={e => setForm({...form, description: e.target.value})}
                  className="bg-white/5 border-white/10 text-white min-h-[100px] rounded-xl"
                  placeholder="Summary of the news item..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Target Link</Label>
                <Input 
                  value={form.link}
                  onChange={e => setForm({...form, link: e.target.value})}
                  className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                />
              </div>



              <div className="flex items-center gap-3 py-2">
                <Switch checked={form.is_active} onCheckedChange={val => setForm({...form, is_active: val})} />
                <Label className="text-sm text-slate-400 font-medium">Publicly visible</Label>
              </div>

              <Button type="submit" disabled={saving} className="w-full h-14 bg-primary text-white rounded-2xl font-bold">
                {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : (isEditing ? "Update Content" : "Publish Content")}
              </Button>
              {isEditing && <Button variant="ghost" onClick={resetForm} className="w-full text-slate-500">Discard Edits</Button>}
            </form>
          </Card>
        </motion.div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-white flex items-center justify-between">
            {filterType === "all" ? "All Entries" : filterType === "news" ? "Latest News" : "Highlights"}
            <span className="text-sm font-normal text-slate-500">({filteredItems.length})</span>
          </h3>

          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#0a0a0a] border border-white/5 p-4 rounded-3xl flex gap-5 group hover:border-white/10 transition-all"
                >
                  <div className="w-12 h-12 shrink-0 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-primary/40">
                    {item.type === "news" ? <Newspaper size={20} /> : <Sparkles size={20} />}
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded bg-white/5 ${item.type === "news" ? "text-blue-400" : "text-amber-400"}`}>
                            {item.type}
                          </span>
                          {!item.is_active && <span className="text-[9px] font-bold uppercase text-red-500/50">Hidden</span>}
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => handleEdit(item)} className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-colors"><Pencil size={14} /></button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-500/10 rounded-xl text-slate-500 hover:text-red-500 transition-colors">
                            {deletingId === item.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                          </button>
                        </div>
                      </div>
                      <h4 className="text-base font-bold text-white line-clamp-1">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsManager;
