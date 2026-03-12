import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { bomAdminStorage } from "./storage";

const FALLBACK_USERNAME = "admin";
const FALLBACK_PASSWORD = "bomadmin123";

const getCredentials = () => {
    try {
        const raw = localStorage.getItem("board_admin_credentials_v1");
        if (!raw) return { username: FALLBACK_USERNAME, password: FALLBACK_PASSWORD };
        const parsed = JSON.parse(raw) as Array<{ key?: string; username?: string; password?: string }>;
        const found = Array.isArray(parsed) ? parsed.find((x) => x?.key === "bom") : null;
        if (found?.username && found?.password) return { username: String(found.username), password: String(found.password) };
    } catch {
        // ignore
    }
    return { username: FALLBACK_USERNAME, password: FALLBACK_PASSWORD };
};

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation() as { state?: { from?: string } };
    const from = useMemo(() => location.state?.from || "/bom-admin", [location.state?.from]);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        const creds = getCredentials();
        if (username.trim() === creds.username && password === creds.password) {
            bomAdminStorage.auth.setAuthed(true);
            navigate(from, { replace: true });
            return;
        }
        setError("Invalid username or password.");
    };

    return (
        <PageLayout title="BOM Admin Login" subtitle="Board of Management" breadcrumb="Boards / Board of Management / Login">
            <section className="py-16">
                <div className="container max-w-lg">
                    <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
                        <h1 className="text-2xl font-semibold text-foreground">Authorities Login</h1>
                        <p className="mt-2 text-sm text-foreground/70">
                            Use your admin credentials to manage Board of Management content.
                        </p>

                        <form onSubmit={onSubmit} className="mt-6 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="bom-admin-username">Username</Label>
                                <Input
                                    id="bom-admin-username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    autoComplete="username"
                                    placeholder="Enter username"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bom-admin-password">Password</Label>
                                <Input
                                    id="bom-admin-password"
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
                                    onClick={() => navigate("/management")}
                                >
                                    Back
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </PageLayout>
    );
};

export default Login;
