import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Tag, TrendingDown, Star, Heart } from "lucide-react";
import { useGameDetail } from "@/hooks/useGameDetail";
import { useStores } from "@/hooks/useStores";
import { StoreBadge, getStoreName } from "@/components/StoreBadge";
import { WishlistButton } from "@/components/WishlistButton";
import { useCurrency } from "@/context/CurrencyContext";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { useWishlist } from "@/context/WishlistContext";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

function getSteamImage(steamAppID: string | null | undefined, size: "header" | "hero" = "header") {
  if (!steamAppID) return null;
  if (size === "hero") return `https://cdn.akamai.steamstatic.com/steam/apps/${steamAppID}/library_hero.jpg`;
  return `https://cdn.akamai.steamstatic.com/steam/apps/${steamAppID}/header.jpg`;
}

export default function GameDetail() {
  const params = useParams<{ id: string }>();
  const gameId = params.id ?? null;
  const { data: game, isLoading, isError } = useGameDetail(gameId);
  const { data: stores } = useStores();
  const { convertPrice } = useCurrency();
  const { track } = useRecentlyViewed();
  const { isWishlisted, add, remove } = useWishlist();
  const { t } = useTranslation();
  const [heroImgError, setHeroImgError] = useState(false);

  const steamAppID = game?.info?.steamAppID ?? null;
  const heroSrc = !heroImgError && steamAppID
    ? getSteamImage(steamAppID, "hero")
    : game?.info?.thumb ?? "";

  useEffect(() => {
    if (game?.info) {
      track({
        gameID: game.info.gameID ?? gameId ?? "",
        title: game.info.name,
        thumb: game.info.thumb,
        steamAppID: game.info.steamAppID,
      });
    }
  }, [game?.info?.name]);

  const storeName = (storeID: string) =>
    stores?.find((s) => s.storeID === storeID)?.storeName ?? getStoreName(storeID);

  const sortedDeals = game?.deals
    ? [...game.deals].sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
    : [];

  const bestDeal = sortedDeals[0];
  const wishlisted = game ? isWishlisted(game.info?.gameID ?? gameId ?? "") : false;

  const wishlistItem = game && bestDeal
    ? {
        dealID: bestDeal.dealID,
        gameID: game.info?.gameID ?? gameId ?? "",
        title: game.info.name,
        thumb: game.info.thumb,
        steamAppID: game.info.steamAppID,
        salePrice: bestDeal.price,
        normalPrice: bestDeal.retailPrice,
        savings: bestDeal.savings,
        storeID: bestDeal.storeID,
      }
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-6 w-24 mb-6" />
          <Skeleton className="w-full rounded-2xl mb-8" style={{ height: 320 }} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !game) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">{t("common.error")}</p>
          <Link href="/">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium">
              {t("game.back")}
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const lowestPrice = sortedDeals[0];
  const cheapestEver = game.cheapestPriceEver;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">

        <div className="flex items-center justify-between mb-6">
          <Link href="/">
            <button
              data-testid="back-button"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> {t("game.back")}
            </button>
          </Link>
          {wishlistItem && (
            <button
              onClick={() => wishlisted ? remove(wishlistItem.gameID) : add(wishlistItem)}
              data-testid="game-wishlist-btn"
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-medium transition-all",
                wishlisted
                  ? "border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                  : "border-border/40 bg-secondary/60 text-muted-foreground hover:text-foreground"
              )}
            >
              <Heart className="w-4 h-4" fill={wishlisted ? "currentColor" : "none"} />
              {wishlisted ? t("game.removeFromWishlist") : t("game.addToWishlist")}
            </button>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="relative rounded-2xl overflow-hidden border border-border/40 mb-8" style={{ height: 300 }}>
            {heroSrc ? (
              <img
                src={heroSrc}
                alt={game.info.name}
                onError={() => setHeroImgError(true)}
                className="w-full h-full object-cover"
                data-testid="game-hero-image"
              />
            ) : (
              <div className="w-full h-full bg-card/60" />
            )}
            <div className="absolute inset-0" style={{
              background: "linear-gradient(to top, rgba(8,10,20,1) 0%, rgba(8,10,20,0.3) 60%, transparent 100%)"
            }} />
            <div className="absolute bottom-0 left-0 p-6">
              <h1
                className="text-3xl md:text-4xl font-bold text-foreground mb-2"
                style={{ fontFamily: "var(--app-font-heading, 'Space Grotesk', sans-serif)" }}
                data-testid="game-title"
              >
                {game.info.name}
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                {steamAppID && (
                  <a
                    href={`https://store.steampowered.com/app/${steamAppID}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="steam-link"
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-foreground/80 border border-white/10 transition-colors"
                  >
                    {t("game.viewOnSteam")} <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {cheapestEver && (
                  <div className="p-4 rounded-xl border border-border/40 bg-card/60 backdrop-blur-sm">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                      <TrendingDown className="w-3.5 h-3.5" />
                      {t("game.cheapestEver")}
                    </div>
                    <p className="text-lg font-bold text-foreground" data-testid="cheapest-ever-price">
                      {parseFloat(cheapestEver.price) === 0 ? t("common.free") : convertPrice(cheapestEver.price)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(cheapestEver.date * 1000).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                    </p>
                  </div>
                )}

                {lowestPrice && (
                  <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 backdrop-blur-sm">
                    <div className="flex items-center gap-1.5 text-xs text-primary mb-1">
                      <Tag className="w-3.5 h-3.5" />
                      {t("game.bestCurrent")}
                    </div>
                    <p className="text-lg font-bold text-foreground" data-testid="best-current-price">
                      {parseFloat(lowestPrice.price) === 0 ? t("common.free") : convertPrice(lowestPrice.price)}
                    </p>
                    <StoreBadge storeID={lowestPrice.storeID} className="mt-1" />
                  </div>
                )}

                {lowestPrice && parseFloat(lowestPrice.savings) > 0 && (
                  <div className="p-4 rounded-xl border border-green-500/30 bg-green-500/5 backdrop-blur-sm">
                    <div className="flex items-center gap-1.5 text-xs text-green-400 mb-1">
                      <Star className="w-3.5 h-3.5" />
                      {t("game.maxSavings")}
                    </div>
                    <p className="text-2xl font-bold text-green-400" data-testid="max-savings">
                      -{Math.round(parseFloat(lowestPrice.savings))}%
                    </p>
                    <p className="text-xs text-muted-foreground">{t("game.offRetail")}</p>
                  </div>
                )}
              </div>

              {steamAppID && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    {t("game.screenshots")}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {["capsule_616x353", "ss_1"].map((img, i) => (
                      <motion.div
                        key={img}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                        className="rounded-xl overflow-hidden border border-border/40 aspect-video"
                      >
                        <img
                          src={`https://cdn.akamai.steamstatic.com/steam/apps/${steamAppID}/${img}.jpg`}
                          alt={`${game.info.name} screenshot ${i + 1}`}
                          className="w-full h-full object-cover"
                          data-testid={`screenshot-${i}`}
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3" data-testid="deals-list">
              <h2
                className="text-lg font-bold text-foreground"
                style={{ fontFamily: "var(--app-font-heading, 'Space Grotesk', sans-serif)" }}
              >
                {t("game.availableDeals")}
              </h2>
              {sortedDeals.length === 0 && (
                <p className="text-muted-foreground text-sm">{t("game.noDeal")}</p>
              )}
              {sortedDeals.map((deal, i) => {
                const savings = Math.round(parseFloat(deal.savings));
                const isFree = parseFloat(deal.price) === 0;
                return (
                  <motion.div
                    key={deal.dealID}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className={`p-4 rounded-xl border backdrop-blur-sm transition-all ${
                      i === 0 ? "border-primary/30 bg-primary/5" : "border-border/40 bg-card/60"
                    }`}
                    data-testid={`deal-row-${deal.dealID}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <StoreBadge storeID={deal.storeID} size="md" />
                      {savings > 0 && (
                        <span className="text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded-md">
                          -{savings}%
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        {!isFree && parseFloat(deal.retailPrice) > parseFloat(deal.price) && (
                          <p className="text-xs text-muted-foreground line-through">
                            {convertPrice(deal.retailPrice)}
                          </p>
                        )}
                        <p className="text-base font-bold text-foreground" data-testid={`deal-price-${deal.dealID}`}>
                          {isFree ? t("common.free") : convertPrice(deal.price)}
                        </p>
                      </div>
                      <a
                        href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-testid={`get-deal-${deal.dealID}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/40 text-primary text-xs font-semibold border border-primary/30 transition-colors"
                      >
                        {t("game.getDeal")} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
