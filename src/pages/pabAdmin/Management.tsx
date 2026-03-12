import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { pabAdminStorage } from "./storage";
import type { PabContent, PabEvent, PabDocument, PabDocumentCategory } from "./types";
import { Plus, Pencil, Trash2, ArrowLeft, Image as ImageIcon, FileText } from "lucide-react";

export default function Management() {
    const [content, setContent] = useState<PabContent>(pabAdminStorage.content.get());

    // Event State
    const [editingEvent, setEditingEvent] = useState<PabEvent | null>(null);
    const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
    const [eventForm, setEventForm] = useState<Partial<PabEvent>>({
        title: "", description: "", image: "", link: ""
    });

    // Document State
    const [editingDoc, setEditingDoc] = useState<PabDocument | null>(null);
    const [isDocDialogOpen, setIsDocDialogOpen] = useState(false);
    const [docForm, setDocForm] = useState<Partial<PabDocument>>({
        title: "", description: "", meta: "PDF", fileUrl: "", fileName: "", category: "applications"
    });

    const navigate = useNavigate();
    const { toast } = useToast();

    const saveContent = (newContent: PabContent) => {
        setContent(newContent);
        pabAdminStorage.content.set(newContent);
    };

    // --- General File Upload Handler ---
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (dataUrl: string, fileName: string) => void) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                callback(reader.result as string, file.name);
            };
            reader.readAsDataURL(file);
        }
    };

    // --- CPD Events Management ---
    const handleSaveEvent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!eventForm.title) return;

        let newEvents = [...(content.events || [])];
        if (editingEvent) {
            newEvents = newEvents.map(ev =>
                ev.id === editingEvent.id ? { ...ev, ...(eventForm as PabEvent), updatedAt: new Date().toISOString() } : ev
            );
            toast({ title: "CPD Event updated" });
        } else {
            const newEvent: PabEvent = {
                ...(eventForm as PabEvent),
                id: Math.random().toString(36).substr(2, 9),
                updatedAt: new Date().toISOString(),
            };
            newEvents.push(newEvent);
            toast({ title: "CPD Event added" });
        }

        saveContent({ ...content, events: newEvents });
        setIsEventDialogOpen(false);
    };

    const handleDeleteEvent = (id: string) => {
        if (!confirm("Are you sure you want to delete this event?")) return;
        saveContent({ ...content, events: (content.events || []).filter(ev => ev.id !== id) });
        toast({ title: "Event deleted", variant: "destructive" });
    };

    // --- Documents Management ---
    const handleSaveDoc = (e: React.FormEvent) => {
        e.preventDefault();
        if (!docForm.title || !docForm.category) return;

        let newDocs = [...(content.documents || [])];
        if (editingDoc) {
            newDocs = newDocs.map(doc =>
                doc.id === editingDoc.id ? { ...doc, ...(docForm as PabDocument), updatedAt: new Date().toISOString() } : doc
            );
            toast({ title: "Document updated" });
        } else {
            const newDoc: PabDocument = {
                ...(docForm as PabDocument),
                id: Math.random().toString(36).substr(2, 9),
                updatedAt: new Date().toISOString(),
            };
            newDocs.push(newDoc);
            toast({ title: "Document added" });
        }

        saveContent({ ...content, documents: newDocs });
        setIsDocDialogOpen(false);
    };

    const handleDeleteDoc = (id: string) => {
        if (!confirm("Are you sure you want to delete this document?")) return;
        saveContent({ ...content, documents: (content.documents || []).filter(doc => doc.id !== id) });
        toast({ title: "Document deleted", variant: "destructive" });
    };

    // --- Renderers ---
    const renderEventList = () => {
        const events = content.events || [];
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">CPD Events & Lectures</h3>
                    <Button onClick={() => { setEditingEvent(null); setEventForm({ title: "", description: "", image: "", link: "" }); setIsEventDialogOpen(true); }} size="sm" className="gap-2">
                        <Plus className="w-4 h-4" /> Add Event
                    </Button>
                </div>
                {events.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8 text-center border-2 border-dashed rounded-xl">No events found.</p>
                ) : (
                    <div className="grid gap-4">
                        {events.map(event => (
                            <div key={event.id} className="flex items-center gap-4 p-4 rounded-xl border bg-card shadow-sm group">
                                <div className="h-16 w-16 rounded-lg bg-muted overflow-hidden shrink-0 flex items-center justify-center">
                                    {event.image ? <img src={event.image} alt="" className="h-full w-full object-cover" /> : <ImageIcon className="w-6 h-6 text-muted-foreground/40" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium truncate">{event.title}</h4>
                                    <p className="text-sm text-muted-foreground truncate">{event.description}</p>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" variant="ghost" onClick={() => { setEditingEvent(event); setEventForm(event); setIsEventDialogOpen(true); }}>
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" onClick={() => handleDeleteEvent(event.id)} className="text-destructive">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const renderDocumentList = (category: PabDocumentCategory) => {
        const docs = (content.documents || []).filter(d => d.category === category);
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold capitalize">{category}</h3>
                    <Button onClick={() => { setEditingDoc(null); setDocForm({ title: "", description: "", meta: "PDF", fileUrl: "", fileName: "", category }); setIsDocDialogOpen(true); }} size="sm" className="gap-2">
                        <Plus className="w-4 h-4" /> Add Document
                    </Button>
                </div>
                {docs.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8 text-center border-2 border-dashed rounded-xl">No documents found.</p>
                ) : (
                    <div className="grid gap-4">
                        {docs.map(doc => (
                            <div key={doc.id} className="flex items-center gap-4 p-4 rounded-xl border bg-card shadow-sm group">
                                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                    <FileText className="w-6 h-6 text-muted-foreground/70" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium truncate">{doc.title}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary/20 text-secondary-foreground">{doc.meta}</span>
                                        <span className="text-xs text-muted-foreground truncate">{doc.fileName || doc.fileUrl}</span>
                                    </div>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" variant="ghost" onClick={() => { setEditingDoc(doc); setDocForm(doc); setIsDocDialogOpen(true); }}>
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="ghost" onClick={() => handleDeleteDoc(doc.id)} className="text-destructive">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-muted/30 p-6">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/pab-admin")}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">PAB Content Management</h1>
                </div>

                <Tabs defaultValue="events" className="space-y-6">
                    <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-muted">
                        <TabsTrigger value="events">CPD Events</TabsTrigger>
                        <TabsTrigger value="applications">Applications</TabsTrigger>
                        <TabsTrigger value="publications">Publications</TabsTrigger>
                    </TabsList>

                    <TabsContent value="events">
                        <Card>
                            <CardContent className="pt-6">{renderEventList()}</CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="applications">
                        <Card>
                            <CardContent className="pt-6">{renderDocumentList("applications")}</CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="publications">
                        <Card>
                            <CardContent className="pt-6">{renderDocumentList("publications")}</CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Event Dialog */}
                <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{editingEvent ? "Edit CPD Event" : "Add CPD Event"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSaveEvent} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>Event Title</Label>
                                <Input value={eventForm.title} onChange={e => setEventForm(f => ({ ...f, title: e.target.value }))} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea value={eventForm.description} onChange={e => setEventForm(f => ({ ...f, description: e.target.value }))} rows={3} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Cover Image Upload</Label>
                                    <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, (dataUrl) => setEventForm(f => ({ ...f, image: dataUrl })))} />
                                    {eventForm.image && <div className="mt-1 text-xs text-muted-foreground truncate">{eventForm.image.startsWith("data:") ? "New image selected" : "Current image"}</div>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Action Link</Label>
                                    <Input value={eventForm.link} onChange={e => setEventForm(f => ({ ...f, link: e.target.value }))} placeholder="https://..." />
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setIsEventDialogOpen(false)}>Cancel</Button>
                                <Button type="submit">Save Event</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

                {/* Document Dialog */}
                <Dialog open={isDocDialogOpen} onOpenChange={setIsDocDialogOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{editingDoc ? "Edit Document" : "Add Document"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSaveDoc} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>Document Title</Label>
                                <Input value={docForm.title} onChange={e => setDocForm(f => ({ ...f, title: e.target.value }))} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea value={docForm.description} onChange={e => setDocForm(f => ({ ...f, description: e.target.value }))} rows={2} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Meta Tag (e.g., PDF)</Label>
                                    <Input value={docForm.meta} onChange={e => setDocForm(f => ({ ...f, meta: e.target.value.toUpperCase() }))} />
                                </div>
                                <div className="space-y-2">
                                    <Label>File Upload</Label>
                                    <Input type="file" onChange={(e) => handleFileUpload(e, (dataUrl, name) => setDocForm(f => ({ ...f, fileUrl: dataUrl, fileName: name })))} />
                                    {(docForm.fileName || docForm.fileUrl) && <div className="mt-1 text-xs text-muted-foreground truncate">{docForm.fileName || "File selected"}</div>}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-muted-foreground text-xs">Or provide external link instead of uploading</Label>
                                <Input value={docForm.fileUrl} onChange={e => setDocForm(f => ({ ...f, fileUrl: e.target.value, fileName: "" }))} placeholder="https://..." />
                            </div>
                            <div className="pt-4 flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setIsDocDialogOpen(false)}>Cancel</Button>
                                <Button type="submit">Save Document</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>

            </div>
        </div>
    );
}
