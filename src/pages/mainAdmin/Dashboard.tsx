import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Image as ImageIcon, LayoutDashboard, LogOut } from "lucide-react";
import {
  mainAdminStorage,
  type AdminEventItem,
  type AdminNewsItem,
  type BoardAdminCredential,
  type HeroItem,
  type KeyHighlightItem,
} from "./storage";

const MAX_HERO_IMAGES = 5;
const MAX_HIGHLIGHTS = 8;
const MAX_EVENTS = 20;
const MAX_NEWS = 50;

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });

const MainAdminDashboard = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const replaceFileInputRef = useRef<HTMLInputElement | null>(null);
  const highlightFileInputRef = useRef<HTMLInputElement | null>(null);
  const highlightReplaceFileInputRef = useRef<HTMLInputElement | null>(null);
  const upcomingFileInputRef = useRef<HTMLInputElement | null>(null);
  const upcomingReplaceFileInputRef = useRef<HTMLInputElement | null>(null);
  const pastFileInputRef = useRef<HTMLInputElement | null>(null);
  const pastReplaceFileInputRef = useRef<HTMLInputElement | null>(null);
  const newsFileInputRef = useRef<HTMLInputElement | null>(null);
  const newsReplaceFileInputRef = useRef<HTMLInputElement | null>(null);
  const [heroItems, setHeroItems] = useState<HeroItem[]>([]);
  const [activeHeroId, setActiveHeroId] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<KeyHighlightItem[]>([]);
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<AdminEventItem[]>([]);
  const [activeUpcomingId, setActiveUpcomingId] = useState<string | null>(null);
  const [pastEvents, setPastEvents] = useState<AdminEventItem[]>([]);
  const [activePastId, setActivePastId] = useState<string | null>(null);
  const [newsItems, setNewsItems] = useState<AdminNewsItem[]>([]);
  const [activeNewsId, setActiveNewsId] = useState<string | null>(null);
  const [boardAdmins, setBoardAdmins] = useState<BoardAdminCredential[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentHeroItems = useMemo(() => mainAdminStorage.site.heroItems.getAll([]), []);
  const currentHighlights = useMemo(() => mainAdminStorage.site.keyHighlights.getAll([]), []);
  const currentUpcoming = useMemo(() => mainAdminStorage.site.upcomingEvents.getAll([]), []);
  const currentPast = useMemo(() => mainAdminStorage.site.pastEvents.getAll([]), []);
  const currentNews = useMemo(() => mainAdminStorage.site.news.getAll([]), []);
  const currentBoardAdmins = useMemo(() => mainAdminStorage.site.boardAdmins.getAll([]), []);

  useEffect(() => {
    setHeroItems(currentHeroItems);
    setActiveHeroId(currentHeroItems[0]?.id ?? null);
  }, [currentHeroItems]);

  useEffect(() => {
    setHighlights(currentHighlights);
    setActiveHighlightId(currentHighlights[0]?.id ?? null);
  }, [currentHighlights]);

  useEffect(() => {
    setUpcomingEvents(currentUpcoming);
    setActiveUpcomingId(currentUpcoming[0]?.id ?? null);
  }, [currentUpcoming]);

  useEffect(() => {
    setPastEvents(currentPast);
    setActivePastId(currentPast[0]?.id ?? null);
  }, [currentPast]);

  useEffect(() => {
    setNewsItems(currentNews);
    setActiveNewsId(currentNews[0]?.id ?? null);
  }, [currentNews]);

  useEffect(() => {
    const defaults: BoardAdminCredential[] = [
      { key: "bae", label: "BAE Admin", username: "bae", password: "bae123" },
      { key: "bap", label: "BAP Admin", username: "bap", password: "bap123" },
      { key: "bom", label: "BOM Admin", username: "admin", password: "bomadmin123" },
      { key: "pab", label: "PAB Admin", username: "admin", password: "pabadmin123" },
    ];
    setBoardAdmins(currentBoardAdmins.length ? currentBoardAdmins : defaults);
  }, [currentBoardAdmins]);

  useEffect(() => {
    mainAdminStorage.site.heroItems.setAll(heroItems.slice(0, MAX_HERO_IMAGES));
  }, [heroItems]);

  useEffect(() => {
    mainAdminStorage.site.keyHighlights.setAll(highlights.slice(0, MAX_HIGHLIGHTS));
  }, [highlights]);

  useEffect(() => {
    mainAdminStorage.site.upcomingEvents.setAll(upcomingEvents.slice(0, MAX_EVENTS));
  }, [upcomingEvents]);

  useEffect(() => {
    mainAdminStorage.site.pastEvents.setAll(pastEvents.slice(0, MAX_EVENTS));
  }, [pastEvents]);

  useEffect(() => {
    mainAdminStorage.site.news.setAll(newsItems.slice(0, MAX_NEWS));
  }, [newsItems]);
  
  useEffect(() => {
    mainAdminStorage.site.boardAdmins.setAll(boardAdmins);
  }, [boardAdmins]);

  const activeItem = useMemo(
    () => heroItems.find((i) => i.id === activeHeroId) ?? null,
    [heroItems, activeHeroId],
  );

  const activeHighlight = useMemo(
    () => highlights.find((i) => i.id === activeHighlightId) ?? null,
    [highlights, activeHighlightId],
  );

  const activeUpcoming = useMemo(
    () => upcomingEvents.find((i) => i.id === activeUpcomingId) ?? null,
    [upcomingEvents, activeUpcomingId],
  );

  const activePast = useMemo(
    () => pastEvents.find((i) => i.id === activePastId) ?? null,
    [pastEvents, activePastId],
  );

  const activeNews = useMemo(
    () => newsItems.find((i) => i.id === activeNewsId) ?? null,
    [newsItems, activeNewsId],
  );


  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" variant="sidebar">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive>
                    <a href="/admin">
                      <LayoutDashboard />
                      <span>Dashboard</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#hero">
                      <ImageIcon />
                      <span>Hero Images</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#highlights">
                      <ImageIcon />
                      <span>Key Highlights</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#events">
                      <ImageIcon />
                      <span>Events</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#news">
                      <ImageIcon />
                      <span>News</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#board-logins">
                      <ImageIcon />
                      <span>Board Logins</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#board-login-bae">
                      <span>BAE Login</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#board-login-bap">
                      <span>BAP Login</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#board-login-bom">
                      <span>BOM Login</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#board-login-pab">
                      <span>PAB Login</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => {
                      mainAdminStorage.auth.clear();
                      navigate("/admin/login", { replace: true });
                    }}
                  >
                    <LogOut />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <div className="flex-1">
        <div className="min-h-svh bg-background">
          <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <p className="font-heading text-base font-semibold text-foreground">Main Admin</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  mainAdminStorage.auth.clear();
                  navigate("/admin/login", { replace: true });
                }}
              >
                Logout
              </Button>
            </div>
          </header>

          <main className="mx-auto max-w-6xl px-4 py-10 space-y-6">
            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm" id="hero">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-heading text-lg font-semibold text-foreground">Hero Images</h2>
                  <p className="text-sm text-foreground/60">Manage up to {MAX_HERO_IMAGES} hero images.</p>
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-12">
                    <div className="lg:col-span-4 space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">Hero images</p>
                          <p className="text-xs text-foreground/60">
                            Upload up to {MAX_HERO_IMAGES} images.
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              e.target.value = "";
                              setError(null);

                              if (heroItems.length >= MAX_HERO_IMAGES) {
                                setError(`You can upload up to ${MAX_HERO_IMAGES} hero images.`);
                                return;
                              }

                              try {
                                setSaving(true);
                                const dataUrl = await fileToDataUrl(file);
                                const now = new Date().toISOString();
                                const next: HeroItem = {
                                  id: createId(),
                                  title: "",
                                  subtitle: "",
                                  description: "",
                                  imageDataUrl: dataUrl,
                                  updatedAt: now,
                                };
                                setHeroItems((prev) => [next, ...prev]);
                                setActiveHeroId(next.id);
                                toast.success("Hero image added.");
                              } catch {
                                setError("Upload failed. Please try again.");
                              } finally {
                                setSaving(false);
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={saving || heroItems.length >= MAX_HERO_IMAGES}
                          >
                            Upload
                          </Button>
                        </div>
                      </div>

                      {error ? <p className="text-sm text-destructive">{error}</p> : null}

                      <div className="rounded-2xl border border-border overflow-hidden">
                        <div className="max-h-[420px] overflow-auto">
                          {heroItems.length === 0 ? (
                            <p className="p-4 text-sm text-foreground/60">No hero images yet.</p>
                          ) : (
                            <ul className="divide-y divide-border">
                              {heroItems.map((item) => (
                                <li key={item.id}>
                                  <button
                                    type="button"
                                    onClick={() => setActiveHeroId(item.id)}
                                    className={`w-full flex items-center gap-3 p-3 text-left hover:bg-muted/40 transition ${
                                      activeHeroId === item.id ? "bg-muted/40" : ""
                                    }`}
                                  >
                                    <div className="h-12 w-16 rounded-lg overflow-hidden border border-border bg-muted shrink-0">
                                      <img
                                        src={item.imageDataUrl}
                                        alt={item.title || "Hero image"}
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                      />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-sm font-medium text-foreground truncate">
                                        {item.title?.trim() ? item.title : "Untitled"}
                                      </p>
                                      <p className="text-xs text-foreground/60 truncate">
                                        {item.subtitle?.trim() ? item.subtitle : "No subtitle"}
                                      </p>
                                    </div>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>

                        <div className="flex flex-wrap gap-3">
                        <Button
                          onClick={() => {
                            setError(null);
                            mainAdminStorage.site.heroItems.setAll(heroItems.slice(0, MAX_HERO_IMAGES));
                            toast.success("Hero images saved.");
                          }}
                          disabled={saving}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setError(null);
                            mainAdminStorage.site.heroItems.clear();
                            mainAdminStorage.site.heroImage.clear();
                            setHeroItems([]);
                            setActiveHeroId(null);
                            toast.success("Hero images reset.");
                          }}
                          disabled={saving}
                        >
                          Reset
                        </Button>
                      </div>
                    </div>

                    <div className="lg:col-span-8 space-y-4">
                      <div className="rounded-3xl border border-border bg-background/60 overflow-hidden">
                        <div className="p-4 border-b border-border">
                          <p className="text-sm font-medium text-foreground">Preview</p>
                          <p className="text-xs text-foreground/60 truncate">
                            {activeItem ? activeItem.title || "Untitled" : "Select an image"}
                          </p>
                        </div>
                        <div className="aspect-[16/9] bg-muted">
                          {activeItem ? (
                            <img
                              src={activeItem.imageDataUrl}
                              alt={activeItem.title || "Hero preview"}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : null}
                        </div>
                      </div>

                      {activeItem ? (
                        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-foreground">Details</p>
                            <div className="flex items-center gap-2">
                              <input
                                ref={replaceFileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  e.target.value = "";
                                  setError(null);
                                  try {
                                    setSaving(true);
                                    const dataUrl = await fileToDataUrl(file);
                                    setHeroItems((prev) =>
                                      prev.map((i) =>
                                        i.id === activeItem.id
                                          ? { ...i, imageDataUrl: dataUrl, updatedAt: new Date().toISOString() }
                                          : i,
                                      ),
                                    );
                                    toast.success("Image replaced.");
                                  } catch {
                                    setError("Replace failed. Please try again.");
                                  } finally {
                                    setSaving(false);
                                  }
                                }}
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => replaceFileInputRef.current?.click()}
                                disabled={saving}
                              >
                                Replace image
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  setHeroItems((prev) => {
                                    const remaining = prev.filter((i) => i.id !== activeItem.id);
                                    setActiveHeroId((current) =>
                                      current === activeItem.id ? remaining[0]?.id ?? null : current,
                                    );
                                    return remaining;
                                  });
                                  toast.success("Hero image removed.");
                                }}
                                disabled={saving}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>

                          <div className="mt-4 grid gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="hero-title">Title</Label>
                              <Input
                                id="hero-title"
                                value={activeItem.title}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setHeroItems((prev) =>
                                    prev.map((i) =>
                                      i.id === activeItem.id
                                        ? { ...i, title: value, updatedAt: new Date().toISOString() }
                                        : i,
                                    ),
                                  );
                                }}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="hero-subtitle">Subtitle</Label>
                              <Input
                                id="hero-subtitle"
                                value={activeItem.subtitle}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setHeroItems((prev) =>
                                    prev.map((i) =>
                                      i.id === activeItem.id
                                        ? { ...i, subtitle: value, updatedAt: new Date().toISOString() }
                                        : i,
                                    ),
                                  );
                                }}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="hero-description">Image description</Label>
                              <Textarea
                                id="hero-description"
                                value={activeItem.description}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setHeroItems((prev) =>
                                    prev.map((i) =>
                                      i.id === activeItem.id
                                        ? { ...i, description: value, updatedAt: new Date().toISOString() }
                                        : i,
                                    ),
                                  );
                                }}
                                placeholder="Short description for this hero image..."
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
                          <p className="text-sm text-foreground/60">Upload and select a hero image to edit details.</p>
                        </div>
                      )}
                    </div>
                  </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm scroll-mt-24" id="highlights">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-heading text-lg font-semibold text-foreground">Key Highlights</h2>
                  <p className="text-sm text-foreground/60">Cards on the home page.</p>
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-12">
                    <div className="lg:col-span-4 space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">Key highlights</p>
                          <p className="text-xs text-foreground/60">Upload up to {MAX_HIGHLIGHTS} cards.</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            ref={highlightFileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              e.target.value = "";
                              setError(null);

                              if (highlights.length >= MAX_HIGHLIGHTS) {
                                setError(`You can upload up to ${MAX_HIGHLIGHTS} highlights.`);
                                return;
                              }

                              try {
                                setSaving(true);
                                const dataUrl = await fileToDataUrl(file);
                                const now = new Date().toISOString();
                                const next: KeyHighlightItem = {
                                  id: createId(),
                                  title: "",
                                  imageDataUrl: dataUrl,
                                  updatedAt: now,
                                };
                                setHighlights((prev) => [next, ...prev]);
                                setActiveHighlightId(next.id);
                                toast.success("Highlight added.");
                              } catch {
                                setError("Upload failed. Please try again.");
                              } finally {
                                setSaving(false);
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            onClick={() => highlightFileInputRef.current?.click()}
                            disabled={saving || highlights.length >= MAX_HIGHLIGHTS}
                          >
                            Upload
                          </Button>
                        </div>
                      </div>

                      {error ? <p className="text-sm text-destructive">{error}</p> : null}

                      <div className="rounded-2xl border border-border overflow-hidden">
                        <div className="max-h-[420px] overflow-auto">
                          {highlights.length === 0 ? (
                            <p className="p-4 text-sm text-foreground/60">No highlights yet.</p>
                          ) : (
                            <ul className="divide-y divide-border">
                              {highlights.map((item) => (
                                <li key={item.id}>
                                  <button
                                    type="button"
                                    onClick={() => setActiveHighlightId(item.id)}
                                    className={`w-full flex items-center gap-3 p-3 text-left hover:bg-muted/40 transition ${
                                      activeHighlightId === item.id ? "bg-muted/40" : ""
                                    }`}
                                  >
                                    <div className="h-12 w-16 rounded-lg overflow-hidden border border-border bg-muted shrink-0">
                                      <img
                                        src={item.imageDataUrl}
                                        alt={item.title || "Highlight image"}
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                      />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-sm font-medium text-foreground truncate">
                                        {item.title?.trim() ? item.title : "Untitled"}
                                      </p>
                                    </div>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button
                          onClick={() => {
                            setError(null);
                            mainAdminStorage.site.keyHighlights.setAll(highlights.slice(0, MAX_HIGHLIGHTS));
                            toast.success("Highlights saved.");
                          }}
                          disabled={saving}
                        >
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setError(null);
                            mainAdminStorage.site.keyHighlights.clear();
                            setHighlights([]);
                            setActiveHighlightId(null);
                            toast.success("Highlights reset.");
                          }}
                          disabled={saving}
                        >
                          Reset
                        </Button>
                      </div>
                    </div>

                    <div className="lg:col-span-8 space-y-4">
                      <div className="rounded-3xl border border-border bg-background/60 overflow-hidden">
                        <div className="p-4 border-b border-border">
                          <p className="text-sm font-medium text-foreground">Preview</p>
                          <p className="text-xs text-foreground/60 truncate">
                            {activeHighlight ? activeHighlight.title || "Untitled" : "Select a highlight"}
                          </p>
                        </div>
                        <div className="aspect-[16/9] bg-muted">
                          {activeHighlight ? (
                            <img
                              src={activeHighlight.imageDataUrl}
                              alt={activeHighlight.title || "Highlight preview"}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : null}
                        </div>
                      </div>

                      {activeHighlight ? (
                        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-foreground">Details</p>
                            <div className="flex items-center gap-2">
                              <input
                                ref={highlightReplaceFileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  e.target.value = "";
                                  setError(null);
                                  try {
                                    setSaving(true);
                                    const dataUrl = await fileToDataUrl(file);
                                    setHighlights((prev) =>
                                      prev.map((i) =>
                                        i.id === activeHighlight.id
                                          ? { ...i, imageDataUrl: dataUrl, updatedAt: new Date().toISOString() }
                                          : i,
                                      ),
                                    );
                                    toast.success("Image replaced.");
                                  } catch {
                                    setError("Replace failed. Please try again.");
                                  } finally {
                                    setSaving(false);
                                  }
                                }}
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => highlightReplaceFileInputRef.current?.click()}
                                disabled={saving}
                              >
                                Replace image
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  setHighlights((prev) => {
                                    const remaining = prev.filter((i) => i.id !== activeHighlight.id);
                                    setActiveHighlightId((current) =>
                                      current === activeHighlight.id ? remaining[0]?.id ?? null : current,
                                    );
                                    return remaining;
                                  });
                                  toast.success("Highlight deleted.");
                                }}
                                disabled={saving}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>

                          <div className="mt-4 grid gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="highlight-title">Title</Label>
                              <Input
                                id="highlight-title"
                                value={activeHighlight.title}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setHighlights((prev) =>
                                    prev.map((i) =>
                                      i.id === activeHighlight.id
                                        ? { ...i, title: value, updatedAt: new Date().toISOString() }
                                        : i,
                                    ),
                                  );
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
                          <p className="text-sm text-foreground/60">Upload and select a highlight to edit.</p>
                        </div>
                      )}
                    </div>
                  </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm scroll-mt-24" id="events">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-heading text-lg font-semibold text-foreground">Events</h2>
                  <p className="text-sm text-foreground/60">Manage Upcoming Events and Past Events pages.</p>
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-border bg-background/60 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">Upcoming Events</p>
                      <p className="text-xs text-foreground/60">Up to {MAX_EVENTS} items.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        ref={upcomingFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          e.target.value = "";
                          setError(null);

                          if (upcomingEvents.length >= MAX_EVENTS) {
                            setError(`You can add up to ${MAX_EVENTS} upcoming events.`);
                            return;
                          }

                          try {
                            setSaving(true);
                            const dataUrl = await fileToDataUrl(file);
                            const now = new Date().toISOString();
                            const next: AdminEventItem = {
                              id: createId(),
                              title: "",
                              date: "",
                              venue: "",
                              imageDataUrl: dataUrl,
                              updatedAt: now,
                            };
                            setUpcomingEvents((prev) => [next, ...prev]);
                            setActiveUpcomingId(next.id);
                            toast.success("Upcoming event added.");
                          } catch {
                            setError("Upload failed. Please try again.");
                          } finally {
                            setSaving(false);
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={() => upcomingFileInputRef.current?.click()}
                        disabled={saving || upcomingEvents.length >= MAX_EVENTS}
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}

                  <div className="mt-4 rounded-2xl border border-border overflow-hidden">
                    <div className="max-h-[320px] overflow-auto">
                      {upcomingEvents.length === 0 ? (
                        <p className="p-4 text-sm text-foreground/60">No upcoming events yet.</p>
                      ) : (
                        <ul className="divide-y divide-border">
                          {upcomingEvents.map((item) => (
                            <li key={item.id}>
                              <button
                                type="button"
                                onClick={() => setActiveUpcomingId(item.id)}
                                className={`w-full flex items-center gap-3 p-3 text-left hover:bg-muted/40 transition ${
                                  activeUpcomingId === item.id ? "bg-muted/40" : ""
                                }`}
                              >
                                <div className="h-12 w-16 rounded-lg overflow-hidden border border-border bg-muted shrink-0">
                                  <img
                                    src={item.imageDataUrl}
                                    alt={item.title || "Upcoming event"}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">
                                    {item.title?.trim() ? item.title : "Untitled"}
                                  </p>
                                  <p className="text-xs text-foreground/60 truncate">{item.date || "No date"}</p>
                                </div>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    {activeUpcoming ? (
                      <div className="space-y-4">
                        <div className="rounded-2xl border border-border overflow-hidden">
                          <div className="aspect-[16/9] bg-muted">
                            <img
                              src={activeUpcoming.imageDataUrl}
                              alt={activeUpcoming.title || "Upcoming preview"}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            ref={upcomingReplaceFileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              e.target.value = "";
                              setError(null);
                              try {
                                setSaving(true);
                                const dataUrl = await fileToDataUrl(file);
                                setUpcomingEvents((prev) =>
                                  prev.map((i) =>
                                    i.id === activeUpcoming.id
                                      ? { ...i, imageDataUrl: dataUrl, updatedAt: new Date().toISOString() }
                                      : i,
                                  ),
                                );
                                toast.success("Image replaced.");
                              } catch {
                                setError("Replace failed. Please try again.");
                              } finally {
                                setSaving(false);
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => upcomingReplaceFileInputRef.current?.click()}
                            disabled={saving}
                          >
                            Replace image
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setUpcomingEvents((prev) => {
                                const remaining = prev.filter((i) => i.id !== activeUpcoming.id);
                                setActiveUpcomingId((current) =>
                                  current === activeUpcoming.id ? remaining[0]?.id ?? null : current,
                                );
                                return remaining;
                              });
                              toast.success("Upcoming event deleted.");
                            }}
                            disabled={saving}
                          >
                            Delete
                          </Button>
                        </div>

                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="upcoming-title">Title</Label>
                            <Input
                              id="upcoming-title"
                              value={activeUpcoming.title}
                              onChange={(e) => {
                                const value = e.target.value;
                                setUpcomingEvents((prev) =>
                                  prev.map((i) =>
                                    i.id === activeUpcoming.id
                                      ? { ...i, title: value, updatedAt: new Date().toISOString() }
                                      : i,
                                  ),
                                );
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="upcoming-date">Date</Label>
                            <Input
                              id="upcoming-date"
                              value={activeUpcoming.date}
                              onChange={(e) => {
                                const value = e.target.value;
                                setUpcomingEvents((prev) =>
                                  prev.map((i) =>
                                    i.id === activeUpcoming.id
                                      ? { ...i, date: value, updatedAt: new Date().toISOString() }
                                      : i,
                                  ),
                                );
                              }}
                              placeholder="e.g., February 2026"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="upcoming-venue">Venue</Label>
                            <Input
                              id="upcoming-venue"
                              value={activeUpcoming.venue}
                              onChange={(e) => {
                                const value = e.target.value;
                                setUpcomingEvents((prev) =>
                                  prev.map((i) =>
                                    i.id === activeUpcoming.id
                                      ? { ...i, venue: value, updatedAt: new Date().toISOString() }
                                      : i,
                                  ),
                                );
                              }}
                              placeholder="e.g., Colombo"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-foreground/60">Select an upcoming event to edit.</p>
                    )}
                  </div>
                </div>

                <div className="rounded-3xl border border-border bg-background/60 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">Past Events</p>
                      <p className="text-xs text-foreground/60">Up to {MAX_EVENTS} items.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        ref={pastFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          e.target.value = "";
                          setError(null);

                          if (pastEvents.length >= MAX_EVENTS) {
                            setError(`You can add up to ${MAX_EVENTS} past events.`);
                            return;
                          }

                          try {
                            setSaving(true);
                            const dataUrl = await fileToDataUrl(file);
                            const now = new Date().toISOString();
                            const next: AdminEventItem = {
                              id: createId(),
                              title: "",
                              date: "",
                              venue: "",
                              imageDataUrl: dataUrl,
                              updatedAt: now,
                            };
                            setPastEvents((prev) => [next, ...prev]);
                            setActivePastId(next.id);
                            toast.success("Past event added.");
                          } catch {
                            setError("Upload failed. Please try again.");
                          } finally {
                            setSaving(false);
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={() => pastFileInputRef.current?.click()}
                        disabled={saving || pastEvents.length >= MAX_EVENTS}
                      >
                        Add
                      </Button>
                    </div>
                  </div>

                  {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}

                  <div className="mt-4 rounded-2xl border border-border overflow-hidden">
                    <div className="max-h-[320px] overflow-auto">
                      {pastEvents.length === 0 ? (
                        <p className="p-4 text-sm text-foreground/60">No past events yet.</p>
                      ) : (
                        <ul className="divide-y divide-border">
                          {pastEvents.map((item) => (
                            <li key={item.id}>
                              <button
                                type="button"
                                onClick={() => setActivePastId(item.id)}
                                className={`w-full flex items-center gap-3 p-3 text-left hover:bg-muted/40 transition ${
                                  activePastId === item.id ? "bg-muted/40" : ""
                                }`}
                              >
                                <div className="h-12 w-16 rounded-lg overflow-hidden border border-border bg-muted shrink-0">
                                  <img
                                    src={item.imageDataUrl}
                                    alt={item.title || "Past event"}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">
                                    {item.title?.trim() ? item.title : "Untitled"}
                                  </p>
                                  <p className="text-xs text-foreground/60 truncate">{item.date || "No date"}</p>
                                </div>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    {activePast ? (
                      <div className="space-y-4">
                        <div className="rounded-2xl border border-border overflow-hidden">
                          <div className="aspect-[16/9] bg-muted">
                            <img
                              src={activePast.imageDataUrl}
                              alt={activePast.title || "Past preview"}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            ref={pastReplaceFileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              e.target.value = "";
                              setError(null);
                              try {
                                setSaving(true);
                                const dataUrl = await fileToDataUrl(file);
                                setPastEvents((prev) =>
                                  prev.map((i) =>
                                    i.id === activePast.id
                                      ? { ...i, imageDataUrl: dataUrl, updatedAt: new Date().toISOString() }
                                      : i,
                                  ),
                                );
                                toast.success("Image replaced.");
                              } catch {
                                setError("Replace failed. Please try again.");
                              } finally {
                                setSaving(false);
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => pastReplaceFileInputRef.current?.click()}
                            disabled={saving}
                          >
                            Replace image
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setPastEvents((prev) => {
                                const remaining = prev.filter((i) => i.id !== activePast.id);
                                setActivePastId((current) =>
                                  current === activePast.id ? remaining[0]?.id ?? null : current,
                                );
                                return remaining;
                              });
                              toast.success("Past event deleted.");
                            }}
                            disabled={saving}
                          >
                            Delete
                          </Button>
                        </div>

                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="past-title">Title</Label>
                            <Input
                              id="past-title"
                              value={activePast.title}
                              onChange={(e) => {
                                const value = e.target.value;
                                setPastEvents((prev) =>
                                  prev.map((i) =>
                                    i.id === activePast.id
                                      ? { ...i, title: value, updatedAt: new Date().toISOString() }
                                      : i,
                                  ),
                                );
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="past-date">Date</Label>
                            <Input
                              id="past-date"
                              value={activePast.date}
                              onChange={(e) => {
                                const value = e.target.value;
                                setPastEvents((prev) =>
                                  prev.map((i) =>
                                    i.id === activePast.id
                                      ? { ...i, date: value, updatedAt: new Date().toISOString() }
                                      : i,
                                  ),
                                );
                              }}
                              placeholder="e.g., February 2024"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="past-venue">Venue</Label>
                            <Input
                              id="past-venue"
                              value={activePast.venue}
                              onChange={(e) => {
                                const value = e.target.value;
                                setPastEvents((prev) =>
                                  prev.map((i) =>
                                    i.id === activePast.id
                                      ? { ...i, venue: value, updatedAt: new Date().toISOString() }
                                      : i,
                                  ),
                                );
                              }}
                              placeholder="e.g., Colombo"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-foreground/60">Select a past event to edit.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm scroll-mt-24" id="news">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-heading text-lg font-semibold text-foreground">News</h2>
                  <p className="text-sm text-foreground/60">Manage the Latest News page and home news section.</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    ref={newsFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      if (!file) return;
                      setError(null);
                      if (newsItems.length >= MAX_NEWS) {
                        setError(`You can add up to ${MAX_NEWS} news items.`);
                        return;
                      }
                      try {
                        setSaving(true);
                        const dataUrl = await fileToDataUrl(file);
                        const now = new Date().toISOString();
                        const next: AdminNewsItem = {
                          id: createId(),
                          title: "",
                          date: "",
                          subtitle: "",
                          description: "",
                          imageDataUrl: dataUrl,
                          link: "#",
                          updatedAt: now,
                        };
                        setNewsItems((prev) => [next, ...prev]);
                        setActiveNewsId(next.id);
                        toast.success("News item added.");
                      } catch {
                        setError("Upload failed. Please try again.");
                      } finally {
                        setSaving(false);
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={() => newsFileInputRef.current?.click()}
                    disabled={saving || newsItems.length >= MAX_NEWS}
                  >
                    Add news
                  </Button>
                </div>
              </div>

              {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}

              <div className="mt-6 grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-4 space-y-4">
                  <div className="rounded-2xl border border-border overflow-hidden">
                    <div className="max-h-[520px] overflow-auto">
                      {newsItems.length === 0 ? (
                        <p className="p-4 text-sm text-foreground/60">No news yet.</p>
                      ) : (
                        <ul className="divide-y divide-border">
                          {newsItems.map((item) => (
                            <li key={item.id}>
                              <button
                                type="button"
                                onClick={() => setActiveNewsId(item.id)}
                                className={`w-full p-3 text-left hover:bg-muted/40 transition ${
                                  activeNewsId === item.id ? "bg-muted/40" : ""
                                }`}
                              >
                                <p className="text-sm font-medium text-foreground truncate">
                                  {item.title?.trim() ? item.title : "Untitled"}
                                </p>
                                <p className="text-xs text-foreground/60 truncate">{item.date || "No date"}</p>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => {
                        setError(null);
                        mainAdminStorage.site.news.setAll(newsItems.slice(0, MAX_NEWS));
                        toast.success("News saved.");
                      }}
                      disabled={saving}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setError(null);
                        mainAdminStorage.site.news.clear();
                        setNewsItems([]);
                        setActiveNewsId(null);
                        toast.success("News reset.");
                      }}
                      disabled={saving}
                    >
                      Reset
                    </Button>
                  </div>
                </div>

                <div className="lg:col-span-8">
                  {activeNews ? (
                    <div className="rounded-3xl border border-border bg-background/60 p-6">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-foreground">Details</p>
                        <div className="flex items-center gap-2">
                          <input
                            ref={newsReplaceFileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              e.target.value = "";
                              if (!file) return;
                              setError(null);
                              try {
                                setSaving(true);
                                const dataUrl = await fileToDataUrl(file);
                                setNewsItems((prev) =>
                                  prev.map((i) =>
                                    i.id === activeNews.id
                                      ? { ...i, imageDataUrl: dataUrl, updatedAt: new Date().toISOString() }
                                      : i,
                                  ),
                                );
                                toast.success("Image replaced.");
                              } catch {
                                setError("Replace failed. Please try again.");
                              } finally {
                                setSaving(false);
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => newsReplaceFileInputRef.current?.click()}
                            disabled={saving}
                          >
                            Replace image
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setNewsItems((prev) => {
                                const remaining = prev.filter((i) => i.id !== activeNews.id);
                                setActiveNewsId((current) =>
                                  current === activeNews.id ? remaining[0]?.id ?? null : current,
                                );
                                return remaining;
                              });
                              toast.success("News deleted.");
                            }}
                            disabled={saving}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4 rounded-2xl border border-border overflow-hidden">
                        <div className="aspect-[16/9] bg-muted">
                          {activeNews.imageDataUrl ? (
                            <img
                              src={activeNews.imageDataUrl}
                              alt={activeNews.title || "News image"}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="news-title">Title</Label>
                          <Input
                            id="news-title"
                            value={activeNews.title}
                            onChange={(e) => {
                              const value = e.target.value;
                              setNewsItems((prev) =>
                                prev.map((i) =>
                                  i.id === activeNews.id ? { ...i, title: value, updatedAt: new Date().toISOString() } : i,
                                ),
                              );
                            }}
                          />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="news-date">Date</Label>
                            <Input
                              id="news-date"
                              value={activeNews.date}
                              onChange={(e) => {
                                const value = e.target.value;
                                setNewsItems((prev) =>
                                  prev.map((i) =>
                                    i.id === activeNews.id ? { ...i, date: value, updatedAt: new Date().toISOString() } : i,
                                  ),
                                );
                              }}
                              placeholder="e.g., March 2026"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="news-link">Link</Label>
                            <Input
                              id="news-link"
                              value={activeNews.link}
                              onChange={(e) => {
                                const value = e.target.value;
                                setNewsItems((prev) =>
                                  prev.map((i) =>
                                    i.id === activeNews.id ? { ...i, link: value, updatedAt: new Date().toISOString() } : i,
                                  ),
                                );
                              }}
                              placeholder="# or https://..."
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="news-subtitle">Subtitle</Label>
                          <Input
                            id="news-subtitle"
                            value={activeNews.subtitle}
                            onChange={(e) => {
                              const value = e.target.value;
                              setNewsItems((prev) =>
                                prev.map((i) =>
                                  i.id === activeNews.id
                                    ? { ...i, subtitle: value, updatedAt: new Date().toISOString() }
                                    : i,
                                ),
                              );
                            }}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="news-description">Description</Label>
                          <Textarea
                            id="news-description"
                            value={activeNews.description}
                            onChange={(e) => {
                              const value = e.target.value;
                              setNewsItems((prev) =>
                                prev.map((i) =>
                                  i.id === activeNews.id
                                    ? { ...i, description: value, updatedAt: new Date().toISOString() }
                                    : i,
                                ),
                              );
                            }}
                            placeholder="News content..."
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-border bg-background/60 p-8">
                      <p className="text-sm text-foreground/60">Select a news item to edit.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm scroll-mt-24" id="board-logins">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-heading text-lg font-semibold text-foreground">Board Admin Logins</h2>
                  <p className="text-sm text-foreground/60">
                    Manage credentials and quick access for BAE / BAP / BOM / PAB admin panels.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => {
                      setError(null);
                      mainAdminStorage.site.boardAdmins.setAll(boardAdmins);
                      toast.success("Board admin logins saved.");
                    }}
                    disabled={saving}
                  >
                    Save all
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setError(null);
                      mainAdminStorage.site.boardAdmins.clear();
                      const defaults: BoardAdminCredential[] = [
                        { key: "bae", label: "BAE Admin", username: "bae", password: "bae123" },
                        { key: "bap", label: "BAP Admin", username: "bap", password: "bap123" },
                        { key: "bom", label: "BOM Admin", username: "admin", password: "bomadmin123" },
                        { key: "pab", label: "PAB Admin", username: "admin", password: "pabadmin123" },
                      ];
                      setBoardAdmins(defaults);
                      toast.success("Board admin logins reset to defaults.");
                    }}
                    disabled={saving}
                  >
                    Reset all
                  </Button>
                </div>
              </div>

              {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                {(["bae", "bap", "bom", "pab"] as const).map((key) => {
                  const acc = boardAdmins.find((a) => a.key === key);
                  if (!acc) return null;

                  const loginRoute =
                    acc.key === "bae"
                      ? "/bae-admin/login"
                      : acc.key === "bap"
                        ? "/bap-admin/login"
                        : acc.key === "bom"
                          ? "/bom-admin/login"
                          : "/pab-admin/login";

                  const appRoute =
                    acc.key === "bae"
                      ? "/bae-admin"
                      : acc.key === "bap"
                        ? "/bap-admin"
                        : acc.key === "bom"
                          ? "/bom-admin"
                          : "/pab-admin";

                  const authKey =
                    acc.key === "bae"
                      ? "bae_admin_authed_v1"
                      : acc.key === "bap"
                        ? "bap_admin_authed_v1"
                        : acc.key === "bom"
                          ? "bom_admin_authed_v1"
                          : "pab_admin_auth";

                  return (
                    <div
                      key={acc.key}
                      id={`board-login-${acc.key}`}
                      className="scroll-mt-24 rounded-3xl border border-border bg-background/60 p-6"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-heading text-lg font-semibold text-foreground">{acc.label}</h3>
                          <p className="mt-1 text-xs text-foreground/60">
                            Login: <span className="font-mono">{loginRoute}</span>
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" onClick={() => navigate(loginRoute)}>
                            Open login
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              localStorage.setItem(authKey, "true");
                              toast.success(`${acc.label} logged in.`);
                              navigate(appRoute);
                            }}
                          >
                            Login now
                          </Button>
                        </div>
                      </div>

                      <div className="mt-5 grid gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`board-admin-${acc.key}-username`}>Username</Label>
                          <Input
                            id={`board-admin-${acc.key}-username`}
                            value={acc.username}
                            onChange={(e) => {
                              const value = e.target.value;
                              setBoardAdmins((prev) =>
                                prev.map((i) => (i.key === acc.key ? { ...i, username: value } : i)),
                              );
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`board-admin-${acc.key}-password`}>Password</Label>
                          <Input
                            id={`board-admin-${acc.key}-password`}
                            type="password"
                            value={acc.password}
                            onChange={(e) => {
                              const value = e.target.value;
                              setBoardAdmins((prev) =>
                                prev.map((i) => (i.key === acc.key ? { ...i, password: value } : i)),
                              );
                            }}
                          />
                        </div>
                      </div>

                      <div className="mt-5">
                        <Button
                          size="sm"
                          onClick={() => {
                            setError(null);
                            mainAdminStorage.site.boardAdmins.setAll(boardAdmins);
                            toast.success(`${acc.label} saved.`);
                          }}
                          disabled={saving}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainAdminDashboard;
