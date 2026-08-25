import { apiClient } from "./client";
import type {
  Category,
  ContactInquiryPayload,
  DocumentDetail,
  DocumentListItem,
  DocumentTypeOption,
  Paginated,
  ProductDetail,
  ProductListItem,
  SearchResults,
  Standard,
} from "@/types";

export interface ProductListParams {
  category?: string;
  material?: string;
  featured?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
}

export interface DocumentListParams {
  category?: string;
  product?: string;
  document_type?: string;
  language?: string;
  standard?: string;
  year?: number;
  featured?: boolean;
  search?: string;
  ordering?: string;
  page?: number;
  page_size?: number;
}

export const api = {
  categories: {
    list: () => apiClient.get<Paginated<Category>>("/categories/").then((r) => r.data),
    detail: (slug: string) => apiClient.get<Category>(`/categories/${slug}/`).then((r) => r.data),
  },
  products: {
    list: (params: ProductListParams = {}) =>
      apiClient.get<Paginated<ProductListItem>>("/products/", { params }).then((r) => r.data),
    detail: (slug: string) => apiClient.get<ProductDetail>(`/products/${slug}/`).then((r) => r.data),
    documents: (slug: string) =>
      apiClient.get<DocumentListItem[]>(`/products/${slug}/documents/`).then((r) => r.data),
  },
  standards: {
    list: (): Promise<Standard[]> =>
      apiClient.get<Standard[] | Paginated<Standard>>("/standards/").then((r) => {
        const data = r.data as any;
        return Array.isArray(data) ? data : data.results;
      }),
  },
  documents: {
    list: (params: DocumentListParams = {}) =>
      apiClient.get<Paginated<DocumentListItem>>("/documents/", { params }).then((r) => r.data),
    detail: (slug: string) => apiClient.get<DocumentDetail>(`/documents/${slug}/`).then((r) => r.data),
    types: () => apiClient.get<DocumentTypeOption[]>("/document-types/").then((r) => r.data),
  },
  catalogues: {
    list: (params: DocumentListParams = {}) =>
      apiClient.get<Paginated<DocumentListItem>>("/catalogues/", { params }).then((r) => r.data),
  },
  search: {
    global: (q: string) => apiClient.get<SearchResults>("/search/", { params: { q } }).then((r) => r.data),
  },
  contact: {
    submit: (payload: ContactInquiryPayload) => apiClient.post("/contact/", payload).then((r) => r.data),
  },
};
