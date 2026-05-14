import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { useDeals } from "@/hooks/useDeals";
import { useStores } from "@/hooks/useStores";
import { DealCard } from "@/components/DealCard";
import { SkeletonGrid } from "@/components/SkeletonCard";
import { GetDealsParams } from "@/types";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { label: "Best Rating", value: "Deal Rating" },
  { label: "Biggest Savings", value: "Savings" },
  { label: "Lowest Price", value: "Price" },
  { label: "Most Recent", value: "Recent" },
  { label: "Title A-Z", value: "Title" },
] as const;

type SortValue = typeof SORT_OPTIONS[number]["value"];

const FEATURED_STORES = [
  { id: "1", name: "Steam" },
  { id: "25", name: "Epic Games" },
  { id: "7", name: "GOG" },
  { id: "8", name: "EA App" },
  { id: "13", name: "Fanatical" },
  { id: "11", name: "WinGameStore" },
];

export default function AllDeals() {
  const [sortBy, setSortBy] = useState<SortValue>("Deal Rating");
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<number>(60);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(0);

  const { data: stores } = useStores();

  const params: GetDealsParams = {
    sortBy,
    pageSize: 48,
    pageNumber: page,
    onSale: 1,
    ...(selectedStore ? { storeID: selectedStore } : {}),
    ...(maxPrice < 60 ? { upperPrice: maxPrice } : {}),
  };

  const { data: deals, isLoading, isFetching } = useDeals(params);

  useEffect(() => {
    setPage(0);
  }, [sortBy, selectedStore, maxPrice]);

  const activeFiltersCount = [selectedStore, maxPrice < 60].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">

        <div className="mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-foreground mb-1"
            style={{ fontFamily: "var(--app-font-heading, 'Space Grotesk', sans-serif)" }}
          >
            All Deals
          </motion.h1>
          <p className="text-muted-foreground text-sm">
            {deals ? `${deals.length}+ deals available` : "Loading deals..."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative" data-testid="sort-select">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortValue)}
              className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-border/50 bg-secondary/60 text-foreground text-sm font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary/50"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>

          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            data-testid="toggle-filters"
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-colors",
              filtersOpen || activeFiltersCount > 0
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border/50 bg-secondary/60 text-muted-foreground hover:text-foreground"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold leading-none">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {selectedStore && (
            <button
              onClick={() => setSelectedStore("")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium border border-primary/20 hover:bg-primary/20 transition-colors"
              data-testid="clear-store-filter"
            >
              {FEATURED_STORES.find((s) => s.id === selectedStore)?.name ?? `Store ${selectedStore}`}
              <X className="w-3 h-3" />
            </button>
          )}

          {maxPrice < 60 && (
            <button
              onClick={() => setMaxPrice(60)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium border border-primary/20 hover:bg-primary/20 transition-colors"
              data-testid="clear-price-filter"
            >
              Max ${maxPrice}
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-6 overflow-hidden"
            >
              <div className="p-5 rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm space-y-5">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Store / Platform</p>
                  <div className="flex flex-wrap gap-2" data-testid="store-filters">
                    <button
                      onClick={() => setSelectedStore("")}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                        !selectedStore
                          ? "bg-primary/20 text-primary border-primary/40"
                          : "bg-secondary/50 text-muted-foreground border-border/40 hover:text-foreground"
                      )}
                    >
                      All Stores
                    </button>
                    {FEATURED_STORES.map((store) => (
                      <button
                        key={store.id}
                        onClick={() => setSelectedStore(store.id === selectedStore ? "" : store.id)}
                        data-testid={`store-filter-${store.id}`}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                          selectedStore === store.id
                            ? "bg-primary/20 text-primary border-primary/40"
                            : "bg-secondary/50 text-muted-foreground border-border/40 hover:text-foreground"
                        )}
                      >
                        {store.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Max Price: {maxPrice >= 60 ? "Any" : `$${maxPrice}`}
                  </p>
                  <input
                    type="range"
                    min={0}
                    max={60}
                    step={5}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    data-testid="price-range-slider"
                    className="w-full max-w-xs accent-primary h-1.5 cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground max-w-xs mt-1">
                    <span>Free</span>
                    <span>$60+</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading ? (
          <SkeletonGrid count={24} />
        ) : deals && deals.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {deals.map((deal, i) => (
                <DealCard key={deal.dealID} deal={deal} index={i % 12} />
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0 || isFetching}
                data-testid="prev-page"
                className="px-4 py-2 rounded-xl border border-border/40 bg-secondary/60 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-muted-foreground">Page {page + 1}</span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!deals || deals.length < 48 || isFetching}
                data-testid="next-page"
                className="px-4 py-2 rounded-xl border border-border/40 bg-secondary/60 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No deals found. Try adjusting your filters.</p>
            <button
              onClick={() => { setSelectedStore(""); setMaxPrice(60); }}
              className="mt-4 px-4 py-2 bg-primary/10 text-primary rounded-xl text-sm border border-primary/20 hover:bg-primary/20 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
