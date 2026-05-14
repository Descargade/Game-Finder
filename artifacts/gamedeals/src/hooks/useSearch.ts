import { useQuery } from "@tanstack/react-query";
import { searchGames } from "@/services/cheapshark";

export function useSearch(query: string, limit = 10) {
  return useQuery({
    queryKey: ["search", query, limit],
    queryFn: () => searchGames(query, limit),
    enabled: query.trim().length >= 2,
    staleTime: 1000 * 60 * 2,
    placeholderData: [],
  });
}
