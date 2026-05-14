import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, TrendingUp, Star, Percent, ExternalLink } from "lucide-react";
import { useDeals } from "@/hooks/useDeals";
import { DealCard } from "@/components/DealCard";
import { SkeletonGrid } from "@/components/SkeletonCard";
import { useState } from "react";
import { Deal } from "@/types";
import { useCurrency } from "@/context/CurrencyContext";
import { useTranslation } from "react-i18next";

function HeroSection({ deal }: { deal: Deal }) {
  const { convertPrice } = useCurrency();
  const { t } = useTranslation();
  const [imgError, setImgError] = useState(false);
  const savings = Math.round(parseFloat(deal.savings));
  const imgSrc = imgError
    ? deal.thumb
    : `https://cdn.akamai.steamstatic.com/steam/apps/${deal.steamAppID}/library_hero.jpg`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative rounded-2xl overflow-hidden border border-border/40 mb-12"
      style={{ minHeight: 340 }}
    >
      <div className="absolute inset-0">
        <img
          src={imgSrc}
          onError={() => setImgError(true)}
          alt={deal.title}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(8,10,20,0.95) 35%, rgba(8,10,20,0.5) 70%, transparent 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(8,10,20,0.8) 0%, transparent 60%)",
          }}
        />
      </div>

      <div
        className="relative z-10 p-8 md:p-12 flex flex-col justify-end h-full"
        style={{ minHeight: 340 }}
      >
        <div className="max-w-lg">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 bg-primary/20 text-primary border border-primary/30 text-xs font-semibold rounded-md">
              {t("home.featuredDeal")}
            </span>
            {savings > 0 && (
              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold rounded-md">
                -{savings}% {t("common.off")}
              </span>
            )}
          </div>
          <h1
            className="text-3xl md:text-5xl font-bold text-foreground mb-3 leading-tight"
            style={{ fontFamily: "var(--app-font-heading, 'Space Grotesk', sans-serif)" }}
          >
            {deal.title}
          </h1>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-muted-foreground line-through text-lg">
              {convertPrice(deal.normalPrice)}
            </span>
            <span className="text-3xl font-bold text-foreground">
              {parseFloat(deal.salePrice) === 0 ? t("common.free") : convertPrice(deal.salePrice)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/game/${deal.gameID}`}>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                data-testid="hero-view-game"
                className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors"
              >
                {t("home.viewGame")} <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
            <a
              href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="hero-get-deal"
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-foreground rounded-xl font-semibold text-sm flex items-center gap-2 border border-white/20 transition-colors"
            >
              {t("home.getDeal")} <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  href,
}: {
  icon: React.ElementType;
  title: string;
  href?: string;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <h2
          className="text-xl font-bold text-foreground"
          style={{ fontFamily: "var(--app-font-heading, 'Space Grotesk', sans-serif)" }}
        >
          {title}
        </h2>
      </div>
      {href && (
        <Link href={href}>
          <span className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 cursor-pointer">
            {t("home.viewAll")} <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      )}
    </div>
  );
}

function HeroCarousel({ deals }: { deals: Deal[] }) {
  const { t } = useTranslation();
  return (
    <div className="mb-12">
      <SectionHeader icon={Star} title={t("home.topRatedDeals")} href="/deals" />
      <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
        {deals.slice(0, 8).map((deal, i) => (
          <motion.div
            key={deal.dealID}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className="flex-shrink-0 snap-start"
            style={{ width: "min(260px, 70vw)" }}
          >
            <DealCard deal={deal} index={i} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const topDeals = useDeals({ sortBy: "Deal Rating", pageSize: 20, onSale: 1 });
  const recentDeals = useDeals({ sortBy: "Recent", pageSize: 8, onSale: 1 });
  const bigDiscounts = useDeals({ sortBy: "Savings", pageSize: 8, onSale: 1 });

  const heroDeal = topDeals.data?.find((d) => d.steamAppID) ?? topDeals.data?.[0];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">

        {topDeals.isLoading ? (
          <div
            className="rounded-2xl bg-card/60 border border-border/40 mb-12 animate-pulse"
            style={{ height: 340 }}
          />
        ) : heroDeal ? (
          <HeroSection deal={heroDeal} />
        ) : null}

        {topDeals.isLoading ? (
          <div className="mb-12">
            <SectionHeader icon={Star} title={t("home.topRatedDeals")} />
            <SkeletonGrid count={8} />
          </div>
        ) : topDeals.data && topDeals.data.length > 0 ? (
          <HeroCarousel deals={topDeals.data} />
        ) : null}

        <div className="mb-12">
          <SectionHeader icon={TrendingUp} title={t("home.trendingNow")} href="/deals" />
          {recentDeals.isLoading ? (
            <SkeletonGrid count={8} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {recentDeals.data?.map((deal, i) => (
                <DealCard key={deal.dealID} deal={deal} index={i} />
              ))}
            </div>
          )}
        </div>

        <div className="mb-12">
          <SectionHeader icon={Percent} title={t("home.biggestDiscounts")} href="/deals" />
          {bigDiscounts.isLoading ? (
            <SkeletonGrid count={8} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {bigDiscounts.data?.map((deal, i) => (
                <DealCard key={deal.dealID} deal={deal} index={i} />
              ))}
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center"
        >
          <h2
            className="text-2xl font-bold text-foreground mb-2"
            style={{ fontFamily: "var(--app-font-heading, 'Space Grotesk', sans-serif)" }}
          >
            {t("home.browseAllDeals")}
          </h2>
          <p className="text-muted-foreground text-sm mb-5">{t("home.browseAllDesc")}</p>
          <Link href="/deals">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              data-testid="browse-all-deals-btn"
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm inline-flex items-center gap-2 hover:bg-primary/90 transition-colors"
            >
              {t("home.browseAllDeals")} <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
