import { useQuery } from "@tanstack/react-query";
import { getStores } from "../services/cheapshark";

export function useStores() {
  return useQuery({
    queryKey: ["stores"],
    queryFn: getStores,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours (stores rarely change)
  });
}
