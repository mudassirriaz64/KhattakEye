import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { ProgressBar } from "./ProgressBar";
import { LoadingOverlay } from "./LoadingOverlay";

type LoadingContextType = {
  isLoading: boolean;
  setLoading: (v: boolean) => void;
  withLoading: <T>(promise: Promise<T>) => Promise<T>;
  navProgress: number;
  setNavProgress: (v: number) => void;
  isNavigating: boolean;
  startNavigation: () => void;
  finishNavigation: () => void;
};

const LoadingContext = createContext<LoadingContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading must be used within LoadingProvider");
  return ctx;
}

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setLoading] = useState(false);
  const [navProgress, setNavProgress] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [showNav, setShowNav] = useState(false);

  const withLoading = useCallback(async <T,>(promise: Promise<T>): Promise<T> => {
    setLoading(true);
    try {
      return await promise;
    } finally {
      setLoading(false);
    }
  }, []);

  const startNavigation = useCallback(() => {
    setShowNav(true);
    setIsNavigating(true);
    setNavProgress(0);
    const timer = setInterval(() => {
      setNavProgress((p) => {
        const next = Math.min(85, p + Math.random() * 12 + 3);
        if (next >= 85) clearInterval(timer);
        return next;
      });
    }, 200);
  }, []);

  const finishNavigation = useCallback(() => {
    setNavProgress(100);
    setTimeout(() => {
      setIsNavigating(false);
      setShowNav(false);
      setNavProgress(0);
    }, 400);
  }, []);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setLoading,
        withLoading,
        navProgress,
        setNavProgress,
        isNavigating,
        startNavigation,
        finishNavigation,
      }}
    >
      <AnimatePresence>
        {showNav && (
          <ProgressBar show={showNav} progress={navProgress} />
        )}
      </AnimatePresence>
      {isLoading && <LoadingOverlay show variant="fullscreen" />}
      {children}
    </LoadingContext.Provider>
  );
}
