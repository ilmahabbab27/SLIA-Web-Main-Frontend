import type { MemberRecord, BaeDocument } from "./types";

const AUTH_KEY = "bae_admin_authed_v1";
const STUDENTS_KEY = "bae_admin_students_v1";
const GRADUATES_KEY = "bae_admin_graduates_v1";
const DOCUMENTS_KEY = "bae_admin_documents_v1";

export const baeAdminStorage = {
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
  students: {
    getAll(fallback: MemberRecord[] = []): MemberRecord[] {
      const raw = localStorage.getItem(STUDENTS_KEY);
      if (!raw) return fallback;
      try {
        const parsed = JSON.parse(raw) as MemberRecord[];
        return Array.isArray(parsed) ? parsed : fallback;
      } catch {
        return fallback;
      }
    },
    setAll(items: MemberRecord[]) {
      localStorage.setItem(STUDENTS_KEY, JSON.stringify(items));
    },
  },
  graduates: {
    getAll(fallback: MemberRecord[] = []): MemberRecord[] {
      const raw = localStorage.getItem(GRADUATES_KEY);
      if (!raw) return fallback;
      try {
        const parsed = JSON.parse(raw) as MemberRecord[];
        return Array.isArray(parsed) ? parsed : fallback;
      } catch {
        return fallback;
      }
    },
    setAll(items: MemberRecord[]) {
      localStorage.setItem(GRADUATES_KEY, JSON.stringify(items));
    },
  },
  documents: {
    getAll(fallback: BaeDocument[] = []): BaeDocument[] {
      const raw = localStorage.getItem(DOCUMENTS_KEY);
      if (!raw) return fallback;
      try {
        const parsed = JSON.parse(raw) as BaeDocument[];
        return Array.isArray(parsed) ? parsed : fallback;
      } catch {
        return fallback;
      }
    },
    setAll(items: BaeDocument[]) {
      localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(items));
    },
  },
};

