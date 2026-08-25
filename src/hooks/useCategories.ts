import { useQuery } from "@tanstack/react-query";

import { api } from "@/api/endpoints";

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => api.categories.list(),
  });
}

export function useCategory(slug: string | undefined) {
  return useQuery({
    queryKey: ["category", slug],
    queryFn: () => api.categories.detail(slug as string),
    enabled: Boolean(slug),
  });
}
