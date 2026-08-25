import { useQuery } from "@tanstack/react-query";

import { api, ProductListParams } from "@/api/endpoints";

export function useProducts(params: ProductListParams) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => api.products.list(params),
    placeholderData: (prev) => prev,
  });
}

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => api.products.detail(slug as string),
    enabled: Boolean(slug),
  });
}

export function useProductDocuments(slug: string | undefined) {
  return useQuery({
    queryKey: ["product-documents", slug],
    queryFn: () => api.products.documents(slug as string),
    enabled: Boolean(slug),
  });
}
