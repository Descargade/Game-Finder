import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Trash2, Target, ChevronDown, ChevronUp, ExternalLink, Clock } from "lucide-react";
import { Link } from "wouter";
import { useWishlist } from "@/context/WishlistContext";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { useCurrency } from "@/context/CurrencyContext";
import { EmptyState } from "@/components/EmptyState";
import { StoreBadge } from "@/components/StoreBadge";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

function getSteamImage(steamAppID: string | null, thumb: string) {
  if (steamAppID) return `https://cdn.akamai.steamstatic.com/steam/apps/${steamAppID}/header.jpg`;
  return thumb;
}

function TargetPriceInput({
  gameID,
  current,
  onSave,
}: {
  gameID: string;
  current?: number;
  onSave: (price: number | undefined) => void;
}) {
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState(current?.toString() ?? "");
  const { t } = useTranslation();

  const handleSave = () => {
    const n = parseFloat(val);
    onSave(isNaN(n) || n <= 0 ? undefined : n);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        data-testid={`target-price-toggle-${gameID}`}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors",
          current !== undefined
            ? "border-primary/40 bg-primary/10 text-primary"
            : "border-border/40 bg-secondary/50 text-muted-foreground hover:text-foreground"
        )}
      >
        <Target className="w-3 h-3" />
        {current !== undefined ? `$${current.toFixed(2)}` : t("wishlist.setTarget")}
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1.5 z-10 p-3 rounded-xl border border-border/50 bg-popover shadow-xl shadow-black/40 min-w-[180px]"
          >
            <p className="text-xs text-muted-foreground mb-2">{t("wishlist.targetHint")}</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={val}
                onChange={(e) => setVal(e.target.value)}
                placeholder="0.00"
                className="flex-1 px-2 py-1.5 rounded-lg border border-border/50 bg-secondary/60 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 w-20"
                data-testid={`target-price-input-${gameID}`}
                autoFocus
                onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") setOpen(false); }}
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSave}
                className="flex-1 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors"
                data-testid={`target-price-save-${gameID}`}
              >
                {t("wishlist.save")}
              </button>
              {current !== undefined && (
                <button
                  onClick={() => { onSave(undefined); setVal(""); setOpen(false); }}
                  className="py-1.5 px-2 bg-secondary/60 text-muted-foreground rounded-lg text-xs hover:text-foreground border border-border/40 transition-colors"
                  data-testid={`target-price-clear-${gameID}`}
                >
                  {t("wishlist.clear")}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Wishlist() {
  const { items, remove, setTargetPrice, belowTargetCount } = useWishlist();
  const { items: recentItems } = useRecentlyViewed();
  const { convertPrice } = useCurrency();
  const { t } = useTranslation();

  const belowTarget = items.filter(
    (i) => i.targetPrice !== undefined && parseFloat(i.salePrice) <= i.targetPrice
  );
  const others = items.filter(
    (i) => !(i.targetPrice !== undefined && parseFloat(i.salePrice) <= i.targetPrice)
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Heart className="w-5 h-5 text-red-400 fill-red-400" />
              <h1
                className="text-3xl font-bold text-foreground"
                style={{ fontFamily: "var(--app-font-heading, 'Space Grotesk', sans-serif)" }}
                data-testid="wishlist-title"
              >
                {t("wishlist.title")}
              </h1>
              {items.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-xs font-semibold border border-border/40">
                  {items.length}
                </span>
              )}
            </div>
            {belowTargetCount > 0 && (
              <p className="text-sm text-green-400 font-medium flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                {t("wishlist.belowTarget", { count: belowTargetCount })}
              </p>
            )}
          </div>
        </motion.div>

        {items.length === 0 ? (
          <EmptyState
            icon={<Heart className="w-9 h-9" />}
            title={t("wishlist.emptyTitle")}
            description={t("wishlist.emptyDesc")}
            actionLabel={t("wishlist.browseDeals")}
            actionHref="/deals"
          />
        ) : (
          <div className="space-y-8">
            {belowTarget.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
                    <Target className="w-4 h-4 text-green-400" />
                  </div>
                  <h2
                    className="text-lg font-bold text-green-400"
                    style={{ fontFamily: "var(--app-font-heading, 'Space Grotesk', sans-serif)" }}
                  >
                    {t("wishlist.belowTargetTitle")}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20">
                    {belowTarget.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {belowTarget.map((item, i) => (
                    <WishlistRow
                      key={item.gameID}
                      item={item}
                      index={i}
                      highlight
                      onRemove={remove}
                      onSetTarget={setTargetPrice}
                      convertPrice={convertPrice}
                      t={t}
                    />
                  ))}
                </div>
              </section>
            )}

            {others.length > 0 && (
              <section>
                {belowTarget.length > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
                      <Heart className="w-4 h-4 text-primary" />
                    </div>
                    <h2
                      className="text-lg font-bold text-foreground"
                      style={{ fontFamily: "var(--app-font-heading, 'Space Grotesk', sans-serif)" }}
                    >
                      {t("wishlist.allItems")}
                    </h2>
                  </div>
                )}
                <div className="space-y-3">
                  {others.map((item, i) => (
                    <WishlistRow
                      key={item.gameID}
                      item={item}
                      index={i}
                      onRemove={remove}
                      onSetTarget={setTargetPrice}
                      convertPrice={convertPrice}
                      t={t}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {recentItems.length > 0 && (
          <section className="mt-14">
            <div className="flex items-center gap-2 mb-5">
              <div className="p-1.5 rounded-lg bg-secondary/60 border border-border/40">
                <Clock className="w-4 h-4 text-muted-foreground" />
              </div>
              <h2
                className="text-lg font-bold text-foreground"
                style={{ fontFamily: "var(--app-font-heading, 'Space Grotesk', sans-serif)" }}
              >
                {t("home.recentlyViewed")}
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {recentItems.slice(0, 4).map((game, i) => {
                const src = game.steamAppID
                  ? `https://cdn.akamai.steamstatic.com/steam/apps/${game.steamAppID}/header.jpg`
                  : game.thumb;
                return (
                  <motion.div
                    key={game.gameID}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link href={`/game/${game.gameID}`}>
                      <div className="group rounded-xl overflow-hidden border border-border/40 bg-card/60 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 cursor-pointer">
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={src}
                            alt={game.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { (e.target as HTMLImageElement).src = game.thumb; }}
                          />
                        </div>
                        <p className="p-2 text-xs font-medium text-foreground line-clamp-1">
                          {game.title}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function WishlistRow({
  item,
  index,
  highlight,
  onRemove,
  onSetTarget,
  convertPrice,
  t,
}: {
  item: import("@/context/WishlistContext").WishlistItem;
  index: number;
  highlight?: boolean;
  onRemove: (id: string) => void;
  onSetTarget: (id: string, price: number | undefined) => void;
  convertPrice: (p: string | number) => string;
  t: (key: string, opts?: Record<string, unknown>) => string;
}) {
  const [imgSrc, setImgSrc] = useState(getSteamImage(item.steamAppID, item.thumb));
  const savings = Math.round(parseFloat(item.savings));
  const isFree = parseFloat(item.salePrice) === 0;
  const belowTarget = item.targetPrice !== undefined && parseFloat(item.salePrice) <= item.targetPrice;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ delay: index * 0.05 }}
      data-testid={`wishlist-item-${item.gameID}`}
      className={cn(
        "flex items-center gap-4 p-4 rounded-xl border backdrop-blur-sm transition-all",
        highlight
          ? "border-green-500/30 bg-green-500/5"
          : "border-border/40 bg-card/60"
      )}
    >
      <Link href={`/game/${item.gameID}`}>
        <div className="w-20 h-14 flex-shrink-0 rounded-lg overflow-hidden border border-border/30 cursor-pointer">
          <img
            src={imgSrc}
            alt={item.title}
            onError={() => setImgSrc(item.thumb)}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <Link href={`/game/${item.gameID}`}>
          <p className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-1 cursor-pointer mb-1">
            {item.title}
          </p>
        </Link>
        <div className="flex items-center gap-2 flex-wrap">
          <StoreBadge storeID={item.storeID} />
          {savings > 0 && (
            <span className="text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded-md">
              -{savings}%
            </span>
          )}
          {belowTarget && (
            <span className="text-[10px] font-bold text-green-400 flex items-center gap-0.5">
              <Target className="w-3 h-3" /> {t("wishlist.hitTarget")}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <div className="text-right">
          {!isFree && parseFloat(item.normalPrice) > parseFloat(item.salePrice) && (
            <p className="text-xs text-muted-foreground line-through">{convertPrice(item.normalPrice)}</p>
          )}
          <p className="text-base font-bold text-foreground" data-testid={`wishlist-price-${item.gameID}`}>
            {isFree ? "FREE" : convertPrice(item.salePrice)}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <TargetPriceInput
            gameID={item.gameID}
            current={item.targetPrice}
            onSave={(p) => onSetTarget(item.gameID, p)}
          />
          <a
            href={`https://www.cheapshark.com/redirect?dealID=${item.dealID}`}
            target="_blank"
            rel="noopener noreferrer"
            data-testid={`wishlist-deal-${item.dealID}`}
            className="p-1.5 rounded-lg bg-primary/10 hover:bg-primary/30 text-primary border border-primary/20 transition-colors"
            title="Get deal"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={() => onRemove(item.gameID)}
            data-testid={`wishlist-remove-${item.gameID}`}
            className="p-1.5 rounded-lg bg-secondary/60 hover:bg-red-500/10 text-muted-foreground hover:text-red-400 border border-border/40 hover:border-red-500/30 transition-colors"
            title="Remove"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
