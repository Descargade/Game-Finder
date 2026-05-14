import { Deal, GameDetailResponse, GetDealsParams, Store } from "../types";

const BASE_URL = "https://www.cheapshark.com/api/1.0";

export async function getDeals(params: GetDealsParams = {}): Promise<Deal[]> {
  const url = new URL(`${BASE_URL}/deals`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, value.toString());
    }
  });

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Failed to fetch deals");
  return res.json();
}

export async function getGameDetail(gameId: string): Promise<GameDetailResponse> {
  const res = await fetch(`${BASE_URL}/games?id=${gameId}`);
  if (!res.ok) throw new Error("Failed to fetch game detail");
  return res.json();
}

export async function getStores(): Promise<Store[]> {
  const res = await fetch(`${BASE_URL}/stores`);
  if (!res.ok) throw new Error("Failed to fetch stores");
  return res.json();
}
