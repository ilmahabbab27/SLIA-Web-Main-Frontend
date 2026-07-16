import { useCallback, useEffect, useMemo, useState } from "react";
import { Image as ImageIcon, Loader2, Pencil, Plus, RefreshCw, Search, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ADMIN_USER_KEY, boardMemberApi, type BoardMemberItem, type BoardMemberKey } from "@/lib/api";

type BoardMemberForm = Omit<BoardMemberItem, "created_at" | "updated_at">;

const boardOptions: Array<{ value: BoardMemberKey; label: string }> = [
  { value: "trustees", label: "Board of Trustees" },
  { value: "management", label: "Board of Management" },
  { value: "bae", label: "Board of Architectural Education" },
  { value: "pab", label: "Professional Affairs Board" },
  { value: "bap", label: "Board of Architectural Publications" },
];

const maxImageDimension = 900;
const imageQuality = 0.8;

const emptyForm = (boardKey: BoardMemberKey = "trustees"): BoardMemberForm => ({
  id: 0,
  board_key: boardKey,
  image: "",
  name: "",
  designation: "",
  is_active: true,
  sort_order: 0,
});

const getErrorMessage = (err: unknown, fallback: string) =>
  err instanceof Error && err.message ? err.message : fallback;

const fileToCompressedDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Could not read image file."));
    reader.onload = () => {
      const source = reader.result as string;
      const image = new Image();

      image.onerror = () => resolve(source);
      image.onload = () => {
        const scale = Math.min(1, maxImageDimension / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          resolve(source);
          return;
        }

        canvas.width = width;
        canvas.height = height;
        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", imageQuality));
      };

      image.src = source;
    };

    reader.readAsDataURL(file);
  });

const BoardMembersManager = () => {
  const adminUser = (() => {
    try {
      return JSON.parse(localStorage.getItem(ADMIN_USER_KEY) || "{}") as {
        role?: "super_admin" | "board_admin";
        board_key?: BoardMemberKey | null;
      };
    } catch {
      return {};
    }
  })();
  const allowedBoard = adminUser.role === "board_admin" ? adminUser.board_key || "management" : null;
  const visibleBoardOptions = allowedBoard ? boardOptions.filter((option) => option.value === allowedBoard) : boardOptions;
  const [members, setMembers] = useState<BoardMemberItem[]>([]);
  const [activeBoard, setActiveBoard] = useState<BoardMemberKey>(allowedBoard || "trustees");
  const [form, setForm] = useState<BoardMemberForm>(emptyForm(allowedBoard || "trustees"));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const isEditing = form.id > 0;

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      setMembers(await boardMemberApi.list());
    } catch (err) {
      setMembers([]);
      toast.error(getErrorMessage(err, "Could not load board members."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const filteredMembers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return [...members]
      .filter((member) => member.board_key === activeBoard)
      .sort((a, b) => a.sort_order - b.sort_order)
      .filter((member) => {
        if (!query) return true;
        return [member.name, member.designation].join(" ").toLowerCase().includes(query);
      });
  }, [activeBoard, members, searchQuery]);

  const resetForm = (boardKey: BoardMemberKey = activeBoard) => setForm(emptyForm(allowedBoard || boardKey));

  const changeActiveBoard = (boardKey: BoardMemberKey) => {
    if (allowedBoard) return;
    setActiveBoard(boardKey);
    resetForm(boardKey);
    setSearchQuery("");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    fileToCompressedDataUrl(file)
      .then((image) => setForm((current) => ({ ...current, image })))
      .catch((err: Error) => toast.error(err.message || "Could not process selected image."));

    e.target.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Name is required.");
      return;
    }

    if (!form.designation.trim()) {
      toast.error("Designation is required.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        board_key: allowedBoard || form.board_key,
        image: form.image || "",
        name: form.name.trim(),
        designation: form.designation.trim(),
        is_active: form.is_active,
        sort_order: form.sort_order,
      };

      if (isEditing) {
        await boardMemberApi.update(form.id, payload);
        toast.success("Board member updated");
      } else {
        await boardMemberApi.create(payload);
        toast.success("Board member added");
      }

      await fetchMembers();
      resetForm(form.board_key);
    } catch (err) {
      toast.error(getErrorMessage(err, "Save failed."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (member: BoardMemberItem) => {
    if (!confirm(`Delete ${member.name}?`)) return;

    setDeletingId(member.id);
    try {
      await boardMemberApi.delete(member.id);
      await fetchMembers();
      if (form.id === member.id) resetForm(member.board_key);
      toast.success("Board member deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Delete failed."));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="min-w-0 space-y-8 pb-20">
      <header className="flex min-w-0 flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">About Boards</p>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Board <span className="text-primary">Members</span>
          </h2>
          <p className="mt-2 max-w-2xl text-slate-400">
            Manage images, names, designations, order, and visibility for the About board pages.
          </p>
        </div>

        <Button type="button" variant="outline" onClick={fetchMembers} disabled={loading} className="h-10 gap-2 rounded-xl border-white/10 text-slate-400">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </header>

      <div className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.35fr)]">
        <Card className="border-white/5 bg-[#0a0a0a] p-4 sm:p-6 xl:sticky xl:top-28 xl:p-8">
          <h3 className="mb-6 flex items-center gap-3 text-lg font-bold text-white">
            {isEditing ? <Pencil className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
            {isEditing ? "Edit Member" : "Add Member"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Board</Label>
              <Select value={allowedBoard || form.board_key} onValueChange={(value: BoardMemberKey) => setForm((current) => ({ ...current, board_key: allowedBoard || value }))} disabled={Boolean(allowedBoard)}>
                <SelectTrigger className="h-12 rounded-xl border-white/10 bg-white/5 text-white">
                  <SelectValue placeholder="Select board" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-[#0a0a0a] text-white">
                  {visibleBoardOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Image</Label>
              <div className="flex items-center gap-4">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5">
                  {form.image ? <img src={form.image} alt="Board member preview" className="h-full w-full object-cover" /> : <ImageIcon className="h-8 w-8 text-slate-600" />}
                </div>
                <div className="relative flex min-h-20 flex-1 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] px-4 text-center transition hover:bg-white/[0.05]">
                  <p className="text-xs font-medium text-slate-500">Click to upload image</p>
                  <input type="file" className="absolute inset-0 cursor-pointer opacity-0" accept="image/*" onChange={handleImageChange} />
                </div>
              </div>
              {form.image && (
                <Button type="button" variant="ghost" onClick={() => setForm((current) => ({ ...current, image: "" }))} className="text-slate-500">
                  Remove Image
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Name *</Label>
              <Input value={form.name} onChange={(e) => setForm((current) => ({ ...current, name: e.target.value }))} className="h-12 rounded-xl border-white/10 bg-white/5 text-white" placeholder="Ar. Name" />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Designation *</Label>
              <Input value={form.designation} onChange={(e) => setForm((current) => ({ ...current, designation: e.target.value }))} className="h-12 rounded-xl border-white/10 bg-white/5 text-white" placeholder="Chairman" />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Sort Order</Label>
              <Input type="number" value={form.sort_order} onChange={(e) => setForm((current) => ({ ...current, sort_order: Number(e.target.value) || 0 }))} className="h-12 rounded-xl border-white/10 bg-white/5 text-white" />
            </div>

            <div className="flex items-center gap-3 py-2">
              <Switch checked={form.is_active} onCheckedChange={(value) => setForm((current) => ({ ...current, is_active: value }))} />
              <Label className="text-sm text-slate-400">Visible on site</Label>
            </div>

            <Button type="submit" disabled={saving} className="h-14 w-full rounded-2xl bg-primary font-bold text-white">
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : isEditing ? "Update Member" : "Add Member"}
            </Button>
            {isEditing && (
              <Button type="button" variant="ghost" onClick={() => resetForm()} className="w-full text-slate-500">
                Discard Edits
              </Button>
            )}
          </form>
        </Card>

        <div className="min-w-0 space-y-4">
          <div className="grid gap-3 border border-white/5 bg-[#0a0a0a] p-4 md:grid-cols-[260px_1fr_auto]">
            <Select value={activeBoard} onValueChange={changeActiveBoard} disabled={Boolean(allowedBoard)}>
              <SelectTrigger className="h-10 rounded-xl border-white/10 bg-white/5 text-white">
                <SelectValue placeholder="Select board" />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-[#0a0a0a] text-white">
                {visibleBoardOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-10 rounded-xl border-white/10 bg-white/5 pl-9 text-white placeholder:text-slate-600" placeholder="Search members" />
            </div>
            <div className="flex items-center text-sm text-slate-500">{filteredMembers.length} member(s)</div>
          </div>

          {loading && (
            <div className="border border-white/5 bg-[#0a0a0a] py-16 text-center">
              <Loader2 className="mx-auto mb-3 h-6 w-6 animate-spin text-primary" />
              <p className="text-sm text-slate-500">Loading board members...</p>
            </div>
          )}

          {!loading && filteredMembers.length === 0 && (
            <div className="border-2 border-dashed border-white/5 py-20 text-center">
              <p className="text-slate-600">No board members match this selection.</p>
            </div>
          )}

          {!loading &&
            filteredMembers.map((member) => (
              <div key={member.id} className="border border-white/5 bg-[#0a0a0a] p-4 sm:p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5">
                    {member.image ? <img src={member.image} alt={member.name} className="h-full w-full object-cover" /> : <Users className="h-6 w-6 text-slate-700" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-lg font-bold text-white">{member.name}</h4>
                    <p className="truncate text-sm text-primary">{member.designation}</p>
                    <p className={member.is_active ? "mt-1 text-xs font-bold text-emerald-400" : "mt-1 text-xs font-bold text-red-500/70"}>
                      {member.is_active ? "Visible" : "Hidden"} - Order {member.sort_order}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => setForm({ ...member })} disabled={saving || deletingId === member.id} aria-label={`Edit ${member.name}`} className="p-2 text-slate-500 transition-colors hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40">
                      <Pencil size={14} />
                    </button>
                    <button type="button" onClick={() => handleDelete(member)} disabled={saving || deletingId === member.id} aria-label={`Delete ${member.name}`} className="p-2 text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40">
                      {deletingId === member.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default BoardMembersManager;
