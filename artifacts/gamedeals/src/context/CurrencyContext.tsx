import { createContext, useContext, useState, ReactNode } from "react";

type Currency = "USD" | "EUR" | "ARS";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (priceInUSD: string | number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  ARS: 1000,
};

const SYMBOLS: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  ARS: "ARS $",
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("USD");

  const convertPrice = (priceInUSD: string | number) => {
    const num = typeof priceInUSD === "string" ? parseFloat(priceInUSD) : priceInUSD;
    if (isNaN(num)) return `${SYMBOLS[currency]}0.00`;
    
    const converted = num * RATES[currency];
    return `${SYMBOLS[currency]}${converted.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
