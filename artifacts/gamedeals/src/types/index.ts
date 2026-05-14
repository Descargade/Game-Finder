export interface Deal {
  dealID: string;
  title: string;
  storeID: string;
  gameID: string;
  salePrice: string;
  normalPrice: string;
  savings: string;
  metacriticScore: string;
  steamRatingText: string | null;
  steamRatingPercent: string;
  steamAppID: string | null;
  releaseDate: number;
  lastChange: number;
  dealRating: string;
  thumb: string;
  isOnSale: string;
}

export interface Store {
  storeID: string;
  storeName: string;
  isActive: number;
  images: {
    banner: string;
    logo: string;
    icon: string;
  };
}

export interface GameInfo {
  storeID: string;
  gameID: string;
  name: string;
  steamAppID: string | null;
  thumb: string;
}

export interface GameDeal {
  storeID: string;
  dealID: string;
  price: string;
  retailPrice: string;
  savings: string;
}

export interface GameDetailResponse {
  info: GameInfo;
  cheapestPriceEver: {
    price: string;
    date: number;
  };
  deals: GameDeal[];
}

export interface GetDealsParams {
  storeID?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: "Deal Rating" | "Savings" | "Price" | "Metacritic" | "Reviews" | "Release" | "Store" | "Recent" | "Title";
  desc?: number;
  lowerPrice?: number;
  upperPrice?: number;
  title?: string;
  onSale?: number;
}

export interface GameSearchResult {
  gameID: string;
  external: string;
  cheapest: string;
  thumb: string;
}
