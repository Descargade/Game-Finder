import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { I18nextProvider } from "react-i18next";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Home from "@/pages/Home";
import AllDeals from "@/pages/AllDeals";
import GameDetail from "@/pages/GameDetail";
import SearchResults from "@/pages/SearchResults";
import NotFound from "@/pages/not-found";
import i18n from "@/lib/i18n";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 2,
    },
  },
});

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/deals" component={AllDeals} />
        <Route path="/game/:id" component={GameDetail} />
        <Route path="/search" component={SearchResults} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <QueryClientProvider client={queryClient}>
        <CurrencyProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Navbar />
              <Router />
              <Footer />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </CurrencyProvider>
      </QueryClientProvider>
    </I18nextProvider>
  );
}

export default App;
