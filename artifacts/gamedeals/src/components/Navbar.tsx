import { Link, useLocation } from "wouter";
import { useCurrency } from "@/context/CurrencyContext";
import { Menu, X, Zap, Search, Globe } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { SearchBar } from "@/components/SearchBar";

const CURRENCIES = ["USD", "EUR", "ARS"] as const;
type Currency = typeof CURRENCIES[number];

export function Navbar() {
  const [location] = useLocation();
  const { currency, setCurrency } = useCurrency();
  const { t, i18n } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);

  const currentLang = i18n.language.startsWith("es") ? "es" : "en";

  const toggleLanguage = () => {
    const next = currentLang === "en" ? "es" : "en";
    i18n.changeLanguage(next);
    localStorage.setItem("gamedeals-lang", next);
  };

  const NAV_LINKS = [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.allDeals"), href: "/deals" },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/30"
      style={{
        background: "rgba(8, 10, 20, 0.80)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-3">

          <Link href="/" data-testid="nav-logo">
            <span
              className="flex items-center gap-1.5 font-bold text-lg tracking-tight select-none flex-shrink-0"
              style={{ fontFamily: "var(--app-font-heading, 'Space Grotesk', sans-serif)" }}
            >
              <Zap className="w-4 h-4 text-primary fill-primary" />
              <span className="text-foreground">Game</span>
              <span className="text-primary">Deals</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 flex-shrink-0" data-testid="nav-links">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer",
                    location === link.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                  data-testid={`nav-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex flex-1 max-w-xs" data-testid="desktop-search">
            <SearchBar className="w-full" />
          </div>

          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <button
              onClick={toggleLanguage}
              data-testid="language-toggle"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-border/40 bg-secondary/60 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              title={t("nav.language")}
            >
              <Globe className="w-3.5 h-3.5" />
              {currentLang.toUpperCase()}
            </button>

            <div
              className="flex items-center bg-secondary/60 rounded-lg p-0.5 border border-border/40"
              data-testid="currency-selector"
            >
              {CURRENCIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c as Currency)}
                  data-testid={`currency-${c}`}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-xs font-semibold transition-all duration-200",
                    currency === c
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <button
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              onClick={() => { setSearchExpanded(!searchExpanded); setMobileOpen(false); }}
              data-testid="mobile-search-toggle"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              onClick={() => { setMobileOpen(!mobileOpen); setSearchExpanded(false); }}
              data-testid="mobile-menu-toggle"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {searchExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="md:hidden border-t border-border/30 overflow-hidden"
            style={{ background: "rgba(8, 10, 20, 0.97)" }}
          >
            <div className="px-4 py-3" data-testid="mobile-search-bar">
              <SearchBar
                autoFocus
                onClose={() => setSearchExpanded(false)}
              />
            </div>
          </motion.div>
        )}

        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="md:hidden border-t border-border/30 overflow-hidden"
            style={{ background: "rgba(8, 10, 20, 0.97)" }}
            data-testid="mobile-menu"
          >
            <div className="px-4 py-3 space-y-2">
              {NAV_LINKS.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                      location === link.href
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={toggleLanguage}
                  data-testid="mobile-language-toggle"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/40 bg-secondary/60 text-xs font-semibold text-muted-foreground"
                >
                  <Globe className="w-3.5 h-3.5" />
                  {currentLang === "en" ? "English" : "Español"}
                </button>
              </div>

              <div className="flex items-center gap-1 pt-1" data-testid="mobile-currency-selector">
                {CURRENCIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c as Currency)}
                    className={cn(
                      "flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all",
                      currency === c
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary/50 text-muted-foreground"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
