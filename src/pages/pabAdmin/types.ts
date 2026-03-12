export interface PabIntroduction {
    title: string;
    description: string;
    focusPoints: string[];
}

export interface PabEvent {
    id: string;
    title: string;
    description: string;
    image: string;
    link: string;
    updatedAt: string;
}

export type PabDocumentCategory = "applications" | "publications";

export interface PabDocument {
    id: string;
    category: PabDocumentCategory;
    title: string;
    description: string;
    meta: string;
    fileUrl: string; // Used for DataURL or URL
    fileName: string; // Used for the download attribute
    updatedAt: string;
}

export interface PabContent {
    introduction: PabIntroduction;
    events: PabEvent[];
    documents: PabDocument[];
}
