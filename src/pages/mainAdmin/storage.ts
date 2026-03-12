const AUTH_KEY = "main_admin_authed_v1";
const HERO_IMAGE_KEY = "site_hero_image_v1";
const HERO_ITEMS_KEY = "site_hero_items_v1";
const HIGHLIGHTS_KEY = "site_key_highlights_v1";
const UPCOMING_EVENTS_KEY = "site_upcoming_events_v1";
const PAST_EVENTS_KEY = "site_past_events_v1";
const NEWS_KEY = "site_news_v1";

export type HeroItem = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  imageDataUrl: string;
  updatedAt: string; // ISO
};

export type KeyHighlightItem = {
  id: string;
  title: string;
  imageDataUrl: string;
  updatedAt: string; // ISO
};

export type AdminEventItem = {
  id: string;
  title: string;
  date: string;
  venue: string;
  imageDataUrl: string;
  updatedAt: string; // ISO
};

export type AdminNewsItem = {
  id: string;
  title: string;
  date: string;
  subtitle: string;
  description: string;
  imageDataUrl: string;
  link: string;
  updatedAt: string; // ISO
};

export type BoardAdminKey = "bae" | "bap" | "bom" | "pab";

export type BoardAdminCredential = {
  key: BoardAdminKey;
  label: string;
  username: string;
  password: string;
};

export const mainAdminStorage = {
  auth: {
    isAuthed(): boolean {
      return localStorage.getItem(AUTH_KEY) === "true";
    },
    setAuthed(value: boolean) {
      localStorage.setItem(AUTH_KEY, value ? "true" : "false");
    },
    clear() {
      localStorage.removeItem(AUTH_KEY);
    },
  },
  site: {
    heroImage: {
      get(fallback = "/images/hero-1.jpg"): string {
        const value = localStorage.getItem(HERO_IMAGE_KEY);
        return value && value.trim() ? value : fallback;
      },
      set(value: string) {
        localStorage.setItem(HERO_IMAGE_KEY, value.trim());
      },
      clear() {
        localStorage.removeItem(HERO_IMAGE_KEY);
      },
    },
    heroItems: {
      getAll(fallback: HeroItem[] = []): HeroItem[] {
        const raw = localStorage.getItem(HERO_ITEMS_KEY);
        if (!raw) return fallback;
        try {
          const parsed = JSON.parse(raw) as HeroItem[];
          return Array.isArray(parsed) ? parsed : fallback;
        } catch {
          return fallback;
        }
      },
      setAll(items: HeroItem[]) {
        localStorage.setItem(HERO_ITEMS_KEY, JSON.stringify(items));
      },
      clear() {
        localStorage.removeItem(HERO_ITEMS_KEY);
      },
    },
    keyHighlights: {
      getAll(fallback: KeyHighlightItem[] = []): KeyHighlightItem[] {
        const raw = localStorage.getItem(HIGHLIGHTS_KEY);
        if (!raw) return fallback;
        try {
          const parsed = JSON.parse(raw) as KeyHighlightItem[];
          return Array.isArray(parsed) ? parsed : fallback;
        } catch {
          return fallback;
        }
      },
      setAll(items: KeyHighlightItem[]) {
        localStorage.setItem(HIGHLIGHTS_KEY, JSON.stringify(items));
      },
      clear() {
        localStorage.removeItem(HIGHLIGHTS_KEY);
      },
    },
    upcomingEvents: {
      getAll(fallback: AdminEventItem[] = []): AdminEventItem[] {
        const raw = localStorage.getItem(UPCOMING_EVENTS_KEY);
        if (!raw) return fallback;
        try {
          const parsed = JSON.parse(raw) as AdminEventItem[];
          return Array.isArray(parsed) ? parsed : fallback;
        } catch {
          return fallback;
        }
      },
      setAll(items: AdminEventItem[]) {
        localStorage.setItem(UPCOMING_EVENTS_KEY, JSON.stringify(items));
      },
      clear() {
        localStorage.removeItem(UPCOMING_EVENTS_KEY);
      },
    },
    pastEvents: {
      getAll(fallback: AdminEventItem[] = []): AdminEventItem[] {
        const raw = localStorage.getItem(PAST_EVENTS_KEY);
        if (!raw) return fallback;
        try {
          const parsed = JSON.parse(raw) as AdminEventItem[];
          return Array.isArray(parsed) ? parsed : fallback;
        } catch {
          return fallback;
        }
      },
      setAll(items: AdminEventItem[]) {
        localStorage.setItem(PAST_EVENTS_KEY, JSON.stringify(items));
      },
      clear() {
        localStorage.removeItem(PAST_EVENTS_KEY);
      },
    },
    news: {
      getAll(fallback: AdminNewsItem[] = []): AdminNewsItem[] {
        const raw = localStorage.getItem(NEWS_KEY);
        if (!raw) return fallback;
        try {
          const parsed = JSON.parse(raw) as AdminNewsItem[];
          return Array.isArray(parsed) ? parsed : fallback;
        } catch {
          return fallback;
        }
      },
      setAll(items: AdminNewsItem[]) {
        localStorage.setItem(NEWS_KEY, JSON.stringify(items));
      },
      clear() {
        localStorage.removeItem(NEWS_KEY);
      },
    },
    boardAdmins: {
      key: "board_admin_credentials_v1",
      getAll(fallback: BoardAdminCredential[] = []): BoardAdminCredential[] {
        const raw = localStorage.getItem("board_admin_credentials_v1");
        if (!raw) return fallback;
        try {
          const parsed = JSON.parse(raw) as BoardAdminCredential[];
          return Array.isArray(parsed) ? parsed : fallback;
        } catch {
          return fallback;
        }
      },
      setAll(items: BoardAdminCredential[]) {
        localStorage.setItem("board_admin_credentials_v1", JSON.stringify(items));
      },
      clear() {
        localStorage.removeItem("board_admin_credentials_v1");
      },
    },
  },
};
