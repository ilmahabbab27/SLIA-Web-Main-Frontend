import { useMemo, useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { bapAdminStorage } from "./storage";
import type { PublicationGroup, PublicationRecord } from "./types";

const uid = () => `${Date.now()}_${Math.random().toString(16).slice(2)}`;

const groups: { key: PublicationGroup; label: string }[] = [
  { key: "the-architect", label: "The Architect" },
  { key: "vastu", label: "Vastu" },
  { key: "built-environment", label: "Built Environmental journal" },
  { key: "now-architecture", label: "Now architecture" },
  { key: "archive-journal", label: "Archive Journal" },
  { key: "year-book", label: "Architects year book" },
];

const emptyForm = (): Omit<PublicationRecord, "id"> => ({
  group: "the-architect",
  coverSrc: "/images/hero-1.jpg",
  volume: "",
  title: "",
  uploadedAt: new Date().toISOString().slice(0, 10),
  href: "/brochure.pdf",
  downloadName: "",
  meta: "",
});

const Publications = () => {
  const [items, setItems] = useState<PublicationRecord[]>(() => bapAdminStorage.publications.getAll([]));
  const [query, setQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState<PublicationGroup>("the-architect");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PublicationRecord | null>(null);
  const [form, setForm] = useState<Omit<PublicationRecord, "id">>(() => emptyForm());

  const persist = (next: PublicationRecord[]) => {
    setItems(next);
    bapAdminStorage.publications.setAll(next);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((p) => p.group === activeGroup)
      .filter((p) => {
        if (!q) return true;
        return `${p.title} ${p.volume} ${p.uploadedAt} ${p.meta || ""}`.toLowerCase().includes(q);
      })
      .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  }, [items, query, activeGroup]);

  const startCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm(), group: activeGroup });
    setOpen(true);
  };

  const startEdit = (p: PublicationRecord) => {
    setEditing(p);
    const { id: _id, ...rest } = p;
    setForm(rest);
    setOpen(true);
  };

  const save = () => {
    const normalized: Omit<PublicationRecord, "id"> = {
      group: form.group,
      coverSrc: form.coverSrc.trim() || "/images/hero-1.jpg",
      volume: form.volume.trim(),
      title: form.title.trim(),
      uploadedAt: form.uploadedAt.trim() || new Date().toISOString().slice(0, 10),
      href: form.href.trim() || "/brochure.pdf",
      downloadName: form.downloadName?.trim() || "",
      meta: form.meta?.trim() || "",
    };
    if (!normalized.title || !normalized.volume) return;

    if (editing) {
      persist(items.map((p) => (p.id === editing.id ? { ...editing, ...normalized } : p)));
    } else {
      persist([{ id: uid(), ...normalized }, ...items]);
    }
    setOpen(false);
  };

  const remove = (id: string) => persist(items.filter((p) => p.id !== id));

  return (
    <PageLayout title="Publications" subtitle="Publications" breadcrumb="BAP Admin / Publications">
      <section className="py-16">
        <div className="container max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Publications</h1>
              <p className="mt-2 text-foreground/70">Manage items shown on the public publications tabs.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <a href="/bap-admin">Back</a>
              </Button>
              <Button onClick={startCreate}>Add publication</Button>
            </div>
          </div>

          <div className="mt-8">
            <Tabs value={activeGroup} onValueChange={(v) => setActiveGroup(v as PublicationGroup)}>
              <TabsList className="w-full h-auto flex flex-wrap justify-start gap-1">
                {groups.map((g) => (
                  <TabsTrigger key={g.key} value={g.key} className="flex-1 sm:flex-none">
                    {g.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value={activeGroup} className="mt-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div className="w-full sm:w-[420px]">
                    <Label htmlFor="bap-admin-search" className="text-sm text-foreground/70">
                      Search
                    </Label>
                    <Input
                      id="bap-admin-search"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search by title, volume, date..."
                      className="mt-2"
                    />
                  </div>
                  <p className="text-sm text-foreground/60">
                    Showing <span className="font-medium text-foreground/80">{filtered.length}</span>
                  </p>
                </div>

                <div className="mt-6 rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[140px]">Cover</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead className="w-[200px]">Volume</TableHead>
                        <TableHead className="w-[150px]">Uploaded</TableHead>
                        <TableHead className="w-[190px]" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.length ? (
                        filtered.map((p) => (
                          <TableRow key={p.id}>
                            <TableCell>
                              <img
                                src={p.coverSrc}
                                alt="Cover"
                                className="h-16 w-12 rounded-md border border-border object-cover bg-muted"
                                loading="lazy"
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              {p.title}
                              {p.meta && (
                                <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase font-bold">
                                  {p.meta}
                                </span>
                              )}
                            </TableCell>
                            <TableCell>{p.volume}</TableCell>
                            <TableCell>{p.uploadedAt}</TableCell>
                            <TableCell className="text-right">
                              <div className="inline-flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => startEdit(p)}>
                                  Edit
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => remove(p.id)}>
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="py-10 text-center text-foreground/60">
                            No items yet. Click “Add publication” to create one.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit publication" : "Add publication"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 max-h-[80vh] overflow-y-auto pr-2">
            <div className="grid gap-2">
              <Label>Group</Label>
              <Select value={form.group} onValueChange={(v) => setForm((p) => ({ ...p, group: v as PublicationGroup }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((g) => (
                    <SelectItem key={g.key} value={g.key}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bap-title">Title</Label>
              <Input
                id="bap-title"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Publication title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bap-volume">Volume / Issue</Label>
              <Input
                id="bap-volume"
                value={form.volume}
                onChange={(e) => setForm((p) => ({ ...p, volume: e.target.value }))}
                placeholder="Issue 01 / Vol 02 / 2026"
              />
            </div>

            <div className="grid gap-2 border-t pt-4">
              <Label>File Upload (Optional)</Label>
              <Input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  if (file.size > 2 * 1024 * 1024) {
                    alert("File is too large (max 2MB for browser storage). Please use a URL Instead.");
                    e.target.value = "";
                    return;
                  }

                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const dataUrl = event.target?.result as string;
                    const ext = file.name.split(".").pop()?.toUpperCase() || "FILE";
                    setForm((p) => ({
                      ...p,
                      title: p.title || file.name.replace(/\.[^/.]+$/, ""),
                      href: dataUrl,
                      meta: ext,
                      downloadName: file.name,
                    }));
                  };
                  reader.readAsDataURL(file);
                }}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
              />
              <p className="text-[10px] text-muted-foreground italic">
                Files are stored in your browser's local storage. Max 2MB recommended.
              </p>
            </div>

            <div className="grid gap-2 border-t pt-4">
              <Label htmlFor="bap-cover-upload">Cover Image Upload (Optional)</Label>
              <Input
                id="bap-cover-upload"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 1024 * 1024) {
                    alert("Image is too large (max 1MB).");
                    e.target.value = "";
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setForm((p) => ({ ...p, coverSrc: event.target?.result as string }));
                  };
                  reader.readAsDataURL(file);
                }}
                accept="image/*"
              />
            </div>

            <div className="grid gap-2 border-t pt-4">
              <Label htmlFor="bap-date">Uploaded date</Label>
              <Input
                id="bap-date"
                value={form.uploadedAt}
                onChange={(e) => setForm((p) => ({ ...p, uploadedAt: e.target.value }))}
                placeholder="YYYY-MM-DD"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bap-meta">File Type (Meta)</Label>
              <Input
                id="bap-meta"
                value={form.meta || ""}
                onChange={(e) => setForm((p) => ({ ...p, meta: e.target.value }))}
                placeholder="PDF / DOCX"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bap-download">Download Filename</Label>
              <Input
                id="bap-download"
                value={form.downloadName || ""}
                onChange={(e) => setForm((p) => ({ ...p, downloadName: e.target.value }))}
                placeholder="publication.pdf"
              />
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Button
              className="flex-1"
              onClick={save}
              disabled={!form.title.trim() || !form.volume.trim()}
            >
              Save
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Publications;

