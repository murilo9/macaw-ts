import { createContext } from "react";
import type { GameValuesReader } from "./createGameValues";

export const GameValuesContext = createContext<GameValuesReader | null>(null);
