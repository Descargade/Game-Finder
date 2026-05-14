import { motion } from "framer-motion";
import { Link } from "wouter";
import { Home, Zap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
        data-testid="not-found-page"
      >
        <div className="flex items-center justify-center gap-1 mb-6" style={{ fontFamily: "var(--app-font-heading, 'Space Grotesk', sans-serif)" }}>
          <Zap className="w-6 h-6 text-primary fill-primary" />
          <span className="text-2xl font-bold text-foreground">Game</span>
          <span className="text-2xl font-bold text-primary">Deals</span>
        </div>
        <h1
          className="text-8xl font-bold text-primary/20 mb-4 select-none"
          style={{ fontFamily: "var(--app-font-heading, 'Space Grotesk', sans-serif)" }}
        >
          404
        </h1>
        <p className="text-xl font-semibold text-foreground mb-2">Page not found</p>
        <p className="text-muted-foreground mb-8 text-sm max-w-xs mx-auto">
          Looks like this deal has expired or the page doesn't exist.
        </p>
        <Link href="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            data-testid="go-home-button"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Deals
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
}
