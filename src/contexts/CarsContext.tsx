import { createContext, useContext, type ReactNode } from "react";

import { useCarsState, type CarsState } from "../hooks/useCarsState";

export type { SortBy, SortDir } from "../types/carSorting";

export type CarsContextValue = CarsState;

const CarsContext = createContext<CarsContextValue | undefined>(undefined);

export function CarsProvider({ children }: { children: ReactNode }) {
  const value = useCarsState();
  return <CarsContext.Provider value={value}>{children}</CarsContext.Provider>;
}

export function useCars() {
  const ctx = useContext(CarsContext);
  if (!ctx) {
    throw new Error("useCars must be used within CarsProvider");
  }
  return ctx;
}
