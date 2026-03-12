import type { PublicationRecord } from "./types";

const AUTH_KEY = "bap_admin_authed_v1";
const PUBS_KEY = "bap_admin_publications_v1";

export const bapAdminStorage = {
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
  publications: {
    getAll(fallback: PublicationRecord[] = []): PublicationRecord[] {
      const raw = localStorage.getItem(PUBS_KEY);
      if (!raw) return fallback;
      try {
        const parsed = JSON.parse(raw) as PublicationRecord[];
        return Array.isArray(parsed) ? parsed : fallback;
      } catch {
        return fallback;
      }
    },
    setAll(items: PublicationRecord[]) {
      localStorage.setItem(PUBS_KEY, JSON.stringify(items));
    },
  },
};

