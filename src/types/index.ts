export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface CategoryMini {
  id: number;
  name: string;
  slug: string;
  icon: string;
  display_order: number;
}

export interface Category extends CategoryMini {
  description: string;
  image: string | null;
  parent: number | null;
  display_order: number;
  product_count: number;
  subcategories?: Category[];
}

export interface Standard {
  id: number;
  code: string;
  name: string;
  description: string;
}

export interface ProductImage {
  id: number;
  image: string;
  alt_text: string;
  display_order: number;
}

export interface ProductSpecification {
  id: number;
  group: string;
  name: string;
  value: string;
  unit: string;
  display_order: number;
}

export interface ProductListItem {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  product_code: string;
  featured_image: string | null;
  category: CategoryMini;
  material: string;
  featured: boolean;
  active: boolean;
}

export interface ProductDetail extends ProductListItem {
  long_description: string;
  application: string;
  country_of_origin: string;
  warranty_info: string;
  standards: Standard[];
  images: ProductImage[];
  specifications: ProductSpecification[];
  document_count: number;
  created_at: string;
  updated_at: string;
}

export type DocumentType =
  | "datasheet"
  | "catalogue"
  | "material_submittal"
  | "certificate"
  | "test_report"
  | "installation_guide"
  | "warranty"
  | "company_profile"
  | "technical_manual"
  | "other";

export interface DocumentTypeOption {
  value: DocumentType;
  label: string;
}

export interface DocumentRevision {
  id: number;
  revision: string;
  version: number;
  file_url: string | null;
  original_filename: string;
  file_size: number;
  file_size_display: string;
  mime_type: string;
  issue_date: string | null;
  status: "draft" | "current" | "archived";
}

export interface DocumentSection {
  id: number;
  name: string;
  slug: string;
  display_order: number;
}

export interface DocumentListItem {
  id: number;
  title: string;
  slug: string;
  document_code: string;
  document_type: DocumentType;
  language: "en" | "ar" | "en_ar";
  category: CategoryMini | null;
  section: DocumentSection | null;
  product: { id: number; name: string; slug: string; featured_image: string | null } | null;
  cover_image: string | null;
  current_revision: DocumentRevision | null;
  featured: boolean;
}

export interface DocumentDetail extends DocumentListItem {
  description: string;
  standards: Standard[];
  revisions: DocumentRevision[];
  created_at: string;
  updated_at: string;
}

export interface SearchResults {
  query: string;
  products: ProductListItem[];
  documents: DocumentListItem[];
  catalogues: DocumentListItem[];
}

export interface ContactInquiryPayload {
  name: string;
  company?: string;
  position?: string;
  email: string;
  phone?: string;
  country?: string;
  inquiry_type: string;
  product?: number | null;
  project_name?: string;
  message: string;
}
