import { useQuery } from "@tanstack/react-query";
import { getGameDetail } from "../services/cheapshark";

export function useGameDetail(gameId: string | null) {
  return useQuery({
    queryKey: ["game", gameId],
    queryFn: () => getGameDetail(gameId as string),
    enabled: !!gameId,
  });
}
