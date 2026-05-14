import { Zap } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border/30 mt-20 py-10 px-4" data-testid="footer">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" aria-label="GameDeals home">
          <div className="flex items-center gap-1.5 cursor-pointer" style={{ fontFamily: "var(--app-font-heading, 'Space Grotesk', sans-serif)" }}>
            <Zap className="w-4 h-4 text-primary fill-primary" aria-hidden="true" />
            <span className="font-bold text-foreground">Game</span>
            <span className="font-bold text-primary">Deals</span>
          </div>
        </Link>
        <nav className="flex items-center gap-4 text-xs text-muted-foreground" aria-label="Footer navigation">
          <Link href="/">
            <span className="hover:text-foreground transition-colors cursor-pointer">{t("nav.home")}</span>
          </Link>
          <Link href="/deals">
            <span className="hover:text-foreground transition-colors cursor-pointer">{t("nav.allDeals")}</span>
          </Link>
          <Link href="/wishlist">
            <span className="hover:text-foreground transition-colors cursor-pointer">{t("nav.wishlist")}</span>
          </Link>
          <a
            href="https://apidocs.cheapshark.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            API
          </a>
        </nav>
        <p className="text-xs text-muted-foreground/50" data-testid="footer-credit">
          Powered by 2BleA
        </p>
      </div>
    </footer>
  );
}
