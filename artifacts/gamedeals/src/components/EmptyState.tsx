import { motion } from "framer-motion";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn("flex flex-col items-center justify-center py-20 text-center px-4", className)}
    >
      <div className="w-20 h-20 rounded-2xl bg-secondary/60 border border-border/40 flex items-center justify-center mb-5 text-muted-foreground/50">
        {icon}
      </div>
      <h3
        className="text-lg font-bold text-foreground mb-1"
        style={{ fontFamily: "var(--app-font-heading, 'Space Grotesk', sans-serif)" }}
      >
        {title}
      </h3>
      <p className="text-muted-foreground text-sm max-w-xs mb-6">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            {actionLabel}
          </motion.button>
        </Link>
      )}
      {actionLabel && onAction && (
        <motion.button
          onClick={onAction}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="px-5 py-2.5 bg-secondary/80 text-muted-foreground rounded-xl font-semibold text-sm hover:text-foreground border border-border/40 transition-colors"
        >
          {actionLabel}
        </motion.button>
      )}
    </motion.div>
  );
}
