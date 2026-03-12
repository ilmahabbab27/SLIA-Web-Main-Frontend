import type { BomContent, BomEvent } from "./types";

const AUTH_KEY = "bom_admin_authed_v1";
const CONTENT_KEY = "bom_admin_content_v1";

const DEFAULT_CONTENT: BomContent = {
    introduction: {
        title: "Introduction",
        description: "The Board of Management is responsible for the overall administrative and strategic oversight of the Sri Lanka Institute of Architects. It serves as a central hub for coordinating institutional programs, workshops, and fostering collaboration through professional associations.",
        focusPoints: [
            "Strategic planning and policy implementation for SLIA operations.",
            "Management of member services and institutional growth initiatives."
        ]
    },
    events: [
        {
            id: "1",
            category: "programs",
            title: "Professional Practice Workshop",
            description: "A comprehensive workshop series for associate members preparing for professional practice examinations.",
            image: "https://placehold.co/600x400/27272a/ffffff?text=Professional+Practice",
            link: "#",
            updatedAt: new Date().toISOString()
        },
        // ... other defaults can be added here or populated on first load
    ]
};

export const bomAdminStorage = {
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
    content: {
        get(): BomContent {
            const raw = localStorage.getItem(CONTENT_KEY);
            if (!raw) return DEFAULT_CONTENT;
            try {
                return JSON.parse(raw);
            } catch {
                return DEFAULT_CONTENT;
            }
        },
        set(content: BomContent) {
            localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
        }
    }
};
