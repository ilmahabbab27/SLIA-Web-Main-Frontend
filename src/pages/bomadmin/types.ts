export type BomCategory =
    | "programs"
    | "slapm"
    | "slaud"
    | "slaia"
    | "slaac";

export interface BomEvent {
    id: string;
    category: BomCategory;
    title: string;
    description: string;
    image: string;
    link: string;
    updatedAt: string;
}

export interface BomIntroduction {
    title: string;
    description: string;
    focusPoints: string[];
}

export interface BomContent {
    introduction: BomIntroduction;
    events: BomEvent[];
}
