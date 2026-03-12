import { useMemo, useState } from "react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { baeAdminStorage } from "./storage";
import type { MemberRecord } from "./types";

const uid = () => `${Date.now()}_${Math.random().toString(16).slice(2)}`;

type StoreKind = "students" | "graduates";

const getStore = (kind: StoreKind) => (kind === "students" ? baeAdminStorage.students : baeAdminStorage.graduates);

const emptyForm = (): Omit<MemberRecord, "id"> => ({
  name: "",
  role: "",
  email: "",
  address: "",
  imageSrc: "/placeholder.svg",
});

const MemberCrudPage = ({
  kind,
  title,
  breadcrumb,
}: {
  kind: StoreKind;
  title: string;
  breadcrumb: string;
}) => {
  const store = getStore(kind);
  const [items, setItems] = useState<MemberRecord[]>(() => store.getAll([]));
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MemberRecord | null>(null);
  const [form, setForm] = useState<Omit<MemberRecord, "id">>(() => emptyForm());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((m) => `${m.name} ${m.role} ${m.email} ${m.address}`.toLowerCase().includes(q));
  }, [items, query]);

  const persist = (next: MemberRecord[]) => {
    setItems(next);
    store.setAll(next);
  };

  const startCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setOpen(true);
  };

  const startEdit = (m: MemberRecord) => {
    setEditing(m);
    const { id: _id, ...rest } = m;
    setForm(rest);
    setOpen(true);
  };

  const save = () => {
    const normalized: Omit<MemberRecord, "id"> = {
      name: form.name.trim(),
      role: form.role.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      imageSrc: form.imageSrc?.trim() || "/placeholder.svg",
    };

    if (!normalized.name || !normalized.role) return;

    if (editing) {
      persist(items.map((m) => (m.id === editing.id ? { ...editing, ...normalized } : m)));
    } else {
      persist([{ id: uid(), ...normalized }, ...items]);
    }
    setOpen(false);
  };

  const remove = (id: string) => {
    persist(items.filter((m) => m.id !== id));
  };

  return (
    <PageLayout title={title} subtitle={title} breadcrumb={breadcrumb}>
      <section className="py-16">
        <div className="container max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{title}</h1>
              <p className="mt-2 text-foreground/70">Add, edit, and delete member records.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <a href="/bae-admin">Back</a>
              </Button>
              <Button onClick={startCreate}>Add member</Button>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full sm:w-[380px]">
              <Label htmlFor="bae-admin-search" className="text-sm text-foreground/70">
                Search
              </Label>
              <Input
                id="bae-admin-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, role, email..."
                className="mt-2"
              />
            </div>
            <p className="text-sm text-foreground/60">
              Showing <span className="font-medium text-foreground/80">{filtered.length}</span> of{" "}
              <span className="font-medium text-foreground/80">{items.length}</span>
            </p>
          </div>

          <div className="mt-6 rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="w-[220px]">Role</TableHead>
                  <TableHead className="w-[190px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length ? (
                  filtered.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="font-medium">{m.name}</TableCell>
                      <TableCell>{m.email || "—"}</TableCell>
                      <TableCell className="max-w-[380px] truncate">{m.address || "—"}</TableCell>
                      <TableCell>{m.role}</TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => startEdit(m)}>
                            Edit
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => remove(m.id)}>
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-foreground/60">
                      No members yet. Click “Add member” to create one.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit member" : "Add member"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="bae-member-name">Name</Label>
              <Input
                id="bae-member-name"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                placeholder="Ar. Name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bae-member-role">Role</Label>
              <Input
                id="bae-member-role"
                value={form.role}
                onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
                placeholder="Member / Representative / Chairperson"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bae-member-email">Email</Label>
              <Input
                id="bae-member-email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="name@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bae-member-address">Address</Label>
              <Input
                id="bae-member-address"
                value={form.address}
                onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                placeholder="City, Sri Lanka"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bae-member-image">Image URL</Label>
              <Input
                id="bae-member-image"
                value={form.imageSrc || ""}
                onChange={(e) => setForm((p) => ({ ...p, imageSrc: e.target.value }))}
                placeholder="/placeholder.svg"
              />
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Button className="flex-1" onClick={save} disabled={!form.name.trim() || !form.role.trim()}>
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

export default MemberCrudPage;

