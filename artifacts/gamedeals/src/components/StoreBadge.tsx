import { SiSteam, SiEpicgames, SiGogdotcom, SiEa, SiUbisoft } from "react-icons/si";
import { cn } from "@/lib/utils";

interface StoreInfo {
  name: string;
  icon?: React.ReactNode;
  color?: string;
}

const STORE_MAP: Record<string, StoreInfo> = {
  "1":  { name: "Steam",         icon: <SiSteam />,    color: "#1b2838" },
  "2":  { name: "GamersGate",    color: "#e8471c" },
  "3":  { name: "GreenMan",      color: "#00a651" },
  "7":  { name: "GOG",           icon: <SiGogdotcom />, color: "#5c2d91" },
  "8":  { name: "EA App",        icon: <SiEa />,       color: "#e87722" },
  "11": { name: "WinGameStore",  color: "#2d6fa3" },
  "13": { name: "Fanatical",     color: "#e4004b" },
  "15": { name: "Gamesrocket",   color: "#ff5722" },
  "21": { name: "FunStock",      color: "#ff6b35" },
  "22": { name: "GameBillet",    color: "#0d5ca6" },
  "24": { name: "Humble",                              color: "#cc0000" },
  "25": { name: "Epic Games",    icon: <SiEpicgames />, color: "#2a2a2a" },
  "27": { name: "Gamesplanet",   color: "#0ea5e9" },
  "28": { name: "Gamesload",     color: "#7c3aed" },
  "29": { name: "2Game",         color: "#f97316" },
  "30": { name: "IndieGala",     color: "#8b5cf6" },
  "31": { name: "Blizzard",      color: "#00aeff" },
  "32": { name: "AllYouPlay",    color: "#16a34a" },
  "33": { name: "DLGamer",       color: "#dc2626" },
  "35": { name: "DreamGame",     color: "#a855f7" },
  "37": { name: "Ubisoft",       icon: <SiUbisoft />,  color: "#0070f3" },
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
      {store?.icon && (
        <span className={size === "sm" ? "w-3 h-3 [&>svg]:w-3 [&>svg]:h-3" : "w-3.5 h-3.5 [&>svg]:w-3.5 [&>svg]:h-3.5"}>
          {store.icon}
        </span>
      )}
      {label}
    </span>
  );
}
