import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mainAdminStorage } from "./storage";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

const MainAdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };
  const from = useMemo(() => location.state?.from || "/admin", [location.state?.from]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      mainAdminStorage.auth.setAuthed(true);
      navigate(from, { replace: true });
      return;
    }
    setError("Invalid username or password.");
  };

  return (
    <PageLayout title="Admin Login" subtitle="Main Admin Login" breadcrumb="Admin / Login">
      <section className="py-16">
        <div className="container max-w-lg">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            <h1 className="text-2xl font-semibold text-foreground">Admin login</h1>
            <p className="mt-2 text-sm text-foreground/70">Use your admin credentials to access the main admin panel.</p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="main-admin-username">Username</Label>
                <Input
                  id="main-admin-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  placeholder="Enter username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="main-admin-password">Password</Label>
                <Input
                  id="main-admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Enter password"
                />
              </div>

              {error ? <p className="text-sm text-destructive">{error}</p> : null}

              <div className="pt-2 flex gap-3">
                <Button type="submit" className="flex-1">
                  Login
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    mainAdminStorage.auth.clear();
                    setUsername("");
                    setPassword("");
                    setError(null);
                  }}
                >
                  Clear
                </Button>
              </div>

              <p className="text-xs text-foreground/60 leading-relaxed">
                Demo credentials (change in code): <span className="font-mono">admin</span> /{" "}
                <span className="font-mono">admin123</span>
              </p>
            </form>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default MainAdminLogin;

