import { useSearch } from "@/hooks/useSearch";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/context/CurrencyContext";
import { SearchBar } from "@/components/SearchBar";

export default function SearchResults() {
  const { t } = useTranslation();
  const { convertPrice } = useCurrency();
  const [location] = useLocation();

  const query = (() => {
    try {
      const full = window.location.href;
      const idx = full.indexOf("?");
      if (idx === -1) return "";
      return new URLSearchParams(full.slice(idx)).get("q") ?? "";
    } catch {
      return "";
    }
  })();

  const { data: results, isLoading, isFetching } = useSearch(query, 30);
  const isSearching = isLoading || isFetching;
  const count = results?.length ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-1 text-muted-foreground text-sm">
            <Search className="w-4 h-4" aria-hidden="true" />
            {t("search.resultsFor")}
          </div>
          <h1
            className="text-3xl font-bold text-foreground"
            style={{ fontFamily: "var(--app-font-heading, 'Space Grotesk', sans-serif)" }}
            data-testid="search-heading"
          >
            &ldquo;{query}&rdquo;
          </h1>
        </motion.div>

        <div className="mb-8 max-w-xl">
          <SearchBar autoFocus={false} />
        </div>

        {isSearching ? (
          <div className="flex items-center gap-3 py-16 justify-center text-muted-foreground" role="status" aria-live="polite">
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            <span>{t("search.searching")}</span>
          </div>
        ) : !results || results.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
            data-testid="no-results"
          >
            <div className="w-16 h-16 rounded-2xl bg-secondary/60 border border-border/40 flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-muted-foreground" aria-hidden="true" />
            </div>
            <p className="text-foreground font-medium mb-1">
              {t("search.noResults")} &ldquo;{query}&rdquo;
            </p>
            <p className="text-muted-foreground text-sm mb-6">{t("search.tryAgain")}</p>
            <Link href="/deals">
              <button className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-xl text-sm hover:bg-primary/20 transition-colors">
                {t("home.browseAllDeals")}
              </button>
            </Link>
          </motion.div>
        ) : (
          <>
            <p className="text-muted-foreground text-sm mb-6" aria-live="polite">
              {t("search.foundResults", { count })}
            </p>
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
              data-testid="search-results-grid"
              role="list"
            >
              {results.map((game, i) => {
                const isFree = parseFloat(game.cheapest) === 0;
                return (
                  <motion.div
                    key={game.gameID}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    role="listitem"
                  >
                    <Link href={`/game/${game.gameID}`}>
                      <div
                        data-testid={`result-card-${game.gameID}`}
                        className="group flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer"
                        role="article"
                      >
                        <div className="flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border border-border/30">
                          <img
                            src={game.thumb}
                            alt={game.external}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { (e.target as HTMLImageElement).style.opacity = "0"; }}
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2"
                            data-testid={`result-title-${game.gameID}`}
                          >
                            {game.external}
                          </p>
                          {game.cheapest && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {isFree ? (
                                <span className="text-primary font-bold">{t("common.free")}</span>
                              ) : (
                                <>{t("search.from")} {convertPrice(game.cheapest)}</>
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
