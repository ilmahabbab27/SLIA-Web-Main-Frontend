export type PublicationGroup =
  | "the-architect"
  | "vastu"
  | "built-environment"
  | "now-architecture"
  | "archive-journal"
  | "year-book";

export type PublicationRecord = {
  id: string;
  group: PublicationGroup;
  coverSrc: string;
  volume: string;
  title: string;
  uploadedAt: string; // YYYY-MM-DD
  href: string;
  downloadName?: string;
  meta?: string;
};

