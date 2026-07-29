import { createContext, useContext } from "react";

export type RevealPhase = "loading" | "revealing" | "revealed";

type RevealContextType = {
  phase: RevealPhase;
};

const RevealContext = createContext<RevealContextType>({ phase: "revealed" });

export function useReveal() {
  return useContext(RevealContext);
}

export function RevealProvider({
  phase,
  children,
}: {
  phase: RevealPhase;
  children: React.ReactNode;
}) {
  return (
    <RevealContext.Provider value={{ phase }}>
      {children}
    </RevealContext.Provider>
  );
}
