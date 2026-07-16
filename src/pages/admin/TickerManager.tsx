import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Pencil, 
  Trash2, 
  Plus, 
  RefreshCw, 
  Loader2, 
  Megaphone,
  Save,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { tickerApi, type TickerItem } from "@/lib/api";

const emptyForm = (): Omit<TickerItem, "id" | "created_at" | "updated_at"> => ({
  text: "",
  link: "#",
  is_active: true,
  sort_order: 0,
});

const TickerManager = () => {
  const [items, setItems] = useState<TickerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<any>(emptyForm());

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await tickerApi.list();
      setItems(data);
    } catch (err) {
      toast.error("Failed to load ticker items");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.text.trim()) { toast.error("Text content is required"); return; }

    setSaving(true);
    try {
      if (isEditing && form.id) {
        const updated = await tickerApi.update(form.id, form);
        setItems(prev => prev.map(i => i.id === updated.id ? updated : i));
        toast.success("Ticker item updated ✓");
      } else {
        const created = await tickerApi.create(form);
        setItems(prev => [...prev, created]);
        toast.success("Ticker item created ✓");
      }
      resetForm();
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item: TickerItem) => {
    setForm(item);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    setDeletingId(id);
    try {
      await tickerApi.delete(id);
      setItems(prev => prev.filter(i => i.id !== id));
      toast.success("Ticker item removed ✓");
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const resetForm = () => {
    setForm(emptyForm());
    setIsEditing(false);
  };

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Megaphone className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Live Announcements</p>
          </div>
          <h2 className="text-4xl font-bold text-white tracking-tight">News <span className="text-primary">Ticker</span></h2>
          <p className="text-slate-400 mt-2">Manage the scrolling updates displayed on the homepage hero section.</p>
        </div>
        <Button variant="outline" onClick={fetchData} disabled={loading} className="gap-2 border-white/10 text-slate-400">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </header>

      <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="bg-[#0a0a0a] border-white/5 p-8 rounded-[2.5rem] lg:sticky lg:top-28">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              {isEditing ? <Pencil className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
              {isEditing ? "Edit Update" : "Add New Update"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Update Text *</Label>
                <Input 
                  value={form.text}
                  onChange={e => setForm({...form, text: e.target.value})}
                  className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                  placeholder="e.g. SLIA Sessions 2024 registration is now open!"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Link (Optional)</Label>
                  <Input 
                    value={form.link}
                    onChange={e => setForm({...form, link: e.target.value})}
                    className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                    placeholder="#"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Sort Order</Label>
                  <Input 
                    type="number"
                    value={form.sort_order}
                    onChange={e => {
                      const val = parseInt(e.target.value);
                      setForm({...form, sort_order: isNaN(val) ? 0 : val});
                    }}
                    className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 py-2">
                <Switch checked={form.is_active} onCheckedChange={val => setForm({...form, is_active: val})} />
                <Label className="text-sm text-slate-400">Visible in ticker</Label>
              </div>

              <Button type="submit" disabled={saving} className="w-full h-14 bg-primary text-white rounded-2xl font-bold">
                {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : (isEditing ? "Update Ticker Item" : "Add to Ticker")}
              </Button>
              {isEditing && (
                <Button variant="ghost" onClick={resetForm} className="w-full text-slate-500">
                  Discard Edits
                </Button>
              )}
            </form>
          </Card>
        </motion.div>

        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#0a0a0a] border border-white/5 p-6 rounded-[2rem] group hover:border-white/10 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${item.is_active ? "text-emerald-500" : "text-slate-600"}`}>
                    {item.is_active ? "Live" : "Inactive"}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(item)} className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-colors"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-500/10 rounded-xl text-slate-500 hover:text-red-500 transition-colors">
                      {deletingId === item.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-white mb-2 leading-tight">{item.text}</h4>
                <div className="flex items-center gap-4">
                  <p className="text-xs text-slate-500 font-mono truncate">{item.link}</p>
                  <span className="text-[10px] text-slate-700 ml-auto">Order: {item.sort_order}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {items.length === 0 && !loading && (
            <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
              <Megaphone className="h-12 w-12 text-slate-700 mx-auto mb-4" />
              <p className="text-slate-500">No ticker items found. Create one to show updates on the hero section.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TickerManager;
