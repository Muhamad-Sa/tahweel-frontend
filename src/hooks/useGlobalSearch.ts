import { useQuery } from "@tanstack/react-query";

import { api } from "@/api/endpoints";
import { useDebounce } from "./useDebounce";

export function useGlobalSearch(query: string) {
  const debounced = useDebounce(query, 250);

  return useQuery({
    queryKey: ["global-search", debounced],
    queryFn: () => api.search.global(debounced),
    enabled: debounced.trim().length >= 2,
  });
}
