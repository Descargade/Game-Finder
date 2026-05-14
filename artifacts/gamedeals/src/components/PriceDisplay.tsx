import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  salePrice: string | number;
  normalPrice?: string | number;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function PriceDisplay({ salePrice, normalPrice, className, size = "md" }: PriceDisplayProps) {
  const { convertPrice } = useCurrency();

  const sale = convertPrice(salePrice);
  const normal = normalPrice ? convertPrice(normalPrice) : null;
  const isOnSale = normalPrice && Number(salePrice) < Number(normalPrice);

  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg font-semibold",
    xl: "text-2xl font-bold",
  };

  const normalSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-sm",
    xl: "text-lg",
  };

  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)} data-testid="price-display">
      {isOnSale && (
        <span className={cn("text-muted-foreground line-through decoration-muted-foreground/50", normalSizes[size])}>
          {normal}
        </span>
      )}
      <span className={cn("text-foreground", sizes[size])}>
        {sale}
      </span>
    </div>
  );
}
