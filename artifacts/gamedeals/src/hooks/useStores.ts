import { useQuery } from "@tanstack/react-query";
import { getStores } from "../services/cheapshark";
import { Store } from "../types";

export function useStores() {
  return useQuery<Store[]>({
    queryKey: ["stores"],
    queryFn: ({ signal }) => getStores(signal),
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 48,
  });
}
