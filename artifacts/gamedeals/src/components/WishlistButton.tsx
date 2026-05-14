import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist, WishlistItem } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  item: Omit<WishlistItem, "addedAt">;
  className?: string;
  size?: "sm" | "md";
}

export function WishlistButton({ item, className, size = "sm" }: WishlistButtonProps) {
  const { add, remove, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(item.gameID);

  const toggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlisted) {
      remove(item.gameID);
    } else {
      add(item);
    }
  };

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.85 }}
      data-testid={`wishlist-btn-${item.gameID}`}
      className={cn(
        "flex items-center justify-center rounded-lg border transition-all duration-200",
        size === "sm" ? "w-7 h-7" : "w-8 h-8",
        wishlisted
          ? "bg-red-500/20 border-red-500/40 text-red-400 hover:bg-red-500/30"
          : "bg-black/30 border-white/10 text-white/50 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30",
        className
      )}
      title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={wishlisted ? "filled" : "empty"}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Heart
            className={cn(size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4")}
            fill={wishlisted ? "currentColor" : "none"}
          />
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}
