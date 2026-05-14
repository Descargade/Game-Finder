import { SiSteam, SiEpicgames, SiGogdotcom } from "react-icons/si";
import { cn } from "@/lib/utils";

const STORE_MAP: Record<string, { name: string; abbr: string }> = {
  "1": { name: "Steam", abbr: "STM" },
  "7": { name: "GOG", abbr: "GOG" },
  "8": { name: "EA App", abbr: "EA" },
  "11": { name: "WinGameStore", abbr: "WGS" },
  "13": { name: "Fanatical", abbr: "FAN" },
  "25": { name: "Epic Games", abbr: "EGS" },
  "27": { name: "Gamesplanet", abbr: "GP" },
  "28": { name: "Gamesload", abbr: "GL" },
  "29": { name: "2Game", abbr: "2GM" },
  "30": { name: "IndieGala", abbr: "IG" },
};

const STORE_ICONS: Record<string, React.ReactNode> = {
  "1": <SiSteam className="w-3 h-3" />,
  "7": <SiGogdotcom className="w-3 h-3" />,
  "25": <SiEpicgames className="w-3 h-3" />,
};

interface StoreBadgeProps {
  storeID: string;
  className?: string;
  size?: "sm" | "md";
}

export function getStoreName(storeID: string): string {
  return STORE_MAP[storeID]?.name ?? `Store ${storeID}`;
}

export function StoreBadge({ storeID, className, size = "sm" }: StoreBadgeProps) {
  const store = STORE_MAP[storeID];
  const icon = STORE_ICONS[storeID];
  const label = store?.name ?? `Store ${storeID}`;

  return (
    <span
      data-testid={`store-badge-${storeID}`}
      className={cn(
        "inline-flex items-center gap-1 rounded-md font-medium text-muted-foreground border border-border/50 bg-secondary/50",
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-1 text-xs",
        className
      )}
    >
      {icon}
      {label}
    </span>
  );
}
