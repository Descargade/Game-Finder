import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { Deal } from "@/types";
import { StoreBadge } from "./StoreBadge";
import { WishlistButton } from "./WishlistButton";
import { useCurrency } from "@/context/CurrencyContext";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DealCardProps {
  deal: Deal;
  index?: number;
}

function getSteamImage(steamAppID: string | null, thumb: string) {
  if (steamAppID) {
    return `https://cdn.akamai.steamstatic.com/steam/apps/${steamAppID}/header.jpg`;
  }
  return thumb;
}

function getDaysSince(unixTs: number): number {
  return Math.floor((Date.now() / 1000 - unixTs) / 86400);
}

export function DealCard({ deal, index = 0 }: DealCardProps) {
  const { convertPrice } = useCurrency();
  const [imgSrc, setImgSrc] = useState(getSteamImage(deal.steamAppID, deal.thumb));
  const savings = Math.round(parseFloat(deal.savings));
  const isFree = parseFloat(deal.salePrice) === 0;
  const daysSince = getDaysSince(deal.lastChange);
  const isNew = daysSince <= 2;
  const isRecent = daysSince > 2 && daysSince <= 7;

  const wishlistItem = {
    dealID: deal.dealID,
    gameID: deal.gameID,
    title: deal.title,
    thumb: deal.thumb,
    steamAppID: deal.steamAppID,
    salePrice: deal.salePrice,
    normalPrice: deal.normalPrice,
    savings: deal.savings,
    storeID: deal.storeID,
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      viewport={{ once: true }}
      data-testid={`deal-card-${deal.dealID}`}
      className="group relative rounded-xl overflow-hidden border border-border/40 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
    >
      <Link href={`/game/${deal.gameID}`} aria-label={`View deal for ${deal.title}`}>
        <div className="relative overflow-hidden aspect-[16/9]">
          <img
            src={imgSrc}
            alt={deal.title}
            onError={() => setImgSrc(deal.thumb)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            data-testid={`deal-image-${deal.dealID}`}
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" aria-hidden="true" />

          <div className="absolute top-2 left-2 flex items-center gap-1">
            {savings > 0 && !isFree && (
              <span
                className={cn(
                  "px-2 py-0.5 rounded-md text-xs font-bold text-white",
                  savings >= 75 ? "bg-green-500" : savings >= 50 ? "bg-emerald-500" : "bg-green-600"
                )}
                data-testid={`deal-discount-${deal.dealID}`}
                aria-label={`${savings}% off`}
              >
                -{savings}%
              </span>
            )}
            {isFree && (
              <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-primary text-primary-foreground">
                FREE
              </span>
            )}
            {isNew && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-yellow-500/90 text-black">
                NEW
              </span>
            )}
          </div>
        </div>

        <div className="p-3 space-y-1.5 pr-10">
          <p
            className="text-sm font-medium text-foreground leading-tight line-clamp-2"
            data-testid={`deal-title-${deal.dealID}`}
          >
            {deal.title}
          </p>

          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {!isFree && parseFloat(deal.normalPrice) > parseFloat(deal.salePrice) && (
                <span className="text-xs text-muted-foreground line-through">
                  {convertPrice(deal.normalPrice)}
                </span>
              )}
              <span
                className={cn(
                  "text-sm font-bold",
                  isFree ? "text-primary" : "text-foreground"
                )}
                data-testid={`deal-price-${deal.dealID}`}
              >
                {isFree ? "FREE" : convertPrice(deal.salePrice)}
              </span>
            </div>
            <StoreBadge storeID={deal.storeID} />
          </div>

          {isRecent && (
            <p className="text-[10px] text-muted-foreground/60">
              Updated {daysSince}d ago
            </p>
          )}
        </div>
      </Link>

      <div className="absolute top-2 right-2">
        <WishlistButton item={wishlistItem} />
      </div>

      <a
        href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        data-testid={`deal-link-${deal.dealID}`}
        className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1.5 rounded-lg bg-primary/20 hover:bg-primary/40 text-primary border border-primary/30"
        title={`Get deal for ${deal.title}`}
        aria-label={`Get deal for ${deal.title} on store`}
      >
        <ExternalLink className="w-3 h-3" aria-hidden="true" />
      </a>
    </motion.article>
  );
}
