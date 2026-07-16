import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Pencil, RefreshCw, Trash2, Upload, Plus, X, FileText } from "lucide-react";
import { toast } from "sonner";
import {
  pabSettingApi,
  pabEventApi,
  pabApplicationApi,
  pabPublicationApi,
  type PabEvent,
  type PabApplication,
  type PabPublication,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (err instanceof Error) {
    return err.message || fallback;
  }
  if (typeof err === 'object' && err !== null) {
    const e = err as any;
    return e.message || e.error || JSON.stringify(e) || fallback;
  }
  return String(err) || fallback;
};

const downloadFile = (fileName: string, fileSrc: string) => {
  const link = document.createElement("a");
  link.href = fileSrc;
  link.download = fileName;
  link.click();
};

const PabManager = () => {
  const [loading, setLoading] = useState(true);
  const [introduction, setIntroduction] = useState("");
  const [introductionEditing, setIntroductionEditing] = useState(false);
  const [savingIntro, setSavingIntro] = useState(false);

  const [cpdEvents, setCpdEvents] = useState<PabEvent[]>([]);
  const [cpdForm, setCpdForm] = useState<Partial<PabEvent> & { fileToUpload?: File; imageChanged?: boolean }>({
    is_active: true,
    sort_order: 0,
    imageChanged: false,
  });
  const [savingCpd, setSavingCpd] = useState(false);
  const [deletingCpdId, setDeletingCpdId] = useState<number | null>(null);
  const [cpdError, setCpdError] = useState<string | null>(null);
  const isEditingCpd = Boolean(cpdForm.id);

  const [applications, setApplications] = useState<PabApplication[]>([]);
  const [appForm, setAppForm] = useState<Partial<PabApplication> & { fileToUpload?: File; fileChanged?: boolean }>({
    is_active: true,
    sort_order: 0,
    fileChanged: false,
  });
  const [savingApp, setSavingApp] = useState(false);
  const [deletingAppId, setDeletingAppId] = useState<number | null>(null);
  const [appError, setAppError] = useState<string | null>(null);
  const isEditingApp = Boolean(appForm.id);

  const [publications, setPublications] = useState<PabPublication[]>([]);
  const [pubForm, setPubForm] = useState<Partial<PabPublication> & { fileToUpload?: File; fileChanged?: boolean }>({
    is_active: true,
    sort_order: 0,
    fileChanged: false,
  });
  const [savingPub, setSavingPub] = useState(false);
  const [deletingPubId, setDeletingPubId] = useState<number | null>(null);
  const [pubError, setPubError] = useState<string | null>(null);
  const isEditingPub = Boolean(pubForm.id);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [settings, events, apps, pubs] = await Promise.all([
        pabSettingApi.show(),
        pabEventApi.list(),
        pabApplicationApi.list(),
        pabPublicationApi.list(),
      ]);
      setIntroduction(settings.introduction || "");
      setCpdEvents(events);
      setApplications(apps);
      setPublications(pubs);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to load PAB data"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const sortedCpdEvents = useMemo(
    () => [...cpdEvents].sort((a, b) => a.sort_order - b.sort_order),
    [cpdEvents]
  );

  const sortedApplications = useMemo(
    () => [...applications].sort((a, b) => a.sort_order - b.sort_order),
    [applications]
  );

  const sortedPublications = useMemo(
    () => [...publications].sort((a, b) => a.sort_order - b.sort_order),
    [publications]
  );

  // Introduction handlers
  const saveIntroduction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!introduction.trim()) {
      toast.error("Introduction cannot be empty");
      return;
    }
    setSavingIntro(true);
    try {
      await pabSettingApi.update({ introduction });
      toast.success("Introduction updated");
      setIntroductionEditing(false);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not save introduction"));
    } finally {
      setSavingIntro(false);
    }
  };

  // CPD Events handlers
  const handleCpdFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be 10MB or smaller");
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      setCpdForm((current) => ({
        ...current,
        file_name: file.name,
        file_src: dataUrl,
      }));
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not upload file"));
    }
  };

  const handleCpdImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be 10MB or smaller");
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      setCpdForm((current) => ({
        ...current,
        image_name: file.name,
        image_src: dataUrl,
        imageChanged: true,
      }));
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not upload image"));
    }
  };

  const saveCpdEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setCpdError(null);

    if (!cpdForm.title?.trim()) {
      setCpdError("Event title is required");
      return;
    }
    setSavingCpd(true);
    try {
      const payload: any = {
        title: cpdForm.title,
        description: cpdForm.description || null,
        event_date: cpdForm.event_date || null,
        event_time: cpdForm.event_time || null,
        venue: cpdForm.venue || null,
        link: cpdForm.link || null,
        is_active: cpdForm.is_active ?? true,
        sort_order: cpdForm.sort_order ?? 0,
      };

      // For new events, include all file/image data
      if (!cpdForm.id) {
        if (cpdForm.file_src) {
          payload.file_src = cpdForm.file_src;
          payload.file_name = cpdForm.file_name || null;
        }
        if (cpdForm.image_src) {
          payload.image_src = cpdForm.image_src;
          payload.image_name = cpdForm.image_name || null;
        }
      } else {
        // For existing events, only include image data if it changed
        if (cpdForm.imageChanged) {
          payload.image_src = cpdForm.image_src || null;
          payload.image_name = cpdForm.image_name || null;
        }
        if (cpdForm.file_src?.startsWith("data:")) {
          payload.file_src = cpdForm.file_src;
          payload.file_name = cpdForm.file_name || null;
        }
      }

      if (cpdForm.id) {
        await pabEventApi.update(cpdForm.id, payload);
      } else {
        await pabEventApi.create(payload as any);
      }

      await fetchData();
      setCpdForm({ is_active: true, sort_order: 0, imageChanged: false });
      setCpdError(null);
      toast.success(cpdForm.id ? "Event updated" : "Event added");
    } catch (err) {
      const errorMsg = getErrorMessage(err, cpdForm.id ? "Failed to update PAB event" : "Failed to create PAB event");
      console.error("CPD Event Error:", err);
      setCpdError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSavingCpd(false);
    }
  };

  const deleteCpdEvent = async (item: PabEvent) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    setDeletingCpdId(item.id);
    try {
      await pabEventApi.delete(item.id);
      await fetchData();
      toast.success("Event deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete event"));
    } finally {
      setDeletingCpdId(null);
    }
  };

  // Application handlers
  const handleAppFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be 10MB or smaller");
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      setAppForm((current) => ({
        ...current,
        file_name: file.name,
        file_src: dataUrl,
        fileChanged: true,
      }));
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not upload file"));
    }
  };

  const saveApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setAppError(null);

    if (!appForm.title?.trim()) {
      setAppError("Application title is required");
      return;
    }
    setSavingApp(true);
    try {
      const payload: any = {
        title: appForm.title,
        description: appForm.description || null,
        is_active: appForm.is_active ?? true,
        sort_order: appForm.sort_order ?? 0,
      };

      // For new applications, include all file data
      if (!appForm.id) {
        if (appForm.file_src) {
          payload.file_src = appForm.file_src;
          payload.file_name = appForm.file_name || null;
        }
      } else {
        // For existing applications, only include file data if it changed
        if (appForm.fileChanged && appForm.file_src) {
          payload.file_src = appForm.file_src;
          payload.file_name = appForm.file_name || null;
        }
      }

      if (appForm.id) {
        await pabApplicationApi.update(appForm.id, payload);
      } else {
        await pabApplicationApi.create(payload as any);
      }

      await fetchData();
      setAppForm({ is_active: true, sort_order: 0, fileChanged: false });
      setAppError(null);
      toast.success(appForm.id ? "Application updated" : "Application added");
    } catch (err) {
      const errorMsg = getErrorMessage(err, appForm.id ? "Failed to update application" : "Failed to create PAB application");
      console.error("Application Error:", err);
      setAppError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSavingApp(false);
    }
  };

  const deleteApplication = async (item: PabApplication) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    setDeletingAppId(item.id);
    try {
      await pabApplicationApi.delete(item.id);
      await fetchData();
      toast.success("Application deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete application"));
    } finally {
      setDeletingAppId(null);
    }
  };

  // Publication handlers
  const handlePubFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be 10MB or smaller");
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      setPubForm((current) => ({
        ...current,
        file_name: file.name,
        file_src: dataUrl,
        fileChanged: true,
      }));
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not upload file"));
    }
  };

  const savePublication = async (e: React.FormEvent) => {
    e.preventDefault();
    setPubError(null);

    if (!pubForm.title?.trim()) {
      setPubError("Publication title is required");
      return;
    }
    setSavingPub(true);
    try {
      const payload: any = {
        title: pubForm.title,
        description: pubForm.description || null,
        is_active: pubForm.is_active ?? true,
        sort_order: pubForm.sort_order ?? 0,
      };

      // For new publications, include all file data
      if (!pubForm.id) {
        if (pubForm.file_src) {
          payload.file_src = pubForm.file_src;
          payload.file_name = pubForm.file_name || null;
        }
      } else {
        // For existing publications, only include file data if it changed
        if (pubForm.fileChanged && pubForm.file_src) {
          payload.file_src = pubForm.file_src;
          payload.file_name = pubForm.file_name || null;
        }
      }

      if (pubForm.id) {
        await pabPublicationApi.update(pubForm.id, payload);
      } else {
        await pabPublicationApi.create(payload as any);
      }

      await fetchData();
      setPubForm({ is_active: true, sort_order: 0, fileChanged: false });
      setPubError(null);
      toast.success(pubForm.id ? "Publication updated" : "Publication added");
    } catch (err) {
      const errorMsg = getErrorMessage(err, pubForm.id ? "Failed to update publication" : "Failed to create PAB publication");
      console.error("Publication Error:", err);
      setPubError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSavingPub(false);
    }
  };

  const deletePublication = async (item: PabPublication) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    setDeletingPubId(item.id);
    try {
      await pabPublicationApi.delete(item.id);
      await fetchData();
      toast.success("Publication deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete publication"));
    } finally {
      setDeletingPubId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-8 pb-20">
      <header className="flex min-w-0 flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary mb-2">
            Professional Affairs Board
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            PAB <span className="text-primary">Manager</span>
          </h2>
          <p className="mt-2 max-w-2xl text-slate-400">
            Manage PAB introduction, CPD events, applications, and publications.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={fetchData}
          disabled={loading}
          className="h-10 gap-2 rounded-xl border-white/10 text-slate-400"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </header>

      {/* Introduction Section */}
      <Card className="border-white/5 bg-[#0a0a0a] p-4 sm:p-6 xl:p-8">
        <form onSubmit={saveIntroduction} className="space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Introduction</h3>
              <p className="mt-1 text-sm text-slate-500">Board introduction text shown on the PAB page.</p>
            </div>
            <div className="flex gap-2">
              {introductionEditing ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIntroductionEditing(false);
                      fetchData();
                    }}
                    disabled={savingIntro}
                    className="rounded-xl border-white/10 text-slate-400"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={savingIntro} className="rounded-xl bg-primary font-bold text-white">
                    {savingIntro ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                  </Button>
                </>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIntroductionEditing(true)}
                  className="gap-2 rounded-xl border-white/10 text-slate-400"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              )}
            </div>
          </div>
          <Textarea
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
            readOnly={!introductionEditing}
            className={`min-h-[140px] rounded-xl border-white/10 ${
              introductionEditing ? "bg-white/5 text-white" : "cursor-not-allowed bg-white/[0.03] text-slate-400"
            }`}
          />
        </form>
      </Card>

      <Tabs defaultValue="cpd" className="w-full space-y-6">
        <TabsList className="w-full h-auto flex flex-wrap justify-start gap-2 bg-transparent">
          <TabsTrigger value="cpd" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
            CPD Events
          </TabsTrigger>
          <TabsTrigger value="applications" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
            Applications
          </TabsTrigger>
          <TabsTrigger value="publications" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
            Publications
          </TabsTrigger>
        </TabsList>

        {/* CPD Events Tab */}
        <TabsContent value="cpd" className="mt-0 space-y-0">
          <div className="grid min-w-0 gap-8 xl:grid-cols-[1fr_1.2fr]">
            {/* Form */}
            <Card className="border-white/5 bg-[#0a0a0a] p-4 sm:p-6 xl:sticky xl:top-28 xl:p-8 xl:h-fit">
              <h3 className="mb-6 flex items-center gap-3 text-lg font-bold text-white">
                {isEditingCpd ? <Pencil className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
                {isEditingCpd ? "Edit Event" : "Add Event"}
              </h3>
              {cpdError && (
                <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3">
                  <p className="text-sm text-red-400">{cpdError}</p>
                </div>
              )}
              <form onSubmit={saveCpdEvent} className="space-y-4">
                <div>
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Title *</Label>
                  <Input
                    value={cpdForm.title || ""}
                    onChange={(e) => setCpdForm({ ...cpdForm, title: e.target.value })}
                    className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Description</Label>
                  <Textarea
                    value={cpdForm.description || ""}
                    onChange={(e) => setCpdForm({ ...cpdForm, description: e.target.value })}
                    className="min-h-[100px] rounded-xl border-white/10 bg-white/5 text-white"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Date</Label>
                    <Input
                      type="date"
                      value={cpdForm.event_date || ""}
                      onChange={(e) => setCpdForm({ ...cpdForm, event_date: e.target.value })}
                      className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Time</Label>
                    <Input
                      type="time"
                      value={cpdForm.event_time || ""}
                      onChange={(e) => setCpdForm({ ...cpdForm, event_time: e.target.value })}
                      className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Venue</Label>
                  <Input
                    value={cpdForm.venue || ""}
                    onChange={(e) => setCpdForm({ ...cpdForm, venue: e.target.value })}
                    className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">File</Label>
                  {cpdForm.file_src ? (
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 shrink-0 text-primary" />
                        <p className="truncate text-sm text-slate-300">{cpdForm.file_name}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setCpdForm({ ...cpdForm, file_name: "", file_src: "" })}
                        className="shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/10 bg-white/[0.02] p-4 transition-all hover:bg-white/[0.05]">
                      <Upload className="h-5 w-5 text-slate-500 mb-2" />
                      <p className="text-xs text-slate-500">Upload file (max 10MB)</p>
                      <input type="file" onChange={handleCpdFileChange} className="hidden" />
                    </label>
                  )}
                </div>
                <div>
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Image</Label>
                  {cpdForm.image_src ? (
                    <div className="space-y-3">
                      <img
                        src={cpdForm.image_src}
                        alt={cpdForm.image_name}
                        className="h-40 w-full object-cover rounded-lg border border-white/10"
                      />
                      <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
                        <p className="truncate text-sm text-slate-300">{cpdForm.image_name}</p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setCpdForm({ ...cpdForm, image_name: "", image_src: "", imageChanged: true })}
                          className="shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/10 bg-white/[0.02] p-4 transition-all hover:bg-white/[0.05]">
                      <Upload className="h-5 w-5 text-slate-500 mb-2" />
                      <p className="text-xs text-slate-500">Upload image (max 10MB)</p>
                      <input type="file" accept="image/*" onChange={handleCpdImageChange} className="hidden" />
                    </label>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Sort Order</Label>
                    <Input
                      type="number"
                      value={cpdForm.sort_order || 0}
                      onChange={(e) => setCpdForm({ ...cpdForm, sort_order: parseInt(e.target.value) || 0 })}
                      className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
                    />
                  </div>
                  <div className="flex items-end">
                    <Switch
                      checked={cpdForm.is_active ?? true}
                      onCheckedChange={(checked) => setCpdForm({ ...cpdForm, is_active: checked })}
                    />
                    <Label className="ml-2 text-sm text-slate-400">Active</Label>
                  </div>
                </div>
                <Button type="submit" disabled={savingCpd} className="w-full bg-primary hover:bg-primary/90 h-12">
                  {savingCpd && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  {isEditingCpd ? "Update Event" : "Add Event"}
                </Button>
                {isEditingCpd && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCpdForm({ is_active: true, sort_order: 0 })}
                    className="w-full rounded-xl border-white/10 text-slate-400"
                  >
                    Cancel Edit
                  </Button>
                )}
              </form>
            </Card>

            {/* List */}
            <Card className="border-white/5 bg-[#0a0a0a] p-4 sm:p-6 xl:p-8">
              <h3 className="mb-6 text-lg font-bold text-white">Events</h3>
              <div className="space-y-3">
                {sortedCpdEvents.length === 0 ? (
                  <p className="text-center text-slate-400 py-8">No events yet</p>
                ) : (
                  sortedCpdEvents.map((event) => (
                    <div key={event.id} className="rounded-lg bg-white/5 p-4 border border-white/10">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4 className="font-bold text-white">{event.title}</h4>
                        <div className="flex gap-1 shrink-0">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setCpdForm({ ...event, imageChanged: false })}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-primary"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteCpdEvent(event)}
                            disabled={deletingCpdId === event.id}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-red-400"
                          >
                            {deletingCpdId === event.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      {event.description && <p className="text-sm text-slate-400 line-clamp-2">{event.description}</p>}
                      <div className="flex gap-3 mt-3 flex-wrap">
                        {event.event_date && <span className="text-xs text-slate-500">📅 {event.event_date}</span>}
                        {event.file_name && event.file_src && (
                          <button
                            onClick={() => downloadFile(event.file_name!, event.file_src!)}
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            📄 {event.file_name}
                          </button>
                        )}
                        {event.image_name && event.image_src && (
                          <button
                            onClick={() => downloadFile(event.image_name!, event.image_src!)}
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            🖼️ {event.image_name}
                          </button>
                        )}
                      </div>
                      <div className="flex gap-4 mt-2 text-xs text-slate-500">
                        <span>Sort: {event.sort_order}</span>
                        <span>{event.is_active ? "✓" : "✗"}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications" className="mt-0 space-y-0">
          <div className="grid min-w-0 gap-8 xl:grid-cols-[1fr_1.2fr]">
            {/* Form */}
            <Card className="border-white/5 bg-[#0a0a0a] p-4 sm:p-6 xl:sticky xl:top-28 xl:p-8 xl:h-fit">
              <h3 className="mb-6 flex items-center gap-3 text-lg font-bold text-white">
                {isEditingApp ? <Pencil className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
                {isEditingApp ? "Edit Application" : "Add Application"}
              </h3>
              {appError && (
                <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3">
                  <p className="text-sm text-red-400">{appError}</p>
                </div>
              )}
              <form onSubmit={saveApplication} className="space-y-4">
                <div>
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Title *</Label>
                  <Input
                    value={appForm.title || ""}
                    onChange={(e) => setAppForm({ ...appForm, title: e.target.value })}
                    className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Description</Label>
                  <Textarea
                    value={appForm.description || ""}
                    onChange={(e) => setAppForm({ ...appForm, description: e.target.value })}
                    className="min-h-[100px] rounded-xl border-white/10 bg-white/5 text-white"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">File</Label>
                  {appForm.file_src ? (
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 shrink-0 text-primary" />
                        <p className="truncate text-sm text-slate-300">{appForm.file_name}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setAppForm({ ...appForm, file_name: "", file_src: "", fileChanged: true })}
                        className="shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/10 bg-white/[0.02] p-4 transition-all hover:bg-white/[0.05]">
                      <Upload className="h-5 w-5 text-slate-500 mb-2" />
                      <p className="text-xs text-slate-500">Upload file (max 10MB)</p>
                      <input type="file" onChange={handleAppFileChange} className="hidden" />
                    </label>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Sort Order</Label>
                    <Input
                      type="number"
                      value={appForm.sort_order || 0}
                      onChange={(e) => setAppForm({ ...appForm, sort_order: parseInt(e.target.value) || 0 })}
                      className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
                    />
                  </div>
                  <div className="flex items-end">
                    <Switch
                      checked={appForm.is_active ?? true}
                      onCheckedChange={(checked) => setAppForm({ ...appForm, is_active: checked })}
                    />
                    <Label className="ml-2 text-sm text-slate-400">Active</Label>
                  </div>
                </div>
                <Button type="submit" disabled={savingApp} className="w-full bg-primary hover:bg-primary/90 h-12">
                  {savingApp && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  {isEditingApp ? "Update Application" : "Add Application"}
                </Button>
                {isEditingApp && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAppForm({ is_active: true, sort_order: 0 })}
                    className="w-full rounded-xl border-white/10 text-slate-400"
                  >
                    Cancel Edit
                  </Button>
                )}
              </form>
            </Card>

            {/* List */}
            <Card className="border-white/5 bg-[#0a0a0a] p-4 sm:p-6 xl:p-8">
              <h3 className="mb-6 text-lg font-bold text-white">Applications</h3>
              <div className="space-y-3">
                {sortedApplications.length === 0 ? (
                  <p className="text-center text-slate-400 py-8">No applications yet</p>
                ) : (
                  sortedApplications.map((app) => (
                    <div key={app.id} className="rounded-lg bg-white/5 p-4 border border-white/10">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4 className="font-bold text-white">{app.title}</h4>
                        <div className="flex gap-1 shrink-0">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setAppForm({ ...app, fileChanged: false })}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-primary"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteApplication(app)}
                            disabled={deletingAppId === app.id}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-red-400"
                          >
                            {deletingAppId === app.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      {app.description && <p className="text-sm text-slate-400 line-clamp-2">{app.description}</p>}
                      <div className="flex gap-3 mt-3 flex-wrap">
                        {app.file_name && app.file_src && (
                          <button
                            onClick={() => downloadFile(app.file_name!, app.file_src!)}
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            📄 {app.file_name}
                          </button>
                        )}
                      </div>
                      <div className="flex gap-4 mt-2 text-xs text-slate-500">
                        <span>Sort: {app.sort_order}</span>
                        <span>{app.is_active ? "✓" : "✗"}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Publications Tab */}
        <TabsContent value="publications" className="mt-0 space-y-0">
          <div className="grid min-w-0 gap-8 xl:grid-cols-[1fr_1.2fr]">
            {/* Form */}
            <Card className="border-white/5 bg-[#0a0a0a] p-4 sm:p-6 xl:sticky xl:top-28 xl:p-8 xl:h-fit">
              <h3 className="mb-6 flex items-center gap-3 text-lg font-bold text-white">
                {isEditingPub ? <Pencil className="h-5 w-5 text-primary" /> : <Plus className="h-5 w-5 text-primary" />}
                {isEditingPub ? "Edit Publication" : "Add Publication"}
              </h3>
              {pubError && (
                <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3">
                  <p className="text-sm text-red-400">{pubError}</p>
                </div>
              )}
              <form onSubmit={savePublication} className="space-y-4">
                <div>
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Title *</Label>
                  <Input
                    value={pubForm.title || ""}
                    onChange={(e) => setPubForm({ ...pubForm, title: e.target.value })}
                    className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Description</Label>
                  <Textarea
                    value={pubForm.description || ""}
                    onChange={(e) => setPubForm({ ...pubForm, description: e.target.value })}
                    className="min-h-[100px] rounded-xl border-white/10 bg-white/5 text-white"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">File</Label>
                  {pubForm.file_src ? (
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 shrink-0 text-primary" />
                        <p className="truncate text-sm text-slate-300">{pubForm.file_name}</p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setPubForm({ ...pubForm, file_name: "", file_src: "", fileChanged: true })}
                        className="shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-white/10 bg-white/[0.02] p-4 transition-all hover:bg-white/[0.05]">
                      <Upload className="h-5 w-5 text-slate-500 mb-2" />
                      <p className="text-xs text-slate-500">Upload file (max 10MB)</p>
                      <input type="file" onChange={handlePubFileChange} className="hidden" />
                    </label>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Sort Order</Label>
                    <Input
                      type="number"
                      value={pubForm.sort_order || 0}
                      onChange={(e) => setPubForm({ ...pubForm, sort_order: parseInt(e.target.value) || 0 })}
                      className="h-12 rounded-xl border-white/10 bg-white/5 text-white"
                    />
                  </div>
                  <div className="flex items-end">
                    <Switch
                      checked={pubForm.is_active ?? true}
                      onCheckedChange={(checked) => setPubForm({ ...pubForm, is_active: checked })}
                    />
                    <Label className="ml-2 text-sm text-slate-400">Active</Label>
                  </div>
                </div>
                <Button type="submit" disabled={savingPub} className="w-full bg-primary hover:bg-primary/90 h-12">
                  {savingPub && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  {isEditingPub ? "Update Publication" : "Add Publication"}
                </Button>
                {isEditingPub && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPubForm({ is_active: true, sort_order: 0 })}
                    className="w-full rounded-xl border-white/10 text-slate-400"
                  >
                    Cancel Edit
                  </Button>
                )}
              </form>
            </Card>

            {/* List */}
            <Card className="border-white/5 bg-[#0a0a0a] p-4 sm:p-6 xl:p-8">
              <h3 className="mb-6 text-lg font-bold text-white">Publications</h3>
              <div className="space-y-3">
                {sortedPublications.length === 0 ? (
                  <p className="text-center text-slate-400 py-8">No publications yet</p>
                ) : (
                  sortedPublications.map((pub) => (
                    <div key={pub.id} className="rounded-lg bg-white/5 p-4 border border-white/10">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h4 className="font-bold text-white">{pub.title}</h4>
                        <div className="flex gap-1 shrink-0">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setPubForm({ ...pub, fileChanged: false })}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-primary"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deletePublication(pub)}
                            disabled={deletingPubId === pub.id}
                            className="h-8 w-8 p-0 text-slate-400 hover:text-red-400"
                          >
                            {deletingPubId === pub.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      {pub.description && <p className="text-sm text-slate-400 line-clamp-2">{pub.description}</p>}
                      <div className="flex gap-3 mt-3 flex-wrap">
                        {pub.file_name && pub.file_src && (
                          <button
                            onClick={() => downloadFile(pub.file_name!, pub.file_src!)}
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            📄 {pub.file_name}
                          </button>
                        )}
                      </div>
                      <div className="flex gap-4 mt-2 text-xs text-slate-500">
                        <span>Sort: {pub.sort_order}</span>
                        <span>{pub.is_active ? "✓" : "✗"}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PabManager;
