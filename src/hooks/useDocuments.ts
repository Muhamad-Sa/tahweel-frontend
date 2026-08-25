import { useQuery } from "@tanstack/react-query";

import { api, DocumentListParams } from "@/api/endpoints";

export function useDocuments(params: DocumentListParams) {
  return useQuery({
    queryKey: ["documents", params],
    queryFn: () => api.documents.list(params),
    placeholderData: (prev) => prev,
  });
}

export function useDocument(slug: string | undefined) {
  return useQuery({
    queryKey: ["document", slug],
    queryFn: () => api.documents.detail(slug as string),
    enabled: Boolean(slug),
  });
}

export function useDocumentTypes() {
  return useQuery({
    queryKey: ["document-types"],
    queryFn: () => api.documents.types(),
    staleTime: Infinity,
  });
}

export function useCatalogues(params: DocumentListParams) {
  return useQuery({
    queryKey: ["catalogues", params],
    queryFn: () => api.catalogues.list(params),
    placeholderData: (prev) => prev,
  });
}

export function useStandards() {
  return useQuery({
    queryKey: ["standards"],
    queryFn: () => api.standards.list(),
    staleTime: Infinity,
  });
}
