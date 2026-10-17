import { createContext } from "react";
import type { GameEventChannel } from "../game/GameEvents";

export const GameEventsContext = createContext<GameEventChannel | null>(null);
