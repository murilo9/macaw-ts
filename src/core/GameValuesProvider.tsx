import type { ReactNode } from "react";
import type { GameValuesReader } from "./createGameValues";
import { GameValuesContext } from "./gameValuesContext";

export function GameValuesProvider({
  value,
  children,
}: {
  value: GameValuesReader;
  children: ReactNode;
}) {
  return (
    <GameValuesContext.Provider value={value}>
      {children}
    </GameValuesContext.Provider>
  );
}
