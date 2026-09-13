import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Image as ImageIcon,
  Calendar,
  Images,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  ShieldCheck,
  HelpCircle,
  Megaphone,
  Mail,
  MessageSquareWarning,
  Users,
  KeyRound,
  Award,
  BookOpen,
  BriefcaseBusiness,
  GraduationCap
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { adminAuthApi, ADMIN_TOKEN_KEY, ADMIN_USER_KEY, type BoardMemberKey } from "@/lib/api";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Hero Manager", icon: ImageIcon, path: "/admin/hero" },
  { label: "Events Manager", icon: Calendar, path: "/admin/events" },
  { label: "Annual Events", icon: Images, path: "/admin/annual-events" },
  { label: "Council Manager", icon: Users, path: "/admin/council" },
  { label: "Board Members", icon: Users, path: "/admin/board-members" },
  { label: "Governance Boards", icon: ShieldCheck, path: "/admin/boards" },
  { label: "BOM Manager", icon: BriefcaseBusiness, path: "/admin/bom" },
  { label: "BAE Manager", icon: GraduationCap, path: "/admin/bae" },
  { label: "BAP Manager", icon: BookOpen, path: "/admin/bap" },
  { label: "PAB Manager", icon: ShieldCheck, path: "/admin/pab" },
  { label: "SLIA Members", icon: Users, path: "/admin/slia" },
  { label: "Contact Manager", icon: Mail, path: "/admin/contact" },
  { label: "Complaints & Inquiries", icon: MessageSquareWarning, path: "/admin/complaints" },
  { label: "FAQ Manager", icon: HelpCircle, path: "/admin/faqs" },
  { label: "Ticker Manager", icon: Megaphone, path: "/admin/ticker" },
  { label: "Award Categories", icon: Award, path: "/admin/award-categories" },
  { label: "Admin Accounts", icon: KeyRound, path: "/admin/users" },
];

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Closed by default on mobile
  const [isCollapsed, setIsCollapsed] = useState(false); // For desktop toggle
  const navigate = useNavigate();
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem(ADMIN_USER_KEY) || "{}") as {
        name?: string;
        email?: string;
        role?: "super_admin" | "board_admin";
        board_key?: BoardMemberKey | null;
      };
    } catch {
      return {};
    }
  })();
  const visibleNavItems = user.role === "board_admin" ? navItems.filter((item) => item.path === "/admin/board-members") : navItems;

  const handleLogout = async () => {
    try {
      await adminAuthApi.logout();
    } catch {
      // Local logout should still complete if the backend token already expired.
    } finally {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_USER_KEY);
      navigate("/admin/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-primary/30">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-[70] bg-[#0a0a0a]/95 backdrop-blur-xl border-r border-white/5 transition-all duration-500 ease-in-out
          ${isSidebarOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-20" : "lg:w-72"}`}
      >
        <div className="h-full flex flex-col p-4">
          {/* Logo Section */}
          <div className="flex items-center justify-between px-2 mb-10 h-12">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                <span className="font-heading text-white font-bold text-xl">S</span>
              </div>
              {(!isCollapsed || isSidebarOpen) && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="overflow-hidden whitespace-nowrap"
                  style={{ position: "relative" }}
                >
                  <p className="text-sm font-bold tracking-tighter text-white">SLIA ADMIN</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em]">Hero Editor</p>
                </motion.div>
              )}
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  end={item.path === "/admin"}
                  onClick={() => setIsSidebarOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 relative ${isActive
                      ? "bg-white/5 text-white"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.02]"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`h-5 w-5 shrink-0 transition-colors ${isActive ? "text-primary" : "group-hover:text-primary"}`} />
                      {(!isCollapsed || isSidebarOpen) && (
                        <span className="text-sm font-medium">{item.label}</span>
                      )}
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-white/5 space-y-1.5">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex items-center gap-3 w-full px-3 py-3 text-slate-400 hover:text-white hover:bg-white/[0.02] rounded-xl transition-all"
            >
              <Menu className="h-5 w-5" />
              {!isCollapsed && <span className="text-sm">Collapse Menu</span>}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-3 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/5 rounded-xl transition-all"
            >
              <LogOut className="h-5 w-5" />
              {(!isCollapsed || isSidebarOpen) && <span className="text-sm">Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-500 ease-in-out min-h-screen min-w-0 flex flex-col overflow-x-hidden 
          ${isCollapsed ? "lg:pl-20" : "lg:pl-72"}`}
      >
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-4 md:px-8 bg-[#050505]/50 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden h-10 w-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 rounded-xl"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="relative group hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search resources..."
                className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm w-48 md:w-64 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <button className="relative text-slate-400 hover:text-white transition-colors h-10 w-10 flex items-center justify-center">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-primary rounded-full border-2 border-[#050505]" />
            </button>
            <div className="h-8 w-px bg-white/10 hidden md:block" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden lg:block">
                <p className="text-xs font-bold text-white uppercase tracking-wider">{user.name || "Admin User"}</p>
                <p className="text-[10px] text-primary font-medium">{user.email || "SLIA Secretariat"}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-emerald-800 border border-white/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-white">AU</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="w-full min-w-0 max-w-7xl flex-1 p-4 md:p-8 lg:mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
