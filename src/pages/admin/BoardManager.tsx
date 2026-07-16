import { useCallback, useEffect, useState } from "react";
import { Image as ImageIcon, Loader2, RefreshCw, Save, ShieldCheck, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { boardApi, type BoardItem } from "@/lib/api";

const BoardManager = () => {
  const [boards, setBoards] = useState<BoardItem[]>([]);
  const [descriptions, setDescriptions] = useState<Record<number, string>>({});
  const [savedDescriptions, setSavedDescriptions] = useState<Record<number, string>>({});
  const [logos, setLogos] = useState<Record<number, string>>({});
  const [savedLogos, setSavedLogos] = useState<Record<number, string>>({});
  const [editingIds, setEditingIds] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);

  const fetchBoards = useCallback(async () => {
    setLoading(true);
    try {
      const data = await boardApi.list();
      setBoards(data);
      setDescriptions(
        data.reduce((values, board) => ({ ...values, [board.id]: board.description || "" }), {} as Record<number, string>)
      );
      setSavedDescriptions(
        data.reduce((values, board) => ({ ...values, [board.id]: board.description || "" }), {} as Record<number, string>)
      );
      const nextLogos = data.reduce((values, board) => ({ ...values, [board.id]: board.icon || "" }), {} as Record<number, string>);
      setLogos(nextLogos);
      setSavedLogos(nextLogos);
      setEditingIds({});
    } catch {
      toast.error("Failed to load governance boards");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Could not read logo file."));
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

  const handleLogoChange = async (board: BoardItem, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Logo must be 2MB or smaller.");
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setLogos((current) => ({ ...current, [board.id]: dataUrl }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not upload logo");
    }
  };

  const removeLogo = (board: BoardItem) => {
    setLogos((current) => ({ ...current, [board.id]: "" }));
  };

  const startEdit = (board: BoardItem) => {
    setEditingIds((current) => ({ ...current, [board.id]: true }));
  };

  const cancelEdit = (board: BoardItem) => {
    setDescriptions((current) => ({ ...current, [board.id]: savedDescriptions[board.id] || "" }));
    setLogos((current) => ({ ...current, [board.id]: savedLogos[board.id] || "" }));
    setEditingIds((current) => ({ ...current, [board.id]: false }));
  };

  const saveBoard = async (board: BoardItem) => {
    setSavingId(board.id);
    try {
      const updated = await boardApi.update(board.id, {
        description: descriptions[board.id] || "",
        icon: logos[board.id] || "",
      });
      setBoards((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      setDescriptions((current) => ({ ...current, [updated.id]: updated.description || "" }));
      setSavedDescriptions((current) => ({ ...current, [updated.id]: updated.description || "" }));
      setLogos((current) => ({ ...current, [updated.id]: updated.icon || "" }));
      setSavedLogos((current) => ({ ...current, [updated.id]: updated.icon || "" }));
      setEditingIds((current) => ({ ...current, [updated.id]: false }));
      toast.success("Board details updated");
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
              <ShieldCheck className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Governance Boards</p>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-white">
            Board <span className="text-primary">Details</span>
          </h2>
          <p className="mt-2 max-w-2xl text-slate-400">
            The four governance boards, links, and order are fixed. Update the public descriptions and board logos here.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={fetchBoards} disabled={loading} className="gap-2 border-white/10 text-slate-400">
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
          {boards.map((board) => (
            <Card key={board.id} className="border-white/5 bg-[#0a0a0a] p-6">
              <div className="mb-5 flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                  {logos[board.id] ? (
                    <img src={logos[board.id]} alt={`${board.name} logo`} className="h-9 w-9 object-contain" />
                  ) : (
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-white">{board.name}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
                    {board.path} / Order {board.sort_order}
                  </p>
                </div>
                <div className="ml-auto shrink-0">
                  {editingIds[board.id] ? (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => cancelEdit(board)}
                      disabled={savingId === board.id}
                      className="rounded-xl text-slate-400"
                    >
                      Cancel
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => startEdit(board)}
                      className="rounded-xl border-white/10 text-slate-400"
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </div>

              <div className="mb-5 space-y-3">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Board Logo</Label>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                    {logos[board.id] ? (
                      <img src={logos[board.id]} alt={`${board.name} logo preview`} className="h-16 w-16 object-contain" />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-slate-600" />
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={!editingIds[board.id] || savingId === board.id}
                      className="relative gap-2 overflow-hidden rounded-xl border-white/10 text-slate-400 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Logo
                      <input
                        type="file"
                        accept="image/*,.svg"
                        onChange={(event) => handleLogoChange(board, event)}
                        disabled={!editingIds[board.id] || savingId === board.id}
                        className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
                      />
                    </Button>
                    {logos[board.id] && editingIds[board.id] && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => removeLogo(board)}
                        disabled={savingId === board.id}
                        className="gap-2 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-600">Recommended: transparent PNG or SVG, maximum 2MB.</p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Description</Label>
                <Textarea
                  value={descriptions[board.id] || ""}
                  onChange={(event) =>
                    setDescriptions((current) => ({ ...current, [board.id]: event.target.value }))
                  }
                  readOnly={!editingIds[board.id]}
                  className={`min-h-[140px] rounded-xl border-white/10 ${
                    editingIds[board.id] ? "bg-white/5 text-white" : "cursor-not-allowed bg-white/[0.03] text-slate-400"
                  }`}
                />
              </div>

              {editingIds[board.id] && (
                <Button
                  type="button"
                  onClick={() => saveBoard(board)}
                  disabled={savingId === board.id}
                  className="mt-5 h-12 rounded-xl bg-primary font-bold text-white"
                >
                  {savingId === board.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                  Save Details
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardManager;
