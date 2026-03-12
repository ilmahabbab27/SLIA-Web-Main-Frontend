import { PabContent } from "./types";

const AUTH_KEY = "pab_admin_auth";
const CONTENT_KEY = "pab_admin_content";

const defaultContent: PabContent = {
    introduction: {
        title: "Introduction",
        description: "The Professional Affairs Board oversees the ethical and professional conduct of architectural practices, managing registrations, CPD events, and standard publications to ensure the highest level of architectural service.",
        focusPoints: [],
    },
    events: [],
    documents: [
        {
            id: "1",
            category: "applications",
            title: "Practice name clearance application",
            description: "Application form for getting clearance on a new architectural practice name.",
            meta: "PDF",
            fileUrl: "#",
            fileName: "name-clearance.pdf",
            updatedAt: new Date().toISOString()
        },
        {
            id: "2",
            category: "applications",
            title: "Practice registration applications",
            description: "Form to register a new architectural practice with the board.",
            meta: "PDF",
            fileUrl: "#",
            fileName: "practice-reg.pdf",
            updatedAt: new Date().toISOString()
        },
        {
            id: "3",
            category: "applications",
            title: "Affidavit",
            description: "Standard affidavit form required for official declarations.",
            meta: "PDF",
            fileUrl: "#",
            fileName: "affidavit.pdf",
            updatedAt: new Date().toISOString()
        }
    ]
};

export const pabAdminStorage = {
    auth: {
        isAuthed: (): boolean => {
            return localStorage.getItem(AUTH_KEY) === "true";
        },
        setAuthed: (status: boolean) => {
            localStorage.setItem(AUTH_KEY, status.toString());
        },
        logout: () => {
            localStorage.removeItem(AUTH_KEY);
        }
    },
    content: {
        get: (): PabContent => {
            const stored = localStorage.getItem(CONTENT_KEY);
            return stored ? JSON.parse(stored) : defaultContent;
        },
        set: (content: PabContent) => {
            localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
        }
    }
};
