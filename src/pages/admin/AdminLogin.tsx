import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Loader2, LogIn, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminAuthApi, ADMIN_TOKEN_KEY, ADMIN_USER_KEY } from "@/lib/api";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: string } | null)?.from || "/admin";

  if (localStorage.getItem(ADMIN_TOKEN_KEY)) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = await adminAuthApi.login(username.trim(), password);
      localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.user));
      toast.success("Logged in");
      navigate(data.user.role === "board_admin" ? "/admin/board-members" : redirectTo, { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] px-4 text-white">
      <Card className="w-full max-w-md border-white/5 bg-[#0a0a0a] p-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/20">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">SLIA Admin</h1>
            <p className="text-sm text-slate-400">Sign in to manage website content</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Username</Label>
            <Input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
              autoComplete="username"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
              autoComplete="current-password"
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="h-12 w-full rounded-xl bg-primary font-bold text-white">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
            Sign In
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AdminLogin;
