import { useQuery } from "@tanstack/react-query";
import { getGameDetail } from "../services/cheapshark";
import { GameDetailResponse } from "../types";

export function useGameDetail(gameId: string | null) {
  return useQuery<GameDetailResponse>({
    queryKey: ["game", gameId],
    queryFn: ({ signal }) => getGameDetail(gameId as string, signal),
    enabled: !!gameId,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
}
