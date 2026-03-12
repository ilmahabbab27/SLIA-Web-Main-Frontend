import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { bomAdminStorage } from "./storage";
import type { BomContent, BomEvent, BomCategory } from "./types";
import { Plus, Pencil, Trash2, ArrowLeft, Image as ImageIcon } from "lucide-react";

export default function Management() {
    const [content, setContent] = useState<BomContent>(bomAdminStorage.content.get());
    const [editingEvent, setEditingEvent] = useState<BomEvent | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const [form, setForm] = useState<Partial<BomEvent>>({
        title: "",
        description: "",
        image: "",
        link: "",
        category: "programs",
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setForm(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };


    const saveContent = (newContent: BomContent) => {
        setContent(newContent);
        bomAdminStorage.content.set(newContent);
    };

    const handleSaveEvent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.category) return;

        let newEvents = [...content.events];
        if (editingEvent) {
            newEvents = newEvents.map(ev =>
                ev.id === editingEvent.id ? { ...ev, ...form as BomEvent, updatedAt: new Date().toISOString() } : ev
            );
            toast({ title: "Event updated" });
        } else {
            const newEvent: BomEvent = {
                ...form as BomEvent,
                id: Math.random().toString(36).substr(2, 9),
                updatedAt: new Date().toISOString(),
            };
            newEvents.push(newEvent);
            toast({ title: "Event added" });
        }

        saveContent({ ...content, events: newEvents });
        setIsDialogOpen(false);
        setEditingEvent(null);
        resetForm();
    };

    const handleDeleteEvent = (id: string) => {
        if (!confirm("Are you sure you want to delete this event?")) return;
        saveContent({
            ...content,
            events: content.events.filter(ev => ev.id !== id)
        });
        toast({ title: "Event deleted", variant: "destructive" });
    };

    const resetForm = () => {
        setForm({ title: "", description: "", image: "", link: "", category: "programs" });
    };

    const openAddDialog = (category: BomCategory) => {
        setEditingEvent(null);
        setForm({ title: "", description: "", image: "", link: "", category });
        setIsDialogOpen(true);
    };

    const openEditDialog = (event: BomEvent) => {
        setEditingEvent(event);
        setForm(event);
        setIsDialogOpen(true);
    };

    const renderEventList = (category: BomCategory) => {
        const filtered = content.events.filter(e => e.category === category);
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold capitalize">{category} Events</h3>
                    <Button onClick={() => openAddDialog(category)} size="sm" className="gap-2">
                        <Plus className="w-4 h-4" /> Add Event
                    </Button>
                </div>
                {filtered.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-8 text-center border-2 border-dashed rounded-xl">
                        No events found in this category.
                    </p>
                ) : (
                    <div className="grid gap-4">
                        {filtered.map(event => (
                            <div key={event.id} className="flex items-center gap-4 p-4 rounded-xl border bg-card shadow-sm group">
                                <div className="h-16 w-16 rounded-lg bg-muted overflow-hidden shrink-0">
                                    {event.image ? (
                                        <img src={event.image} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center">
                                            <ImageIcon className="w-6 h-6 text-muted-foreground/40" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium truncate">{event.title}</h4>
                                    <p className="text-sm text-muted-foreground truncate">{event.description}</p>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" variant="ghost" onClick={() => openEditDialog(event)}>
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

    return (
        <div className="min-h-screen bg-muted/30 p-6">
            <div className="max-w-5xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/bom-admin")}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Manage Events & Associations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="programs" className="space-y-6">
                            <TabsList className="w-full justify-start overflow-x-auto h-auto p-1 bg-muted">
                                <TabsTrigger value="programs">Programs</TabsTrigger>
                                <TabsTrigger value="slapm">SLAPM</TabsTrigger>
                                <TabsTrigger value="slaud">SLAUD</TabsTrigger>
                                <TabsTrigger value="slaia">SLAIA</TabsTrigger>
                                <TabsTrigger value="slaac">SLAAC</TabsTrigger>
                            </TabsList>

                            <TabsContent value="programs">{renderEventList("programs")}</TabsContent>
                            <TabsContent value="slapm">{renderEventList("slapm")}</TabsContent>
                            <TabsContent value="slaud">{renderEventList("slaud")}</TabsContent>
                            <TabsContent value="slaia">{renderEventList("slaia")}</TabsContent>
                            <TabsContent value="slaac">{renderEventList("slaac")}</TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{editingEvent ? "Edit Event" : "Add New Event"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSaveEvent} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label>Event Category</Label>
                                <Select value={form.category} onValueChange={(v) => setForm(f => ({ ...f, category: v as BomCategory }))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="programs">Programs</SelectItem>
                                        <SelectItem value="slapm">SLAPM</SelectItem>
                                        <SelectItem value="slaud">SLAUD</SelectItem>
                                        <SelectItem value="slaia">SLAIA</SelectItem>
                                        <SelectItem value="slaac">SLAAC</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Event Title</Label>
                                <Input
                                    value={form.title}
                                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    placeholder="Sustainable Design Seminar"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    placeholder="Key highlights and objectives of the event..."
                                    rows={3}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Cover Image Upload</Label>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="cursor-pointer"
                                    />
                                    {form.image && (
                                        <div className="mt-2 text-xs text-muted-foreground truncate">
                                            {form.image.startsWith("data:") ? "New image selected" : "Current: " + form.image}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>Action Link</Label>
                                    <Input
                                        value={form.link}
                                        onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
                                        placeholder="https://example.com or /internal-path"
                                    />
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button type="submit">Save Event</Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
