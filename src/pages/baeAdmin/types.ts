export type MemberRecord = {
  id: string;
  name: string;
  role: string;
  email: string;
  address: string;
  imageSrc?: string;
  uploadedAt?: string;
};

export type BaeDocumentCategory = "applications" | "notices" | "references";

export type BaeDocument = {
  id: string;
  title: string;
  category: BaeDocumentCategory;
  href: string;
  downloadName: string;
  meta: string;
  uploadedAt: string; // YYYY-MM-DD
};

