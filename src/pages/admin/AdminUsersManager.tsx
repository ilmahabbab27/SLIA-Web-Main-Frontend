import { useCallback, useEffect, useState } from "react";
import { KeyRound, Loader2, Pencil, RefreshCw, Save, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminUserApi, ADMIN_USER_KEY, type AdminUserItem } from "@/lib/api";

const boardLabels: Record<string, string> = {
  management: "Board of Management",
  bae: "Board of Architectural Education",
  pab: "Professional Affairs Board",
  bap: "Board of Architectural Publications",
};

type AccountForm = Record<number, { name: string; password: string }>;

const AdminUsersManager = () => {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [form, setForm] = useState<AccountForm>({});
  const [savedForm, setSavedForm] = useState<AccountForm>({});
  const [editingIds, setEditingIds] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminUserApi.list();
      const nextForm = data.reduce(
        (values, user) => ({ ...values, [user.id]: { name: user.name, password: "" } }),
        {} as AccountForm
      );
      setUsers(data);
      setForm(nextForm);
      setSavedForm(nextForm);
      setEditingIds({});
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not load admin accounts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateField = (id: number, key: "name" | "password", value: string) => {
    setForm((current) => ({
      ...current,
      [id]: {
        name: current[id]?.name || "",
        password: current[id]?.password || "",
        [key]: value,
      },
    }));
  };

  const startEdit = (user: AdminUserItem) => {
    setEditingIds((current) => ({ ...current, [user.id]: true }));
  };

  const cancelEdit = (user: AdminUserItem) => {
    setForm((current) => ({
      ...current,
      [user.id]: savedForm[user.id] || { name: user.name, password: "" },
    }));
    setEditingIds((current) => ({ ...current, [user.id]: false }));
  };

  const saveUser = async (user: AdminUserItem) => {
    const values = form[user.id];
    if (!values?.name.trim()) {
      toast.error("Username is required");
      return;
    }

    setSavingId(user.id);
    try {
      const updated = await adminUserApi.update(user.id, {
        name: values.name.trim(),
        ...(values.password ? { password: values.password } : {}),
      });

      setUsers((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setForm((current) => ({ ...current, [user.id]: { name: updated.name, password: "" } }));
      setSavedForm((current) => ({ ...current, [user.id]: { name: updated.name, password: "" } }));
      setEditingIds((current) => ({ ...current, [user.id]: false }));

      const currentUser = JSON.parse(localStorage.getItem(ADMIN_USER_KEY) || "{}") as { email?: string };
      if (currentUser.email === updated.email) {
        localStorage.setItem(ADMIN_USER_KEY, JSON.stringify({ ...currentUser, name: updated.name }));
      }

      toast.success("Admin account updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
              <KeyRound className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Admin Access</p>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-white">
            Admin <span className="text-primary">Accounts</span>
          </h2>
          <p className="mt-2 max-w-2xl text-slate-400">
            Update usernames and set new passwords for the main admin and board admin logins.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={fetchUsers} disabled={loading} className="gap-2 border-white/10 text-slate-400">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {users.map((user) => (
            <Card key={user.id} className="border-white/5 bg-[#0a0a0a] p-6">
              <div className="mb-5 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {user.role === "super_admin" ? "Main Admin" : boardLabels[user.board_key || ""] || "Board Admin"}
                  </h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-500">{user.email}</p>
                </div>
                <div className="ml-auto shrink-0">
                  {editingIds[user.id] ? (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => cancelEdit(user)}
                      disabled={savingId === user.id}
                      className="rounded-xl text-slate-400"
                    >
                      Cancel
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => startEdit(user)}
                      className="gap-2 rounded-xl border-white/10 text-slate-400"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Username</Label>
                  <Input
                    value={form[user.id]?.name || ""}
                    onChange={(event) => updateField(user.id, "name", event.target.value)}
                    readOnly={!editingIds[user.id]}
                    className={`h-12 rounded-xl border-white/10 ${
                      editingIds[user.id] ? "bg-white/5 text-white" : "cursor-not-allowed bg-white/[0.03] text-slate-400"
                    }`}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">New Password</Label>
                  <Input
                    type="password"
                    value={form[user.id]?.password || ""}
                    onChange={(event) => updateField(user.id, "password", event.target.value)}
                    readOnly={!editingIds[user.id]}
                    className={`h-12 rounded-xl border-white/10 ${
                      editingIds[user.id] ? "bg-white/5 text-white" : "cursor-not-allowed bg-white/[0.03] text-slate-400"
                    }`}
                    placeholder="Leave blank to keep current"
                  />
                </div>
              </div>

              {editingIds[user.id] && (
                <Button type="button" onClick={() => saveUser(user)} disabled={savingId === user.id} className="mt-5 h-12 rounded-xl bg-primary font-bold text-white">
                  {savingId === user.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  Save Account
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsersManager;
