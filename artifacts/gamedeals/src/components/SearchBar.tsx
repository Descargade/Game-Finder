import { useState, useRef, useEffect, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2 } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

interface SearchBarProps {
  onClose?: () => void;
  autoFocus?: boolean;
  className?: string;
}

export function SearchBar({ onClose, autoFocus, className }: SearchBarProps) {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 280);
  const { data: suggestions, isFetching } = useSearch(debouncedQuery, 6);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!query.trim()) return;
      setOpen(false);
      setLocation(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose?.();
    },
    [query, setLocation, onClose]
  );

  const handleSuggestionClick = useCallback(
    (gameID: string) => {
      setOpen(false);
      setQuery("");
      setLocation(`/game/${gameID}`);
      onClose?.();
    },
    [setLocation, onClose]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
      onClose?.();
    }
    if (e.key === "Enter") handleSubmit();
  };

  const hasSuggestions = suggestions && suggestions.length > 0;
  const showDropdown = open && debouncedQuery.trim().length >= 2;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={t("nav.searchPlaceholder")}
          data-testid="search-input"
          className="w-full pl-9 pr-8 py-2 rounded-xl border border-border/50 bg-secondary/60 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/40 transition-all"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(""); setOpen(false); inputRef.current?.focus(); }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            data-testid="search-clear"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </form>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-xl border border-border/50 overflow-hidden shadow-2xl shadow-black/40"
            style={{ background: "rgba(12, 14, 28, 0.97)", backdropFilter: "blur(20px)" }}
            data-testid="search-dropdown"
          >
            {isFetching && !hasSuggestions ? (
              <div className="flex items-center gap-2 px-4 py-3 text-muted-foreground text-sm">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                {t("search.searching")}
              </div>
            ) : hasSuggestions ? (
              <>
                <p className="px-4 pt-3 pb-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {t("search.suggestions")}
                </p>
                {suggestions.map((game, i) => (
                  <motion.button
                    key={game.gameID}
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => handleSuggestionClick(game.gameID)}
                    data-testid={`suggestion-${game.gameID}`}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors text-left group"
                  >
                    <img
                      src={game.thumb}
                      alt={game.external}
                      className="w-10 h-7 rounded object-cover flex-shrink-0 border border-border/30"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground font-medium truncate group-hover:text-primary transition-colors">
                        {game.external}
                      </p>
                      {game.cheapest && parseFloat(game.cheapest) > 0 && (
                        <p className="text-xs text-muted-foreground">from ${game.cheapest}</p>
                      )}
                    </div>
                  </motion.button>
                ))}
                {debouncedQuery.trim() && (
                  <button
                    onClick={() => handleSubmit()}
                    data-testid="search-view-all"
                    className="w-full flex items-center gap-2 px-4 py-2.5 border-t border-border/30 text-sm text-primary hover:bg-primary/5 transition-colors font-medium"
                  >
                    <Search className="w-3.5 h-3.5" />
                    {t("search.viewAllResults")} "{debouncedQuery}"
                  </button>
                )}
              </>
            ) : debouncedQuery.trim().length >= 2 && !isFetching ? (
              <div className="px-4 py-4 text-sm text-muted-foreground">
                {t("search.noResults")} "{debouncedQuery}"
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
