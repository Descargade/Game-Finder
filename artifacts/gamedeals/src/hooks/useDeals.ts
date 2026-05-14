import { useQuery } from "@tanstack/react-query";
import { getDeals } from "../services/cheapshark";
import { GetDealsParams } from "../types";

export function useDeals(params: GetDealsParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["deals", params],
    queryFn: () => getDeals(params),
    enabled: options?.enabled !== false,
  });
}
