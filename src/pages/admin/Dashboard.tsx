import { motion } from "framer-motion";
import {
  Image as ImageIcon,
  MousePointer2,
  Sparkles,
  Plus,
  Layout,
  Calendar,
  ShieldCheck,
  HelpCircle,
  Megaphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { heroApi, eventApi, boardApi, faqApi, tickerApi } from "@/lib/api";

const Dashboard = () => {
  const [slideCount, setSlideCount] = useState<number | null>(null);
  const [eventCount, setEventCount] = useState<number | null>(null);
  const [boardCount, setBoardCount] = useState<number | null>(null);
  const [faqCount, setFaqCount] = useState<number | null>(null);
  const [tickerCount, setTickerCount] = useState<number | null>(null);

  useEffect(() => {
    heroApi
      .list()
      .then((data) => setSlideCount(data.length))
      .catch(() => setSlideCount(0));

    eventApi
      .list()
      .then((data) => setEventCount(data.length))
      .catch(() => setEventCount(0));

    boardApi
      .list()
      .then((data) => setBoardCount(data.length))
      .catch(() => setBoardCount(0));

    faqApi
      .list()
      .then((data) => setFaqCount(data.length))
      .catch(() => setFaqCount(0));

    tickerApi
      .list()
      .then((data) => setTickerCount(data.length))
      .catch(() => setTickerCount(0));
  }, []);

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white tracking-tight"
          >
            Hero <span className="text-primary">Dashboard</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 mt-2"
          >
            Manage the visual center of the SLIA homepage.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3"
        >
          <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 flex items-center gap-2">
            <Link to="/admin/hero">
              <Plus className="h-4 w-4" /> Add New Slide
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* Hero Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-primary/30 transition-all duration-500"
        >
          <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <Layout className="h-6 w-6 text-blue-400" />
          </div>
          <p className="text-slate-400 text-sm font-medium">Active Slides</p>
          <h3 className="text-4xl font-bold text-white mt-1">
            {slideCount === null ? <span className="text-slate-600 text-2xl animate-pulse">…</span> : slideCount}
          </h3>
          <p className="text-xs text-slate-500 mt-2 font-bold uppercase tracking-widest">Currently live on site</p>
          <Button asChild variant="link" className="text-xs text-slate-500 hover:text-white p-0 h-auto mt-4">
            <Link to="/admin/hero">Manage Hero &rarr;</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-primary/30 transition-all duration-500"
        >
          <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <Calendar className="h-6 w-6 text-emerald-400" />
          </div>
          <p className="text-slate-400 text-sm font-medium">Highlights</p>
          <h3 className="text-4xl font-bold text-white mt-1">
            {eventCount === null ? <span className="text-slate-600 text-2xl animate-pulse">…</span> : eventCount}
          </h3>
          <p className="text-xs text-emerald-500 mt-2 font-bold uppercase tracking-widest">Live events</p>
          <Button asChild variant="link" className="text-xs text-slate-500 hover:text-white p-0 h-auto mt-4">
            <Link to="/admin/events">Manage Events &rarr;</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-primary/30 transition-all duration-500"
        >
          <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <ShieldCheck className="h-6 w-6 text-amber-400" />
          </div>
          <p className="text-slate-400 text-sm font-medium">Governance Boards</p>
          <h3 className="text-4xl font-bold text-white mt-1">
            {boardCount === null ? <span className="text-slate-600 text-2xl animate-pulse">…</span> : boardCount}
          </h3>
          <p className="text-xs text-slate-500 mt-2 font-bold uppercase tracking-widest">Active Boards</p>
          <Button asChild variant="link" className="text-xs text-slate-500 hover:text-white p-0 h-auto mt-4">
            <Link to="/admin/boards">Manage Boards &rarr;</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-primary/30 transition-all duration-500"
        >
          <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <HelpCircle className="h-6 w-6 text-blue-400" />
          </div>
          <p className="text-slate-400 text-sm font-medium">FAQs</p>
          <h3 className="text-4xl font-bold text-white mt-1">
            {faqCount === null ? <span className="text-slate-600 text-2xl animate-pulse">…</span> : faqCount}
          </h3>
          <p className="text-xs text-slate-500 mt-2 font-bold uppercase tracking-widest">Questions active</p>
          <Button asChild variant="link" className="text-xs text-slate-500 hover:text-white p-0 h-auto mt-4">
            <Link to="/admin/faqs">Manage FAQs &rarr;</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#0a0a0a] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-primary/30 transition-all duration-500"
        >
          <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <Megaphone className="h-6 w-6 text-primary" />
          </div>
          <p className="text-slate-400 text-sm font-medium">News Ticker</p>
          <h3 className="text-4xl font-bold text-white mt-1">
            {tickerCount === null ? <span className="text-slate-600 text-2xl animate-pulse">…</span> : tickerCount}
          </h3>
          <p className="text-xs text-primary mt-2 font-bold uppercase tracking-widest">Live Updates</p>
          <Button asChild variant="link" className="text-xs text-slate-500 hover:text-white p-0 h-auto mt-4">
            <Link to="/admin/ticker">Manage Ticker &rarr;</Link>
          </Button>
        </motion.div>
      </section>

      {/* Quick Access Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-primary/20 to-emerald-900/20 border border-primary/20 rounded-[3rem] p-12 relative overflow-hidden group"
      >
        <div className="relative z-10 max-w-xl">
          <h4 className="text-3xl font-bold text-white mb-4">Ready to refresh your homepage?</h4>
          <p className="text-slate-300 mb-8 leading-relaxed">
            Updating your hero slides regularly keeps the site feeling fresh and professional. You can add new announcements, event highlights, or architectural showcases in seconds.
          </p>
          <Button asChild className="bg-white text-black hover:bg-white/90 rounded-full px-8 h-12 font-bold transition-all active:scale-95">
            <Link to="/admin/hero">Open Hero Manager &rarr;</Link>
          </Button>
        </div>

        {/* Decorative elements */}
        <div className="absolute right-[-10%] top-[-10%] h-64 w-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute right-10 bottom-10 opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none">
          <ImageIcon size={200} className="text-white" />
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
