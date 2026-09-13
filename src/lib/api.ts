// ---------------------------------------------------------------------------
// API base — points to the XAMPP Laravel backend
// ---------------------------------------------------------------------------
export const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.DEV ? "http://127.0.0.1:8000/api" : "/api");

// ---------------------------------------------------------------------------
// Hero Images
// ---------------------------------------------------------------------------
export interface HeroSlide {
  id: number;
  image: string;      // base64 data URL or public path
  tag: string;
  title: string;
  description: string;
  link: string;
  created_at?: string;
  updated_at?: string;
}

export const ADMIN_TOKEN_KEY = "slia_admin_token";
export const ADMIN_USER_KEY = "slia_admin_user";

const headers = () => {
  const token = typeof window !== "undefined" ? window.localStorage.getItem(ADMIN_TOKEN_KEY) : null;

  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const authHeaders = () => {
  const token = typeof window !== "undefined" ? window.localStorage.getItem(ADMIN_TOKEN_KEY) : null;

  return {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export interface AdminLoginResponse {
  token: string;
  user: {
    name: string;
    email: string;
    role?: "super_admin" | "board_admin";
    board_key?: BoardMemberKey | null;
  };
}

export const adminAuthApi = {
  login: async (username: string, password: string): Promise<AdminLoginResponse> => {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Login failed");
    }
    return res.json();
  },

  logout: async (): Promise<void> => {
    const res = await fetch(`${API_BASE}/admin/logout`, {
      method: "POST",
      headers: headers(),
    });
    if (!res.ok && res.status !== 401) throw new Error("Logout failed");
  },
};

export interface AdminUserItem {
  id: number;
  name: string;
  email: string;
  role: "super_admin" | "board_admin";
  board_key?: BoardMemberKey | null;
  updated_at?: string;
}

export const adminUserApi = {
  list: async (): Promise<AdminUserItem[]> => {
    const res = await fetch(`${API_BASE}/admin/users`, { headers: headers() });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to fetch admin users");
    }
    return res.json();
  },

  update: async (id: number, data: { name: string; password?: string }): Promise<AdminUserItem> => {
    const res = await fetch(`${API_BASE}/admin/users/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to update admin user");
    }
    return res.json();
  },
};

export const heroApi = {
  /** GET /api/hero-images */
  list: async (): Promise<HeroSlide[]> => {
    const res = await fetch(`${API_BASE}/hero-images`, { headers: headers() });
    if (!res.ok) throw new Error(`Failed to fetch hero images: ${res.status}`);
    return res.json();
  },

  /** POST /api/hero-images */
  create: async (data: Omit<HeroSlide, "id" | "created_at" | "updated_at">): Promise<HeroSlide> => {
    const res = await fetch(`${API_BASE}/hero-images`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to create hero image: ${res.status}`);
    }
    return res.json();
  },

  /** PUT /api/hero-images/:id */
  update: async (
    id: number,
    data: Partial<Omit<HeroSlide, "id" | "created_at" | "updated_at">>
  ): Promise<HeroSlide> => {
    const res = await fetch(`${API_BASE}/hero-images/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to update hero image: ${res.status}`);
    }
    return res.json();
  },

  /** DELETE /api/hero-images/:id */
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/hero-images/${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    if (!res.ok) throw new Error(`Failed to delete hero image: ${res.status}`);
  },
};

// ---------------------------------------------------------------------------
// Hero Buttons
// ---------------------------------------------------------------------------
export interface HeroButton {
  id: number;
  label: string;
  link: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export const heroButtonApi = {
  /** GET /api/hero-buttons */
  list: async (): Promise<HeroButton[]> => {
    const res = await fetch(`${API_BASE}/hero-buttons`, { headers: headers() });
    if (!res.ok) throw new Error(`Failed to fetch hero buttons: ${res.status}`);
    return res.json();
  },

  /** POST /api/hero-buttons */
  create: async (data: Omit<HeroButton, "id" | "created_at" | "updated_at">): Promise<HeroButton> => {
    const res = await fetch(`${API_BASE}/hero-buttons`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to create hero button: ${res.status}`);
    }
    return res.json();
  },

  /** PUT /api/hero-buttons/:id */
  update: async (
    id: number,
    data: Partial<Omit<HeroButton, "id" | "created_at" | "updated_at">>
  ): Promise<HeroButton> => {
    const res = await fetch(`${API_BASE}/hero-buttons/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to update hero button: ${res.status}`);
    }
    return res.json();
  },

  /** DELETE /api/hero-buttons/:id */
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/hero-buttons/${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    if (!res.ok) throw new Error(`Failed to delete hero button: ${res.status}`);
  },
};

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------
export interface EventItem {
  id: number;
  image: string;
  images?: string[];
  title: string;
  subtitle?: string;
  description?: string;
  date?: string;
  venue?: string;
  link: string;
  category: "highlight" | "program" | "upcoming" | "past";
  show_latest?: boolean;
  show_upcoming?: boolean;
  show_past?: boolean;
  show_program?: boolean;
  show_highlight?: boolean;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export const eventApi = {
  /** GET /api/events?category=... */
  list: async (category?: EventItem["category"] | "latest"): Promise<EventItem[]> => {
    const url = category ? `${API_BASE}/events?category=${category}` : `${API_BASE}/events`;
    const res = await fetch(url, { headers: headers() });
    if (!res.ok) throw new Error(`Failed to fetch events: ${res.status}`);
    return res.json();
  },

  /** GET /api/events/:id */
  show: async (id: number): Promise<EventItem> => {
    const res = await fetch(`${API_BASE}/events/${id}`, { headers: headers() });
    if (!res.ok) throw new Error(`Failed to fetch event: ${res.status}`);
    return res.json();
  },

  /** POST /api/events */
  create: async (data: Omit<EventItem, "id" | "created_at" | "updated_at">): Promise<EventItem> => {
    const res = await fetch(`${API_BASE}/events`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to create event: ${res.status}`);
    }
    return res.json();
  },

  /** PUT /api/events/:id */
  update: async (
    id: number,
    data: Partial<Omit<EventItem, "id" | "created_at" | "updated_at">>
  ): Promise<EventItem> => {
    const res = await fetch(`${API_BASE}/events/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to update event: ${res.status}`);
    }
    return res.json();
  },

  /** DELETE /api/events/:id */
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/events/${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    if (!res.ok) throw new Error(`Failed to delete event: ${res.status}`);
  },
};

// ---------------------------------------------------------------------------
// Public Calendar Events
// ---------------------------------------------------------------------------
export interface PublicCalendarEventItem {
  id: number;
  title: string;
  event_date: string;
  event_time: string;
  venue: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export const publicCalendarEventApi = {
  list: async (): Promise<PublicCalendarEventItem[]> => {
    const res = await fetch(`${API_BASE}/public-calendar-events`, { headers: headers() });
    if (!res.ok) throw new Error(`Failed to fetch public calendar events: ${res.status}`);
    return res.json();
  },

  create: async (data: Omit<PublicCalendarEventItem, "id" | "created_at" | "updated_at">): Promise<PublicCalendarEventItem> => {
    const res = await fetch(`${API_BASE}/public-calendar-events`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to create public calendar event: ${res.status}`);
    }
    return res.json();
  },

  update: async (
    id: number,
    data: Omit<PublicCalendarEventItem, "id" | "created_at" | "updated_at">
  ): Promise<PublicCalendarEventItem> => {
    const res = await fetch(`${API_BASE}/public-calendar-events/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to update public calendar event: ${res.status}`);
    }
    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/public-calendar-events/${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    if (!res.ok) throw new Error(`Failed to delete public calendar event: ${res.status}`);
  },
};

// ---------------------------------------------------------------------------
// Annual Events
// ---------------------------------------------------------------------------
export interface AnnualEventItem {
  id: number;
  year: string;
  event_type: "agm" | "inauguration" | "conference" | "exhibition" | "members-night";
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  images?: string[];
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export const annualEventApi = {
  /** GET /api/annual-events */
  list: async (): Promise<AnnualEventItem[]> => {
    const res = await fetch(`${API_BASE}/annual-events`, { headers: headers() });
    if (!res.ok) throw new Error(`Failed to fetch annual events: ${res.status}`);
    return res.json();
  },

  /** POST /api/annual-events */
  create: async (data: Omit<AnnualEventItem, "id" | "created_at" | "updated_at">): Promise<AnnualEventItem> => {
    const res = await fetch(`${API_BASE}/annual-events`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to create annual event: ${res.status}`);
    }
    return res.json();
  },

  /** PUT /api/annual-events/:id */
  update: async (
    id: number,
    data: Partial<Omit<AnnualEventItem, "id" | "created_at" | "updated_at">>
  ): Promise<AnnualEventItem> => {
    const res = await fetch(`${API_BASE}/annual-events/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to update annual event: ${res.status}`);
    }
    return res.json();
  },

  /** DELETE /api/annual-events/:id */
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/annual-events/${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    if (!res.ok) throw new Error(`Failed to delete annual event: ${res.status}`);
  },
};

// ---------------------------------------------------------------------------
// Award Categories
// ---------------------------------------------------------------------------
export interface AwardCategoryItem {
  id: number;
  year: string;
  name: string;
  description?: string;
  guideline?: string;
  guideline_attachment_name?: string;
  guideline_attachment?: string;
  general_guideline?: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface AwardSettingItem {
  id: number;
  year: string;
  general_guideline: string;
  created_at?: string;
  updated_at?: string;
}

export const awardCategoryApi = {
  /** GET /api/award-categories */
  list: async (year?: string): Promise<AwardCategoryItem[]> => {
    const query = year ? `?year=${encodeURIComponent(year)}` : "";
    const res = await fetch(`${API_BASE}/award-categories${query}`, { headers: headers() });
    if (!res.ok) throw new Error(`Failed to fetch award categories: ${res.status}`);
    return res.json();
  },

  /** POST /api/award-categories */
  create: async (
    data: Omit<AwardCategoryItem, "id" | "created_at" | "updated_at">
  ): Promise<AwardCategoryItem> => {
    const res = await fetch(`${API_BASE}/award-categories`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to create award category: ${res.status}`);
    }
    return res.json();
  },

  /** PUT /api/award-categories/:id */
  update: async (
    id: number,
    data: Partial<Omit<AwardCategoryItem, "id" | "created_at" | "updated_at">>
  ): Promise<AwardCategoryItem> => {
    const res = await fetch(`${API_BASE}/award-categories/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to update award category: ${res.status}`);
    }
    return res.json();
  },

  /** DELETE /api/award-categories/:id */
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/award-categories/${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    if (!res.ok) throw new Error(`Failed to delete award category: ${res.status}`);
  },
};

export const awardSettingApi = {
  /** GET /api/award-settings */
  show: async (): Promise<AwardSettingItem> => {
    const res = await fetch(`${API_BASE}/award-settings`, { headers: headers() });
    if (!res.ok) throw new Error(`Failed to fetch award settings: ${res.status}`);
    return res.json();
  },

  /** PUT /api/award-settings */
  update: async (data: Pick<AwardSettingItem, "year" | "general_guideline">): Promise<AwardSettingItem> => {
    const res = await fetch(`${API_BASE}/award-settings`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to update award settings: ${res.status}`);
    }
    return res.json();
  },
};

// ---------------------------------------------------------------------------
// Boards
// ---------------------------------------------------------------------------
export interface BoardItem {
  id: number;
  name: string;
  description: string;
  path: string;
  icon?: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export const boardApi = {
  /** GET /api/boards */
  list: async (): Promise<BoardItem[]> => {
    const res = await fetch(`${API_BASE}/boards`, { headers: headers() });
    if (!res.ok) throw new Error(`Failed to fetch boards: ${res.status}`);
    return res.json();
  },

  /** POST /api/boards */
  create: async (data: Omit<BoardItem, "id" | "created_at" | "updated_at">): Promise<BoardItem> => {
    const res = await fetch(`${API_BASE}/boards`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to create board: ${res.status}`);
    }
    return res.json();
  },

  /** PUT /api/boards/:id */
  update: async (
    id: number,
    data: Partial<Omit<BoardItem, "id" | "created_at" | "updated_at">>
  ): Promise<BoardItem> => {
    const res = await fetch(`${API_BASE}/boards/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to update board: ${res.status}`);
    }
    return res.json();
  },

  /** DELETE /api/boards/:id */
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/boards/${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    if (!res.ok) throw new Error(`Failed to delete board: ${res.status}`);
  },
};

// ---------------------------------------------------------------------------
// BAP Introduction & Publications
// ---------------------------------------------------------------------------
export type BapPublicationCategory =
  | "the-architect"
  | "vastu"
  | "built-environment"
  | "now-architecture"
  | "archive-journal"
  | "year-book";

export interface BapSettingItem {
  id: number;
  introduction: string;
  created_at?: string;
  updated_at?: string;
}

export interface BapPublicationItem {
  id: number;
  category: BapPublicationCategory;
  title: string;
  volume?: string;
  uploaded_at?: string;
  cover_src?: string;
  file_name?: string;
  file_src?: string;
  external_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export const bapSettingApi = {
  show: async (): Promise<BapSettingItem> => {
    const res = await fetch(`${API_BASE}/bap-settings`, { headers: headers() });
    if (!res.ok) throw new Error(`Failed to fetch BAP settings: ${res.status}`);
    return res.json();
  },

  update: async (data: Pick<BapSettingItem, "introduction">): Promise<BapSettingItem> => {
    const res = await fetch(`${API_BASE}/bap-settings`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to update BAP settings: ${res.status}`);
    }
    return res.json();
  },
};

export const bapPublicationApi = {
  list: async (category?: BapPublicationCategory): Promise<BapPublicationItem[]> => {
    const query = category ? `?category=${encodeURIComponent(category)}` : "";
    const res = await fetch(`${API_BASE}/bap-publications${query}`, { headers: headers() });
    if (!res.ok) throw new Error(`Failed to fetch BAP publications: ${res.status}`);
    return res.json();
  },

  create: async (data: Omit<BapPublicationItem, "id" | "created_at" | "updated_at">): Promise<BapPublicationItem> => {
    const res = await fetch(`${API_BASE}/bap-publications`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to create BAP publication: ${res.status}`);
    }
    return res.json();
  },

  update: async (
    id: number,
    data: Partial<Omit<BapPublicationItem, "id" | "created_at" | "updated_at">>
  ): Promise<BapPublicationItem> => {
    const res = await fetch(`${API_BASE}/bap-publications/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to update BAP publication: ${res.status}`);
    }
    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/bap-publications/${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    if (!res.ok) throw new Error(`Failed to delete BAP publication: ${res.status}`);
  },
};

// ---------------------------------------------------------------------------
// BOM Introduction & Items
// ---------------------------------------------------------------------------
export type BomItemCategory = "programs" | "slapm" | "slaud" | "slaia" | "slaac";

export interface BomSettingItem {
  id: number;
  introduction_title: string;
  introduction: string;
  focus_points?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface BomItem {
  id: number;
  category: BomItemCategory;
  title: string;
  description?: string;
  event_date?: string;
  image?: string;
  link?: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export const bomSettingApi = {
  show: async (): Promise<BomSettingItem> => {
    const res = await fetch(`${API_BASE}/bom-settings`, { headers: headers() });
    if (!res.ok) throw new Error(`Failed to fetch BOM settings: ${res.status}`);
    return res.json();
  },

  update: async (
    data: Pick<BomSettingItem, "introduction_title" | "introduction" | "focus_points">
  ): Promise<BomSettingItem> => {
    const res = await fetch(`${API_BASE}/bom-settings`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to update BOM settings: ${res.status}`);
    }
    return res.json();
  },
};

export const bomItemApi = {
  list: async (category?: BomItemCategory): Promise<BomItem[]> => {
    const query = category ? `?category=${encodeURIComponent(category)}` : "";
    const res = await fetch(`${API_BASE}/bom-items${query}`, { headers: headers() });
    if (!res.ok) throw new Error(`Failed to fetch BOM items: ${res.status}`);
    return res.json();
  },

  create: async (data: Omit<BomItem, "id" | "created_at" | "updated_at">): Promise<BomItem> => {
    const res = await fetch(`${API_BASE}/bom-items`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to create BOM item: ${res.status}`);
    }
    return res.json();
  },

  update: async (
    id: number,
    data: Partial<Omit<BomItem, "id" | "created_at" | "updated_at">>
  ): Promise<BomItem> => {
    const res = await fetch(`${API_BASE}/bom-items/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to update BOM item: ${res.status}`);
    }
    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/bom-items/${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    if (!res.ok) throw new Error(`Failed to delete BOM item: ${res.status}`);
  },
};

// ---------------------------------------------------------------------------
// BAE Documents
// ---------------------------------------------------------------------------
export type BaeDocumentCategory = "applications" | "notices" | "references";

export interface BaeSettingItem {
  id: number;
  introduction: string;
  created_at?: string;
  updated_at?: string;
}

export const baeSettingApi = {
  show: async (): Promise<BaeSettingItem> => {
    const res = await fetch(`${API_BASE}/bae-settings`, { headers: headers() });
    if (!res.ok) throw new Error(`Failed to fetch BAE settings: ${res.status}`);
    return res.json();
  },

  update: async (data: Pick<BaeSettingItem, "introduction">): Promise<BaeSettingItem> => {
    const res = await fetch(`${API_BASE}/bae-settings`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to update BAE settings: ${res.status}`);
    }
    return res.json();
  },
};

export interface BaeDocumentItem {
  id: number;
  category: BaeDocumentCategory;
  title: string;
  meta?: string;
  file_name?: string;
  file_src?: string;
  external_url?: string;
  uploaded_at?: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export const baeDocumentApi = {
  list: async (category?: BaeDocumentCategory): Promise<BaeDocumentItem[]> => {
    const query = category ? `?category=${encodeURIComponent(category)}` : "";
    const res = await fetch(`${API_BASE}/bae-documents${query}`, { headers: headers() });
    if (!res.ok) throw new Error(`Failed to fetch BAE documents: ${res.status}`);
    return res.json();
  },

  create: async (data: Omit<BaeDocumentItem, "id" | "created_at" | "updated_at">): Promise<BaeDocumentItem> => {
    const res = await fetch(`${API_BASE}/bae-documents`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to create BAE document: ${res.status}`);
    }
    return res.json();
  },

  update: async (
    id: number,
    data: Partial<Omit<BaeDocumentItem, "id" | "created_at" | "updated_at">>
  ): Promise<BaeDocumentItem> => {
    const res = await fetch(`${API_BASE}/bae-documents/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to update BAE document: ${res.status}`);
    }
    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/bae-documents/${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    if (!res.ok) throw new Error(`Failed to delete BAE document: ${res.status}`);
  },
};

export type BaeMemberType = "student" | "graduate" | "associate";

export interface BaeMemberItem {
  id: number;
  member_type: BaeMemberType;
  current_membership_type?: BaeMemberType | null;
  serial_no?: number | null;
  name: string;
  name_with_initials?: string | null;
  gender?: "male" | "female" | "other" | "not_specified" | null;
  picture?: string | null;
  nic?: string | null;
  nationality?: string | null;
  date_of_birth?: string | null;
  academic_qualifications?: string | null;
  membership_year?: string | null;
  membership_number?: string | null;
  student_membership_number?: string | null;
  student_membership_year?: string | null;
  graduate_membership_number?: string | null;
  graduate_membership_year?: string | null;
  associate_membership_number?: string | null;
  associate_membership_year?: string | null;
  address?: string | null;
  office_address?: string | null;
  office_phone?: string | null;
  office_email?: string | null;
  residence_address?: string | null;
  residence_phone?: string | null;
  residence_email?: string | null;
  contact_no?: string | null;
  email?: string | null;
  remarks?: string | null;
  is_active: boolean;
  current_membership_status?: "active" | "inactive" | "expired" | "suspended" | "cancelled" | null;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export const baeMemberApi = {
  list: async (memberType?: BaeMemberType, search?: string): Promise<BaeMemberItem[]> => {
    const params = new URLSearchParams();
    if (memberType) params.set("member_type", memberType);
    if (search) params.set("search", search);
    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await fetch(`${API_BASE}/bae-members${query}`, { headers: headers() }).catch(() => {
      throw new Error("Could not connect to the API server. Start Laravel on http://127.0.0.1:8000 and try again.");
    });
    if (!res.ok) throw new Error(`Failed to fetch BAE members: ${res.status}`);
    return res.json();
  },

  create: async (data: Omit<BaeMemberItem, "id" | "created_at" | "updated_at">): Promise<BaeMemberItem> => {
    const res = await fetch(`${API_BASE}/bae-members`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    }).catch(() => {
      throw new Error("Could not connect to the API server. Start Laravel on http://127.0.0.1:8000 and try again.");
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to create BAE member: ${res.status}`);
    }
    return res.json();
  },

  update: async (
    id: number,
    data: Partial<Omit<BaeMemberItem, "id" | "created_at" | "updated_at">>
  ): Promise<BaeMemberItem> => {
    const res = await fetch(`${API_BASE}/bae-members/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    }).catch(() => {
      throw new Error("Could not connect to the API server. Start Laravel on http://127.0.0.1:8000 and try again.");
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to update BAE member: ${res.status}`);
    }
    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/bae-members/${id}`, {
      method: "DELETE",
      headers: headers(),
    }).catch(() => {
      throw new Error("Could not connect to the API server. Start Laravel on http://127.0.0.1:8000 and try again.");
    });
    if (!res.ok) throw new Error(`Failed to delete BAE member: ${res.status}`);
  },

  importExcel: async (
    file: File,
    options: { member_type?: BaeMemberType; replace?: boolean }
  ): Promise<{ imported: number }> => {
    const formData = new FormData();
    formData.append("file", file);
    if (options.member_type) formData.append("member_type", options.member_type);
    formData.append("replace", options.replace ? "1" : "0");

    const res = await fetch(`${API_BASE}/bae-members/import`, {
      method: "POST",
      headers: authHeaders(),
      body: formData,
    }).catch(() => {
      throw new Error("Could not connect to the API server. Start Laravel on http://127.0.0.1:8000 and try again.");
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to import BAE members: ${res.status}`);
    }
    return res.json();
  },

  bulkUpdateType: async (ids: number[], memberType: BaeMemberType): Promise<{ updated: number }> => {
    const res = await fetch(`${API_BASE}/bae-members/bulk-update`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify({ ids, member_type: memberType }),
    }).catch(() => {
      throw new Error("Could not connect to the API server. Start Laravel on http://127.0.0.1:8000 and try again.");
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to bulk update BAE members: ${res.status}`);
    }
    return res.json();
  },
};

// ---------------------------------------------------------------------------
// Council Members
// ---------------------------------------------------------------------------
export interface CouncilMemberItem {
  id: number;
  image?: string;
  name: string;
  designation: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export const councilApi = {
  /** GET /api/council-members */
  list: async (): Promise<CouncilMemberItem[]> => {
    const res = await fetch(`${API_BASE}/council-members`, { headers: headers() });
    if (!res.ok) throw new Error(`Failed to fetch council members: ${res.status}`);
    return res.json();
  },

  /** POST /api/council-members */
  create: async (data: Omit<CouncilMemberItem, "id" | "created_at" | "updated_at">): Promise<CouncilMemberItem> => {
    const res = await fetch(`${API_BASE}/council-members`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to create council member: ${res.status}`);
    }
    return res.json();
  },

  /** PUT /api/council-members/:id */
  update: async (
    id: number,
    data: Partial<Omit<CouncilMemberItem, "id" | "created_at" | "updated_at">>
  ): Promise<CouncilMemberItem> => {
    const res = await fetch(`${API_BASE}/council-members/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to update council member: ${res.status}`);
    }
    return res.json();
  },

  /** DELETE /api/council-members/:id */
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/council-members/${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    if (!res.ok) throw new Error(`Failed to delete council member: ${res.status}`);
  },
};

// ---------------------------------------------------------------------------
// About Board Members
// ---------------------------------------------------------------------------
export type BoardMemberKey = "trustees" | "management" | "bae" | "pab" | "bap";

export interface BoardMemberItem {
  id: number;
  board_key: BoardMemberKey;
  image?: string;
  name: string;
  designation: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export const boardMemberApi = {
  /** GET /api/board-members?board_key=... */
  list: async (boardKey?: BoardMemberKey): Promise<BoardMemberItem[]> => {
    const query = boardKey ? `?board_key=${boardKey}` : "";
    const res = await fetch(`${API_BASE}/board-members${query}`, { headers: headers() });
    if (!res.ok) throw new Error(`Failed to fetch board members: ${res.status}`);
    return res.json();
  },

  /** POST /api/board-members */
  create: async (data: Omit<BoardMemberItem, "id" | "created_at" | "updated_at">): Promise<BoardMemberItem> => {
    const res = await fetch(`${API_BASE}/board-members`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to create board member: ${res.status}`);
    }
    return res.json();
  },

  /** PUT /api/board-members/:id */
  update: async (
    id: number,
    data: Partial<Omit<BoardMemberItem, "id" | "created_at" | "updated_at">>
  ): Promise<BoardMemberItem> => {
    const res = await fetch(`${API_BASE}/board-members/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to update board member: ${res.status}`);
    }
    return res.json();
  },

  /** DELETE /api/board-members/:id */
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/board-members/${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    if (!res.ok) throw new Error(`Failed to delete board member: ${res.status}`);
  },
};

// ---------------------------------------------------------------------------
// Contact Entries
// ---------------------------------------------------------------------------
export type ContactIconType = "address" | "phone" | "email" | "web" | "person" | "role";

export interface ContactEntryItem {
  id: number;
  category: string;
  label: string;
  icon: ContactIconType;
  text: string;
  href?: string;
  is_active: boolean;
  is_locked?: boolean;
  locked?: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export const contactApi = {
  /** GET /api/contact-entries */
  list: async (): Promise<ContactEntryItem[]> => {
    const res = await fetch(`${API_BASE}/contact-entries`, { headers: headers() });
    if (!res.ok) throw new Error(`Failed to fetch contact entries: ${res.status}`);
    return res.json();
  },

  /** POST /api/contact-entries */
  create: async (data: Omit<ContactEntryItem, "id" | "created_at" | "updated_at">): Promise<ContactEntryItem> => {
    const res = await fetch(`${API_BASE}/contact-entries`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to create contact entry: ${res.status}`);
    }
    return res.json();
  },

  /** PUT /api/contact-entries/:id */
  update: async (
    id: number,
    data: Partial<Omit<ContactEntryItem, "id" | "created_at" | "updated_at">>
  ): Promise<ContactEntryItem> => {
    const res = await fetch(`${API_BASE}/contact-entries/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to update contact entry: ${res.status}`);
    }
    return res.json();
  },

  /** DELETE /api/contact-entries/:id */
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/contact-entries/${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    if (!res.ok) throw new Error(`Failed to delete contact entry: ${res.status}`);
  },
};

export interface ComplaintItem {
  id: number;
  name: string;
  email?: string | null;
  category: string;
  subject: string;
  message: string;
  attachment_name?: string | null;
  status: "new" | "in_progress" | "resolved" | "closed";
  created_at?: string;
  updated_at?: string;
}

export const complaintApi = {
  list: async (): Promise<ComplaintItem[]> => {
    const res = await fetch(`${API_BASE}/complaints`, { headers: headers() });
    if (res.status === 401) {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_USER_KEY);
      throw new Error("Admin session expired. Please sign in again.");
    }
    if (!res.ok) throw new Error(`Failed to fetch complaints: ${res.status}`);
    return res.json();
  },

  updateStatus: async (id: number, status: ComplaintItem["status"]): Promise<ComplaintItem> => {
    const res = await fetch(`${API_BASE}/complaints/${id}`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to update complaint: ${res.status}`);
    }
    return res.json();
  },

  downloadAttachment: async (id: number): Promise<Blob> => {
    const res = await fetch(`${API_BASE}/complaints/${id}/download`, { headers: authHeaders() });
    if (!res.ok) throw new Error(`Failed to download attachment: ${res.status}`);
    return res.blob();
  },
};

// ---------------------------------------------------------------------------
// News & Highlights
// ---------------------------------------------------------------------------
export interface NewsItem {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  link: string;
  type: "news" | "highlight";
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export const newsApi = {
  /** GET /api/news-items?type=... */
  list: async (type?: "news" | "highlight"): Promise<NewsItem[]> => {
    const url = type ? `${API_BASE}/news-items?type=${type}` : `${API_BASE}/news-items`;
    const res = await fetch(url, { headers: headers() });
    if (!res.ok) throw new Error(`Failed to fetch news items: ${res.status}`);
    return res.json();
  },

  /** POST /api/news-items */
  create: async (data: Omit<NewsItem, "id" | "created_at" | "updated_at">): Promise<NewsItem> => {
    const res = await fetch(`${API_BASE}/news-items`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to create news item: ${res.status}`);
    }
    return res.json();
  },

  /** PUT /api/news-items/:id */
  update: async (
    id: number,
    data: Partial<Omit<NewsItem, "id" | "created_at" | "updated_at">>
  ): Promise<NewsItem> => {
    const res = await fetch(`${API_BASE}/news-items/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to update news item: ${res.status}`);
    }
    return res.json();
  },

  /** DELETE /api/news-items/:id */
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/news-items/${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    if (!res.ok) throw new Error(`Failed to delete news item: ${res.status}`);
  },
};

// ---------------------------------------------------------------------------
// FAQs
// ---------------------------------------------------------------------------
export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export const faqApi = {
  /** GET /api/faqs */
  list: async (): Promise<FaqItem[]> => {
    const res = await fetch(`${API_BASE}/faqs`, { headers: headers() });
    if (!res.ok) throw new Error(`Failed to fetch faqs: ${res.status}`);
    return res.json();
  },

  /** POST /api/faqs */
  create: async (data: Omit<FaqItem, "id" | "created_at" | "updated_at">): Promise<FaqItem> => {
    const res = await fetch(`${API_BASE}/faqs`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to create faq: ${res.status}`);
    }
    return res.json();
  },

  /** PUT /api/faqs/:id */
  update: async (
    id: number,
    data: Partial<Omit<FaqItem, "id" | "created_at" | "updated_at">>
  ): Promise<FaqItem> => {
    const res = await fetch(`${API_BASE}/faqs/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Failed to update faq: ${res.status}`);
    }
    return res.json();
  },

  /** DELETE /api/faqs/:id */
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/faqs/${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    if (!res.ok) throw new Error(`Failed to delete faq: ${res.status}`);
  },
};

export interface TickerItem {
  id: number;
  text: string;
  link?: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export const tickerApi = {
  list: async (): Promise<TickerItem[]> => {
    const res = await fetch(`${API_BASE}/tickers`, { headers: headers() });
    if (!res.ok) throw new Error("Failed to fetch tickers");
    return res.json();
  },

  create: async (data: Omit<TickerItem, "id" | "created_at" | "updated_at">): Promise<TickerItem> => {
    const res = await fetch(`${API_BASE}/tickers`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to create ticker item");
    }
    return res.json();
  },

  /** PUT /api/tickers/:id */
  update: async (id: number, data: Partial<TickerItem>): Promise<TickerItem> => {
    const res = await fetch(`${API_BASE}/tickers/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Failed to update ticker item");
    }
    return res.json();
  },

  /** DELETE /api/tickers/:id */
  delete: async (id: number): Promise<void> => {
    const urls = [`${API_BASE}/tickers/${id}`, `${API_BASE}/ticker/${id}`];

    let lastError: Response | null = null;

    for (const url of urls) {
      const res = await fetch(url, {
        method: "DELETE",
        headers: headers(),
      });

      if (res.ok) return;

      lastError = res;

      if (res.status !== 404) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Failed to delete ticker item: ${res.status}`);
      }
    }

    throw new Error(`Failed to delete ticker item: ${lastError?.status || "unknown error"}`);
  },
};

// ---------------------------------------------------------------------------
// PAB (Professional Affairs Board)
// ---------------------------------------------------------------------------
export interface PabSetting {
  id: number;
  introduction: string;
  created_at?: string;
  updated_at?: string;
}

export interface PabEvent {
  id: number;
  title: string;
  description?: string;
  event_date?: string;
  event_time?: string;
  venue?: string;
  link?: string;
  file_name?: string;
  file_src?: string;
  image_name?: string;
  image_src?: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface PabApplication {
  id: number;
  title: string;
  description?: string;
  file_name?: string;
  file_src?: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface PabPublication {
  id: number;
  title: string;
  description?: string;
  file_name?: string;
  file_src?: string;
  is_active: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

export const pabSettingApi = {
  show: async (): Promise<PabSetting> => {
    const res = await fetch(`${API_BASE}/pab-settings`, { headers: headers() });
    if (!res.ok) throw new Error("Failed to fetch PAB settings");
    return res.json();
  },

  update: async (data: Partial<PabSetting>): Promise<PabSetting> => {
    const res = await fetch(`${API_BASE}/pab-settings`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update PAB settings");
    return res.json();
  },
};

export const pabEventApi = {
  list: async (): Promise<PabEvent[]> => {
    const res = await fetch(`${API_BASE}/pab-events`, { headers: headers() });
    if (!res.ok) throw new Error("Failed to fetch PAB events");
    return res.json();
  },

  create: async (data: Omit<PabEvent, "id" | "created_at" | "updated_at">): Promise<PabEvent> => {
    const res = await fetch(`${API_BASE}/pab-events`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || err.errors?.title?.[0] || "Failed to create PAB event");
    }
    return res.json();
  },

  update: async (id: number, data: Partial<PabEvent>): Promise<PabEvent> => {
    const res = await fetch(`${API_BASE}/pab-events/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || err.errors?.title?.[0] || "Failed to update PAB event");
    }
    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/pab-events/${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    if (!res.ok) throw new Error("Failed to delete PAB event");
  },
};

export const pabApplicationApi = {
  list: async (): Promise<PabApplication[]> => {
    const res = await fetch(`${API_BASE}/pab-applications`, { headers: headers() });
    if (!res.ok) throw new Error("Failed to fetch PAB applications");
    return res.json();
  },

  create: async (data: Omit<PabApplication, "id" | "created_at" | "updated_at">): Promise<PabApplication> => {
    const res = await fetch(`${API_BASE}/pab-applications`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || err.errors?.title?.[0] || "Failed to create PAB application");
    }
    return res.json();
  },

  update: async (id: number, data: Partial<PabApplication>): Promise<PabApplication> => {
    const res = await fetch(`${API_BASE}/pab-applications/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || err.errors?.title?.[0] || "Failed to update PAB application");
    }
    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/pab-applications/${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    if (!res.ok) throw new Error("Failed to delete PAB application");
  },
};

export const pabPublicationApi = {
  list: async (): Promise<PabPublication[]> => {
    const res = await fetch(`${API_BASE}/pab-publications`, { headers: headers() });
    if (!res.ok) throw new Error("Failed to fetch PAB publications");
    return res.json();
  },

  create: async (data: Omit<PabPublication, "id" | "created_at" | "updated_at">): Promise<PabPublication> => {
    const res = await fetch(`${API_BASE}/pab-publications`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || err.errors?.title?.[0] || "Failed to create PAB publication");
    }
    return res.json();
  },

  update: async (id: number, data: Partial<PabPublication>): Promise<PabPublication> => {
    const res = await fetch(`${API_BASE}/pab-publications/${id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || err.errors?.title?.[0] || "Failed to update PAB publication");
    }
    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/pab-publications/${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    if (!res.ok) throw new Error("Failed to delete PAB publication");
  },
};
