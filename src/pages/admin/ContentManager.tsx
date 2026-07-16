import { motion } from "framer-motion";
import { FileText, Plus, Search, Filter, MoreHorizontal, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContentManager = ({ title, description }: { title: string, description: string }) => {
  return (
    <div className="space-y-10 text-white">
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-bold text-white tracking-tight">{title}</h2>
          <p className="text-slate-400 mt-2 max-w-2xl">{description}</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 h-12 font-bold shadow-lg shadow-primary/20">
          <Plus className="h-5 w-5 mr-2" /> New Entry
        </Button>
      </section>

      {/* Toolbar */}
      <section className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#0a0a0a] border border-white/5 p-4 rounded-3xl">
        <div className="relative w-full sm:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search items..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-all text-white"
          />
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-white/5 border-white/10 text-white rounded-2xl px-5 flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
        </div>
      </section>

      {/* Table / List */}
      <section className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Title & Information</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Status</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Last Modified</th>
              <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                      <FileText className="h-6 w-6 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white group-hover:text-primary transition-colors cursor-pointer">Draft Entry #{i}</p>
                      <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Ref: SLIA-2026-00{i}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${i % 2 === 0 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                    {i % 2 === 0 ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-8 py-6 text-sm text-slate-400 font-medium">
                  {i} hour{i > 1 ? 's' : ''} ago
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-white hover:bg-white/10">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-red-500/50 hover:text-red-500 hover:bg-red-500/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-white hover:bg-white/10">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="px-8 py-6 border-t border-white/5 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Showing 5 of 24 entries</p>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-white/5 border-white/10 text-white rounded-xl h-9 text-xs">Prev</Button>
            <Button variant="outline" className="bg-white/5 border-white/10 text-white rounded-xl h-9 text-xs">Next</Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContentManager;
