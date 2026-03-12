import { useMemo, useState } from "react";
import PageLayout from "@/components/PageLayout";
import {
  FileText,
  Download,
  Calendar,
  Lock,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { baeAdminStorage } from "@/pages/baeAdmin/storage";
import type { MemberRecord, BaeDocument } from "@/pages/baeAdmin/types";

type DocLink = {
  title: string;
  meta: string;
  href: string;
  downloadName: string;
  uploadedAt: string; // YYYY-MM-DD
};

const applications: DocLink[] = [
  {
    title: "Application form (Placeholder)",
    meta: "PDF",
    href: "/brochure.pdf",
    downloadName: "BAE-Application-Form.pdf",
    uploadedAt: "2026-03-05",
  },
  {
    title: "Training record (Placeholder)",
    meta: "PDF",
    href: "/brochure.pdf",
    downloadName: "BAE-Training-Record.pdf",
    uploadedAt: "2026-03-05",
  },
  {
    title: "Candidate checklist (Placeholder)",
    meta: "PDF",
    href: "/brochure.pdf",
    downloadName: "BAE-Candidate-Checklist.pdf",
    uploadedAt: "2026-03-05",
  },
];

const notices: DocLink[] = [
  {
    title: "Notice 01 (Placeholder)",
    meta: "PDF",
    href: "/brochure.pdf",
    downloadName: "BAE-Notice-01.pdf",
    uploadedAt: "2026-03-05",
  },
  {
    title: "Notice 02 (Placeholder)",
    meta: "PDF",
    href: "/brochure.pdf",
    downloadName: "BAE-Notice-02.pdf",
    uploadedAt: "2026-02-10",
  },
  {
    title: "Notice 03 (Placeholder)",
    meta: "PDF",
    href: "/brochure.pdf",
    downloadName: "BAE-Notice-03.pdf",
    uploadedAt: "2026-01-18",
  },
];

const references: DocLink[] = [
  {
    title: "BAE Reference pack (Placeholder)",
    meta: "PDF",
    href: "/brochure.pdf",
    downloadName: "BAE-Reference-Pack.pdf",
    uploadedAt: "2026-02-20",
  },
  {
    title: "Specifications (Placeholder)",
    meta: "PDF",
    href: "/brochure.pdf",
    downloadName: "BAE-Specifications.pdf",
    uploadedAt: "2026-02-20",
  },
  {
    title: "Reading list (Placeholder)",
    meta: "PDF",
    href: "/brochure.pdf",
    downloadName: "BAE-Reading-List.pdf",
    uploadedAt: "2026-02-20",
  },
];

const formatUploadedDate = (isoDate: string) =>
  new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "2-digit" }).format(
    new Date(`${isoDate}T00:00:00`)
  );

const DocumentCard = ({ item }: { item: DocLink | BaeDocument }) => (
  <div className="rounded-2xl border border-border/70 bg-background/60 p-5 hover:bg-background/80 hover:shadow-sm transition">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="font-heading font-semibold text-foreground">{item.title}</p>
        <p className="mt-2 text-sm text-foreground/70">
          Uploaded: <span className="font-medium text-foreground/80">{formatUploadedDate(item.uploadedAt)}</span>
        </p>
      </div>
      <span className="shrink-0 text-xs rounded-full border border-border bg-muted/40 px-2 py-1 text-foreground/70">
        {item.meta}
      </span>
    </div>
    <div className="mt-4">
      <a
        href={item.href}
        download={item.downloadName}
        className="inline-flex px-5 py-2.5 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition rounded-xl shadow-sm"
      >
        Download
      </a>
    </div>
  </div>
);

const graduateMembersFallback = [
  {
    name: "Ar. [Name]",
    role: "Chairperson",
    email: "chairperson@example.com",
    address: "SLIA, Colombo, Sri Lanka",
    imageSrc: "/placeholder.svg",
  },
  {
    name: "Ar. [Name]",
    role: "Member",
    email: "member1@example.com",
    address: "Colombo, Sri Lanka",
    imageSrc: "/placeholder.svg",
  },
  {
    name: "Ar. [Name]",
    role: "Member",
    email: "member2@example.com",
    address: "Kandy, Sri Lanka",
    imageSrc: "/placeholder.svg",
  },
  {
    name: "Ar. [Name]",
    role: "Member",
    email: "member3@example.com",
    address: "Galle, Sri Lanka",
    imageSrc: "/placeholder.svg",
  },
];

const studentMembersFallback = [
  {
    name: "Student [Name]",
    role: "Representative",
    email: "student1@example.com",
    address: "University (Placeholder)",
    imageSrc: "/placeholder.svg",
  },
  {
    name: "Student [Name]",
    role: "Representative",
    email: "student2@example.com",
    address: "University (Placeholder)",
    imageSrc: "/placeholder.svg",
  },
  {
    name: "Student [Name]",
    role: "Representative",
    email: "student3@example.com",
    address: "University (Placeholder)",
    imageSrc: "/placeholder.svg",
  },
];

const toPublicMember = (m: MemberRecord) => ({
  name: m.name,
  role: m.role,
  email: m.email,
  address: m.address,
  imageSrc: m.imageSrc,
});

const MemberTable = ({
  title,
  accentClass,
  members,
}: {
  title: string;
  accentClass: string;
  members: { name: string; role: string; email: string; address: string; imageSrc?: string }[];
}) => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<{
    name: string;
    role: string;
    email: string;
    address: string;
    imageSrc?: string;
  } | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) => {
      const hay = `${m.name} ${m.role} ${m.email} ${m.address}`.toLowerCase();
      return hay.includes(q);
    });
  }, [members, query]);

  return (
    <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-foreground">{title}</h3>
          <div className={`w-14 h-1 rounded-full bg-gradient-to-r ${accentClass} mt-3`} />
        </div>
        <div className="w-full md:w-[320px]">
          <label className="text-sm text-foreground/70" htmlFor={`${title}-search`}>
            Search
          </label>
          <Input
            id={`${title}-search`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or role..."
            className="mt-2"
          />
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border/70 bg-background/60">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[72px]">Photo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="w-[170px]">Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-foreground/70">
                  No members match “{query.trim()}”.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((m) => (
                <TableRow
                  key={`${m.role}-${m.email}-${m.name}`}
                  className="cursor-pointer"
                  onClick={() => setSelected(m)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelected(m);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`View details for ${m.name}`}
                >
                  <TableCell>
                    <div className="h-10 w-10 rounded-full overflow-hidden border border-border bg-muted">
                      <img
                        src={m.imageSrc || "/placeholder.svg"}
                        alt={m.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{m.name}</TableCell>
                  <TableCell className="text-foreground/80">{m.email}</TableCell>
                  <TableCell className="text-foreground/80">{m.address}</TableCell>
                  <TableCell className="text-foreground/80">{m.role}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent className="sm:max-w-[640px]">
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle>{selected.name}</DialogTitle>
              </DialogHeader>

              <div className="grid sm:grid-cols-[120px_1fr] gap-6 items-start">
                <div className="h-28 w-28 rounded-2xl overflow-hidden border border-border bg-muted">
                  <img
                    src={selected.imageSrc || "/placeholder.svg"}
                    alt={selected.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-foreground/60">Role</p>
                    <p className="text-foreground font-medium">{selected.role}</p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Email</p>
                    <a
                      className="text-foreground underline decoration-muted-foreground/40 hover:decoration-muted-foreground"
                      href={`mailto:${selected.email}`}
                    >
                      {selected.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-foreground/60">Address</p>
                    <p className="text-foreground/80 leading-relaxed">{selected.address}</p>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export const BoardOfArchitecturalEducationView = ({ breadcrumb }: { breadcrumb: string }) => {
  const dynamicDocs = useMemo(() => baeAdminStorage.documents.getAll([]), []);

  const appDocs = dynamicDocs.filter((d) => d.category === "applications");
  const noticeDocs = dynamicDocs.filter((d) => d.category === "notices");
  const refDocs = dynamicDocs.filter((d) => d.category === "references");

  const displayApplications = appDocs.length > 0 ? appDocs : applications;
  const displayNotices = noticeDocs.length > 0 ? noticeDocs : notices;
  const displayReferences = refDocs.length > 0 ? refDocs : references;

  return (
    <PageLayout
      title="Board of Architectural Education"
      subtitle="Documents and member listings"
      breadcrumb={breadcrumb}
    >
      <section className="py-16">
        <div className="container max-w-6xl mx-auto space-y-10">
          <Tabs defaultValue="introduction" className="space-y-6">
            <TabsList className="w-full h-auto flex flex-wrap justify-start gap-1">
              <TabsTrigger value="introduction" className="flex-1 sm:flex-none">
                Introduction
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex-1 sm:flex-none">
                Documents
              </TabsTrigger>
              <TabsTrigger value="graduate" className="flex-1 sm:flex-none">
                <span className="sm:hidden">Graduates</span>
                <span className="hidden sm:inline">Graduate members</span>
              </TabsTrigger>
              <TabsTrigger value="student" className="flex-1 sm:flex-none">
                <span className="sm:hidden">Students</span>
                <span className="hidden sm:inline">Student members</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="introduction" className="mt-0">
              <div className="rounded-3xl border border-border bg-card p-8 md:p-10 shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(800px_circle_at_20%_0%,hsl(var(--primary)/0.14),transparent_55%),radial-gradient(700px_circle_at_80%_20%,hsl(var(--secondary)/0.12),transparent_55%)]" />
                <div className="relative">
                  <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                    Introduction
                  </h2>
                  <div className="w-16 h-1 rounded-full bg-gradient-to-r from-primary/70 via-secondary/60 to-accent/50 mt-4" />
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Button asChild>
                      <Link to="/bae-admin/login">BAE Login (Authorities)</Link>
                    </Button>
                    <Button variant="secondary" asChild>
                      <Link to="/about-bae">About this Board</Link>
                    </Button>
                  </div>
                  <p className="mt-5 text-foreground/75 leading-relaxed max-w-3xl text-lg">
                    The Board of Architectural Education supports the Institute’s education and examination
                    related work. Use the tabs to browse documents, graduate members, and student members.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="mt-0">
              <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
                <Tabs defaultValue="applications" className="space-y-6">
                  <TabsList className="w-full h-auto flex flex-wrap justify-start gap-1">
                    <TabsTrigger value="applications" className="flex-1 sm:flex-none">
                      Applications
                    </TabsTrigger>
                    <TabsTrigger value="notices" className="flex-1 sm:flex-none">
                      Notices
                    </TabsTrigger>
                    <TabsTrigger value="references" className="flex-1 sm:flex-none">
                      References
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="applications" className="mt-0">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {displayApplications.map((item) => (
                        <DocumentCard key={item.title + (("downloadName" in item) ? (item as any).downloadName : "")} item={item} />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="notices" className="mt-0">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {displayNotices.map((item) => (
                        <DocumentCard key={item.title + (("downloadName" in item) ? (item as any).downloadName : "")} item={item} />
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="references" className="mt-0">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {displayReferences.map((item) => (
                        <DocumentCard key={item.title + (("downloadName" in item) ? (item as any).downloadName : "")} item={item} />
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </TabsContent>

            <TabsContent value="graduate" className="mt-0">
              <MemberTable
                title="Graduate members"
                accentClass="from-primary/60 to-transparent"
                members={
                  baeAdminStorage.graduates.getAll([]).length
                    ? baeAdminStorage.graduates.getAll([]).map(toPublicMember)
                    : graduateMembersFallback
                }
              />
            </TabsContent>

            <TabsContent value="student" className="mt-0">
              <MemberTable
                title="Student members"
                accentClass="from-secondary/60 to-transparent"
                members={
                  baeAdminStorage.students.getAll([]).length
                    ? baeAdminStorage.students.getAll([]).map(toPublicMember)
                    : studentMembersFallback
                }
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </PageLayout>
  );
};

const BoardOfArchitecturalEducation = () => (
  <BoardOfArchitecturalEducationView breadcrumb="Boards / Board of Architectural Education" />
);

export default BoardOfArchitecturalEducation;
