import { useQuery } from "@tanstack/react-query";
import { searchGames } from "@/services/cheapshark";
import { GameSearchResult } from "@/types";

export function useSearch(query: string, limit = 10) {
  return useQuery<GameSearchResult[]>({
    queryKey: ["search", query, limit],
    queryFn: ({ signal }) => searchGames(query, limit, signal),
    enabled: query.trim().length >= 2,
    staleTime: 1000 * 60 * 2,
    placeholderData: [],
  });
}
