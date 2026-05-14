import { useQuery } from "@tanstack/react-query";
import { getDeals } from "../services/cheapshark";
import { Deal, GetDealsParams } from "../types";

export function useDeals(params: GetDealsParams, options?: { enabled?: boolean }) {
  return useQuery<Deal[]>({
    queryKey: ["deals", params],
    queryFn: ({ signal }) => getDeals(params, signal),
    enabled: options?.enabled !== false,
    staleTime: 1000 * 60 * 3,
  });
}
