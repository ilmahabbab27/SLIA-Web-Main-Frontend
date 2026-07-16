import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Pencil, 
  Trash2, 
  Plus, 
  RefreshCw, 
  Loader2, 
  HelpCircle,
  MessageCircleQuestion
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { faqApi, type FaqItem } from "@/lib/api";

const emptyForm = (): Omit<FaqItem, "id" | "created_at" | "updated_at"> => ({
  question: "",
  answer: "",
  is_active: true,
  sort_order: 0,
});

const FAQManager = () => {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<any>(emptyForm());

  const fetchFaqs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await faqApi.list();
      setFaqs(data);
    } catch (err) {
      toast.error("Failed to load FAQs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchFaqs(); }, [fetchFaqs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.question.trim()) { toast.error("Question is required"); return; }
    if (!form.answer.trim()) { toast.error("Answer is required"); return; }

    setSaving(true);
    try {
      if (isEditing && form.id) {
        const updated = await faqApi.update(form.id, form);
        setFaqs(prev => prev.map(f => f.id === updated.id ? updated : f));
        toast.success("FAQ updated ✓");
      } else {
        const created = await faqApi.create(form);
        setFaqs(prev => [...prev, created]);
        toast.success("FAQ created ✓");
      }
      resetForm();
    } catch (err: any) {
      toast.error(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (faq: FaqItem) => {
    setForm(faq);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    setDeletingId(id);
    try {
      await faqApi.delete(id);
      setFaqs(prev => prev.filter(f => f.id !== id));
      toast.success("FAQ removed ✓");
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
              <HelpCircle className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Public Support</p>
          </div>
          <h2 className="text-4xl font-bold text-white tracking-tight">SLIA <span className="text-primary">FAQs</span></h2>
          <p className="text-slate-400 mt-2">Manage the Frequently Asked Questions shown to visitors.</p>
        </div>
        <Button variant="outline" onClick={fetchFaqs} disabled={loading} className="gap-2 border-white/10 text-slate-400">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </header>

      <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr]">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="bg-[#0a0a0a] border-white/5 p-8 rounded-[2.5rem] lg:sticky lg:top-28">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              <Plus className="h-5 w-5 text-primary" />
              {isEditing ? "Edit FAQ" : "Add New FAQ"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Question *</Label>
                <Input 
                  value={form.question}
                  onChange={e => setForm({...form, question: e.target.value})}
                  className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                  placeholder="e.g. How can I select my Architect?"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Answer *</Label>
                <Textarea 
                  value={form.answer}
                  onChange={e => setForm({...form, answer: e.target.value})}
                  className="bg-white/5 border-white/10 text-white min-h-[150px] rounded-xl"
                  placeholder="Provide a detailed answer..."
                />
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

              <div className="flex items-center gap-3 py-2">
                <Switch checked={form.is_active} onCheckedChange={val => setForm({...form, is_active: val})} />
                <Label className="text-sm text-slate-400">Visible on site</Label>
              </div>

              <Button type="submit" disabled={saving} className="w-full h-14 bg-primary text-white rounded-2xl font-bold">
                {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : (isEditing ? "Update FAQ" : "Create FAQ")}
              </Button>
            </form>
          </Card>
        </motion.div>

        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {faqs.map((faq) => (
              <motion.div
                key={faq.id}
                layout
                className="bg-[#0a0a0a] border border-white/5 p-6 rounded-[2rem] group hover:border-white/10 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${faq.is_active ? "text-emerald-500" : "text-slate-600"}`}>
                    {faq.is_active ? "Active" : "Hidden"}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(faq)} className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-colors"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(faq.id)} className="p-2 hover:bg-red-500/10 rounded-xl text-slate-500 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{faq.question}</h4>
                <p className="text-sm text-slate-400 line-clamp-3 mb-2">{faq.answer}</p>
                <div className="text-[10px] text-slate-700 font-bold uppercase">Order: {faq.sort_order}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default FAQManager;
