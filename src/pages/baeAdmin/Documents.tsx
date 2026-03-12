import { useMemo, useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { baeAdminStorage } from "./storage";
import type { BaeDocument, BaeDocumentCategory } from "./types";

const uid = () => `${Date.now()}_${Math.random().toString(16).slice(2)}`;

const categories: { key: BaeDocumentCategory; label: string }[] = [
    { key: "applications", label: "Applications" },
    { key: "notices", label: "Notices" },
    { key: "references", label: "References" },
];

const emptyForm = (): Omit<BaeDocument, "id"> => ({
    title: "",
    category: "applications",
    href: "/brochure.pdf",
    downloadName: "",
    meta: "PDF",
    uploadedAt: new Date().toISOString().slice(0, 10),
});

const Documents = () => {
    const [items, setItems] = useState<BaeDocument[]>(() => baeAdminStorage.documents.getAll([]));
    const [query, setQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState<BaeDocumentCategory>("applications");
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<BaeDocument | null>(null);
    const [form, setForm] = useState<Omit<BaeDocument, "id">>(() => emptyForm());

    const persist = (next: BaeDocument[]) => {
        setItems(next);
        baeAdminStorage.documents.setAll(next);
    };

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return items
            .filter((p) => p.category === activeCategory)
            .filter((p) => {
                if (!q) return true;
                return `${p.title} ${p.uploadedAt} ${p.meta}`.toLowerCase().includes(q);
            })
            .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
    }, [items, query, activeCategory]);

    const startCreate = () => {
        setEditing(null);
        setForm({ ...emptyForm(), category: activeCategory });
        setOpen(true);
    };

    const startEdit = (p: BaeDocument) => {
        setEditing(p);
        const { id: _id, ...rest } = p;
        setForm(rest);
        setOpen(true);
    };

    const save = () => {
        const normalized: Omit<BaeDocument, "id"> = {
            title: form.title.trim(),
            category: form.category,
            href: form.href.trim() || "/brochure.pdf",
            downloadName: form.downloadName.trim() || `${form.title.replace(/\s+/g, "-")}.pdf`,
            meta: form.meta.trim() || "PDF",
            uploadedAt: form.uploadedAt.trim() || new Date().toISOString().slice(0, 10),
        };

        if (!normalized.title) return;

        if (editing) {
            persist(items.map((p) => (p.id === editing.id ? { ...editing, ...normalized } : p)));
        } else {
            persist([{ id: uid(), ...normalized }, ...items]);
        }
        setOpen(false);
    };

    const remove = (id: string) => persist(items.filter((p) => p.id !== id));

    return (
        <PageLayout title="BAE Documents" subtitle="Manage BAE Documents" breadcrumb="BAE Admin / Documents">
            <section className="py-16">
                <div className="container max-w-6xl">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">BAE Documents</h1>
                            <p className="mt-2 text-foreground/70">Manage documents shown on the Board of Architectural Education page.</p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" asChild>
                                <a href="/bae-admin">Back</a>
                            </Button>
                            <Button onClick={startCreate}>Add document</Button>
                        </div>
                    </div>

                    <div className="mt-8">
                        <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as BaeDocumentCategory)}>
                            <TabsList className="w-full h-auto flex flex-wrap justify-start gap-1">
                                {categories.map((c) => (
                                    <TabsTrigger key={c.key} value={c.key} className="flex-1 sm:flex-none">
                                        {c.label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                            <TabsContent value={activeCategory} className="mt-6">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                    <div className="w-full sm:w-[420px]">
                                        <Label htmlFor="bae-docs-search" className="text-sm text-foreground/70">
                                            Search
                                        </Label>
                                        <Input
                                            id="bae-docs-search"
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            placeholder="Search by title, date..."
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
                                                <TableHead>Title</TableHead>
                                                <TableHead className="w-[150px]">Meta (Type)</TableHead>
                                                <TableHead className="w-[150px]">Uploaded</TableHead>
                                                <TableHead className="w-[190px]" />
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filtered.length ? (
                                                filtered.map((p) => (
                                                    <TableRow key={p.id}>
                                                        <TableCell className="font-medium">{p.title}</TableCell>
                                                        <TableCell>{p.meta}</TableCell>
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
                                                    <TableCell colSpan={4} className="py-10 text-center text-foreground/60">
                                                        No documents yet. Click “Add document” to create one.
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
                        <DialogTitle>{editing ? "Edit document" : "Add document"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>Category</Label>
                            <Select value={form.category} onValueChange={(v) => setForm((p) => ({ ...p, category: v as BaeDocumentCategory }))}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((c) => (
                                        <SelectItem key={c.key} value={c.key}>
                                            {c.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="doc-title">Title</Label>
                            <Input
                                id="doc-title"
                                value={form.title}
                                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                                placeholder="Document title"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>File Upload (Optional)</Label>
                            <Input
                                type="file"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    if (file.size > 2 * 1024 * 1024) {
                                        alert("File is too large (max 2MB for browser storage). Please use a URL instead.");
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
                        <div className="grid gap-2">
                            <Label htmlFor="doc-meta">File Type (Meta)</Label>
                            <Input
                                id="doc-meta"
                                value={form.meta}
                                onChange={(e) => setForm((p) => ({ ...p, meta: e.target.value }))}
                                placeholder="PDF / DOCX"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="doc-date">Uploaded date</Label>
                            <Input
                                id="doc-date"
                                value={form.uploadedAt}
                                onChange={(e) => setForm((p) => ({ ...p, uploadedAt: e.target.value }))}
                                placeholder="YYYY-MM-DD"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="doc-href">File Link (URL / Loaded Data)</Label>
                            <Input
                                id="doc-href"
                                value={form.href}
                                onChange={(e) => setForm((p) => ({ ...p, href: e.target.value }))}
                                placeholder="/brochure.pdf or data:..."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="doc-download">Download Filename</Label>
                            <Input
                                id="doc-download"
                                value={form.downloadName}
                                onChange={(e) => setForm((p) => ({ ...p, downloadName: e.target.value }))}
                                placeholder="document-name.pdf"
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex gap-3">
                        <Button className="flex-1" onClick={save} disabled={!form.title.trim()}>
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

export default Documents;
