import type { ReactNode } from "react";
import type { GameEventChannel } from "../game/GameEvents";
import { GameEventsContext } from "./gameEventsContext";

export function GameEventsProvider({
  value,
  children,
}: {
  value: GameEventChannel;
  children: ReactNode;
}) {
  return (
    <GameEventsContext.Provider value={value}>
      {children}
    </GameEventsContext.Provider>
  );
}
