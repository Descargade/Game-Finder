import { Deal, GameDetailResponse, GameSearchResult, GetDealsParams, Store } from "../types";

const BASE_URL = "https://www.cheapshark.com/api/1.0";

async function apiFetch<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`CheapShark API error ${res.status}: ${res.statusText}`);
  }
  const data = await res.json();
  return data as T;
}

export async function getDeals(params: GetDealsParams = {}, signal?: AbortSignal): Promise<Deal[]> {
  const url = new URL(`${BASE_URL}/deals`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) url.searchParams.append(key, value.toString());
  });
  return apiFetch<Deal[]>(url.toString(), signal);
}

export async function getGameDetail(gameId: string, signal?: AbortSignal): Promise<GameDetailResponse> {
  return apiFetch<GameDetailResponse>(`${BASE_URL}/games?id=${gameId}`, signal);
}

export async function getStores(signal?: AbortSignal): Promise<Store[]> {
  return apiFetch<Store[]>(`${BASE_URL}/stores`, signal);
}

export async function searchGames(query: string, limit = 10, signal?: AbortSignal): Promise<GameSearchResult[]> {
  if (!query.trim()) return [];
  return apiFetch<GameSearchResult[]>(
    `${BASE_URL}/games?title=${encodeURIComponent(query.trim())}&limit=${limit}`,
    signal
  );
}
